"use client";

import { Card, Checkbox, Tag, Typography, Divider } from "antd";

const { Text } = Typography;

// TODO: BACKEND - Make filters functional
// These filters should update URL query params and trigger trip search API

const FiltersSidebar = () => {
  // TODO: BACKEND - Add state management for filter selections
  // const [filters, setFilters] = useState({ busType: 'all', departure: [], priceRange: [], amenities: [] });
  
  // TODO: BACKEND - Fetch available filter options from API
  // Endpoint: GET /api/trips/filters
  // Should return: available bus types, price ranges based on current search
  
  // TODO: BACKEND - Implement filter change handler
  // const handleFilterChange = (filterType, value) => {
  //   Update URL params and trigger new search
  //   router.push(`/trips?${new URLSearchParams(filters).toString()}`);
  // };

  return (
    <Card
      title={<span style={{ color: "#0d1f3c", fontWeight: 600 }}>Refine Search</span>}
      style={{ borderRadius: "12px", position: "sticky", top: 80 }}
    >

      {/* Bus Type */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ display: "block", marginBottom: 10, color: "#0d1f3c" }}>
          Bus Type
        </Text>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Tag color="#0d1f3c" style={{ cursor: "pointer" }}>All</Tag>
          <Tag style={{ cursor: "pointer" }}>Premium</Tag>
          <Tag style={{ cursor: "pointer" }}>Standard</Tag>
        </div>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* Departure Time */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ display: "block", marginBottom: 10, color: "#0d1f3c" }}>
          Departure Time
        </Text>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Checkbox>Morning (06:00 - 12:00)</Checkbox>
          <Checkbox>Afternoon (12:00 - 18:00)</Checkbox>
          <Checkbox>Evening (18:00 - 00:00)</Checkbox>
        </div>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* Price Range */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ display: "block", marginBottom: 10, color: "#0d1f3c" }}>
          Price Range
        </Text>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Checkbox>Under KES 1,500</Checkbox>
          <Checkbox>KES 1,500 - 2,500</Checkbox>
          <Checkbox>Over KES 2,500</Checkbox>
        </div>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* Amenities */}
      <div>
        <Text strong style={{ display: "block", marginBottom: 10, color: "#0d1f3c" }}>
          Amenities
        </Text>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Tag style={{ cursor: "pointer" }}>Wi-Fi</Tag>
          <Tag style={{ cursor: "pointer" }}>USB Ports</Tag>
          <Tag style={{ cursor: "pointer" }}>AC</Tag>
          <Tag style={{ cursor: "pointer" }}>Snacks</Tag>
        </div>
      </div>

    </Card>
  );
};

export default FiltersSidebar;