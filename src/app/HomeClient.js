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
  const fullText = "Move Beautifully Across Kenya.";

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
      title: "Discover Routes",
      description: "Pick your departure city, destination, and date to reveal curated departures.",
    },
    {
      icon: <SelectOutlined style={{ fontSize: 32, color: "#1677ff" }} />,
      title: "Shape Your Cabin",
      description: "Choose exact seats from a live cabin layout with instant availability feedback.",
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: 32, color: "#1677ff" }} />,
      title: "Confirm & Ride",
      description: "Review everything once and get a ready-to-board ticket immediately.",
    },
  ];

  const features = [
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 28, color: "#52c41a" }} />,
      title: "Executive Comfort",
      description: "Spacious seating, cleaner cabins, and thoughtful onboard extras.",
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 28, color: "#faad14" }} />,
      title: "Clockwork Departures",
      description: "Time-first scheduling designed to help you plan confidently.",
    },
    {
      icon: <CustomerServiceOutlined style={{ fontSize: 28, color: "#1677ff" }} />,
      title: "Human Support",
      description: "Get practical help from our team whenever plans need a quick adjustment.",
    },
  ];

  return (
    <div style={{ background: "var(--ts-bg)", minHeight: "100vh", padding: "20px" }}>
      <section className="discover-hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Signature Intercity Atlas</span>
          <h1 className="hero-title ts-display">
            {displayText}
            <span className="hero-cursor">|</span>
          </h1>
          <p className="hero-subcopy">
            A premium intercity experience with quick booking, clean layouts, and reliable departures.
          </p>

          <div className="hero-cta-wrap">
            <Button
              type="primary"
              size="large"
              className="hero-primary-btn"
              onClick={() => router.push("/trips")}
            >
              Start Booking
            </Button>
            <Button
              size="large"
              className="hero-secondary-btn"
              onClick={() => router.push("/my-bookings")}
            >
              Open My Tickets
            </Button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span>Average On-Time</span>
            <strong>97.2%</strong>
          </div>
          <div className="stat-card">
            <span>Major Routes</span>
            <strong>42</strong>
          </div>
          <div className="stat-card">
            <span>Seats Booked</span>
            <strong>140k+</strong>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-header">
          <Title level={2} style={{ marginBottom: 6, color: "var(--ts-text-primary)" }}>
            How TravelSync Works
          </Title>
          <Paragraph className="section-subcopy">
            A simple flow designed to feel precise from first search to final ticket.
          </Paragraph>
        </div>

        <Row gutter={[20, 20]} justify="center">
          {steps.map((step, idx) => (
            <Col xs={24} sm={12} lg={8} key={idx}>
              <Card className="discover-step-card" styles={{ body: { padding: "30px 24px" } }}>
                <span className="step-index">0{idx + 1}</span>
                <div style={{ marginBottom: 16 }}>{step.icon}</div>
                <Title level={4} style={{ marginBottom: 8, color: "var(--ts-text-primary)" }}>
                  {step.title}
                </Title>
                <Paragraph className="step-copy">{step.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="section-shell why-shell">
        <div className="section-header">
          <h2 className="why-title ts-display">
            Why Riders Choose TravelSync
          </h2>
          <p className="why-subcopy">
            We combine dependable operations with a booking experience that feels thoughtfully designed.
          </p>
        </div>

        <Row gutter={[18, 18]} justify="center">
          {features.map((feat, idx) => (
            <Col xs={24} sm={12} lg={8} key={idx}>
              <div className="why-card">
                <div className="why-icon">{feat.icon}</div>
                <h3 className="why-card-title ts-display">{feat.title}</h3>
                <p className="why-copy">{feat.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      <section className="cta-shell">
        <h2 className="cta-title ts-display">
          Ready for Your Next Route?
        </h2>
        <p className="cta-copy">
          Compare departures, choose your seat, and lock in your journey in minutes.
        </p>
        <Button
          type="primary"
          size="large"
          className="cta-btn"
          onClick={() => router.push("/trips")}
        >
          View Trips
        </Button>
      </section>

      <style jsx>{`
        .discover-hero {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          min-height: 520px;
          margin-bottom: 56px;
          padding: 48px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
          background:
            linear-gradient(120deg, rgba(12, 24, 30, 0.66), rgba(16, 111, 102, 0.42)),
            url('/herobus.jpg');
          background-size: cover;
          background-position: center;
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: 0 24px 60px rgba(6, 14, 21, 0.3);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          align-self: center;
        }

        .hero-eyebrow {
          display: inline-block;
          margin-bottom: 18px;
          padding: 7px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
          color: #d9fff8;
          letter-spacing: 0.08em;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .hero-title {
          margin: 0 0 14px;
          color: #f2fcff;
          font-size: clamp(2.5rem, 5vw, 4.2rem);
          line-height: 1;
          text-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .hero-cursor {
          opacity: 0.55;
        }

        .hero-subcopy {
          color: #ffffff !important;
          font-size: 1.08rem;
          max-width: 620px;
          margin: 0 0 30px !important;
          line-height: 1.7;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.42);
        }

        .hero-cta-wrap {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        :global(.hero-primary-btn.ant-btn) {
          height: 52px;
          padding: 0 32px;
          border-radius: 999px;
          background: #9bf4de !important;
          border-color: #9bf4de !important;
          color: #0f2a2d !important;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        :global(.hero-secondary-btn.ant-btn) {
          height: 52px;
          padding: 0 30px;
          border-radius: 999px;
          color: #f2fcff !important;
          border: 1px solid rgba(242, 252, 255, 0.48);
          background: rgba(9, 18, 25, 0.42);
          font-weight: 700;
        }

        .hero-stats {
          position: relative;
          z-index: 1;
          align-self: center;
          display: grid;
          gap: 12px;
        }

        .stat-card {
          border-radius: 16px;
          padding: 16px 18px;
          background: rgba(248, 255, 255, 0.15);
          border: 1px solid rgba(229, 254, 249, 0.35);
          backdrop-filter: blur(6px);
          color: #ebfcff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .stat-card strong {
          font-size: 1.1rem;
          font-weight: 800;
          color: #bdffef;
        }

        .section-shell {
          margin-bottom: 56px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .section-subcopy {
          color: var(--ts-text-secondary) !important;
          max-width: 640px;
          margin: 0 auto !important;
        }

        :global(.discover-step-card.ant-card) {
          position: relative;
          height: 100%;
          border-radius: 18px;
          border: 1px solid var(--ts-border);
          overflow: hidden;
        }

        :global(.discover-step-card.ant-card):before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(15, 118, 110, 0.08), transparent 45%);
          pointer-events: none;
        }

        .step-index {
          display: inline-block;
          margin-bottom: 12px;
          color: #0f766e;
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .step-copy {
          color: var(--ts-text-secondary) !important;
          margin: 0 !important;
          line-height: 1.65;
        }

        .why-shell {
          border-radius: 22px;
          padding: 40px 28px;
          background: linear-gradient(140deg, #14232c, #1c3644);
          border: 1px solid #2e5565;
        }

        .why-subcopy {
          color: #e3f3f8 !important;
          max-width: 650px;
          margin: 0 auto;
          font-size: 1.02rem;
          line-height: 1.7;
        }

        .why-title {
          margin: 0 0 8px;
          color: #f2fbff;
        }

        .why-card {
          height: 100%;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(130, 174, 192, 0.24);
          background: rgba(7, 15, 20, 0.44);
        }

        .why-icon {
          margin-bottom: 10px;
        }

        .why-card-title {
          margin: 0 0 8px;
          color: #f2fbff;
          font-size: 1.3rem;
        }

        .why-copy {
          color: #e1f1f6 !important;
          margin: 0;
          line-height: 1.65;
        }

        .cta-shell {
          border-radius: 22px;
          padding: 48px 36px;
          text-align: center;
          background:
            radial-gradient(circle at 20% 20%, rgba(182, 255, 235, 0.2), transparent 34%),
            linear-gradient(125deg, #102229, #214251);
          border: 1px solid rgba(152, 213, 203, 0.26);
        }

        .cta-title {
          color: #f4fdff;
          margin: 0 0 8px;
          font-size: clamp(2rem, 3.8vw, 2.6rem);
        }

        .cta-copy {
          color: #ecfbff !important;
          max-width: 640px;
          margin: 0 auto 24px;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        :global(.cta-btn.ant-btn) {
          height: 48px;
          border-radius: 999px;
          padding: 0 30px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        @media (max-width: 992px) {
          .discover-hero {
            grid-template-columns: 1fr;
            padding: 36px 24px;
            min-height: auto;
          }

          .hero-stats {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .cta-shell,
          .why-shell {
            padding: 32px 18px;
          }

          .hero-cta-wrap {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}