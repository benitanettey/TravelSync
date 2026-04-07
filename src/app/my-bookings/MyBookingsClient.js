"use client";

import { useState, useMemo } from "react";
import {
  Typography,
  Input,
  Button,
  Card,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  message,
  Empty,
  Space,
} from "antd";
import {
  SearchOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTravelData } from "@/hooks/useTravelData";
import {
  cancelBookingRequest,
  modifyBookingRequest,
} from "@/services/seatDataService";

const { Title, Text, Paragraph } = Typography;

export default function MyBookingsPage() {
  const {
    findBookings,
    getBusById,
    getBookedSeats,
    cancelBookingLocal,
    modifyBookingLocal,
    syncSeatStatuses,
  } = useTravelData();

  const [messageApi, ctx] = message.useMessage();
  const [searchRef, setSearchRef] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [cancelModalId, setCancelModalId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Modify state
  const [modifyBooking, setModifyBooking] = useState(null);
  const [modifyLoading, setModifyLoading] = useState(false);
  const [modifyForm] = Form.useForm();
  const [modifySeats, setModifySeats] = useState([]);

  const handleSearch = () => {
    if (!searchRef && !searchPhone) {
      messageApi.warning("Please enter a booking reference or phone number.");
      return;
    }
    // Prepend +254 to phone if user entered a number
    const phoneToSearch = searchPhone ? `+254${searchPhone.replace(/\s/g, "")}` : "";
    const found = findBookings({ reference: searchRef, phone: phoneToSearch });
    setResults(found);
    setHasSearched(true);
  };

  // Cancel
  const handleCancel = async () => {
    if (!cancelModalId) return;
    setCancelLoading(true);

    const result = await cancelBookingRequest(cancelModalId);

    if (!result.ok) {
      messageApi.error(result.message || "Could not cancel booking.");
      setCancelLoading(false);
      return;
    }

    cancelBookingLocal(cancelModalId);

    if (result.seats?.length > 0) {
      const booking = results.find((b) => b.id === cancelModalId);
      if (booking) syncSeatStatuses(booking.busId, result.seats);
    }

    messageApi.success("Booking cancelled successfully.");
    setCancelLoading(false);
    setCancelModalId(null);

    // Re-run search
    const phoneToSearch = searchPhone ? `+254${searchPhone.replace(/\s/g, "")}` : "";
    const found = findBookings({ reference: searchRef, phone: phoneToSearch });
    setResults(found);
  };

  // Modify — open modal
  const openModifyModal = (booking) => {
    setModifyBooking(booking);
    setModifySeats([...booking.seatNumbers]);
    modifyForm.setFieldsValue({
      firstName: booking.passenger?.firstName || "",
      lastName: booking.passenger?.lastName || "",
      email: booking.passenger?.email || "",
      phone: booking.passenger?.phone || "",
    });
  };

  // Available seats for modify
  const modifyBusSeats = useMemo(() => {
    if (!modifyBooking) return [];
    const booked = getBookedSeats(modifyBooking.busId);
    const bus = getBusById(modifyBooking.busId);
    const isPremium = bus?.type === "Premium";
    const layout = isPremium
      ? ["A1","A2","A3","B1","B2","B3","C1","C2","C3","D1","D2","D3","E1","E2","E3"]
      : ["A1","A2","A3","A4","B1","B2","B3","B4","C1","C2","C3","C4","D1","D2","D3","D4","E1","E2","E3","E4","F1","F2","F3","F4"];

    return layout.map((sn) => ({
      seatNumber: sn,
      isBooked: booked.includes(sn) && !modifyBooking.seatNumbers.includes(sn),
      isOwned: modifyBooking.seatNumbers.includes(sn),
    }));
  }, [modifyBooking, getBookedSeats, getBusById]);

  const handleModify = async () => {
    if (modifySeats.length === 0) {
      messageApi.warning("Please select at least one seat.");
      return;
    }

    setModifyLoading(true);

    const passengerValues = modifyForm.getFieldsValue();
    const result = await modifyBookingRequest(modifyBooking.id, {
      seatNumbers: modifySeats,
      passenger: passengerValues,
    });

    if (!result.ok) {
      messageApi.error(result.message || "Could not modify booking.");
      setModifyLoading(false);
      return;
    }

    modifyBookingLocal(modifyBooking.id, result.booking);

    if (result.seats?.length > 0) {
      syncSeatStatuses(modifyBooking.busId, result.seats);
    }

    messageApi.success("Booking modified successfully.");
    setModifyLoading(false);
    setModifyBooking(null);

    const phoneToSearch = searchPhone ? `+254${searchPhone.replace(/\s/g, "")}` : "";
    const found = findBookings({ reference: searchRef, phone: phoneToSearch });
    setResults(found);
  };

  const toggleModifySeat = (sn) => {
    setModifySeats((prev) =>
      prev.includes(sn) ? prev.filter((s) => s !== sn) : [...prev, sn]
    );
  };

  const inputStyle = {
    background: "var(--ts-input-bg)",
    border: "1px solid var(--ts-input-border)",
    borderRadius: 8,
    height: 48,
  };

  return (
    <div style={{ background: "var(--ts-bg)", minHeight: "100vh" }}>
      {ctx}

      {/* Hero */}
      <div className="manage-hero">
        <div className="manage-hero-overlay" />
        <div className="manage-hero-inner">
          <div className="manage-hero-icon">
            <SearchOutlined style={{ fontSize: 30, color: "#d8fff4" }} />
          </div>
          <h1 className="manage-hero-title ts-display">Manage My Bookings</h1>
          <p className="manage-hero-subcopy">
            Search, modify, or cancel any reservation from one place.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "44px 20px" }}>
        {/* Search Card */}
        <Card
          className="manage-search-card"
          style={{ borderRadius: 18, border: "1px solid var(--ts-border)", background: "var(--ts-bg-card)", marginBottom: 32 }}
          styles={{ body: { padding: 30 } }}
        >
          <Row gutter={16} align="bottom">
            <Col xs={24} sm={9}>
              <Text style={{ fontWeight: 500, color: "var(--ts-text-primary)", fontSize: 13, display: "block", marginBottom: 6 }}>
                Booking Reference
              </Text>
              <Input
                placeholder="e.g. TS-MNN1RHFD-384"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                onPressEnter={handleSearch}
                style={inputStyle}
              />
            </Col>
            <Col xs={24} sm={2} style={{ textAlign: "center", padding: "12px 0" }}>
              <Text style={{ fontSize: 13, color: "var(--ts-text-secondary)" }}>or</Text>
            </Col>
            <Col xs={24} sm={8}>
              <Text style={{ fontWeight: 500, color: "var(--ts-text-primary)", fontSize: 13, display: "block", marginBottom: 6 }}>
                Phone Number
              </Text>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  style={{ ...inputStyle, width: 70, textAlign: "center", flexShrink: 0 }}
                  value="+254"
                  disabled
                />
                <Input
                  placeholder="712 345 678"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  onPressEnter={handleSearch}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </Space.Compact>
            </Col>
            <Col xs={24} sm={5}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                size="large"
                block
                onClick={handleSearch}
                className="manage-search-button"
                style={{
                  height: 48,
                  borderRadius: 10,
                  fontWeight: 700,
                  background: "var(--ts-accent)",
                }}
              >
                Find Bookings
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Results */}
        {hasSearched && results.length === 0 && (
          <Empty
            description={
              <Text type="secondary">No bookings found. Check your reference or phone number and try again.</Text>
            }
            style={{ marginTop: 60 }}
          />
        )}

        {results.length > 0 && (
          <>
            <Title level={4} style={{ color: "var(--ts-text-primary)", marginBottom: 16, fontStyle: "italic" }}>
              {results.length} Matching Booking{results.length > 1 ? "s" : ""}
            </Title>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {results.map((booking) => {
                const isCancelled = booking.status === "cancelled";
                const isCompleted = booking.status === "completed";
                const isActive = !isCancelled && !isCompleted;

                const cardBorder = isCancelled
                  ? "1px solid #fca5a5"
                  : isCompleted
                    ? "1px solid #93c5fd"
                    : "1px solid var(--ts-border)";

                const statusColor = isCancelled ? "red" : isCompleted ? "blue" : "green";
                const statusLabel = isCancelled ? "CANCELLED" : isCompleted ? "COMPLETED" : "CONFIRMED";

                return (
                  <Card
                    key={booking.id}
                    style={{
                      borderRadius: 16,
                      border: cardBorder,
                      opacity: isCancelled || isCompleted ? 0.75 : 1,
                    }}
                    styles={{ body: { padding: 24 } }}
                  >
                    <Row justify="space-between" align="top" gutter={16}>
                      <Col flex="auto">
                        {/* Status + ref */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                          <Tag
                            color={statusColor}
                            style={{ borderRadius: 4, fontWeight: 600, fontSize: 11 }}
                          >
                            {statusLabel}
                          </Tag>
                          <Text strong style={{ color: "var(--ts-text-primary)", fontSize: 15 }}>
                            #{booking.reference}
                          </Text>
                        </div>

                        {/* Route */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <EnvironmentOutlined style={{ color: "var(--ts-text-secondary)" }} />
                          <Text style={{ fontSize: 16, fontWeight: 600, color: "var(--ts-text-primary)" }}>
                            {booking.route?.from || "—"} → {booking.route?.to || "—"}
                          </Text>
                        </div>

                        {/* Details */}
                        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 8 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <CalendarOutlined style={{ color: "var(--ts-text-secondary)" }} />
                            <Text type="secondary">{booking.route?.departure || "—"}</Text>
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <UserOutlined style={{ color: "var(--ts-text-secondary)" }} />
                            <Text type="secondary">
                              {booking.passenger?.firstName} {booking.passenger?.lastName}
                            </Text>
                          </span>
                        </div>

                        {/* Seats */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {booking.seatNumbers.map((sn) => (
                            <Tag
                              key={sn}
                              style={{
                                borderRadius: 4,
                                fontWeight: 600,
                                border: "1px solid var(--ts-border)",
                                background: "var(--ts-bg-elevated)",
                                color: "var(--ts-text-secondary)",
                              }}
                            >
                              {sn}
                            </Tag>
                          ))}
                          <Tag
                            style={{
                              background: booking.busType === "premium" ? "var(--ts-accent-green)" : "#fef3c7",
                              color: booking.busType === "premium" ? "var(--ts-text-primary)" : "#92400e",
                              border: "none",
                              borderRadius: 4,
                              fontWeight: 600,
                              fontSize: 11,
                            }}
                          >
                            {booking.busType === "premium" ? "EXECUTIVE" : "STANDARD"}
                          </Tag>
                        </div>
                      </Col>

                      {/* Right side — price + actions */}
                      <Col>
                        <div style={{ textAlign: "right" }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>Total Paid</Text>
                          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--ts-text-primary)", marginBottom: 12 }}>
                            KES {(booking.total || 0).toLocaleString()}
                          </div>

                          {isActive && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <Button
                                icon={<EditOutlined />}
                                onClick={() => openModifyModal(booking)}
                                style={{ borderRadius: 8, fontWeight: 500 }}
                              >
                                Edit
                              </Button>
                              <Button
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => setCancelModalId(booking.id)}
                                style={{ borderRadius: 8, fontWeight: 500 }}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                          {isCompleted && (
                            <Text type="secondary" style={{ fontSize: 12 }}>Journey completed</Text>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        title="Cancel Booking"
        open={!!cancelModalId}
        onCancel={() => setCancelModalId(null)}
        onOk={handleCancel}
        confirmLoading={cancelLoading}
        okText="Yes, Cancel Booking"
        okButtonProps={{ danger: true }}
      >
        <Paragraph>
          Are you sure you want to cancel this booking? The reserved seats will be released back to availability.
        </Paragraph>
        <Paragraph type="secondary">
          This action cannot be undone.
        </Paragraph>
      </Modal>

      {/* Modify Modal */}
      <Modal
        title="Modify Booking"
        open={!!modifyBooking}
        onCancel={() => setModifyBooking(null)}
        onOk={handleModify}
        confirmLoading={modifyLoading}
        okText="Save Changes"
        width={640}
      >
        {modifyBooking && (
          <>
            <Paragraph type="secondary" style={{ marginBottom: 20 }}>
              Change seats or update passenger details for booking{" "}
              <strong>#{modifyBooking.reference}</strong>.
            </Paragraph>

            {/* Seat picker */}
            <Text strong style={{ display: "block", marginBottom: 8, color: "var(--ts-text-primary)" }}>
              Select Seats
            </Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 24,
                padding: 16,
                background: "var(--ts-bg-elevated)",
                borderRadius: 12,
                border: "1px solid var(--ts-border)",
              }}
            >
              {modifyBusSeats.map(({ seatNumber, isBooked }) => {
                const isSelected = modifySeats.includes(seatNumber);
                return (
                  <Button
                    key={seatNumber}
                    size="small"
                    disabled={isBooked}
                    type={isSelected ? "primary" : "default"}
                    onClick={() => toggleModifySeat(seatNumber)}
                    style={{
                      width: 52,
                      height: 40,
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 12,
                      ...(isSelected
                        ? { background: "var(--ts-accent)", borderColor: "var(--ts-accent)" }
                        : isBooked
                          ? { background: "var(--ts-border)", color: "var(--ts-text-secondary)" }
                          : {}),
                    }}
                  >
                    {seatNumber}
                  </Button>
                );
              })}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Currently selected: {modifySeats.length > 0 ? modifySeats.join(", ") : "None"}
              </Text>
            </div>

            {/* Passenger form */}
            <Text strong style={{ display: "block", marginBottom: 8, color: "var(--ts-text-primary)" }}>
              Passenger Details
            </Text>
            <Form form={modifyForm} layout="vertical" requiredMark={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="First Name" name="firstName">
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name" name="lastName">
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Email" name="email">
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone" name="phone">
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </>
        )}
      </Modal>

      <style jsx>{`
        .manage-hero {
          position: relative;
          overflow: hidden;
          border-radius: 0 0 28px 28px;
          padding: 68px 20px 92px;
          text-align: center;
          background:
            radial-gradient(circle at 12% 20%, rgba(148, 255, 233, 0.2), transparent 32%),
            radial-gradient(circle at 85% 10%, rgba(106, 202, 255, 0.16), transparent 28%),
            linear-gradient(145deg, #13222d, #1d3a48 62%, #184d5a);
        }

        .manage-hero-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(120deg, rgba(255, 255, 255, 0.04), transparent 38%);
        }

        .manage-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 760px;
          margin: 0 auto;
        }

        .manage-hero-icon {
          width: 66px;
          height: 66px;
          border-radius: 50%;
          background: rgba(127, 227, 197, 0.18);
          border: 1px solid rgba(208, 255, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }

        .manage-hero-title {
          margin: 0;
          color: #f2fdff;
          font-size: clamp(2rem, 4.6vw, 3.2rem);
          line-height: 1.05;
          letter-spacing: 0.01em;
          text-shadow: 0 4px 22px rgba(0, 0, 0, 0.28);
        }

        .manage-hero-subcopy {
          margin: 12px auto 0;
          color: #e4fbff;
          font-size: 1.04rem;
          max-width: 620px;
          line-height: 1.68;
        }

        :global(.manage-search-card.ant-card) {
          margin-top: -54px;
          box-shadow: 0 20px 36px rgba(16, 24, 32, 0.14);
        }

        :global(.manage-search-button.ant-btn) {
          white-space: nowrap;
          letter-spacing: 0.01em;
          padding: 0 16px;
        }

        @media (max-width: 768px) {
          .manage-hero {
            padding: 56px 16px 74px;
          }

          :global(.manage-search-card.ant-card) {
            margin-top: -32px;
          }
        }
      `}</style>
    </div>
  );
}
