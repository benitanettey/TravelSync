"use client";

import SeatItem from "./SeatItem";

export default function SeatMap({
  selectedSeats,
  setSelectedSeats,
  busType = "premium",
  bookedSeats = ["A2", "C1", "C2", "D3"],
}) {
  // TODO: BACKEND - Fetch booked seats from API in real-time
  // Endpoint: GET /api/trips/:tripId/seats
  // Should return: array of seat statuses { seatNumber, status: 'available'|'booked'|'reserved' }
  // TODO: BACKEND - Implement WebSocket connection for real-time seat updates
  // When another user books a seat, update the UI immediately

  // TODO: BACKEND - Fetch bus layout configuration from API
  // Endpoint: GET /api/buses/:busId/layout
  // Should return: seat configuration based on bus type (premium 2x1, standard 2x2)
  // This allows different bus models to have different layouts
  const premiumRows = [
    { row: "A", seats: ["A1", "A2", null, "A3"] },
    { row: "B", seats: ["B1", "B2", null, "B3"] },
    { row: "C", seats: ["C1", "C2", null, "C3"] },
    { row: "D", seats: ["D1", "D2", null, "D3"] },
    { row: "E", seats: ["E1", "E2", null, "E3"] },
  ];

  const standardRows = [
    { row: "A", seats: ["A1", "A2", null, "A3", "A4"] },
    { row: "B", seats: ["B1", "B2", null, "B3", "B4"] },
    { row: "C", seats: ["C1", "C2", null, "C3", "C4"] },
    { row: "D", seats: ["D1", "D2", null, "D3", "D4"] },
    { row: "E", seats: ["E1", "E2", null, "E3", "E4"] },
    { row: "F", seats: ["F1", "F2", null, "F3", "F4"] },
  ];

  const rows = busType === "premium" ? premiumRows : standardRows;

  const allSeats = rows.flatMap((r) => r.seats.filter((s) => s !== null));
  const availableCount = allSeats.filter((s) => !bookedSeats.includes(s)).length;

  const toggleSeat = (seat) => {
  if (bookedSeats.includes(seat)) return;
  setSelectedSeats((prev) =>
    prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
  );
};

  const getStatus = (seat) => {
    if (bookedSeats.includes(seat)) return "booked";
    if (selectedSeats.includes(seat)) return "selected";
    return "available";
  };

  return (
    <div className={`bus-layout ${busType}`}>
      {/* DRIVER AREA */}
      <div className="driver-area">
        <div className="steering-wheel" />
        <span>Driver</span>
        <div className="settings-icon">
          <SettingsGear />
        </div>
      </div>

      {/* SEAT ROWS */}
      <div className="seats-area">
        {rows.map((rowData) => (
          <div key={rowData.row} className="seat-row">
            {rowData.seats.map((seat, idx) =>
              seat === null ? (
                <div key={`aisle-${idx}`} className="aisle" />
              ) : (
                <SeatItem
                  key={seat}
                  seat={seat}
                  status={getStatus(seat)}
                  busType={busType}
                  onClick={toggleSeat}
                />
              )
            )}
          </div>
        ))}
      </div>

      {/* AVAILABLE COUNT */}
      <p className="available-count">{availableCount} seats available</p>

      <style jsx>{`
        .bus-layout {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border: 2px solid #e2e8f0;
          border-radius: 40px 40px 16px 16px;
          padding: 24px 20px;
          max-width: 340px;
          margin: 0 auto;
          position: relative;
        }

        .bus-layout.standard {
          max-width: 380px;
          background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
          border-color: #fde68a;
        }

        .driver-area {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 2px dashed #cbd5e1;
          position: relative;
        }

        .steering-wheel {
          width: 36px;
          height: 36px;
          border: 3px solid #64748b;
          border-radius: 50%;
          position: relative;
        }

        .steering-wheel::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: #64748b;
          border-radius: 50%;
        }

        .driver-area span {
          color: #64748b;
          font-weight: 500;
          font-size: 13px;
        }

        .settings-icon {
          position: absolute;
          right: 0;
          top: 0;
          color: #94a3b8;
        }

        .seats-area {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .seat-row {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .aisle {
          width: 20px;
        }

        .available-count {
          text-align: center;
          margin: 14px 0 0;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.3px;
        }
      `}</style>
    </div>
  );
}

function SettingsGear() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}
