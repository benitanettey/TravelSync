import { buildSeatsForBuses, initialData, getSeatNumbersByBusType } from "@/constants/initialData";

export const TRAVEL_DATA_STORAGE_KEY = "travelsync-data";
export const RESERVATION_KEY = "travelsync-reservation";

function parseDepartureMinutes(timeStr) {
  const match = (timeStr || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + minutes;
}

export function hasDeparted(timeStr) {
  const depMinutes = parseDepartureMinutes(timeStr);
  if (depMinutes === null) return false;
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() >= depMinutes;
}

// Determines whether a bus should be shown in the trips list.
// Return buses (with activeFrom) have an overnight-aware visibility window.
export function isBusVisible(bus, selectedDate) {
  const now = new Date();
  
  // Get today's date in Kenya/Local time (YYYY-MM-DD)
  const today = now.toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD format

  // If searching for a future date, always show the bus
  if (selectedDate > today) {
    return true;
  }

  // If searching for today's date, hide only if it has already departed
  if (selectedDate === today) {
    const depMinutes = parseDepartureMinutes(bus.departure);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    // Show if departure is at least 5 minutes in the future
    return nowMinutes < (depMinutes - 5);
  }

  // If it's a past date, don't show any buses
  return false;
}

export function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function clearStaleReservation(data) {
  if (typeof window === "undefined") return data;
  try {
    const raw = window.localStorage.getItem(RESERVATION_KEY);
    if (!raw) return data;
    const reservation = JSON.parse(raw);
    if (!reservation || !reservation.expiresAt || Date.now() < reservation.expiresAt) return data;
    window.localStorage.removeItem(RESERVATION_KEY);
    const { busId, seatNumbers } = reservation;
    if (!busId || !Array.isArray(seatNumbers)) return data;
    return {
      ...data,
      seats: data.seats.map((seat) =>
        seat.busId === busId && seatNumbers.includes(seat.seatNumber) && seat.status === "reserved"
          ? { ...seat, status: "available" }
          : seat
      ),
    };
  } catch {
    return data;
  }
}

function resetDepartedBuses(data) {
  const today = getTodayString();
  const toResetIds = new Set(
    data.buses
      .filter((bus) => hasDeparted(bus.departure) && bus.lastResetDate !== today)
      .map((bus) => bus.id)
  );
  if (toResetIds.size === 0) return data;
  return {
    buses: data.buses.map((bus) =>
      toResetIds.has(bus.id) ? { ...bus, lastResetDate: today } : bus
    ),
    seats: data.seats.map((seat) =>
      toResetIds.has(seat.busId) ? { ...seat, status: "available" } : seat
    ),
    bookings: data.bookings.map((booking) =>
      toResetIds.has(booking.busId) && booking.status === "confirmed"
        ? { ...booking, status: "completed" }
        : booking
    ),
  };
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function toValidStatus(status) {
  if (status === "booked" || status === "reserved") {
    return status;
  }

  return "available";
}

function normalizeSeatRecord(seat) {
  if (!seat || typeof seat !== "object") {
    return null;
  }

  if (!seat.busId || !seat.seatNumber) {
    return null;
  }

  return {
    busId: String(seat.busId),
    seatNumber: String(seat.seatNumber),
    status: toValidStatus(seat.status),
  };
}

function normalizeBookingRecord(booking) {
  if (!booking || typeof booking !== "object") {
    return null;
  }

  if (!booking.id || !booking.busId || !Array.isArray(booking.seatNumbers)) {
    return null;
  }

  return {
    id: String(booking.id),
    reference: String(booking.reference || booking.id),
    busId: String(booking.busId),
    seatNumbers: booking.seatNumbers.map(String),
    passenger: booking.passenger && typeof booking.passenger === "object" ? booking.passenger : {},
    route: booking.route && typeof booking.route === "object" ? booking.route : {},
    total: Number(booking.total || 0),
    pricePerSeat: Number(booking.pricePerSeat || 0),
    taxesFees: Number(booking.taxesFees || 0),
    busType: String(booking.busType || "premium"),
    status: String(booking.status || "confirmed"),
    createdAt: String(booking.createdAt || new Date().toISOString()),
  };
}

function mergeRequiredSeats(buses, seats, bookings) {
  const defaultSeats = buildSeatsForBuses(buses);
  const seatMap = new Map(
    defaultSeats.map((seat) => [`${seat.busId}:${seat.seatNumber}`, seat])
  );

  seats.forEach((seat) => {
    seatMap.set(`${seat.busId}:${seat.seatNumber}`, seat);
  });

  // Keep seats and bookings consistent. Any booked seat in a booking becomes booked in seat state.
  bookings.forEach((booking) => {
    booking.seatNumbers.forEach((seatNumber) => {
      const key = `${booking.busId}:${seatNumber}`;
      const existing = seatMap.get(key);

      if (existing) {
        seatMap.set(key, { ...existing, status: "booked" });
        return;
      }

      seatMap.set(key, {
        busId: booking.busId,
        seatNumber,
        status: "booked",
      });
    });
  });

  return Array.from(seatMap.values()).sort((a, b) => {
    const busCompare = a.busId.localeCompare(b.busId);
    if (busCompare !== 0) {
      return busCompare;
    }

    return a.seatNumber.localeCompare(b.seatNumber);
  });
}

export function normalizeTravelData(rawData) {
  const fallback = cloneData(initialData);

  if (!rawData || typeof rawData !== "object") {
    return fallback;
  }

  const rawBuses = Array.isArray(rawData.buses) && rawData.buses.length > 0
    ? rawData.buses
    : [];

  const parsedBuses = rawBuses
    .filter((bus) => bus && typeof bus === "object" && bus.id)
    .map((bus) => ({
      id: String(bus.id),
      from: String(bus.from || ""),
      to: String(bus.to || ""),
      departure: String(bus.departure || ""),
      arrival: String(bus.arrival || ""),
      duration: String(bus.duration || ""),
      price: Number(bus.price || 0),
      type: bus.type === "Premium" ? "Premium" : "Standard",
      lastResetDate: bus.lastResetDate || null,
      activeFrom: bus.activeFrom || null,
    }));

  const busMap = new Map(fallback.buses.map((bus) => [bus.id, bus]));
  parsedBuses.forEach((bus) => {
    busMap.set(bus.id, bus);
  });
  const buses = Array.from(busMap.values());

  const seats = Array.isArray(rawData.seats)
    ? rawData.seats.map(normalizeSeatRecord).filter(Boolean)
    : [];

  const bookings = Array.isArray(rawData.bookings)
    ? rawData.bookings.map(normalizeBookingRecord).filter(Boolean)
    : [];

  const bookingSet = new Set(bookings.map((booking) => booking.id));
  const mergedBookings = [...bookings];
  fallback.bookings.forEach((booking) => {
    if (!bookingSet.has(booking.id)) {
      mergedBookings.push(booking);
    }
  });

  return {
    buses,
    seats: mergeRequiredSeats(buses, seats, mergedBookings),
    bookings: mergedBookings,
  };
}

export function loadTravelData() {
  if (typeof window === "undefined") {
    return normalizeTravelData(initialData);
  }

  try {
    const raw = window.localStorage.getItem(TRAVEL_DATA_STORAGE_KEY);

    if (!raw) {
      return normalizeTravelData(initialData);
    }

    const normalized = normalizeTravelData(JSON.parse(raw));
    const reset = resetDepartedBuses(normalized);
    if (reset !== normalized) {
      saveTravelData(reset);
    }
    return clearStaleReservation(reset);
  } catch (_error) {
    return normalizeTravelData(initialData);
  }
}

export function saveTravelData(data) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeTravelData(data);
  window.localStorage.setItem(TRAVEL_DATA_STORAGE_KEY, JSON.stringify(normalized));
}

export function getAvailableSeatCount(data, busId) {
  const busSeats = data.seats.filter((seat) => seat.busId === busId);
  if (busSeats.length === 0) {
    // No seat records — could be a future-date trip with no bookings yet.
    // Strip the date suffix and look up the base bus to get its capacity.
    const baseBusId = busId.replace(/_\d{4}-\d{2}-\d{2}$/, "");
    if (baseBusId === busId) return 0; // not date-scoped, genuinely no seats
    const bus = data.buses.find((b) => b.id === baseBusId);
    if (!bus) return 0;
    return getSeatNumbersForBusType(bus.type === "Premium" ? "Premium" : "Standard").length;
  }
  return busSeats.filter((seat) => seat.status === "available").length;
}

export function getSeatNumbersForBusType(busType) {
  return getSeatNumbersByBusType(busType);
}
