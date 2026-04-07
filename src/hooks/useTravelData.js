"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { initialData } from "@/constants/initialData";
import {
  getAvailableSeatCount,
  getSeatNumbersForBusType,
  loadTravelData,
  normalizeTravelData,
  saveTravelData,
} from "@/services/travelDataStorage";

const TravelDataContext = createContext(null);

function buildBookingRef() {
  return `TS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;
}

function buildBookingId() {
  return `booking-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function toBusTypeValue(type) {
  return type === "Premium" ? "premium" : "standard";
}

function normalizeServerBooking(rawBooking, buses) {
  if (!rawBooking || !rawBooking.id || !rawBooking.busId) {
    return null;
  }

  const bus = buses.find((item) => item.id === rawBooking.busId);

  return {
    id: String(rawBooking.id),
    reference: String(rawBooking.reference || rawBooking.id),
    busId: String(rawBooking.busId),
    seatNumbers: Array.isArray(rawBooking.seatNumbers) ? rawBooking.seatNumbers.map(String) : [],
    passenger: rawBooking.passenger && typeof rawBooking.passenger === "object" ? rawBooking.passenger : {},
    route: rawBooking.route && typeof rawBooking.route === "object"
      ? rawBooking.route
      : {
          from: bus?.from || "",
          to: bus?.to || "",
          departure: bus?.departure || "",
          arrival: bus?.arrival || "",
          duration: bus?.duration || "",
        },
    total: Number(rawBooking.total || 0),
    pricePerSeat: Number(rawBooking.pricePerSeat || 0),
    taxesFees: Number(rawBooking.taxesFees || 0),
    busType: String(rawBooking.busType || (bus ? toBusTypeValue(bus.type) : "standard")),
    status: String(rawBooking.status || "confirmed"),
    createdAt: String(rawBooking.createdAt || new Date().toISOString()),
  };
}

export function TravelDataProvider({ children }) {
  const [data, setData] = useState(() => loadTravelData());
  const isHydrated = true;

  const updateData = useCallback((updater) => {
    setData((previousData) => {
      const candidate = typeof updater === "function" ? updater(previousData) : updater;
      const normalized = normalizeTravelData(candidate);
      saveTravelData(normalized);
      return normalized;
    });
  }, []);

  const getBusById = useCallback(
    (busId) => {
      const direct = data.buses.find((bus) => bus.id === busId);
      if (direct) return direct;
      // Fall back to base bus for date-scoped IDs like "bus-1_2026-04-20"
      const baseId = busId.replace(/_\d{4}-\d{2}-\d{2}$/, "");
      return data.buses.find((bus) => bus.id === baseId) || null;
    },
    [data.buses]
  );

  const getBusSeats = useCallback(
    (busId) => data.seats.filter((seat) => seat.busId === busId),
    [data.seats]
  );

  const getBookedSeats = useCallback(
    (busId) =>
      getBusSeats(busId)
        .filter((seat) => seat.status === "booked" || seat.status === "reserved")
        .map((seat) => seat.seatNumber),
    [getBusSeats]
  );

  const syncSeatStatuses = useCallback(
    (busId, seatStatuses) => {
      if (!busId || !Array.isArray(seatStatuses) || seatStatuses.length === 0) {
        return;
      }

      updateData((previousData) => {
        const nextSeats = previousData.seats.map((seat) => {
          if (seat.busId !== busId) {
            return seat;
          }

          const incoming = seatStatuses.find((item) => item.seatNumber === seat.seatNumber);

          if (!incoming) {
            return seat;
          }

          return {
            ...seat,
            status: incoming.status,
          };
        });

        return {
          ...previousData,
          seats: nextSeats,
        };
      });
    },
    [updateData]
  );

  const reserveSeatsOptimistic = useCallback(
    (busId, seatNumbers) => {
      const requestedSeats = Array.isArray(seatNumbers) ? seatNumbers.map(String) : [];
      if (!busId || requestedSeats.length === 0) {
        return { ok: false, message: "No seats selected.", conflictSeats: [] };
      }

      const busSeats = data.seats.filter((seat) => seat.busId === busId);
      // If no record exists for a seat, treat it as available (handles future-date trips)
      const conflictSeats = requestedSeats.filter((seatNumber) => {
        const seat = busSeats.find((item) => item.seatNumber === seatNumber);
        return seat && seat.status !== "available";
      });

      if (conflictSeats.length > 0) {
        return {
          ok: false,
          message: `Seat(s) no longer available: ${conflictSeats.join(", ")}`,
          conflictSeats,
        };
      }

      updateData((previousData) => {
        const existingSeatNums = new Set(
          previousData.seats.filter((s) => s.busId === busId).map((s) => s.seatNumber)
        );
        const updatedSeats = previousData.seats.map((seat) => {
          if (seat.busId === busId && requestedSeats.includes(seat.seatNumber)) {
            return { ...seat, status: "reserved" };
          }
          return seat;
        });
        // Create records for seats that had no record yet (future-date trips)
        const newRecords = requestedSeats
          .filter((sn) => !existingSeatNums.has(sn))
          .map((sn) => ({ busId, seatNumber: sn, status: "reserved" }));
        return { ...previousData, seats: [...updatedSeats, ...newRecords] };
      });

      return { ok: true, conflictSeats: [] };
    },
    [data.seats, updateData]
  );

  const rollbackReservedSeats = useCallback(
    (busId, seatNumbers) => {
      const requestedSeats = Array.isArray(seatNumbers) ? seatNumbers.map(String) : [];
      if (!busId || requestedSeats.length === 0) {
        return;
      }

      updateData((previousData) => ({
        ...previousData,
        seats: previousData.seats.map((seat) => {
          if (
            seat.busId === busId
            && requestedSeats.includes(seat.seatNumber)
            && seat.status === "reserved"
          ) {
            return {
              ...seat,
              status: "available",
            };
          }

          return seat;
        }),
      }));
    },
    [updateData]
  );

  const upsertBookingFromServer = useCallback(
    (serverBooking) => {
      const booking = normalizeServerBooking(serverBooking, data.buses);
      if (!booking) {
        return null;
      }

      updateData((previousData) => {
        const existingIndex = previousData.bookings.findIndex((item) => item.id === booking.id);
        const nextBookings = existingIndex >= 0
          ? previousData.bookings.map((item) => (item.id === booking.id ? booking : item))
          : [booking, ...previousData.bookings];

        const nextSeats = previousData.seats.map((seat) => {
          if (seat.busId === booking.busId && booking.seatNumbers.includes(seat.seatNumber)) {
            return {
              ...seat,
              status: "booked",
            };
          }

          return seat;
        });

        return {
          ...previousData,
          seats: nextSeats,
          bookings: nextBookings,
        };
      });

      return booking;
    },
    [data.buses, updateData]
  );

  const createBooking = useCallback(
    ({ busId, seatNumbers, passenger, busType, pricePerSeat, taxesFees }) => {
      const bus = data.buses.find((item) => item.id === busId);

      if (!bus) {
        throw new Error("Trip no longer exists.");
      }

      if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
        throw new Error("Select at least one seat before confirming.");
      }

      const busSeats = data.seats.filter((seat) => seat.busId === busId);
      const unavailableSeats = seatNumbers.filter((seatNumber) => {
        const seatRecord = busSeats.find((seat) => seat.seatNumber === seatNumber);
        return !seatRecord || seatRecord.status !== "available";
      });

      if (unavailableSeats.length > 0) {
        throw new Error(`Seat(s) no longer available: ${unavailableSeats.join(", ")}`);
      }

      const booking = {
        id: buildBookingId(),
        reference: buildBookingRef(),
        busId,
        seatNumbers,
        passenger,
        route: {
          from: bus.from,
          to: bus.to,
          departure: bus.departure,
          arrival: bus.arrival,
          duration: bus.duration,
        },
        total: pricePerSeat * seatNumbers.length + taxesFees,
        pricePerSeat,
        taxesFees,
        busType: busType || toBusTypeValue(bus.type),
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      updateData((previousData) => {
        const nextSeats = previousData.seats.map((seat) => {
          if (seat.busId === busId && seatNumbers.includes(seat.seatNumber)) {
            return {
              ...seat,
              status: "booked",
            };
          }

          return seat;
        });

        return {
          ...previousData,
          seats: nextSeats,
          bookings: [booking, ...previousData.bookings],
        };
      });

      return booking;
    },
    [data.buses, data.seats, updateData]
  );

  const getBookingById = useCallback(
    (bookingId) => data.bookings.find((booking) => booking.id === bookingId) || null,
    [data.bookings]
  );

  const findBookings = useCallback(
    ({ reference, phone }) => {
      return data.bookings.filter((booking) => {
        if (reference) {
          const ref = reference.toUpperCase().replace(/^#/, "");
          if (booking.reference?.toUpperCase().includes(ref)) return true;
        }
        if (phone && booking.passenger?.phone) {
          const normalize = (p) => p.replace(/[\s\-\+\(\)]/g, "");
          if (normalize(booking.passenger.phone).includes(normalize(phone))) return true;
        }
        return false;
      });
    },
    [data.bookings]
  );

  const cancelBookingLocal = useCallback(
    (bookingId) => {
      const booking = data.bookings.find((b) => b.id === bookingId);
      if (!booking) return;

      updateData((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        ),
        seats: prev.seats.map((seat) => {
          if (seat.busId === booking.busId && booking.seatNumbers.includes(seat.seatNumber)) {
            return { ...seat, status: "available" };
          }
          return seat;
        }),
      }));
    },
    [data.bookings, updateData]
  );

  const modifyBookingLocal = useCallback(
    (bookingId, updatedBooking) => {
      const oldBooking = data.bookings.find((b) => b.id === bookingId);
      if (!oldBooking) return;

      const releasedSeats = oldBooking.seatNumbers.filter(
        (sn) => !updatedBooking.seatNumbers.includes(sn)
      );
      const claimedSeats = updatedBooking.seatNumbers.filter(
        (sn) => !oldBooking.seatNumbers.includes(sn)
      );

      updateData((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === bookingId ? { ...updatedBooking, id: bookingId } : b
        ),
        seats: prev.seats.map((seat) => {
          if (seat.busId !== oldBooking.busId) return seat;
          if (releasedSeats.includes(seat.seatNumber)) return { ...seat, status: "available" };
          if (claimedSeats.includes(seat.seatNumber)) return { ...seat, status: "booked" };
          return seat;
        }),
      }));
    },
    [data.bookings, updateData]
  );

  const resetData = useCallback(() => {
    const normalized = normalizeTravelData(initialData);
    setData(normalized);
    saveTravelData(normalized);
  }, []);

  const value = useMemo(
    () => ({
      data,
      buses: data.buses,
      seats: data.seats,
      bookings: data.bookings,
      isHydrated,
      updateData,
      resetData,
      getBusById,
      getBusSeats,
      getBookedSeats,
      getAvailableSeatCount: (busId) => getAvailableSeatCount(data, busId),
      getSeatNumbersForBusType,
      syncSeatStatuses,
      reserveSeatsOptimistic,
      rollbackReservedSeats,
      upsertBookingFromServer,
      createBooking,
      getBookingById,
      findBookings,
      cancelBookingLocal,
      modifyBookingLocal,
    }),
    [
      data,
      isHydrated,
      updateData,
      resetData,
      getBusById,
      getBusSeats,
      getBookedSeats,
      syncSeatStatuses,
      reserveSeatsOptimistic,
      rollbackReservedSeats,
      upsertBookingFromServer,
      createBooking,
      getBookingById,
      findBookings,
      cancelBookingLocal,
      modifyBookingLocal,
    ]
  );

  return <TravelDataContext.Provider value={value}>{children}</TravelDataContext.Provider>;
}

export function useTravelData() {
  const context = useContext(TravelDataContext);

  if (!context) {
    throw new Error("useTravelData must be used within TravelDataProvider.");
  }

  return context;
}
