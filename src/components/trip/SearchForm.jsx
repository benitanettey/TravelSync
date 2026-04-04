"use client";

import { Input, DatePicker, Button, Row, Col } from "antd";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [date, setDate] = useState(null);

  // TODO: BACKEND - Replace text inputs with autocomplete dropdowns
  // Fetch cities/stations from API as user types
  // Endpoint: GET /api/stations/search?q={query}
  // Should return: array of matching stations { id, name, city }

  // TODO: BACKEND - Add passenger count selector
  // const [passengers, setPassengers] = useState(1);

  // TODO: BACKEND - Add return date for round-trip bookings (optional)
  // const [returnDate, setReturnDate] = useState(null);

  const handleSearch = () => {
    // TODO: BACKEND - Validate search inputs
    // Check that from !== to, date is not in the past, etc.
    
    // TODO: BACKEND - Track search analytics
    // Log popular routes, search patterns for business insights
    
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date.format("YYYY-MM-DD"));
    router.push(`/trips?${params.toString()}`);
  };

  return (
    <Row gutter={16} style={{ marginTop: "20px" }}>
      <Col xs={24} sm={6}>
        <Input
          placeholder="From where?"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </Col>

      <Col xs={24} sm={6}>
        <Input
          placeholder="Going to?"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </Col>

      <Col xs={24} sm={6}>
        <DatePicker
          style={{ width: "100%" }}
          value={date}
          onChange={(d) => setDate(d)}
        />
      </Col>

      <Col xs={24} sm={6}>
        <Button type="primary" block onClick={handleSearch}>
          Find Trips
        </Button>
      </Col>
    </Row>
  );
};

export default SearchForm;