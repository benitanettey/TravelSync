"use client";

import { Row, Col, Typography } from "antd";
import SearchForm from "../../components/trip/SearchForm";
import TripCard from "../../components/trip/TripCard";
import FiltersSidebar from "../../components/trip/FiltersSidebar";

const { Title } = Typography;

export default function TripsPage() {

  // TODO: BACKEND - Replace mock data with API call to fetch trips
  // Endpoint: GET /api/trips
  // Query params: from, to, date, passengers
  // Should return: array of trip objects with id, from, to, departure, arrival, duration, price, availableSeats, busType
  // TODO: BACKEND - Add loading state while fetching trips
  // TODO: BACKEND - Add error handling for failed API calls
  // TODO: BACKEND - Implement pagination for large result sets
  const trips = [
    {
      id: 1,
      from: "Nairobi",
      to: "Mombasa",
      departure: "08:00 AM",
      arrival: "02:00 PM",
      duration: "6h",
      price: 2500,
      seats: 5,
      type: "Premium",
    },
    {
      id: 2,
      from: "Nairobi",
      to: "Kisumu",
      departure: "09:30 AM",
      arrival: "03:30 PM",
      duration: "6h",
      price: 2200,
      seats: 8,
      type: "Premium",
    },
    {
      id: 3,
      from: "Nairobi",
      to: "Nakuru",
      departure: "10:00 AM",
      arrival: "01:00 PM",
      duration: "3h",
      price: 1200,
      seats: 12,
      type: "Standard",
    },
    {
      id: 4,
      from: "Nairobi",
      to: "Eldoret",
      departure: "07:00 AM",
      arrival: "01:30 PM",
      duration: "6h 30m",
      price: 1800,
      seats: 3,
      type: "Standard",
    },
  ];

  return (
    <div>

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
              background: "#fff",
              padding: "20px 24px",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(13, 31, 60, 0.15)",
              border: "1px solid rgba(13, 31, 60, 0.08)",
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
          <Title level={4} style={{ marginBottom: 20, color: "#0d1f3c" }}>
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