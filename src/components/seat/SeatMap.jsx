"use client";

import { WifiOutlined } from "@ant-design/icons";

export default function SeatMap({ selectedSeats, setSelectedSeats, busType = "premium" }) {
  // TODO: BACKEND - Fetch booked seats from API in real-time
  // Endpoint: GET /api/trips/:tripId/seats
  // Should return: array of seat statuses { seatNumber, status: 'available'|'booked'|'reserved' }
  // TODO: BACKEND - Implement WebSocket connection for real-time seat updates
  // When another user books a seat, update the UI immediately
  const bookedSeats = ["A2", "C1", "C2", "D3"];

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

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const getSeatClass = (seat) => {
    if (bookedSeats.includes(seat)) return "booked";
    if (selectedSeats.includes(seat)) return "selected";
    return "";
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
                <div
                  key={seat}
                  className={`seat ${getSeatClass(seat)}`}
                  onClick={() => toggleSeat(seat)}
                >
                  {busType === "premium" && !bookedSeats.includes(seat) && (
                    <WifiOutlined className="seat-icon" />
                  )}
                  <span className="seat-label">{seat}</span>
                </div>
              )
            )}
          </div>
        ))}
      </div>

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

        .seat {
          width: 56px;
          height: 62px;
          background: linear-gradient(180deg, #a7f3d0 0%, #6ee7b7 100%);
          border: 2px solid #34d399;
          border-radius: 10px 10px 6px 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: 600;
          font-size: 11px;
          color: #065f46;
          transition: all 0.2s ease;
          position: relative;
          gap: 2px;
        }

        .bus-layout.standard .seat {
          background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%);
          border-color: #f59e0b;
          color: #92400e;
          width: 52px;
          height: 56px;
        }

        .seat::before {
          content: "";
          position: absolute;
          top: -5px;
          left: 6px;
          right: 6px;
          height: 5px;
          background: linear-gradient(180deg, #6ee7b7 0%, #34d399 100%);
          border-radius: 4px 4px 0 0;
        }

        .bus-layout.standard .seat::before {
          background: linear-gradient(180deg, #fde68a 0%, #f59e0b 100%);
        }

        .seat:hover:not(.booked) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
        }

        .bus-layout.standard .seat:hover:not(.booked) {
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .seat.selected {
          background: linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%) !important;
          border-color: #60a5fa !important;
          color: #1d4ed8 !important;
        }

        .seat.selected::before {
          background: linear-gradient(180deg, #bfdbfe 0%, #60a5fa 100%) !important;
        }

        .seat.booked {
          background: #e2e8f0;
          border-color: #cbd5e1;
          color: #94a3b8;
          cursor: not-allowed;
        }

        .seat.booked::before {
          background: #cbd5e1;
        }

        .seat-icon {
          font-size: 14px;
          opacity: 0.7;
        }

        .seat.booked .seat-icon {
          display: none;
        }

        .seat-label {
          font-size: 11px;
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