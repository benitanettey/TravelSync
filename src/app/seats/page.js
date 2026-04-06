"use client";

export const dynamic = "force-dynamic";

import { Row, Col, Card, Button, Typography, Select, Tag, Segmented } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import SeatMap from "@/components/seat/SeatMap";
import BookingSummary from "@/components/booking/BookingSummary";
import { useTravelData } from "@/hooks/useTravelData";
import { fetchSeatStatuses } from "@/services/seatDataService";

const { Text, Title } = Typography;

export default function SeatsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getBusById, getBookedSeats, syncSeatStatuses } = useTravelData();

  const busId = searchParams.get("busId") || "";
  const bus = getBusById(busId);

  const from = bus?.from || searchParams.get("from") || "Nairobi";
  const to = bus?.to || searchParams.get("to") || "Mombasa";
  const departure = bus?.departure || searchParams.get("departure") || "08:00 AM";
  const basePrice = bus?.price || Number(searchParams.get("price")) || 2500;

  const queryBusType = searchParams.get("busType");
  const normalizedBusType = queryBusType === "standard" || queryBusType === "premium"
    ? queryBusType
    : bus?.type === "Premium"
      ? "premium"
      : "standard";

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [busType, setBusType] = useState(normalizedBusType);

  useEffect(() => {
    if (!busId) {
      return;
    }

    let isMounted = true;

    async function refreshSeatData() {
      const seatStatuses = await fetchSeatStatuses(busId);
      if (!isMounted || !seatStatuses) {
        return;
      }

      syncSeatStatuses(busId, seatStatuses);
    }

    refreshSeatData();

    return () => {
      isMounted = false;
    };
  }, [busId, syncSeatStatuses]);

  // TODO: BACKEND - Fetch boarding/arriving station options from API
  // Endpoint: GET /api/routes/:routeId/stations
  // Should return: array of station options for boarding and arriving

  const bookedSeats = useMemo(() => getBookedSeats(busId), [busId, getBookedSeats]);

  const price = busType === "premium" ? basePrice : Math.round(basePrice * 0.7);
  const duration = "6h 45m";

  const handleProceed = () => {
    // TODO: BACKEND - Temporarily reserve selected seats before proceeding to booking
    // Endpoint: POST /api/trips/:tripId/reserve-seats
    // Body: { seatNumbers: [...], sessionId: "..." }
    // Should reserve seats for 10-15 minutes while user completes booking
    const params = new URLSearchParams();
    params.set("from", from);
    params.set("to", to);
    params.set("departure", departure);
    params.set("price", price);
    params.set("seats", selectedSeats.join(","));
    params.set("busId", busId);
    params.set("busType", busType);
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
      {/* BACK LINK */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        style={{ padding: 0, marginBottom: 16 }}
        onClick={() => router.push("/trips")}
      >
        Back to Trips
      </Button>

      {/* HEADER CARD */}
      <Card
        style={{
          borderRadius: 12,
          marginBottom: 24,
          background: "#fff",
        }}
        styles={{ body: { padding: "24px 32px" } }}
      >
        <Row justify="space-between" align="middle" wrap>
          <Col>
            <Text type="success" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
              ACTIVE JOURNEY
            </Text>
            <Title level={2} style={{ margin: "4px 0 8px" }}>
              {from} to {to}
            </Title>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarOutlined style={{ color: "#64748b" }} />
                <Text type="secondary">Today</Text>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ClockCircleOutlined style={{ color: "#64748b" }} />
                <Text type="secondary">{departure} Departure</Text>
              </span>
              <Tag color={busType === "premium" ? "blue" : "green"}>
                {busType === "premium" ? "PREMIUM BUS" : "STANDARD BUS"}
              </Tag>
            </div>
          </Col>

          <Col>
            <Row gutter={16}>
              <Col>
                <div
                  style={{
                    background: "#0d1f3c",
                    color: "white",
                    padding: "16px 24px",
                    borderRadius: 8,
                    textAlign: "center",
                    minWidth: 100,
                  }}
                >
                  <Text style={{ color: "#8a9ab0", fontSize: 10, display: "block" }}>
                    EST. DURATION
                  </Text>
                  <Text style={{ color: "white", fontSize: 20, fontWeight: 700 }}>
                    {duration}
                  </Text>
                </div>
              </Col>
              <Col>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    padding: "16px 24px",
                    borderRadius: 8,
                    textAlign: "center",
                    minWidth: 100,
                  }}
                >
                  <Text style={{ color: "#64748b", fontSize: 10, display: "block" }}>
                    FARES FROM
                  </Text>
                  <Text style={{ color: "#0d1f3c", fontSize: 20, fontWeight: 700 }}>
                    KES {price}
                  </Text>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* CUSTOMIZE SEGMENT */}
      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Text style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#64748b" }}>
          CUSTOMIZE SEGMENT
        </Text>

        <Row gutter={24} style={{ marginTop: 16 }}>
          <Col xs={24} sm={8}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
              BOARDING FROM
            </Text>
            <Select
              defaultValue="main"
              style={{ width: "100%" }}
              options={[
                { value: "main", label: `${from} Main Station` },
                { value: "central", label: `${from} Central` },
              ]}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
              ARRIVING AT
            </Text>
            <Select
              defaultValue="main"
              style={{ width: "100%" }}
              options={[
                { value: "main", label: `${to} Main Station` },
                { value: "central", label: `${to} Central` },
              ]}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
              BUS TYPE
            </Text>
            <Segmented
              value={busType}
              onChange={(val) => {
                setBusType(val);
                setSelectedSeats([]);
              }}
              options={[
                { value: "premium", label: "Premium" },
                { value: "standard", label: "Standard" },
              ]}
              block
            />
          </Col>
        </Row>
      </Card>

      {/* LAYOUT */}
      <Row gutter={24}>
        {/* LEFT - BUS CARD */}
        <Col xs={24} lg={14}>
          <Card
            style={{
              borderRadius: 12,
              background: busType === "premium" ? "#fff" : "#fafafa",
            }}
            styles={{ body: { padding: "24px" } }}
          >
            {/* DECK HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {busType === "premium" ? "Executive Deck" : "Standard Deck"}
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Select your preferred seat.{" "}
                  {busType === "premium" ? "2×1 Premium Layout." : "2×2 Standard Layout."}
                </Text>
              </div>
              <Button type="text" icon={<SettingOutlined />} style={{ color: "#64748b" }} />
            </div>

            {/* SEAT LEGEND */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 20,
                marginBottom: 16,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 16,
                    height: 14,
                    background:
                      busType === "premium"
                        ? "linear-gradient(180deg, #a7f3d0, #6ee7b7)"
                        : "linear-gradient(180deg, #fef3c7, #fde68a)",
                    border: busType === "premium" ? "2px solid #34d399" : "2px solid #f59e0b",
                    borderRadius: 3,
                  }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Available
                </Text>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 16,
                    height: 14,
                    background: "linear-gradient(180deg, #dbeafe, #bfdbfe)",
                    border: "2px solid #60a5fa",
                    borderRadius: 3,
                  }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Selected
                </Text>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 16,
                    height: 14,
                    background: "#e2e8f0",
                    border: "2px solid #cbd5e1",
                    borderRadius: 3,
                  }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Booked
                </Text>
              </span>
            </div>

            <SeatMap
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              busType={busType}
              bookedSeats={bookedSeats}
            />

            {/* AMENITIES */}
            {busType === "premium" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 24,
                  marginTop: 24,
                  padding: "12px 16px",
                  background: "#f0fdf4",
                  borderRadius: 8,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a" }}>
                  <WifiOutlined /> Free Wi-Fi
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a" }}>
                  🔌 USB Charging
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a" }}>
                  ❄️ Air Conditioning
                </span>
              </div>
            )}
          </Card>
        </Col>

        {/* RIGHT - SUMMARY */}
        <Col xs={24} lg={10}>
          <BookingSummary
            selectedSeats={selectedSeats}
            pricePerSeat={price}
            taxesFees={busType === "premium" ? 350 : 200}
            onProceed={handleProceed}
            busType={busType}
          />
        </Col>
      </Row>
    </div>
  );
}