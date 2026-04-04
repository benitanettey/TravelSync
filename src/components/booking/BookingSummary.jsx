"use client";

import { Button, Divider, Typography, Tag } from "antd";
import {
  ArrowRightOutlined,
  CustomerServiceOutlined,
  SafetyOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Text, Title } = Typography;

export default function BookingSummary({
  selectedSeats = [],
  pricePerSeat = 2500,
  taxesFees = 300,
  onProceed,
  busType = "premium",
}) {
  const count = selectedSeats.length;

  const subtotal = pricePerSeat * count;
  const total = subtotal + taxesFees;

  const isPremium = busType === "premium";

  return (
    <>
      <div className="bs-wrap">

        {/* MAIN CARD */}
        <div className={`bs-card ${isPremium ? "premium" : "standard"}`}>
          {/* Header */}
          <div className="bs-header">
            <FileTextOutlined style={{ fontSize: 18 }} />
            <Title level={5} style={{ margin: 0, color: "#0d1f3c" }}>
              Booking Summary
            </Title>
          </div>

          <Divider style={{ margin: "16px 0", borderColor: "#e2e8f0" }} />

          {/* Info rows */}
          <div className="bs-info-row">
            <Text type="secondary">Bus Type</Text>
            <Text strong style={{ color: isPremium ? "#1677ff" : "#f59e0b" }}>
              {isPremium ? "Executive Gold Liner" : "Standard Liner"}
            </Text>
          </div>

          <div className="bs-info-row">
            <Text type="secondary">Selected Seats</Text>
            <div style={{ display: "flex", gap: 6 }}>
              {count > 0 ? (
                selectedSeats.map((seat) => (
                  <Tag
                    key={seat}
                    color="#0d1f3c"
                    style={{ margin: 0, borderRadius: 4 }}
                  >
                    {seat}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">—</Text>
              )}
            </div>
          </div>

          <div className="bs-info-row">
            <Text type="secondary">Total Passengers</Text>
            <Text strong>
              {count > 0 ? `0${count} Adult${count > 1 ? "s" : ""}` : "—"}
            </Text>
          </div>

          <Divider style={{ margin: "16px 0", borderColor: "#e2e8f0" }} />

          {/* Price breakdown */}
          <div className="bs-info-row">
            <Text type="secondary">Base Fare (x{count})</Text>
            <Text>KES {subtotal.toLocaleString()}.00</Text>
          </div>

          <div className="bs-info-row">
            <Text type="secondary">Booking Fee</Text>
            <Text>KES {taxesFees.toLocaleString()}.00</Text>
          </div>

          <div className="bs-total-row">
            <Text strong style={{ fontSize: 15 }}>Total Amount</Text>
            <Text strong style={{ fontSize: 22, color: "#0d1f3c" }}>
              KES {total.toLocaleString()}.00
            </Text>
          </div>

          <Button
            type="primary"
            size="large"
            block
            icon={<ArrowRightOutlined />}
            disabled={count === 0}
            onClick={onProceed}
            style={{
              marginTop: 20,
              height: 48,
              borderRadius: 24,
              background: "#0d1f3c",
              borderColor: "#0d1f3c",
              fontWeight: 600,
            }}
          >
            Confirm Booking
          </Button>

          <div className="bs-terms">
            BY CLICKING CONFIRM, YOU AGREE TO OUR{" "}
            <Link href="/support" style={{ color: "#0d1f3c", textDecoration: "underline" }}>
              TERMS & CONDITIONS
            </Link>
            .
          </div>
        </div>

        {/* SECURE CHECKOUT CARD */}
        <div className="bs-secure-card">
          <SafetyOutlined style={{ fontSize: 20, color: "#16a34a" }} />
          <div>
            <Text strong style={{ color: "#16a34a", display: "block" }}>
              Secure Checkout
            </Text>
            <Text style={{ color: "#16a34a", fontSize: 13 }}>
              SSL Encrypted Transaction
            </Text>
          </div>
        </div>

        {/* ASSIST CARD */}
        <Link href="/support" style={{ textDecoration: "none" }}>
          <div className="bs-assist">
            <CustomerServiceOutlined style={{ fontSize: 20, color: "#64748b" }} />
            <div>
              <Text strong>Need assistance?</Text>
              <br />
              <Text type="secondary">Talk to a concierge expert.</Text>
            </div>
          </div>
        </Link>

      </div>

      <style jsx>{`
        .bs-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bs-card {
          border-radius: 12px;
          padding: 20px;
          background: #fff;
          border: 1px solid #e2e8f0;
        }

        .bs-card.standard {
          border-color: #fde68a;
          background: #fffefb;
        }

        .bs-header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #0d1f3c;
        }

        .bs-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .bs-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0 0;
        }

        .bs-terms {
          margin-top: 16px;
          font-size: 10px;
          color: #94a3b8;
          text-align: center;
          letter-spacing: 0.3px;
        }

        .bs-secure-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
        }

        .bs-assist {
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          gap: 12px;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #fff;
        }

        .bs-assist:hover {
          border-color: #0d1f3c;
          background: #f8fafc;
        }
      `}</style>
    </>
  );
}