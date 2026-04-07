"use client";

import { Card, Row, Col, Tag, Button, Typography } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Text } = Typography;

const TripCard = ({ trip }) => {
  const router = useRouter();

  const tripType = trip?.type || "Premium";
  const isPremium = tripType === "Premium" || tripType === "Executive";

  return (
    <>
      <Card
        hoverable
        style={{
          borderRadius: "18px",
          transition: "all 0.3s ease",
          border: isPremium ? "1px solid var(--ts-border)" : "1px solid #d9b15f",
          background: "var(--ts-bg-card)",
        }}
        styles={{
          body: { padding: "24px" },
        }}
      >
        <Row justify="space-between" align="middle" gutter={16}>

        {/* LEFT SIDE */}
        <Col flex="auto">
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Tag
              style={{
                margin: 0,
                borderRadius: 999,
                border: "1px solid var(--ts-border)",
                background: isPremium ? "var(--ts-bg-elevated)" : "rgba(217,154,50,0.18)",
                color: isPremium ? "var(--ts-text-secondary)" : "#d99a32",
                fontWeight: 700,
              }}
            >
              {isPremium ? "PREMIUM" : "STANDARD"}
            </Tag>
            {isPremium && (
              <>
                <Tag icon={<WifiOutlined />} color="default">Wi-Fi</Tag>
                <Tag icon={<ThunderboltOutlined />} color="default">Charging</Tag>
              </>
            )}
          </div>

          <h3 className="trip-time-range" style={{ margin: "0 0 8px", color: "var(--ts-text-primary)" }}>
            {trip.departure} → {trip.arrival}
          </h3>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Text type="secondary">
              <EnvironmentOutlined style={{ marginRight: 6 }} />
              {trip.from} → {trip.to}
            </Text>

            <Text type="secondary">
              <ClockCircleOutlined style={{ marginRight: 6 }} />
              {trip.duration}
            </Text>

            <Text style={{ color: trip.seats <= 5 ? "#ef4444" : "#16a34a", fontWeight: 700 }}>
              {trip.seats} seats left
            </Text>
          </div>
        </Col>

        {/* RIGHT SIDE */}
        <Col>
          <div style={{ textAlign: "right" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>From</Text>
            <h2 className="trip-price" style={{ margin: "0 0 12px", color: "var(--ts-text-primary)" }}>
              KES {trip.price.toLocaleString()}
            </h2>

            <Button
              type="primary"
              size="large"
              style={{
                background: isPremium ? "var(--ts-text-primary)" : "#d99a32",
                borderColor: isPremium ? "var(--ts-text-primary)" : "#d99a32",
                borderRadius: 8,
                fontWeight: 600,
              }}
              onClick={() => {
                const params = new URLSearchParams();
                params.set("busId", trip.id);
                params.set("from", trip.from);
                params.set("to", trip.to);
                params.set("departure", trip.departure);
                params.set("price", String(trip.price));
                params.set("busType", (trip.type || "Standard").toLowerCase());
                router.push(`/seats?${params.toString()}`);
              }}
            >
              Choose Seats
            </Button>
          </div>
        </Col>

        </Row>
      </Card>
      <style jsx>{`
        .trip-time-range {
          font-family: var(--font-body), "Segoe UI", sans-serif;
          font-size: 1.18rem;
          font-weight: 500;
          letter-spacing: 0.015em;
          font-variant-numeric: tabular-nums;
        }

        .trip-price {
          font-family: var(--font-body), "Segoe UI", sans-serif;
          font-size: 1.5rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </>
  );
};

export default TripCard;