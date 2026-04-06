import { NextResponse } from "next/server";
import { createBookingInStore, readStoreData } from "@/lib/serverDataStore";

function toValidStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(String).filter(Boolean);
}

export async function GET() {
  const data = await readStoreData();
  return NextResponse.json({ bookings: data.bookings });
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const busId = body?.busId ? String(body.busId) : "";
  const seatNumbers = toValidStringArray(body?.seatNumbers);
  const passenger = body?.passenger && typeof body.passenger === "object" ? body.passenger : {};
  const busType = body?.busType ? String(body.busType) : "standard";
  const pricePerSeat = Number(body?.pricePerSeat || 0);
  const taxesFees = Number(body?.taxesFees || 0);

  if (!busId) {
    return NextResponse.json({ error: "busId is required" }, { status: 400 });
  }

  if (seatNumbers.length === 0) {
    return NextResponse.json({ error: "seatNumbers is required" }, { status: 400 });
  }

  const result = await createBookingInStore({
    busId,
    seatNumbers,
    passenger,
    busType,
    pricePerSeat,
    taxesFees,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.message,
        conflictSeats: result.conflictSeats || [],
        seats: (result.seats || []).map((seat) => ({
          seatNumber: seat.seatNumber,
          status: seat.status,
        })),
      },
      { status: result.status }
    );
  }

  return NextResponse.json(
    {
      booking: result.booking,
      seats: (result.seats || []).map((seat) => ({
        seatNumber: seat.seatNumber,
        status: seat.status,
      })),
    },
    { status: 201 }
  );
}
