import { buildSeatsForBuses, initialData, getSeatNumbersByBusType } from "@/constants/initialData";

export const TRAVEL_DATA_STORAGE_KEY = "travelsync-data";

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

  const buses = Array.isArray(rawData.buses) && rawData.buses.length > 0
    ? rawData.buses
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
        }))
    : fallback.buses;

  const seats = Array.isArray(rawData.seats)
    ? rawData.seats.map(normalizeSeatRecord).filter(Boolean)
    : [];

  const bookings = Array.isArray(rawData.bookings)
    ? rawData.bookings.map(normalizeBookingRecord).filter(Boolean)
    : [];

  return {
    buses,
    seats: mergeRequiredSeats(buses, seats, bookings),
    bookings,
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

    return normalizeTravelData(JSON.parse(raw));
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
  return data.seats.filter(
    (seat) => seat.busId === busId && seat.status === "available"
  ).length;
}

export function getSeatNumbersForBusType(busType) {
  return getSeatNumbersByBusType(busType);
}
