import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { initialData } from "@/constants/initialData";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const DATA_FILE = path.join(DATA_DIR, "travel-data.json");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeStatus(status) {
  if (status === "booked" || status === "reserved") {
    return status;
  }

  return "available";
}

function normalizeStore(data) {
  const fallback = clone(initialData);

  if (!data || typeof data !== "object") {
    return fallback;
  }

  const buses = Array.isArray(data.buses) ? data.buses : fallback.buses;
  const seats = Array.isArray(data.seats) ? data.seats : fallback.seats;
  const bookings = Array.isArray(data.bookings) ? data.bookings : [];

  return {
    buses: buses
      .filter((bus) => bus && bus.id)
      .map((bus) => ({
        id: String(bus.id),
        from: String(bus.from || ""),
        to: String(bus.to || ""),
        departure: String(bus.departure || ""),
        arrival: String(bus.arrival || ""),
        duration: String(bus.duration || ""),
        price: Number(bus.price || 0),
        type: bus.type === "Premium" ? "Premium" : "Standard",
      })),
    seats: seats
      .filter((seat) => seat && seat.busId && seat.seatNumber)
      .map((seat) => ({
        busId: String(seat.busId),
        seatNumber: String(seat.seatNumber),
        status: normalizeStatus(seat.status),
      })),
    bookings: bookings
      .filter((booking) => booking && booking.id && booking.busId && Array.isArray(booking.seatNumbers))
      .map((booking) => ({
        id: String(booking.id),
        reference: String(booking.reference || booking.id),
        busId: String(booking.busId),
        seatNumbers: booking.seatNumbers.map(String),
        passenger: booking.passenger && typeof booking.passenger === "object" ? booking.passenger : {},
        route: booking.route && typeof booking.route === "object" ? booking.route : {},
        total: Number(booking.total || 0),
        pricePerSeat: Number(booking.pricePerSeat || 0),
        taxesFees: Number(booking.taxesFees || 0),
        busType: String(booking.busType || "standard"),
        status: String(booking.status || "confirmed"),
        createdAt: String(booking.createdAt || new Date().toISOString()),
      })),
  };
}

async function ensureStoreFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), "utf8");
  }
}

export async function readStoreData() {
  await ensureStoreFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw);
  return normalizeStore(parsed);
}

export async function writeStoreData(data) {
  await ensureStoreFile();
  const normalized = normalizeStore(data);
  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}

export async function getSeatsByBusId(busId) {
  const data = await readStoreData();
  const bus = data.buses.find((item) => item.id === busId);

  if (!bus) {
    return null;
  }

  return data.seats.filter((seat) => seat.busId === busId);
}

export async function getBookingById(bookingId) {
  const data = await readStoreData();
  return data.bookings.find((booking) => booking.id === bookingId) || null;
}

function buildBookingId() {
  return `booking-${crypto.randomUUID()}`;
}

function buildBookingReference() {
  return `TS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;
}

export async function createBookingInStore(payload) {
  const {
    busId,
    seatNumbers,
    passenger,
    busType = "standard",
    pricePerSeat = 0,
    taxesFees = 0,
  } = payload;

  const uniqueSeatNumbers = [...new Set((seatNumbers || []).map(String))];
  const data = await readStoreData();

  const bus = data.buses.find((item) => item.id === busId);
  if (!bus) {
    return {
      ok: false,
      status: 404,
      message: "Trip not found.",
      conflictSeats: [],
    };
  }

  if (uniqueSeatNumbers.length === 0) {
    return {
      ok: false,
      status: 400,
      message: "Select at least one seat.",
      conflictSeats: [],
    };
  }

  const busSeats = data.seats.filter((seat) => seat.busId === busId);
  const conflictSeats = uniqueSeatNumbers.filter((seatNumber) => {
    const found = busSeats.find((seat) => seat.seatNumber === seatNumber);
    return !found || found.status !== "available";
  });

  if (conflictSeats.length > 0) {
    return {
      ok: false,
      status: 409,
      message: `Seat(s) no longer available: ${conflictSeats.join(", ")}`,
      conflictSeats,
      seats: busSeats,
    };
  }

  const booking = {
    id: buildBookingId(),
    reference: buildBookingReference(),
    busId,
    seatNumbers: uniqueSeatNumbers,
    passenger: passenger && typeof passenger === "object" ? passenger : {},
    route: {
      from: bus.from,
      to: bus.to,
      departure: bus.departure,
      arrival: bus.arrival,
      duration: bus.duration,
    },
    total: Number(pricePerSeat) * uniqueSeatNumbers.length + Number(taxesFees),
    pricePerSeat: Number(pricePerSeat),
    taxesFees: Number(taxesFees),
    busType,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  const nextSeats = data.seats.map((seat) => {
    if (seat.busId === busId && uniqueSeatNumbers.includes(seat.seatNumber)) {
      return {
        ...seat,
        status: "booked",
      };
    }

    return seat;
  });

  const nextData = {
    ...data,
    seats: nextSeats,
    bookings: [booking, ...data.bookings],
  };

  await writeStoreData(nextData);

  return {
    ok: true,
    status: 201,
    booking,
    seats: nextSeats.filter((seat) => seat.busId === busId),
  };
}
