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
    <Card
      hoverable
      style={{
        borderRadius: "12px",
        transition: "all 0.3s ease",
        border: isPremium ? "1px solid #e2e8f0" : "1px solid #fde68a",
      }}
      styles={{
        body: { padding: "24px" },
      }}
    >
      <Row justify="space-between" align="middle" gutter={16}>

        {/* LEFT SIDE */}
        <Col flex="auto">
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Tag color={isPremium ? "#0d1f3c" : "#f59e0b"}>
              {isPremium ? "PREMIUM" : "STANDARD"}
            </Tag>
            {isPremium && (
              <>
                <Tag icon={<WifiOutlined />} color="default">Wi-Fi</Tag>
                <Tag icon={<ThunderboltOutlined />} color="default">USB</Tag>
              </>
            )}
          </div>

          <h3 style={{ margin: "0 0 8px", fontWeight: "700", fontSize: 18, color: "#0d1f3c" }}>
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

            <Text style={{ color: trip.seats <= 5 ? "#ef4444" : "#16a34a" }}>
              🔥 {trip.seats} seats left
            </Text>
          </div>
        </Col>

        {/* RIGHT SIDE */}
        <Col>
          <div style={{ textAlign: "right" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>From</Text>
            <h2 style={{ margin: "0 0 12px", fontWeight: "700", color: "#0d1f3c", fontSize: 24 }}>
              KES {trip.price.toLocaleString()}
            </h2>

            <Button
              type="primary"
              size="large"
              style={{
                background: isPremium ? "#0d1f3c" : "#f59e0b",
                borderColor: isPremium ? "#0d1f3c" : "#f59e0b",
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
              Select Seats
            </Button>
          </div>
        </Col>

      </Row>
    </Card>
  );
};

export default TripCard;