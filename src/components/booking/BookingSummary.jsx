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
            <Title level={5} style={{ margin: 0, color: "var(--ts-text-primary)" }}>
              Fare Summary
            </Title>
          </div>

          <Divider style={{ margin: "16px 0", borderColor: "var(--ts-border)" }} />

          {/* Info rows */}
          <div className="bs-info-row">
            <Text style={{ color: "var(--ts-text-secondary)" }}>Bus Type</Text>
            <Text strong style={{ color: isPremium ? "var(--ts-accent)" : "#f59e0b" }}>
              {isPremium ? "Executive Gold Liner" : "Standard Liner"}
            </Text>
          </div>

          <div className="bs-info-row">
            <Text style={{ color: "var(--ts-text-secondary)" }}>Selected Seats</Text>
            <div style={{ display: "flex", gap: 6 }}>
              {count > 0 ? (
                selectedSeats.map((seat) => (
                  <Tag
                    key={seat}
                    style={{ margin: 0, borderRadius: 4, background: "var(--ts-text-primary)", color: "var(--ts-bg)" }}
                  >
                    {seat}
                  </Tag>
                ))
              ) : (
                <Text style={{ color: "var(--ts-text-secondary)" }}>—</Text>
              )}
            </div>
          </div>

          <div className="bs-info-row">
            <Text style={{ color: "var(--ts-text-secondary)" }}>Total Passengers</Text>
            <Text strong style={{ color: "var(--ts-text-primary)" }}>
              {count > 0 ? `0${count} Adult${count > 1 ? "s" : ""}` : "—"}
            </Text>
          </div>

          <Divider style={{ margin: "16px 0", borderColor: "var(--ts-border)" }} />

          {/* Price breakdown */}
          <div className="bs-info-row">
            <Text style={{ color: "var(--ts-text-secondary)" }}>Base Fare (x{count})</Text>
            <Text style={{ color: "var(--ts-text-primary)" }}>KES {subtotal.toLocaleString()}.00</Text>
          </div>

          <div className="bs-info-row">
            <Text style={{ color: "var(--ts-text-secondary)" }}>Booking Fee</Text>
            <Text style={{ color: "var(--ts-text-primary)" }}>KES {taxesFees.toLocaleString()}.00</Text>
          </div>

          <div className="bs-total-row">
            <Text strong style={{ fontSize: 15, color: "var(--ts-text-primary)" }}>Total Amount</Text>
            <Text strong style={{ fontSize: 22, color: "var(--ts-text-primary)" }}>
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
              fontWeight: 600,
            }}
          >
            Continue to Confirmation
          </Button>

          <div className="bs-terms">
            BY CONTINUING, YOU AGREE TO OUR{" "}
            <Link href="/support" style={{ color: "var(--ts-accent)", textDecoration: "underline" }}>
              TERMS AND CONDITIONS
            </Link>
            .
          </div>
        </div>

        {/* SECURE CHECKOUT CARD */}
        <div className="bs-secure-card">
          <SafetyOutlined style={{ fontSize: 20, color: "var(--ts-text-secondary)" }} />
          <div>
            <Text strong style={{ color: "var(--ts-text-secondary)", display: "block" }}>
              Secure Checkout
            </Text>
            <Text style={{ color: "var(--ts-text-secondary)", fontSize: 13 }}>
              SSL Encrypted Transaction
            </Text>
          </div>
        </div>

        {/* ASSIST CARD */}
        <Link href="/support" style={{ textDecoration: "none" }}>
          <div className="bs-assist">
            <CustomerServiceOutlined style={{ fontSize: 20, color: "var(--ts-text-secondary)" }} />
            <div>
              <Text strong style={{ color: "var(--ts-text-primary)" }}>Need assistance?</Text>
              <br />
              <Text style={{ color: "var(--ts-text-secondary)" }}>Talk to a support specialist.</Text>
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
          border-radius: 18px;
          padding: 20px;
          background: var(--ts-bg-card);
          border: 1px solid var(--ts-border);
          box-shadow: var(--ts-shadow);
        }

        .bs-card.standard {
          border-color: #fde68a;
        }

        .bs-header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--ts-text-primary);
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
          color: var(--ts-text-secondary);
          text-align: center;
          letter-spacing: 0.3px;
        }

        .bs-secure-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--ts-bg-elevated);
          border: 1px solid var(--ts-border);
          border-radius: 16px;
        }

        .bs-assist {
          padding: 16px;
          border: 1px solid var(--ts-border);
          border-radius: 16px;
          display: flex;
          gap: 12px;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--ts-bg-card);
        }

        .bs-assist:hover {
          border-color: var(--ts-accent);
          background: var(--ts-bg-elevated);
        }
      `}</style>
    </>
  );
}