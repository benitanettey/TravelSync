import { NextResponse } from "next/server";
import { getSeatsByBusId } from "@/lib/serverDataStore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const busId = searchParams.get("busId");

  if (!busId) {
    return NextResponse.json(
      { error: "Missing required query parameter: busId" },
      { status: 400 }
    );
  }

  const seats = await getSeatsByBusId(busId);
  if (!seats) {
    return NextResponse.json(
      { error: "Trip not found", busId },
      { status: 404 }
    );
  }

  return NextResponse.json({
    busId,
    seats: seats.map((seat) => ({
      seatNumber: seat.seatNumber,
      status: seat.status,
    })),
    updatedAt: new Date().toISOString(),
  });
}
