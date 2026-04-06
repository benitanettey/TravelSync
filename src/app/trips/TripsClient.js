"use client";

import { Row, Col, Typography } from "antd";
import { useMemo } from "react";
import SearchForm from "../../components/trip/SearchForm";
import TripCard from "../../components/trip/TripCard";
import FiltersSidebar from "../../components/trip/FiltersSidebar";
import { useTravelData } from "@/hooks/useTravelData";

const { Title } = Typography;

export default function TripsPage() {
  const { buses, getAvailableSeatCount } = useTravelData();

  const trips = useMemo(
    () =>
      buses.map((bus) => ({
        ...bus,
        seats: getAvailableSeatCount(bus.id),
      })),
    [buses, getAvailableSeatCount]
  );

  return (
    <div style={{ background: "var(--ts-bg)", minHeight: "100vh" }}>

      {/* HERO SECTION */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(13, 31, 60, 0.9), rgba(13, 31, 60, 0.6)), url('/herobus.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
          borderRadius: "12px",
          marginBottom: "60px",
          height: "40vh",
          minHeight: "320px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 40px",
          }}
        >
          <div style={{ maxWidth: "650px" }}>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "800",
                lineHeight: "1.1",
                marginBottom: "16px",
              }}
            >
              Your Journey,{" "}
              <span style={{ color: "#7FE3C5" }}>Precisely</span>{" "}
              Curated.
            </h1>

            <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: 0 }}>
              Experience executive transit where comfort meets absolute reliability.
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "0 40px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              background: "var(--ts-bg-card)",
              padding: "20px 24px",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(13, 31, 60, 0.15)",
              border: "1px solid var(--ts-border)",
            }}
          >
            <SearchForm />
          </div>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <Row gutter={24} style={{ marginTop: "20px" }}>

        {/* SIDEBAR */}
        <Col xs={24} md={6}>
          <FiltersSidebar />
        </Col>

        {/* TRIPS */}
        <Col xs={24} md={18}>
          <Title level={4} style={{ marginBottom: 20, color: "var(--ts-text-primary)" }}>
            {trips.length} Trips Available
          </Title>

          <Row gutter={[16, 16]}>
            {trips.map((trip) => (
              <Col span={24} key={trip.id}>
                <TripCard trip={trip} />
              </Col>
            ))}
          </Row>
        </Col>

      </Row>

    </div>
  );
}