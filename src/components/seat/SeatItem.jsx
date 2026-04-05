"use client";

import { useState } from "react";
import { WifiOutlined } from "@ant-design/icons";

export default function SeatItem({ seat, status, busType, onClick }) {
  const [shaking, setShaking] = useState(false);

  const handleClick = () => {
    if (status === "booked") {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }
    onClick(seat);
  };

  return (
    <>
      <div
        className={`seat${busType === "standard" ? " standard" : ""}${status === "selected" ? " selected" : ""}${status === "booked" ? " booked" : ""}${shaking ? " shake" : ""}`}
        onClick={handleClick}
      >
        {busType === "premium" && status !== "booked" && (
          <WifiOutlined className="seat-icon" />
        )}
        <span className="seat-label">{seat}</span>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-4px); }
          40%       { transform: translateX(4px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
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

        .seat:hover:not(.booked) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
        }

        /* Standard bus overrides */
        .seat.standard {
          width: 52px;
          height: 56px;
          background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%);
          border-color: #f59e0b;
          color: #92400e;
        }

        .seat.standard::before {
          background: linear-gradient(180deg, #fde68a 0%, #f59e0b 100%);
        }

        .seat.standard:hover:not(.booked) {
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        /* Selected state */
        .seat.selected {
          background: linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%) !important;
          border-color: #60a5fa !important;
          color: #1d4ed8 !important;
        }

        .seat.selected::before {
          background: linear-gradient(180deg, #bfdbfe 0%, #60a5fa 100%) !important;
        }

        /* Booked state */
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

        .seat-label {
          font-size: 11px;
        }

        /* Shake animation for booked seats */
        .seat.shake {
          animation: shake 0.4s ease;
        }
      `}</style>
    </>
  );
}
