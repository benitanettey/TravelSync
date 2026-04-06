import { NextResponse } from "next/server";
import { getBookingById, cancelBookingInStore, modifyBookingInStore } from "@/lib/serverDataStore";

export async function GET(_request, { params }) {
  const { id: bookingId } = await params;

  if (!bookingId) {
    return NextResponse.json({ error: "Booking id is required" }, { status: 400 });
  }

  const booking = await getBookingById(String(bookingId));
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}

export async function DELETE(_request, { params }) {
  const { id: bookingId } = await params;

  if (!bookingId) {
    return NextResponse.json({ error: "Booking id is required" }, { status: 400 });
  }

  const result = await cancelBookingInStore(String(bookingId));

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json({
    booking: result.booking,
    seats: (result.seats || []).map((s) => ({ seatNumber: s.seatNumber, status: s.status })),
  });
}

export async function PATCH(request, { params }) {
  const { id: bookingId } = await params;

  if (!bookingId) {
    return NextResponse.json({ error: "Booking id is required" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const seatNumbers = Array.isArray(body?.seatNumbers) ? body.seatNumbers.map(String).filter(Boolean) : null;
  const passenger = body?.passenger && typeof body.passenger === "object" ? body.passenger : null;

  if (!seatNumbers && !passenger) {
    return NextResponse.json({ error: "Provide seatNumbers and/or passenger to modify" }, { status: 400 });
  }

  const result = await modifyBookingInStore(String(bookingId), {
    seatNumbers,
    passenger,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.message,
        conflictSeats: result.conflictSeats || [],
        seats: (result.seats || []).map((s) => ({ seatNumber: s.seatNumber, status: s.status })),
      },
      { status: result.status }
    );
  }

  return NextResponse.json({
    booking: result.booking,
    seats: (result.seats || []).map((s) => ({ seatNumber: s.seatNumber, status: s.status })),
  });
}
