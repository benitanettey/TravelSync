"use client";

import { Card, Checkbox, Tag, Typography, Divider, Button } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const { Text } = Typography;

const DEPARTURE_WINDOWS = [
  { key: "morning", label: "Morning (06:00 - 11:59)" },
  { key: "afternoon", label: "Afternoon (12:00 - 17:59)" },
  { key: "evening", label: "Evening (18:00 - 23:59)" },
];

const PRICE_RANGES = [
  { key: "under-1500", label: "Under KES 1,500" },
  { key: "1500-2500", label: "KES 1,500 - 2,500" },
  { key: "over-2500", label: "Over KES 2,500" },
];

const AMENITIES = ["wifi", "usb", "ac", "snacks"];

const FiltersSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedBusType = (searchParams.get("busType") || "all").trim().toLowerCase();

  const selectedDepartureWindows = searchParams
    .get("departureWindow")
    ?.split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean) || [];

  const selectedPriceRanges = searchParams
    .get("priceRange")
    ?.split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean) || [];

  const selectedAmenities = searchParams
    .get("amenities")
    ?.split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean) || [];

  const updateParam = (key, values) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!values || values.length === 0 || (key === "busType" && values[0] === "all")) {
      params.delete(key);
    } else {
      params.set(key, values.join(","));
    }

    router.push(`/trips?${params.toString()}`);
  };

  const updateBusType = (busType) => {
    updateParam("busType", [busType]);
  };

  const updateDeparture = (windows) => {
    updateParam("departureWindow", windows);
  };

  const updatePriceRange = (ranges) => {
    updateParam("priceRange", ranges);
  };

  const toggleAmenity = (amenity) => {
    const next = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((item) => item !== amenity)
      : [...selectedAmenities, amenity];
    updateParam("amenities", next);
  };

  const resetAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("busType");
    params.delete("departureWindow");
    params.delete("priceRange");
    params.delete("amenities");
    router.push(`/trips?${params.toString()}`);
  };

  return (
    <Card
      title={<span style={{ color: "var(--ts-text-secondary)", fontWeight: 700, letterSpacing: "0.02em" }}>Refine Results</span>}
      style={{ borderRadius: "16px", position: "sticky", top: 80 }}
    >

      {/* Bus Type */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ display: "block", marginBottom: 10, color: "var(--ts-text-secondary)" }}>
          Bus Type
        </Text>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Tag
            style={{
              cursor: "pointer",
              borderRadius: 16,
              padding: "2px 10px",
              border: "1px solid var(--ts-border)",
              background: selectedBusType === "all" ? "var(--ts-bg-elevated)" : "transparent",
              color: selectedBusType === "all" ? "var(--ts-text-secondary)" : "var(--ts-text-secondary)",
              fontWeight: selectedBusType === "all" ? 700 : 500,
            }}
            onClick={() => updateBusType("all")}
          >
            All
          </Tag>
          <Tag
            style={{
              cursor: "pointer",
              border: "1px solid var(--ts-border)",
              background: selectedBusType === "premium" ? "var(--ts-bg-elevated)" : "transparent",
              color: "var(--ts-text-secondary)",
              fontWeight: selectedBusType === "premium" ? 700 : 500,
            }}
            onClick={() => updateBusType("premium")}
          >
            Premium
          </Tag>
          <Tag
            style={{
              cursor: "pointer",
              border: "1px solid var(--ts-border)",
              background: selectedBusType === "standard" ? "var(--ts-bg-elevated)" : "transparent",
              color: "var(--ts-text-secondary)",
              fontWeight: selectedBusType === "standard" ? 700 : 500,
            }}
            onClick={() => updateBusType("standard")}
          >
            Standard
          </Tag>
        </div>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* Departure Time */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ display: "block", marginBottom: 10, color: "var(--ts-text-secondary)" }}>
          Departure Time
        </Text>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Checkbox.Group
            value={selectedDepartureWindows}
            onChange={(values) => updateDeparture(values.map((value) => String(value)))}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DEPARTURE_WINDOWS.map((window) => (
                <Checkbox key={window.key} value={window.key}>
                  {window.label}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>
      </div>

      <Button
        type="link"
        style={{ paddingLeft: 0, fontWeight: 600 }}
        onClick={resetAllFilters}
      >
        Reset all filters
      </Button>

      <Divider style={{ margin: "16px 0" }} />

      {/* Price Range */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ display: "block", marginBottom: 10, color: "var(--ts-text-secondary)" }}>
          Price Range
        </Text>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Checkbox.Group
            value={selectedPriceRanges}
            onChange={(values) => updatePriceRange(values.map((value) => String(value)))}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PRICE_RANGES.map((range) => (
                <Checkbox key={range.key} value={range.key}>
                  {range.label}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* Amenities */}
      <div>
        <Text strong style={{ display: "block", marginBottom: 10, color: "var(--ts-text-secondary)" }}>
          Amenities
        </Text>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {AMENITIES.map((amenity) => (
            <Tag
              key={amenity}
              style={{
                cursor: "pointer",
                border: "1px solid var(--ts-border)",
                background: selectedAmenities.includes(amenity) ? "var(--ts-bg-elevated)" : "transparent",
                color: "var(--ts-text-secondary)",
                fontWeight: selectedAmenities.includes(amenity) ? 700 : 500,
              }}
              onClick={() => toggleAmenity(amenity)}
            >
              {amenity === "wifi" && "Wi-Fi"}
              {amenity === "usb" && "USB Ports"}
              {amenity === "ac" && "AC"}
              {amenity === "snacks" && "Snacks"}
            </Tag>
          ))}
        </div>
      </div>

    </Card>
  );
};

export default FiltersSidebar;