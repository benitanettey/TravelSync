const premiumSeatNumbers = [
  "A1",
  "A2",
  "A3",
  "B1",
  "B2",
  "B3",
  "C1",
  "C2",
  "C3",
  "D1",
  "D2",
  "D3",
  "E1",
  "E2",
  "E3",
];

const standardSeatNumbers = [
  "A1",
  "A2",
  "A3",
  "A4",
  "B1",
  "B2",
  "B3",
  "B4",
  "C1",
  "C2",
  "C3",
  "C4",
  "D1",
  "D2",
  "D3",
  "D4",
  "E1",
  "E2",
  "E3",
  "E4",
  "F1",
  "F2",
  "F3",
  "F4",
];

export const busesSeed = [
  {
    id: "bus-1",
    from: "Nairobi",
    to: "Mombasa",
    departure: "08:00 AM",
    arrival: "02:00 PM",
    duration: "6h",
    price: 2500,
    type: "Premium",
  },
  {
    id: "bus-2",
    from: "Nairobi",
    to: "Kisumu",
    departure: "09:30 AM",
    arrival: "03:30 PM",
    duration: "6h",
    price: 2200,
    type: "Premium",
  },
  {
    id: "bus-3",
    from: "Nairobi",
    to: "Nakuru",
    departure: "10:00 AM",
    arrival: "01:00 PM",
    duration: "3h",
    price: 1200,
    type: "Standard",
  },
  {
    id: "bus-4",
    from: "Nairobi",
    to: "Eldoret",
    departure: "07:00 AM",
    arrival: "01:30 PM",
    duration: "6h 30m",
    price: 1800,
    type: "Standard",
  },
];

const initialBookedByBus = {
  "bus-1": ["A2", "C1", "C2", "D3"],
  "bus-2": ["A2", "B3"],
  "bus-3": ["B1", "C3"],
  "bus-4": ["A4", "D2", "F1"],
};

export function getSeatNumbersByBusType(busType) {
  if (busType === "Premium") {
    return premiumSeatNumbers;
  }

  return standardSeatNumbers;
}

export function buildSeatsForBuses(buses) {
  return buses.flatMap((bus) => {
    const bookedSeats = initialBookedByBus[bus.id] || [];
    const seatNumbers = getSeatNumbersByBusType(bus.type);

    return seatNumbers.map((seatNumber) => ({
      busId: bus.id,
      seatNumber,
      status: bookedSeats.includes(seatNumber) ? "booked" : "available",
    }));
  });
}

export const initialData = {
  buses: busesSeed,
  seats: buildSeatsForBuses(busesSeed),
  bookings: [],
};
