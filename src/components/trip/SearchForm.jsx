"use client";

import { DatePicker, Button, Row, Col, AutoComplete, Input } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchForm = ({ cities = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || "";
  const dateParam = searchParams.get("date") || "";

  const [from, setFrom] = useState(fromParam);
  const [to, setTo] = useState(toParam);
  const [date, setDate] = useState(() => (dateParam ? dayjs(dateParam, "YYYY-MM-DD") : null));

  const cityOptions = useMemo(
    () => cities.map((city) => ({ label: city, value: city })),
    [cities]
  );

  // TODO: BACKEND - Replace text inputs with autocomplete dropdowns
  // Fetch cities/stations from API as user types
  // Endpoint: GET /api/stations/search?q={query}
  // Should return: array of matching stations { id, name, city }

  // TODO: BACKEND - Add passenger count selector
  // const [passengers, setPassengers] = useState(1);

  // TODO: BACKEND - Add return date for round-trip bookings (optional)
  // const [returnDate, setReturnDate] = useState(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", from.trim());
    if (to.trim()) params.set("to", to.trim());
    if (date) params.set("date", date.format("YYYY-MM-DD"));

    const existingTimeFilter = searchParams.get("departureWindow");
    if (existingTimeFilter) {
      params.set("departureWindow", existingTimeFilter);
    }

    router.push(`/trips?${params.toString()}`);
  };

  return (
    <Row gutter={[12, 12]} align="middle">
      <Col xs={24} sm={6}>
        <AutoComplete
          options={cityOptions}
          value={from}
          onChange={(value) => setFrom(value || "")}
          onSelect={(value) => setFrom(String(value))}
          filterOption={(inputValue, option) =>
            String(option?.value || "").toLowerCase().includes(inputValue.toLowerCase())
          }
          style={{ width: "100%" }}
        >
          <Input allowClear placeholder="Departure city" />
        </AutoComplete>
      </Col>

      <Col xs={24} sm={6}>
        <AutoComplete
          options={cityOptions}
          value={to}
          onChange={(value) => setTo(value || "")}
          onSelect={(value) => setTo(String(value))}
          filterOption={(inputValue, option) =>
            String(option?.value || "").toLowerCase().includes(inputValue.toLowerCase())
          }
          style={{ width: "100%" }}
        >
          <Input allowClear placeholder="Destination city" />
        </AutoComplete>
      </Col>

      <Col xs={24} sm={6}>
        <DatePicker
          style={{ width: "100%" }}
          value={date}
          onChange={(d) => setDate(d)}
          format="YYYY-MM-DD"
          placeholder="Travel date"
        />
      </Col>

      <Col xs={24} sm={6}>
        <Button
          type="primary"
          block
          onClick={handleSearch}
          disabled={from.trim() && to.trim() && from.trim().toLowerCase() === to.trim().toLowerCase()}
        >
          Explore Departures
        </Button>
      </Col>
    </Row>
  );
};

export default SearchForm;