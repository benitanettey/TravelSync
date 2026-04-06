"use client";

import { Suspense } from "react";
import { Card, Typography, Button, Row, Col, Tag } from "antd";
import {
  CheckCircleFilled,
  DownloadOutlined,
  PrinterOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTravelData } from "@/hooks/useTravelData";
import { fetchBookingById } from "@/services/seatDataService";

const { Title, Text, Paragraph } = Typography;

// TODO: BACKEND - Fetch station data from API instead of hardcoded values
// Endpoint: GET /api/stations
// Should return: array of station objects with id, name, address, lat, lng
const stationCoords = {
  nairobi: { lat: -1.2864, lng: 36.8172, name: "Nairobi Central Bus Station", address: "Mfangano St, Nairobi CBD" },
  mombasa: { lat: -4.0435, lng: 39.6682, name: "Mombasa Bus Terminal", address: "Abdel Nasser Rd, Mombasa" },
  kisumu: { lat: -0.1022, lng: 34.7617, name: "Kisumu Main Stage", address: "Oginga Odinga St, Kisumu" },
  nakuru: { lat: -0.3031, lng: 36.0800, name: "Nakuru Bus Park", address: "Kenyatta Ave, Nakuru" },
  eldoret: { lat: 0.5143, lng: 35.2698, name: "Eldoret Bus Station", address: "Uganda Rd, Eldoret" },
};

function getStationInfo(city) {
  const key = city.toLowerCase();
  return stationCoords[key] || { name: `${city} Bus Station`, address: `Main Bus Terminal, ${city}` };
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ padding: 60, textAlign: "center" }}>Loading...</div>}>
      <ConfirmationPageContent />
    </Suspense>
  );
}

function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const { getBookingById, upsertBookingFromServer } = useTravelData();

  // TODO: BACKEND - Fetch booking details from API using bookingId
  // Endpoint: GET /api/bookings/:bookingId
  // Should return: full booking object with trip details, passenger info, payment status
  // Redirect to error page if booking not found or unauthorized

  const bookingId = searchParams.get("bookingId") || "";
  const [isMounted, setIsMounted] = useState(false);
  const [remoteBooking, setRemoteBooking] = useState(null);
  const localBooking = isMounted && bookingId ? getBookingById(bookingId) : null;
  const booking = remoteBooking || localBooking;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!bookingId) {
      return;
    }

    let isMounted = true;

    async function loadBookingFromApi() {
      const fetched = await fetchBookingById(bookingId);
      if (!isMounted || !fetched) {
        return;
      }

      const upserted = upsertBookingFromServer(fetched);
      setRemoteBooking(upserted || fetched);
    }

    loadBookingFromApi();

    return () => {
      isMounted = false;
    };
  }, [bookingId, upsertBookingFromServer]);

  const from = booking?.route?.from || searchParams.get("from") || "Nairobi";
  const to = booking?.route?.to || searchParams.get("to") || "Mombasa";
  const departure = booking?.route?.departure || searchParams.get("departure") || "08:00 AM";
  const seatsParam = searchParams.get("seats") || "";
  const seats = booking?.seatNumbers || (seatsParam ? seatsParam.split(",") : []);
  const name = booking?.passenger
    ? `${booking.passenger.firstName || ""} ${booking.passenger.lastName || ""}`.trim() || "Guest"
    : searchParams.get("name") || "Guest";
  const busType = booking?.busType || searchParams.get("busType") || "premium";

  // TODO: BACKEND - Get actual booking reference from API response
  const bookingRef = booking?.reference
    ? `#${booking.reference}`
    : bookingId
      ? `#TS-${bookingId.slice(-8).toUpperCase()}`
      : "#TS-PENDING";
  const isPremium = busType === "premium";
  
  // TODO: BACKEND - Get actual arrival time from trip data
  const arrivalTime = "14:30";
  const duration = "6h 30m";
  const travelDate = booking?.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : searchParams.get("date") || "Today";

  const departureStation = getStationInfo(from);

  // TODO: BACKEND - Implement download ticket functionality
  // Endpoint: GET /api/bookings/:bookingId/ticket
  // Should return: PDF file with e-ticket containing QR code

  // TODO: BACKEND - Implement add to calendar functionality
  // Generate .ics file with trip details for calendar import

  // TODO: BACKEND - Generate actual QR code with booking data
  // Use a QR code library (e.g., qrcode.react) with booking reference
  // QR should encode: { bookingRef, passengerName, tripId, seats }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 60 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 20px" }}>
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#7FE3C5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircleFilled style={{ fontSize: 28, color: "white" }} />
          </div>
          <Title level={2} style={{ margin: 0, fontStyle: "italic", color: "#0d1f3c" }}>
            Booking Confirmed
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Your journey with TravelSync is ready. Safe travels!
          </Paragraph>
        </div>

        <Row gutter={24}>
          {/* LEFT - TICKET CARD */}
          <Col xs={24} lg={15}>
            <Card
              style={{
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                marginBottom: 24,
              }}
              styles={{ body: { padding: 0 } }}
            >
              {/* Main ticket content with QR side by side */}
              <div style={{ display: "flex" }}>
                {/* Left side - Trip details */}
                <div style={{ flex: 1, padding: 28 }}>
                  {/* Bus type and booking ref */}
                  <Row justify="space-between" style={{ marginBottom: 28 }}>
                    <Col>
                      <Text style={{ fontSize: 10, color: "#64748b", letterSpacing: 0.5, display: "block" }}>BUS TYPE</Text>
                      <div style={{ color: "#0d1f3c", fontWeight: 600, fontSize: 15 }}>
                        {isPremium ? "Executive Gold Liner" : "Standard Traveller"}
                      </div>
                    </Col>
                    <Col>
                      <Text style={{ fontSize: 10, color: "#64748b", letterSpacing: 0.5, display: "block" }}>BOOKING REF</Text>
                      <div style={{ color: "#0d1f3c", fontWeight: 700, fontSize: 15 }}>{bookingRef}</div>
                    </Col>
                  </Row>

                  {/* Route display */}
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <Title level={2} style={{ margin: 0, color: "#0d1f3c", fontSize: 28 }}>{from}</Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>{departureStation.name}</Text>
                    </div>

                    <div style={{ textAlign: "center", padding: "0 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 40, height: 1, background: "#cbd5e1" }} />
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#64748b">
                            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                          </svg>
                        </div>
                        <div style={{ width: 40, height: 1, background: "#cbd5e1" }} />
                      </div>
                      <Text style={{ fontSize: 11, color: "#64748b" }}>{duration}</Text>
                    </div>

                    <div style={{ flex: 1, textAlign: "right" }}>
                      <Title level={2} style={{ margin: 0, color: "#0d1f3c", fontSize: 28 }}>{to}</Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>{getStationInfo(to).name}</Text>
                    </div>
                  </div>

                  {/* Times */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
                    <Title level={3} style={{ margin: 0, color: "#0d1f3c" }}>{departure}</Title>
                    <Title level={3} style={{ margin: 0, color: "#0d1f3c" }}>{arrivalTime}</Title>
                  </div>

                  {/* Passenger and date */}
                  <Row gutter={24} style={{ marginBottom: 20 }}>
                    <Col span={12}>
                      <Text style={{ fontSize: 10, color: "#64748b", letterSpacing: 0.5, display: "block" }}>PASSENGER</Text>
                      <div style={{ color: "#0d1f3c", fontWeight: 600, fontSize: 15 }}>{name}</div>
                    </Col>
                    <Col span={12}>
                      <Text style={{ fontSize: 10, color: "#64748b", letterSpacing: 0.5, display: "block" }}>DATE</Text>
                      <div style={{ color: "#0d1f3c", fontWeight: 600, fontSize: 15 }}>{travelDate}</div>
                    </Col>
                  </Row>

                  {/* Seats and class */}
                  <Row gutter={24}>
                    <Col span={12}>
                      <Text style={{ fontSize: 10, color: "#64748b", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>SEATS</Text>
                      <div>
                        {seats.map((seat) => (
                          <Tag
                            key={seat}
                            style={{
                              background: "#0d1f3c",
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              fontWeight: 600,
                              marginRight: 6,
                              padding: "4px 10px",
                            }}
                          >
                            {seat}
                          </Tag>
                        ))}
                      </div>
                    </Col>
                    <Col span={12}>
                      <Text style={{ fontSize: 10, color: "#64748b", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>CLASS</Text>
                      <Tag
                        style={{
                          background: isPremium ? "#7FE3C5" : "#fef3c7",
                          color: isPremium ? "#0d1f3c" : "#92400e",
                          border: "none",
                          borderRadius: 4,
                          fontWeight: 600,
                          fontSize: 11,
                          padding: "4px 10px",
                        }}
                      >
                        {isPremium ? "EXECUTIVE" : "STANDARD"}
                      </Tag>
                    </Col>
                  </Row>
                </div>

                {/* Dashed divider */}
                <div
                  style={{
                    width: 1,
                    background: "repeating-linear-gradient(to bottom, #e2e8f0 0px, #e2e8f0 8px, transparent 8px, transparent 16px)",
                    margin: "24px 0",
                  }}
                />

                {/* Right side - QR Code */}
                <div
                  style={{
                    width: 160,
                    padding: "28px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 10, color: "#64748b", letterSpacing: 0.5, marginBottom: 12 }}>
                    BOARDING PASS
                  </Text>
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      background: "linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 10,
                      marginBottom: 12,
                    }}
                  >
                    {/* QR Code Pattern */}
                    <svg width="85" height="85" viewBox="0 0 80 80" fill="none">
                      <rect x="0" y="0" width="24" height="24" fill="#7FE3C5"/>
                      <rect x="4" y="4" width="16" height="16" fill="#0d1f3c"/>
                      <rect x="8" y="8" width="8" height="8" fill="#7FE3C5"/>
                      <rect x="56" y="0" width="24" height="24" fill="#7FE3C5"/>
                      <rect x="60" y="4" width="16" height="16" fill="#0d1f3c"/>
                      <rect x="64" y="8" width="8" height="8" fill="#7FE3C5"/>
                      <rect x="0" y="56" width="24" height="24" fill="#7FE3C5"/>
                      <rect x="4" y="60" width="16" height="16" fill="#0d1f3c"/>
                      <rect x="8" y="64" width="8" height="8" fill="#7FE3C5"/>
                      <rect x="28" y="0" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="36" y="0" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="44" y="0" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="28" y="8" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="40" y="8" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="48" y="8" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="28" y="28" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="36" y="28" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="44" y="28" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="52" y="28" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="0" y="28" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="8" y="28" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="16" y="28" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="0" y="36" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="12" y="36" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="28" y="36" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="40" y="36" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="0" y="44" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="8" y="44" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="28" y="44" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="44" y="44" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="60" y="28" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="68" y="28" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="76" y="28" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="60" y="36" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="72" y="36" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="60" y="44" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="76" y="44" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="28" y="56" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="36" y="56" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="44" y="56" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="56" y="56" width="24" height="24" fill="#7FE3C5"/>
                      <rect x="60" y="60" width="8" height="8" fill="#0d1f3c"/>
                      <rect x="72" y="60" width="4" height="4" fill="#0d1f3c"/>
                      <rect x="60" y="72" width="4" height="4" fill="#0d1f3c"/>
                      <rect x="72" y="72" width="4" height="4" fill="#0d1f3c"/>
                      <rect x="28" y="64" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="40" y="64" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="28" y="72" width="4" height="4" fill="#7FE3C5"/>
                      <rect x="36" y="72" width="4" height="4" fill="#7FE3C5"/>
                    </svg>
                  </div>
                  <Text style={{ fontSize: 11, color: "#64748b", textAlign: "center", lineHeight: 1.4 }}>
                    Present this code to the driver upon boarding.
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* RIGHT - ACTION BUTTONS + TIPS */}
          <Col xs={24} lg={9}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                style={{
                  height: 52,
                  borderRadius: 8,
                  fontWeight: 600,
                  background: "#1677ff",
                }}
                block
                onClick={() => downloadTicket({
                  bookingRef,
                  from,
                  to,
                  departure,
                  arrivalTime,
                  duration,
                  name,
                  travelDate,
                  seats,
                  busType,
                  isPremium,
                  departureStation,
                  total: booking?.total,
                })}
              >
                Download Ticket
              </Button>
              <Button
                size="large"
                icon={<PrinterOutlined />}
                style={{
                  height: 52,
                  borderRadius: 8,
                  fontWeight: 500,
                  border: "1px solid #e2e8f0",
                }}
                block
              >
                Print
              </Button>
              <Button
                size="large"
                icon={<CalendarOutlined />}
                style={{
                  height: 52,
                  borderRadius: 8,
                  fontWeight: 500,
                  border: "1px solid #e2e8f0",
                }}
                block
              >
                Add to Calendar
              </Button>
            </div>

            {/* Travel Tips */}
            <Card
              style={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
              }}
              styles={{ body: { padding: 20 } }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <InfoCircleOutlined style={{ color: "#7FE3C5", fontSize: 16 }} />
                <Text strong style={{ color: "#0d1f3c" }}>Travel Tips</Text>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#64748b", fontSize: 13, lineHeight: 1.8 }}>
                <li>Arrive at the station at least <strong>20 minutes</strong> before departure.</li>
                <li>Two pieces of luggage (20kg each) are included in your ticket.</li>
                <li>Enjoy complimentary high-speed WiFi and refreshments on board.</li>
              </ul>
            </Card>
          </Col>
        </Row>

        {/* DEPARTURE POINT MAP */}
        <div style={{ marginTop: 40 }}>
          <Title level={4} style={{ color: "#0d1f3c", fontStyle: "italic", marginBottom: 16 }}>
            Departure Point
          </Title>
          <Card
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Map placeholder with pattern */}
            <div
              style={{
                height: 220,
                background: `
                  linear-gradient(rgba(248,250,252,0.95), rgba(248,250,252,0.8)),
                  repeating-linear-gradient(0deg, #e2e8f0 0px, #e2e8f0 1px, transparent 1px, transparent 24px),
                  repeating-linear-gradient(90deg, #e2e8f0 0px, #e2e8f0 1px, transparent 1px, transparent 24px)
                `,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Map pin */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#1677ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(22, 119, 255, 0.35)",
                }}
              >
                <EnvironmentOutlined style={{ fontSize: 26, color: "white" }} />
              </div>

              {/* Station info overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  background: "white",
                  borderRadius: 10,
                  padding: "14px 18px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <Text strong style={{ color: "#0d1f3c", display: "block", fontSize: 15 }}>
                  {departureStation.name}
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {departureStation.address}
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}