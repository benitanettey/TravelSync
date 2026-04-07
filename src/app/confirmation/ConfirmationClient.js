"use client";

import { Suspense, useRef } from "react";
import { Card, Typography, Button, Row, Col, Tag } from "antd";
import {
  CheckCircleFilled,
  DownloadOutlined,
  PrinterOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTravelData } from "@/hooks/useTravelData";
import { fetchBookingById } from "@/services/seatDataService";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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

// Generate .ics calendar file content
function generateICSFile(bookingData) {
  const { from, to, departure, travelDate, bookingRef, departureStation } = bookingData;
  
  // Parse date and time for calendar event
  const eventDate = new Date(travelDate);
  const [time, period] = departure.split(" ");
  const [hours, minutes] = time.split(":");
  let hour24 = parseInt(hours);
  if (period === "PM" && hour24 !== 12) hour24 += 12;
  if (period === "AM" && hour24 === 12) hour24 = 0;
  
  eventDate.setHours(hour24, parseInt(minutes), 0);
  
  // Format dates for ICS (YYYYMMDDTHHMMSS)
  const formatICSDate = (date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };
  
  const startDate = formatICSDate(eventDate);
  const endDate = formatICSDate(new Date(eventDate.getTime() + 6 * 60 * 60 * 1000)); // +6 hours
  const now = formatICSDate(new Date());
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TravelSync//Bus Booking//EN
BEGIN:VEVENT
UID:${bookingRef}@travelsync.com
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:🚌 TravelSync: ${from} → ${to}
DESCRIPTION:Booking Reference: ${bookingRef}\\nFrom: ${from}\\nTo: ${to}\\nDeparture: ${departure}\\n\\nPresent your QR code to the driver upon boarding.
LOCATION:${departureStation.name}, ${departureStation.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
  
  return icsContent;
}

function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketRef = useRef(null);
  const { getBookingById, upsertBookingFromServer } = useTravelData();

  const bookingId = searchParams.get("bookingId") || "";
  const [isMounted, setIsMounted] = useState(false);
  const [remoteBooking, setRemoteBooking] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
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

  // QR code data - compact ticket info that's easy to scan
  const qrData = `TravelSync Ticket
${bookingRef}
${name}
${from} > ${to}
${travelDate} ${departure}
Seats: ${seats.join(", ")}
${isPremium ? "Executive" : "Standard"}`;

  // Download ticket as PDF
  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`TravelSync-Ticket-${bookingRef.replace("#", "")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download ticket. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Print ticket
  const handlePrintTicket = () => {
    window.print();
  };

  // Add to calendar
  const handleAddToCalendar = () => {
    const icsContent = generateICSFile({
      from,
      to,
      departure,
      travelDate,
      bookingRef,
      departureStation,
    });
    
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `TravelSync-${bookingRef.replace("#", "")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Navigate back to home
  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="confirmation-page" style={{ background: "var(--ts-bg)", minHeight: "100vh", paddingBottom: 60 }}>
      <div className="confirmation-shell" style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 20px" }}>
        {/* HEADER */}
        <div className="print-hide" style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--ts-accent-green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircleFilled style={{ fontSize: 28, color: "white" }} />
          </div>
          <Title level={2} style={{ margin: 0, fontStyle: "italic", color: "var(--ts-text-primary)" }}>
            You&apos;re Confirmed
          </Title>
          <Paragraph style={{ marginBottom: 0, color: "var(--ts-text-secondary)" }}>
            Your boarding pass is ready. Arrive early and travel easy.
          </Paragraph>
        </div>

        <Row gutter={24}>
          {/* LEFT - TICKET CARD */}
          <Col xs={24} lg={15} className="print-ticket-col">
            <Card
              className="ticket-print-target"
              ref={ticketRef}
              style={{
                borderRadius: 16,
                border: "1px solid var(--ts-border)",
                overflow: "hidden",
                marginBottom: 24,
                background: "var(--ts-bg-card)",
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
                      <Text style={{ fontSize: 10, color: "var(--ts-text-secondary)", letterSpacing: 0.5, display: "block" }}>BUS TYPE</Text>
                      <div style={{ color: "var(--ts-text-primary)", fontWeight: 600, fontSize: 15 }}>
                        {isPremium ? "Executive Gold Liner" : "Standard Traveller"}
                      </div>
                    </Col>
                    <Col>
                      <Text style={{ fontSize: 10, color: "var(--ts-text-secondary)", letterSpacing: 0.5, display: "block" }}>BOOKING REF</Text>
                      <div style={{ color: "var(--ts-text-primary)", fontWeight: 700, fontSize: 15 }}>{bookingRef}</div>
                    </Col>
                  </Row>

                  {/* Route display */}
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <Title level={2} style={{ margin: 0, color: "var(--ts-text-primary)", fontSize: 28 }}>{from}</Title>
                      <Text style={{ fontSize: 12, color: "var(--ts-text-secondary)" }}>{departureStation.name}</Text>
                    </div>

                    <div style={{ textAlign: "center", padding: "0 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 40, height: 1, background: "var(--ts-border)" }} />
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: "var(--ts-bg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--ts-text-secondary)">
                            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                          </svg>
                        </div>
                        <div style={{ width: 40, height: 1, background: "var(--ts-border)" }} />
                      </div>
                      <Text style={{ fontSize: 11, color: "var(--ts-text-secondary)" }}>{duration}</Text>
                    </div>

                    <div style={{ flex: 1, textAlign: "right" }}>
                      <Title level={2} style={{ margin: 0, color: "var(--ts-text-primary)", fontSize: 28 }}>{to}</Title>
                      <Text style={{ fontSize: 12, color: "var(--ts-text-secondary)" }}>{getStationInfo(to).name}</Text>
                    </div>
                  </div>

                  {/* Times */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
                    <Title level={3} style={{ margin: 0, color: "var(--ts-text-primary)" }}>{departure}</Title>
                    <Title level={3} style={{ margin: 0, color: "var(--ts-text-primary)" }}>{arrivalTime}</Title>
                  </div>

                  {/* Passenger and date */}
                  <Row gutter={24} style={{ marginBottom: 20 }}>
                    <Col span={12}>
                      <Text style={{ fontSize: 10, color: "var(--ts-text-secondary)", letterSpacing: 0.5, display: "block" }}>PASSENGER</Text>
                      <div style={{ color: "var(--ts-text-primary)", fontWeight: 600, fontSize: 15 }}>{name}</div>
                    </Col>
                    <Col span={12}>
                      <Text style={{ fontSize: 10, color: "var(--ts-text-secondary)", letterSpacing: 0.5, display: "block" }}>DATE</Text>
                      <div style={{ color: "var(--ts-text-primary)", fontWeight: 600, fontSize: 15 }}>{travelDate}</div>
                    </Col>
                  </Row>

                  {/* Seats and class */}
                  <Row gutter={24}>
                    <Col span={12}>
                      <Text style={{ fontSize: 10, color: "var(--ts-text-secondary)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>SEATS</Text>
                      <div>
                        {seats.map((seat) => (
                          <Tag
                            key={seat}
                            style={{
                              background: "var(--ts-text-primary)",
                              color: "var(--ts-bg)",
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
                      <Text style={{ fontSize: 10, color: "var(--ts-text-secondary)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>CLASS</Text>
                      <Tag
                        style={{
                          background: isPremium ? "var(--ts-accent-green)" : "#fef3c7",
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
                    background: "repeating-linear-gradient(to bottom, var(--ts-border) 0px, var(--ts-border) 8px, transparent 8px, transparent 16px)",
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
                  <Text style={{ fontSize: 10, color: "var(--ts-text-secondary)", letterSpacing: 0.5, marginBottom: 12 }}>
                    BOARDING PASS
                  </Text>
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      background: "var(--ts-bg-hero)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 10,
                      marginBottom: 12,
                    }}
                  >
                    <QRCodeSVG
                      value={qrData}
                      size={85}
                      bgColor="transparent"
                      fgColor="var(--ts-accent-green)"
                      level="M"
                    />
                  </div>
                  <Text style={{ fontSize: 11, color: "var(--ts-text-secondary)", textAlign: "center", lineHeight: 1.4 }}>
                    Show this QR code at boarding.
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* RIGHT - ACTION BUTTONS + TIPS */}
          <Col xs={24} lg={9} className="print-hide">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                loading={isDownloading}
                style={{
                  height: 52,
                  borderRadius: 8,
                  fontWeight: 600,
                  background: "var(--ts-accent)",
                }}
                block
                onClick={handleDownloadTicket}
              >
                Download boarding pass
              </Button>
              <Button
                size="large"
                icon={<PrinterOutlined />}
                style={{
                  height: 52,
                  borderRadius: 8,
                  fontWeight: 500,
                  border: "1px solid var(--ts-border)",
                  background: "var(--ts-bg-card)",
                  color: "var(--ts-text-primary)",
                }}
                block
                onClick={handlePrintTicket}
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
                  border: "1px solid var(--ts-border)",
                  background: "var(--ts-bg-card)",
                  color: "var(--ts-text-primary)",
                }}
                block
                onClick={handleAddToCalendar}
              >
                Save to calendar
              </Button>
              <Button
                size="large"
                icon={<HomeOutlined />}
                style={{
                  height: 52,
                  borderRadius: 8,
                  fontWeight: 500,
                  border: "1px solid var(--ts-border)",
                  background: "var(--ts-bg-card)",
                  color: "var(--ts-text-primary)",
                  marginTop: 8,
                }}
                block
                onClick={handleBackToHome}
              >
                Return home
              </Button>
            </div>

            {/* Travel Tips */}
            <Card
              style={{
                borderRadius: 12,
                border: "1px solid var(--ts-border)",
                background: "var(--ts-bg-card)",
              }}
              styles={{ body: { padding: 20 } }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <InfoCircleOutlined style={{ color: "var(--ts-accent-green)", fontSize: 16 }} />
                <Text strong style={{ color: "var(--ts-text-primary)" }}>Before You Board</Text>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, color: "var(--ts-text-secondary)", fontSize: 13, lineHeight: 1.8 }}>
                <li>Arrive at the station at least <strong>20 minutes</strong> before departure.</li>
                <li>Two pieces of luggage (20kg each) are included in your ticket.</li>
                <li>Enjoy complimentary high-speed WiFi and refreshments on board.</li>
              </ul>
            </Card>
          </Col>
        </Row>

        {/* DEPARTURE POINT MAP */}
        <div className="print-hide" style={{ marginTop: 40 }}>
          <Title level={4} style={{ color: "var(--ts-text-primary)", fontStyle: "italic", marginBottom: 16 }}>
            Departure Station
          </Title>
          <Card
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid var(--ts-border)",
              background: "var(--ts-bg-card)",
            }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Map placeholder with pattern */}
            <div
              style={{
                height: 220,
                background: "var(--ts-bg-elevated)",
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
                  background: "var(--ts-accent)",
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
                  background: "var(--ts-bg-card)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  boxShadow: "var(--ts-shadow)",
                  border: "1px solid var(--ts-border)",
                }}
              >
                <Text strong style={{ color: "var(--ts-text-primary)", display: "block", fontSize: 15 }}>
                  {departureStation.name}
                </Text>
                <Text style={{ fontSize: 13, color: "var(--ts-text-secondary)" }}>
                  {departureStation.address}
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          html,
          body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .confirmation-page {
            background: #ffffff !important;
            min-height: auto !important;
            padding: 0 !important;
          }

          .confirmation-shell {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .nav-wrap,
          footer {
            display: none !important;
          }

          .print-hide {
            display: none !important;
          }

          .print-ticket-col {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            flex: 0 0 100% !important;
          }

          .ticket-print-target {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: none !important;
            border: 1px solid #d8dee8 !important;
            border-radius: 10px !important;
            box-shadow: none !important;
            background: #ffffff !important;
            overflow: hidden !important;
            margin: 0 !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .ticket-print-target .ant-card-body {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}