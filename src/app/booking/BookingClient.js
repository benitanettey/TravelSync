"use client";

import { Suspense } from "react";
import { Row, Col, Card, Typography, Tag, Checkbox, message } from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import PassengerForm from "@/components/booking/PassengerForm";
import BookingSummary from "@/components/booking/BookingSummary";
import { useTravelData } from "@/hooks/useTravelData";
import { createBookingRequest, fetchSeatStatuses } from "@/services/seatDataService";

const { Title, Text, Paragraph } = Typography;

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ padding: 60, textAlign: "center" }}>Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    getBusById,
    reserveSeatsOptimistic,
    rollbackReservedSeats,
    upsertBookingFromServer,
    syncSeatStatuses,
  } = useTravelData();
  const [messageApi, messageContextHolder] = message.useMessage();

  // TODO: BACKEND - Verify seat reservation is still valid
  // Endpoint: GET /api/reservations/:sessionId
  // If reservation expired, redirect back to seat selection with error message

  const busId = searchParams.get("busId") || "";
  const bus = getBusById(busId);

  const from = bus?.from || searchParams.get("from") || "Nairobi";
  const to = bus?.to || searchParams.get("to") || "Mombasa";
  const departure = bus?.departure || searchParams.get("departure") || "08:00 AM";
  const price = bus?.price || Number(searchParams.get("price")) || 2500;
  const seatsParam = searchParams.get("seats") || "";
  const seats = seatsParam ? seatsParam.split(",") : [];
  const busType = searchParams.get("busType") || "premium";

  // TODO: BACKEND - If user is logged in, pre-fill passenger details from user profile
  // Endpoint: GET /api/users/me/profile
  // Should return: firstName, lastName, email, phone, idType, idNumber

  const handleConfirm = async (passengerData) => {
    // TODO: BACKEND - Submit booking to API
    // Endpoint: POST /api/bookings
    // Body: {
    //   tripId: "...",
    //   seats: [...],
    //   passenger: { firstName, lastName, email, phone, idType, idNumber },
    //   saveForFuture: boolean (if checkbox is checked)
    // }
    // Should return: { bookingId, bookingRef, status, paymentUrl }

    // TODO: BACKEND - Integrate payment gateway (M-Pesa, Card, etc.)
    // Redirect to payment page or show payment modal
    // On successful payment, redirect to confirmation page

    // TODO: BACKEND - Send confirmation email to passenger
    // Trigger email with booking details, QR code, and e-ticket PDF

    const taxesFees = busType === "premium" ? 350 : 200;

    if (!busId || seats.length === 0) {
      messageApi.error("No seat selected. Please return to seat selection.");
      return;
    }

    const latestStatuses = await fetchSeatStatuses(busId);
    if (latestStatuses && latestStatuses.length > 0) {
      syncSeatStatuses(busId, latestStatuses);

      const unavailableNow = latestStatuses
        .filter((seat) => seat.status === "booked" || seat.status === "reserved")
        .map((seat) => seat.seatNumber);

      const conflicting = seats.filter((seat) => unavailableNow.includes(seat));
      if (conflicting.length > 0) {
        messageApi.error(`Seat(s) no longer available: ${conflicting.join(", ")}. Please reselect.`);
        return;
      }
    }

    const optimistic = reserveSeatsOptimistic(busId, seats);
    if (!optimistic.ok) {
      messageApi.error(optimistic.message || "Seat selection is outdated. Please reselect.");
      return;
    }

    const result = await createBookingRequest({
      busId,
      seatNumbers: seats,
      passenger: passengerData,
      busType,
      pricePerSeat: price,
      taxesFees,
    });

    if (!result.ok) {
      rollbackReservedSeats(busId, seats);

      if (result.seats.length > 0) {
        syncSeatStatuses(busId, result.seats);
      }

      if (result.status === 409) {
        const conflictText = result.conflictSeats.length > 0
          ? `Conflicting seats: ${result.conflictSeats.join(", ")}`
          : "Your selected seats were just taken.";
        messageApi.error(`Booking conflict detected. ${conflictText}`);
        return;
      }

      messageApi.error(result.message || "Booking could not be completed. Please retry.");
      return;
    }

    if (result.seats.length > 0) {
      syncSeatStatuses(busId, result.seats);
    }

    const booking = upsertBookingFromServer(result.booking);
    if (!booking?.id) {
      messageApi.error("Booking was created but could not be stored locally.");
      return;
    }

    const params = new URLSearchParams();
    params.set("bookingId", booking.id);
    params.set("from", from);
    params.set("to", to);
    params.set("departure", departure);
    params.set("seats", seats.join(","));
    params.set("busType", busType);
    params.set("name", `${passengerData.firstName || ""} ${passengerData.lastName || ""}`.trim());
    params.set("date", new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }));
    router.push(`/confirmation?${params.toString()}`);
  };

  const isPremium = busType === "premium";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px", background: "var(--ts-bg)", minHeight: "100vh" }}>
      {messageContextHolder}
      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <Link
          href="/seats"
          style={{
            color: "var(--ts-text-secondary)",
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 16,
          }}
        >
          <ArrowLeftOutlined /> Return to seat selection
        </Link>

        <Title level={2} style={{ margin: 0, fontStyle: "italic", color: "var(--ts-text-primary)", letterSpacing: "0.01em" }}>
          Finalize Your Journey
        </Title>
        <Paragraph style={{ marginBottom: 0, color: "var(--ts-text-secondary)" }}>
          Add traveler details to secure your {isPremium ? "executive" : "standard"} seats instantly.
        </Paragraph>
      </div>

      <Row gutter={24}>
        {/* LEFT COLUMN */}
        <Col xs={24} lg={14}>
          {/* PASSENGER FORM CARD */}
          <Card
            style={{ borderRadius: 18, marginBottom: 24, background: "var(--ts-bg-card)", border: "1px solid var(--ts-border)" }}
            styles={{ body: { padding: 24 } }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <UserOutlined style={{ fontSize: 18, color: "var(--ts-text-primary)" }} />
              <Title level={5} style={{ margin: 0, color: "var(--ts-text-primary)" }}>
                Passenger Details
              </Title>
            </div>

            <PassengerForm onSubmit={handleConfirm} disabled={seats.length === 0} />

            <Checkbox style={{ marginTop: 8 }}>
              Save traveler profile for future bookings
            </Checkbox>
          </Card>

          {/* TICKET CARD */}
          <Card
            style={{
              borderRadius: 16,
              background: "var(--ts-bg-hero)",
              color: "white",
              overflow: "hidden",
            }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Top section */}
            <div style={{ padding: "24px 24px 20px" }}>
              <Tag
                color="#1677ff"
                style={{
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  marginBottom: 16,
                }}
              >
                {isPremium ? "EXECUTIVE CLASS BOARDING PASS" : "STANDARD CLASS BOARDING PASS"}
              </Tag>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <Title level={3} style={{ color: "white", margin: 0 }}>
                    {from.substring(0, 3).toUpperCase()} → {to.substring(0, 3).toUpperCase()}
                  </Title>
                  <Text style={{ color: "#8a9ab0", fontSize: 13 }}>
                    Departure today, {departure}
                  </Text>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  {seats.slice(0, 2).map((seat, idx) => (
                    <div
                      key={seat}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        padding: "8px 16px",
                        textAlign: "center",
                      }}
                    >
                      <Text style={{ color: "#8a9ab0", fontSize: 10, display: "block" }}>
                        {idx === 0 ? "SEAT" : "SEAT"}
                      </Text>
                      <Text style={{ color: "white", fontSize: 18, fontWeight: 700 }}>
                        {seat}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom section with dashed border */}
            <div
              style={{
                borderTop: "2px dashed rgba(255,255,255,0.15)",
                padding: "16px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#8a9ab0", fontSize: 11, letterSpacing: 0.5 }}>
                TRAVELSYNC INTERCITY NETWORK
              </Text>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="8" height="8" fill="white" />
                  <rect x="14" y="2" width="8" height="8" fill="white" />
                  <rect x="2" y="14" width="8" height="8" fill="white" />
                  <rect x="14" y="14" width="4" height="4" fill="white" />
                  <rect x="18" y="18" width="4" height="4" fill="white" />
                </svg>
              </div>
            </div>
          </Card>
        </Col>

        {/* RIGHT COLUMN - BOOKING SUMMARY */}
        <Col xs={24} lg={10}>
          <BookingSummary
            selectedSeats={seats}
            pricePerSeat={price}
            taxesFees={isPremium ? 350 : 200}
            onProceed={() => document.querySelector('form')?.requestSubmit()}
            busType={busType}
          />
        </Col>
    </Row>
  </div>
);
}