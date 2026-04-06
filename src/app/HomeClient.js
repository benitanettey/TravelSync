"use client";

import { Button, Row, Col, Card, Typography } from "antd";
import {
  SearchOutlined,
  SelectOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();
  const [displayText, setDisplayText] = useState("");
  const fullText = "Your Journey, Precisely Curated.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      icon: <SearchOutlined style={{ fontSize: 32, color: "#1677ff" }} />,
      title: "Search",
      description: "Enter your origin, destination, and travel date to find available trips.",
    },
    {
      icon: <SelectOutlined style={{ fontSize: 32, color: "#1677ff" }} />,
      title: "Select Seats",
      description: "Choose your preferred seats from our interactive seat map.",
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: 32, color: "#1677ff" }} />,
      title: "Confirm",
      description: "Review your booking and receive instant confirmation.",
    },
  ];

  const features = [
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 28, color: "#52c41a" }} />,
      title: "Executive Comfort",
      description: "Premium seating with extra legroom and onboard amenities.",
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 28, color: "#faad14" }} />,
      title: "On-Time Departures",
      description: "We value your time with punctual schedules you can rely on.",
    },
    {
      icon: <CustomerServiceOutlined style={{ fontSize: 28, color: "#1677ff" }} />,
      title: "24/7 Support",
      description: "Our team is always ready to assist with your travel needs.",
    },
  ];

  return (
    <div style={{ background: "var(--ts-bg)", minHeight: "100vh", padding: "20px" }}>
      {/* HERO SECTION WITH BUS BACKGROUND */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(13, 31, 60, 0.9), rgba(30, 58, 138, 0.75)), url('/herobus.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
          padding: "100px 40px",
          borderRadius: "12px",
          marginBottom: "48px",
          textAlign: "center",
          minHeight: "420px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            marginBottom: "16px",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}
        >
          {displayText}
          <span style={{ opacity: 0.5 }}>|</span>
        </h1>
        <Paragraph
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "18px",
            maxWidth: "600px",
            margin: "0 auto 32px",
          }}
        >
          Experience executive transit where comfort meets reliability. Book your seat in seconds.
        </Paragraph>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            type="primary"
            size="large"
            style={{
              height: "50px",
              padding: "0 40px",
              fontSize: "16px",
              background: "#7FE3C5",
              borderColor: "#7FE3C5",
              color: "#0d1f3c",
              fontWeight: "600",
            }}
            onClick={() => router.push("/trips")}
          >
            Book Now
          </Button>
          <Button
            size="large"
            style={{
              height: "50px",
              padding: "0 40px",
              fontSize: "16px",
              background: "rgba(255,255,255,0.15)",
              borderColor: "rgba(255,255,255,0.4)",
              color: "white",
              fontWeight: "600",
            }}
            onClick={() => router.push("/my-bookings")}
          >
            View My Tickets
          </Button>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ marginBottom: "48px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "32px", color: "var(--ts-text-primary)" }}>
          How It Works
        </Title>

        <Row gutter={24} justify="center">
          {steps.map((step, idx) => (
            <Col xs={24} sm={8} key={idx}>
              <Card
                style={{
                  textAlign: "center",
                  borderRadius: "12px",
                  height: "100%",
                  background: "var(--ts-bg-card)",
                  borderColor: "var(--ts-border)",
                }}
                styles={{ body: { padding: "32px 24px" } }}
              >
                <div style={{ marginBottom: "16px" }}>{step.icon}</div>
                <Title level={4} style={{ marginBottom: "8px", color: "var(--ts-text-primary)" }}>
                  {step.title}
                </Title>
                <Paragraph style={{ color: "var(--ts-text-secondary)" }}>{step.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* WHY TRAVELSYNC */}
      <div
        style={{
          background: "var(--ts-bg-elevated)",
          borderRadius: "12px",
          padding: "48px 40px",
          marginBottom: "48px",
          border: "1px solid var(--ts-border)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "32px", color: "var(--ts-text-primary)" }}>
          Why TravelSync?
        </Title>

        <Row gutter={24} justify="center">
          {features.map((feat, idx) => (
            <Col xs={24} sm={8} key={idx}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div>{feat.icon}</div>
                <div>
                  <Title level={5} style={{ marginBottom: "4px", color: "var(--ts-text-primary)" }}>
                    {feat.title}
                  </Title>
                  <Paragraph style={{ marginBottom: 0, color: "var(--ts-text-secondary)" }}>
                    {feat.description}
                  </Paragraph>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA BANNER */}
      <div
        style={{
          background: "var(--ts-bg-hero)",
          color: "white",
          borderRadius: "12px",
          padding: "48px 40px",
          textAlign: "center",
        }}
      >
        <Title level={3} style={{ color: "var(--ts-text-on-hero)", marginBottom: "8px" }}>
          Ready to travel?
        </Title>
        <Paragraph style={{ color: "rgba(255,255,255,0.8)", marginBottom: "24px" }}>
          Browse available trips and reserve your seat today.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={() => router.push("/trips")}
        >
          View Trips
        </Button>
      </div>
    </div>
  );
}