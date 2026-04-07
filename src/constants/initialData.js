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
  {
    id: "bus-5",
    from: "Nairobi",
    to: "Nyeri",
    departure: "06:30 AM",
    arrival: "09:00 AM",
    duration: "2h 30m",
    price: 900,
    type: "Standard",
  },
  {
    id: "bus-6",
    from: "Nairobi",
    to: "Meru",
    departure: "07:45 AM",
    arrival: "12:45 PM",
    duration: "5h",
    price: 1600,
    type: "Premium",
  },
  {
    id: "bus-7",
    from: "Nairobi",
    to: "Machakos",
    departure: "01:30 PM",
    arrival: "03:00 PM",
    duration: "1h 30m",
    price: 700,
    type: "Standard",
  },
  {
    id: "bus-8",
    from: "Nairobi",
    to: "Kisii",
    departure: "06:00 PM",
    arrival: "11:30 PM",
    duration: "5h 30m",
    price: 1700,
    type: "Premium",
  },
  {
    id: "bus-9",
    from: "Nairobi",
    to: "Malindi",
    departure: "09:00 PM",
    arrival: "06:00 AM",
    duration: "9h",
    price: 3200,
    type: "Premium",
  },
  {
    id: "bus-10",
    from: "Mombasa",
    to: "Nairobi",
    departure: "07:00 AM",
    arrival: "01:00 PM",
    duration: "6h",
    price: 2400,
    type: "Premium",
  },
  {
    id: "bus-11",
    from: "Kisumu",
    to: "Nairobi",
    departure: "08:30 PM",
    arrival: "03:00 AM",
    duration: "6h 30m",
    price: 2100,
    type: "Standard",
  },
  {
    id: "bus-12",
    from: "Nakuru",
    to: "Nairobi",
    departure: "04:30 PM",
    arrival: "07:30 PM",
    duration: "3h",
    price: 1200,
    type: "Standard",
  },
  {
    id: "bus-13",
    from: "Nairobi",
    to: "Kakamega",
    departure: "02:15 PM",
    arrival: "09:15 PM",
    duration: "7h",
    price: 2300,
    type: "Premium",
  },
  {
    id: "bus-14",
    from: "Nairobi",
    to: "Thika",
    departure: "05:30 AM",
    arrival: "06:30 AM",
    duration: "1h",
    price: 500,
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
