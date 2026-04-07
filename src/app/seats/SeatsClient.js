"use client";

import { Suspense } from "react";
import { Row, Col, Card, Button, Typography, Select, Tag, Segmented, message, Modal } from "antd";
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
import { hasDeparted, RESERVATION_KEY, getTodayString } from "@/services/travelDataStorage";

const { Text, Title } = Typography;

export default function SeatsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 60, textAlign: "center" }}>Loading...</div>}>
      <SeatsPageContent />
    </Suspense>
  );
}

function SeatsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { buses, getBusById, getBookedSeats, syncSeatStatuses, reserveSeatsOptimistic } = useTravelData();
  const [messageApi, messageContextHolder] = message.useMessage();

  const busId = searchParams.get("busId") || "";
  // For date-scoped trips (e.g. "bus-1_2026-04-20"), extract date and base bus
  const dateSuffix = busId.match(/_(\d{4}-\d{2}-\d{2})$/);
  const travelDate = dateSuffix ? dateSuffix[1] : getTodayString();
  const isToday = travelDate === getTodayString();

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

  // Redirect if today's bus has already departed (future-date trips are never redirected)
  useEffect(() => {
    if (!departure || !isToday) return;
    if (hasDeparted(departure)) {
      router.replace("/trips");
    }
  }, [departure, isToday, router]);

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

      // Deselect any seats that are no longer available
      const nowBooked = seatStatuses
        .filter((s) => s.status === "booked" || s.status === "reserved")
        .map((s) => s.seatNumber);

      setSelectedSeats((prev) => prev.filter((sn) => !nowBooked.includes(sn)));
    }

    refreshSeatData();

    const interval = setInterval(refreshSeatData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [busId, syncSeatStatuses]);

  // TODO: BACKEND - Fetch boarding/arriving station options from API
  // Endpoint: GET /api/routes/:routeId/stations
  // Should return: array of station options for boarding and arriving

  const bookedSeats = useMemo(() => getBookedSeats(busId), [busId, getBookedSeats]);

  const price = busType === "premium" ? basePrice : Math.round(basePrice * 0.7);
  const duration = bus?.duration || "—";

  const handleBusTypeChange = (targetType) => {
    if (targetType === busType) return;

    const targetTypeCap = targetType === "premium" ? "Premium" : "Standard";
    const currentBusBaseId = busId.replace(/_\d{4}-\d{2}-\d{2}$/, "");

    // Find buses on the same route with the target type (exclude current bus)
    const alternatives = buses.filter(
      (b) =>
        b.from === from &&
        b.to === to &&
        b.type === targetTypeCap &&
        b.id !== currentBusBaseId
    );

    if (alternatives.length === 0) {
      messageApi.warning(
        `No ${targetTypeCap} class available on the ${from} → ${to} route. Try searching for a different trip.`
      );
      return;
    }

    const alt = alternatives[0];
    const sameTime = alt.departure === departure;

    if (sameTime) {
      // Same departure time, just switch the class view
      setBusType(targetType);
      setSelectedSeats([]);
      return;
    }

    // Different departure time — confirm before switching
    Modal.confirm({
      title: `Switch to ${targetTypeCap} Class?`,
      content: `${targetTypeCap} class on this route departs at ${alt.departure} instead of ${departure}. You'll be taken to that trip's seat selection.`,
      okText: "Switch & Continue",
      cancelText: "Stay here",
      onOk: () => {
        const altBusId = dateSuffix ? `${alt.id}_${travelDate}` : alt.id;
        const params = new URLSearchParams();
        params.set("busId", altBusId);
        params.set("from", alt.from);
        params.set("to", alt.to);
        params.set("departure", alt.departure);
        params.set("price", String(alt.price));
        params.set("busType", targetType);
        params.set("travelDate", travelDate);
        router.push(`/seats?${params.toString()}`);
      },
    });
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      messageApi.warning("Please select at least one seat to continue.");
      return;
    }

    const latestStatuses = await fetchSeatStatuses(busId);
    if (latestStatuses && latestStatuses.length > 0) {
      syncSeatStatuses(busId, latestStatuses);

      const unavailableNow = latestStatuses
        .filter((seat) => seat.status === "booked" || seat.status === "reserved")
        .map((seat) => seat.seatNumber);

      const conflicting = selectedSeats.filter((seat) => unavailableNow.includes(seat));
      if (conflicting.length > 0) {
        setSelectedSeats((prev) => prev.filter((seat) => !conflicting.includes(seat)));
        messageApi.error(`Seat(s) no longer available: ${conflicting.join(", ")}. Please choose another seat.`);
        return;
      }
    }

    // Reserve seats for 5 minutes while passenger fills in details
    const reservation = reserveSeatsOptimistic(busId, selectedSeats);
    if (!reservation.ok) {
      messageApi.error(reservation.message || "Could not hold your seats. Please try again.");
      return;
    }

    try {
      window.localStorage.setItem(
        RESERVATION_KEY,
        JSON.stringify({ busId, seatNumbers: selectedSeats, expiresAt: Date.now() + 5 * 60 * 1000 })
      );
    } catch (_e) { /* ignore */ }

    const params = new URLSearchParams();
    params.set("from", from);
    params.set("to", to);
    params.set("departure", departure);
    params.set("price", price);
    params.set("seats", selectedSeats.join(","));
    params.set("busId", busId);
    params.set("busType", busType);
    params.set("travelDate", travelDate);
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px", background: "var(--ts-bg)", minHeight: "100vh" }}>
      {messageContextHolder}
      {/* BACK LINK */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        style={{ padding: 0, marginBottom: 16, color: "var(--ts-text-primary)" }}
        onClick={() => router.push("/trips")}
      >
        Back to journeys
      </Button>

      {/* HEADER CARD */}
      <Card
        style={{
          borderRadius: 18,
          marginBottom: 24,
          background: "var(--ts-bg-card)",
          border: "1px solid var(--ts-border)",
        }}
        styles={{ body: { padding: "24px 32px" } }}
      >
        <Row justify="space-between" align="middle" wrap>
          <Col>
            <Text type="success" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
              SELECTED JOURNEY
            </Text>
            <Title level={2} style={{ margin: "4px 0 8px", color: "var(--ts-text-primary)" }}>
              {from} to {to}
            </Title>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarOutlined style={{ color: "var(--ts-text-secondary)" }} />
                <Text style={{ color: "var(--ts-text-secondary)" }}>Today</Text>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ClockCircleOutlined style={{ color: "var(--ts-text-secondary)" }} />
                <Text style={{ color: "var(--ts-text-secondary)" }}>{departure} Departure</Text>
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
                    background: "var(--ts-bg-hero)",
                    color: "white",
                    padding: "16px 24px",
                    borderRadius: 8,
                    textAlign: "center",
                    minWidth: 100,
                  }}
                >
                  <span style={{ color: "#eaf8fc", fontSize: 10, display: "block", letterSpacing: 0.4, fontWeight: 700 }}>
                    EST. DURATION
                  </span>
                  <span style={{ color: "#f4fcff", fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>
                    {duration}
                  </span>
                </div>
              </Col>
              <Col>
                <div
                  style={{
                    background: "var(--ts-bg-elevated)",
                    border: "1px solid var(--ts-border)",
                    padding: "16px 24px",
                    borderRadius: 8,
                    textAlign: "center",
                    minWidth: 100,
                  }}
                >
                  <Text style={{ color: "var(--ts-text-secondary)", fontSize: 10, display: "block" }}>
                    FARE PER SEAT
                  </Text>
                  <Text style={{ color: "var(--ts-text-primary)", fontSize: 20, fontWeight: 700 }}>
                    KES {price}
                  </Text>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* CUSTOMIZE SEGMENT */}
      <Card style={{ borderRadius: 18, marginBottom: 24 }}>
        <Text style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "var(--ts-text-secondary)" }}>
          Customize Your Segment
        </Text>

        <Row gutter={24} style={{ marginTop: 16 }}>
          <Col xs={24} sm={8}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
              Boarding Point
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
              Arrival Point
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
              Travel Class
            </Text>
            <Segmented
              value={busType}
              onChange={handleBusTypeChange}
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
              borderRadius: 18,
              background: busType === "premium" ? "var(--ts-bg-card)" : "var(--ts-bg-elevated)",
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
                  Pick your preferred seat.{" "}
                  {busType === "premium" ? "2×1 Premium Layout." : "2×2 Standard Layout."}
                </Text>
              </div>
              <Button type="text" icon={<SettingOutlined />} style={{ color: "var(--ts-text-secondary)" }} />
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
                  background: "var(--ts-bg-elevated)",
                  borderRadius: 8,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ts-text-secondary)" }}>
                  <WifiOutlined /> Fast Wi-Fi
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ts-text-secondary)" }}>
                  🔌 USB charging
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ts-text-secondary)" }}>
                  ❄️ Climate control
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