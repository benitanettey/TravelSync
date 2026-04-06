import { NextResponse } from "next/server";
import { getBookingById } from "@/lib/serverDataStore";

export async function GET(_request, { params }) {
  const bookingId = params?.id ? String(params.id) : "";

  if (!bookingId) {
    return NextResponse.json({ error: "Booking id is required" }, { status: 400 });
  }

  const booking = await getBookingById(bookingId);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
