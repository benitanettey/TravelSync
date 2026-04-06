"use client";

import { useState } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Collapse,
  Form,
  Input,
  Button,
  message,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  SendOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const faqs = [
  {
    key: "1",
    label: "How do I book a bus ticket?",
    children:
      "Simply search for your route on the Trips page, select your preferred bus and departure time, choose your seats, fill in your passenger details, and complete the booking. You'll receive a confirmation with a QR code for boarding.",
  },
  {
    key: "2",
    label: "Can I cancel or modify my booking?",
    children:
      "Yes, you can cancel or modify your booking up to 2 hours before departure. Go to My Bookings, select the trip, and choose Cancel or Modify. Refunds are processed within 3-5 business days.",
  },
  {
    key: "3",
    label: "What is the difference between Premium and Standard buses?",
    children:
      "Premium buses offer executive seating (2×1 configuration), extra legroom, complimentary WiFi, refreshments, USB charging ports, and personal entertainment screens. Standard buses have comfortable 2×2 seating with air conditioning.",
  },
  {
    key: "4",
    label: "How much luggage can I bring?",
    children:
      "Each passenger is allowed two pieces of luggage (20kg each) in the cargo hold, plus one carry-on bag. Premium class passengers receive an additional 10kg allowance.",
  },
  {
    key: "5",
    label: "What payment methods do you accept?",
    children:
      "We accept M-Pesa, Airtel Money, credit/debit cards (Visa, Mastercard), and PayPal. All transactions are secured with SSL encryption.",
  },
  {
    key: "6",
    label: "How early should I arrive at the station?",
    children:
      "We recommend arriving at least 20 minutes before your scheduled departure time. This allows time for check-in and boarding procedures.",
  },
  {
    key: "7",
    label: "What if I miss my bus?",
    children:
      "If you miss your bus, please contact our support team immediately. Depending on availability, we may be able to reschedule you to the next available departure for a small rebooking fee.",
  },
  {
    key: "8",
    label: "Are children allowed to travel alone?",
    children:
      "Children under 12 must be accompanied by an adult. Unaccompanied minors aged 12-17 require a signed consent form from a parent or guardian.",
  },
];

const contactCards = [
  {
    icon: <PhoneOutlined style={{ fontSize: 28, color: "#1677ff" }} />,
    title: "Phone Support",
    detail: "+254 700 123 456",
    subtext: "Mon-Fri, 8AM - 8PM",
  },
  {
    icon: <MailOutlined style={{ fontSize: 28, color: "#7FE3C5" }} />,
    title: "Email Us",
    detail: "support@travelsync.co.ke",
    subtext: "Response within 24 hours",
  },
  {
    icon: <MessageOutlined style={{ fontSize: 28, color: "#f59e0b" }} />,
    title: "Live Chat",
    detail: "Chat with us",
    subtext: "Available 24/7",
  },
];

const inputStyle = {
  background: "var(--ts-input-bg)",
  border: "1px solid var(--ts-input-border)",
  borderRadius: 8,
  height: 48,
};

export default function SupportPage() {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    
    // TODO: BACKEND - Submit contact form to API
    // Endpoint: POST /api/support/contact
    // Body: { name, email, subject, message }
    // Should: create support ticket, send confirmation email to user
    
    // TODO: BACKEND - Integrate with ticketing system (e.g., Zendesk, Freshdesk)
    // or internal support dashboard for agents to respond
    
    // Simulate API call (remove when backend is ready)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
    message.success("Your message has been sent! We'll get back to you soon.");
    form.resetFields();
    setTimeout(() => setSubmitted(false), 3000);
  };

  // TODO: BACKEND - Fetch FAQs from CMS or database
  // Endpoint: GET /api/support/faqs
  // Should return: array of FAQ objects { id, question, answer, category }
  // Allow admin to manage FAQs via admin panel

  // TODO: BACKEND - Implement live chat functionality
  // Integrate with chat service (e.g., Intercom, Tawk.to, custom WebSocket)

  return (
    <div style={{ background: "var(--ts-bg)", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "var(--ts-bg-hero)",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(127, 227, 197, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <QuestionCircleOutlined style={{ fontSize: 32, color: "var(--ts-accent-green)" }} />
          </div>
          <Title level={1} style={{ color: "var(--ts-text-on-hero)", margin: 0, fontStyle: "italic" }}>
            How can we help?
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginTop: 12 }}>
            Find answers to common questions or reach out to our support team.
          </Paragraph>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px" }}>
        {/* Contact Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          {contactCards.map((card, idx) => (
            <Col xs={24} md={8} key={idx}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                  height: "100%",
                }}
                styles={{ body: { padding: 28 } }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  {card.icon}
                </div>
                <Text
                  style={{
                    display: "block",
                    color: "#64748b",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 4,
                  }}
                >
                  {card.title}
                </Text>
                <Title level={5} style={{ margin: "0 0 4px", color: "#0d1f3c" }}>
                  {card.detail}
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  {card.subtext}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[48, 48]}>
          {/* FAQs Section */}
          <Col xs={24} lg={14}>
            <div style={{ marginBottom: 24 }}>
              <Title level={3} style={{ color: "#0d1f3c", fontStyle: "italic", margin: 0 }}>
                Frequently Asked Questions
              </Title>
              <Paragraph type="secondary">
                Quick answers to common queries about TravelSync.
              </Paragraph>
            </div>

            <Collapse
              accordion
              expandIconPlacement="end"
              style={{
                background: "white",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
              }}
              items={faqs.map((faq) => ({
                key: faq.key,
                label: (
                  <Text strong style={{ color: "#0d1f3c", fontSize: 15 }}>
                    {faq.label}
                  </Text>
                ),
                children: (
                  <Paragraph style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>
                    {faq.children}
                  </Paragraph>
                ),
              }))}
            />
          </Col>

          {/* Contact Form */}
          <Col xs={24} lg={10}>
            <Card
              style={{
                borderRadius: 16,
                border: "1px solid #e2e8f0",
              }}
              styles={{ body: { padding: 28 } }}
            >
              <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ color: "#0d1f3c", margin: 0 }}>
                  Send us a message
                </Title>
                <Text type="secondary">
                  Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
                </Text>
              </div>

              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <CheckCircleFilled style={{ fontSize: 48, color: "#7FE3C5", marginBottom: 16 }} />
                  <Title level={5} style={{ color: "#0d1f3c" }}>Message Sent!</Title>
                  <Text type="secondary">We&apos;ll get back to you within 24 hours.</Text>
                </div>
              ) : (
                <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
                  <Form.Item
                    name="name"
                    label={<Text style={{ fontWeight: 500, color: "#334155" }}>Full Name</Text>}
                    rules={[{ required: true, message: "Please enter your name" }]}
                  >
                    <Input placeholder="John Doe" style={inputStyle} />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label={<Text style={{ fontWeight: 500, color: "#334155" }}>Email Address</Text>}
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Enter a valid email" },
                    ]}
                  >
                    <Input placeholder="john@example.com" style={inputStyle} />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label={<Text style={{ fontWeight: 500, color: "#334155" }}>Subject</Text>}
                    rules={[{ required: true, message: "Please enter a subject" }]}
                  >
                    <Input placeholder="Booking inquiry, refund request, etc." style={inputStyle} />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label={<Text style={{ fontWeight: 500, color: "#334155" }}>Message</Text>}
                    rules={[{ required: true, message: "Please enter your message" }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Describe your issue or question..."
                      style={{ ...inputStyle, height: "auto" }}
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={loading}
                      icon={<SendOutlined />}
                      style={{
                        height: 52,
                        borderRadius: 8,
                        fontWeight: 600,
                        background: "#1677ff",
                      }}
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>

            {/* Additional Help Card */}
            <Card
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)",
                marginTop: 24,
                border: "none",
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Title level={5} style={{ color: "white", margin: "0 0 8px" }}>
                Need urgent assistance?
              </Title>
              <Paragraph style={{ color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
                For time-sensitive issues like same-day bookings or emergencies, call us directly.
              </Paragraph>
              <Button
                size="large"
                icon={<PhoneOutlined />}
                style={{
                  background: "#7FE3C5",
                  border: "none",
                  color: "#0d1f3c",
                  fontWeight: 600,
                  borderRadius: 8,
                  height: 44,
                }}
              >
                Call Now: +254 700 123 456
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
