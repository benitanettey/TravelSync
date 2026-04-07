"use client";

import { Row, Col, Typography } from "antd";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import SearchForm from "../../components/trip/SearchForm";
import TripCard from "../../components/trip/TripCard";
import FiltersSidebar from "../../components/trip/FiltersSidebar";
import { useTravelData } from "@/hooks/useTravelData";

const { Title } = Typography;

export default function TripsPage() {
  const { buses, getAvailableSeatCount } = useTravelData();
  const searchParams = useSearchParams();

  const fromParam = (searchParams.get("from") || "").trim();
  const toParam = (searchParams.get("to") || "").trim();
  const dateParam = (searchParams.get("date") || "").trim();
  const fromQuery = fromParam.toLowerCase();
  const toQuery = toParam.toLowerCase();
  const departureWindows = (searchParams.get("departureWindow") || "")
    .split(",")
    .map((windowValue) => windowValue.trim().toLowerCase())
    .filter(Boolean);
  const busTypeFilter = (searchParams.get("busType") || "all").trim().toLowerCase();
  const priceRanges = (searchParams.get("priceRange") || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const amenities = (searchParams.get("amenities") || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const cityOptions = useMemo(() => {
    const set = new Set();
    buses.forEach((bus) => {
      if (bus.from) set.add(bus.from);
      if (bus.to) set.add(bus.to);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [buses]);

  const isDepartureMatch = (departure, selectedWindows) => {
    if (!departure || selectedWindows.length === 0) {
      return true;
    }

    const match = departure.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
      return false;
    }

    let hours = Number(match[1]) % 12;
    const minutes = Number(match[2]);
    const meridiem = match[3].toUpperCase();

    if (meridiem === "PM") {
      hours += 12;
    }

    const totalMinutes = hours * 60 + minutes;

    return selectedWindows.some((windowValue) => {
      if (windowValue === "morning") {
        return totalMinutes >= 6 * 60 && totalMinutes < 12 * 60;
      }
      if (windowValue === "afternoon") {
        return totalMinutes >= 12 * 60 && totalMinutes < 18 * 60;
      }
      if (windowValue === "evening") {
        return totalMinutes >= 18 * 60 && totalMinutes < 24 * 60;
      }
      return false;
    });
  };

  const isBusTypeMatch = (trip, selectedType) => {
    if (!selectedType || selectedType === "all") {
      return true;
    }

    return (trip.type || "").toLowerCase() === selectedType;
  };

  const isPriceMatch = (price, selectedRanges) => {
    if (selectedRanges.length === 0) {
      return true;
    }

    return selectedRanges.some((range) => {
      if (range === "under-1500") {
        return price < 1500;
      }
      if (range === "1500-2500") {
        return price >= 1500 && price <= 2500;
      }
      if (range === "over-2500") {
        return price > 2500;
      }
      return false;
    });
  };

  const hasAmenities = (trip, selectedAmenities) => {
    if (selectedAmenities.length === 0) {
      return true;
    }

    const tripType = (trip.type || "").toLowerCase();
    const supports = {
      wifi: tripType === "premium",
      usb: tripType === "premium",
      snacks: tripType === "premium",
      ac: true,
    };

    return selectedAmenities.every((amenity) => supports[amenity]);
  };

  const trips = useMemo(
    () =>
      buses.map((bus) => ({
        ...bus,
        seats: getAvailableSeatCount(bus.id),
      }))
      .filter((trip) => {
        const matchesFrom = !fromQuery || trip.from.toLowerCase().includes(fromQuery);
        const matchesTo = !toQuery || trip.to.toLowerCase().includes(toQuery);
        const matchesDeparture = isDepartureMatch(trip.departure, departureWindows);
        const matchesBusType = isBusTypeMatch(trip, busTypeFilter);
        const matchesPrice = isPriceMatch(trip.price, priceRanges);
        const matchesAmenities = hasAmenities(trip, amenities);
        return matchesFrom && matchesTo && matchesDeparture && matchesBusType && matchesPrice && matchesAmenities;
      }),
    [amenities, buses, busTypeFilter, departureWindows, fromQuery, getAvailableSeatCount, priceRanges, toQuery]
  );

  return (
    <div style={{ background: "var(--ts-bg)", minHeight: "100vh" }}>

      {/* HERO SECTION */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(112deg, rgba(22, 36, 45, 0.92), rgba(15, 118, 110, 0.65)), url('/herobus.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
          borderRadius: "22px",
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
                fontSize: "52px",
                fontWeight: "800",
                lineHeight: "1.1",
                marginBottom: "16px",
              }}
            >
              Select a Route.
              <span style={{ color: "#7FE3C5" }}> Shape the Ride.</span>
            </h1>

            <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: 0 }}>
              Explore verified departures, compare seat classes, and reserve with confidence.
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
            <SearchForm key={`${fromParam}|${toParam}|${dateParam}`} cities={cityOptions} />
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
            {trips.length === 0 && (
              <Col span={24}>
                <div
                  style={{
                    padding: 16,
                    border: "1px solid var(--ts-border)",
                    borderRadius: 10,
                    background: "var(--ts-bg-card)",
                    color: "var(--ts-text-secondary)",
                  }}
                >
                  No departures match the current filters. Adjust cities or departure windows to widen results.
                </div>
              </Col>
            )}
          </Row>
        </Col>

      </Row>

    </div>
  );
}