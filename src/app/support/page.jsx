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
    icon: <PhoneOutlined style={{ fontSize: 28, color: "var(--ts-accent)" }} />,
    title: "Phone Support",
    detail: "+254 700 123 456",
    subtext: "Mon-Fri, 8AM - 8PM",
  },
  {
    icon: <MailOutlined style={{ fontSize: 28, color: "var(--ts-accent-green)" }} />,
    title: "Email Us",
    detail: "support@travelsync.co.ke",
    subtext: "Response within 24 hours",
  },
  {
    icon: <MessageOutlined style={{ fontSize: 28, color: "#d99a32" }} />,
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
      <section className="support-hero">
        <div className="support-hero-inner">
          <div className="support-hero-icon">
            <QuestionCircleOutlined style={{ fontSize: 30, color: "#d8fff4" }} />
          </div>
          <h1 className="support-hero-title ts-display">We&apos;re Here to Help</h1>
          <p className="support-hero-subcopy">
            Browse quick answers or send us a message for tailored assistance.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px" }}>
        {/* Contact Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          {contactCards.map((card, idx) => (
            <Col xs={24} md={8} key={idx}>
              <Card
                className="support-contact-card"
                hoverable
                style={{
                  borderRadius: 18,
                  border: "1px solid var(--ts-border)",
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
                    background: "var(--ts-bg-elevated)",
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
                    color: "var(--ts-text-secondary)",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 4,
                  }}
                >
                  {card.title}
                </Text>
                <Title level={5} style={{ margin: "0 0 4px", color: "var(--ts-text-primary)" }}>
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
              <Title level={3} style={{ color: "var(--ts-text-primary)", fontStyle: "italic", margin: 0 }}>
                Frequently Asked Questions
              </Title>
              <Paragraph type="secondary">
                Clear answers to the most common TravelSync questions.
              </Paragraph>
            </div>

            <Collapse
              className="support-faq"
              accordion
              expandIconPlacement="end"
              style={{
                background: "var(--ts-bg-card)",
                borderRadius: 12,
                border: "1px solid var(--ts-border)",
              }}
              items={faqs.map((faq) => ({
                key: faq.key,
                label: (
                  <Text strong style={{ color: "var(--ts-text-secondary)", fontSize: 15 }}>
                    {faq.label}
                  </Text>
                ),
                children: (
                  <Paragraph style={{ margin: 0, color: "var(--ts-text-secondary)", lineHeight: 1.7 }}>
                    {faq.children}
                  </Paragraph>
                ),
              }))}
            />
          </Col>

          {/* Contact Form */}
          <Col xs={24} lg={10}>
            <Card
              className="support-form-card"
              style={{
                borderRadius: 16,
                border: "1px solid var(--ts-border)",
              }}
              styles={{ body: { padding: 28 } }}
            >
              <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ color: "var(--ts-text-primary)", margin: 0 }}>
                  Send a Message
                </Title>
                <Text type="secondary">
                  Share the details and we&apos;ll get back with practical next steps.
                </Text>
              </div>

              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <CheckCircleFilled style={{ fontSize: 48, color: "var(--ts-accent-green)", marginBottom: 16 }} />
                  <Title level={5} style={{ color: "var(--ts-text-primary)" }}>Message Sent</Title>
                  <Text type="secondary">We&apos;ll get back to you within 24 hours.</Text>
                </div>
              ) : (
                <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
                  <Form.Item
                    name="name"
                    label={<Text style={{ fontWeight: 500, color: "var(--ts-text-primary)" }}>Full Name</Text>}
                    rules={[{ required: true, message: "Please enter your name" }]}
                  >
                    <Input placeholder="John Doe" style={inputStyle} />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label={<Text style={{ fontWeight: 500, color: "var(--ts-text-primary)" }}>Email Address</Text>}
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Enter a valid email" },
                    ]}
                  >
                    <Input placeholder="john@example.com" style={inputStyle} />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label={<Text style={{ fontWeight: 500, color: "var(--ts-text-primary)" }}>Subject</Text>}
                    rules={[{ required: true, message: "Please enter a subject" }]}
                  >
                    <Input placeholder="Booking inquiry, refund request, etc." style={inputStyle} />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label={<Text style={{ fontWeight: 500, color: "var(--ts-text-primary)" }}>Message</Text>}
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
                        background: "var(--ts-accent)",
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
              className="support-urgent-card"
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)",
                marginTop: 24,
                border: "none",
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Title level={5} style={{ color: "white", margin: "0 0 8px" }}>
                Need urgent help?
              </Title>
              <Paragraph style={{ color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
                For same-day booking issues or travel disruptions, call us directly.
              </Paragraph>
              <Button
                size="large"
                icon={<PhoneOutlined />}
                style={{
                  background: "var(--ts-accent-green)",
                  border: "none",
                  color: "var(--ts-text-primary)",
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

      <style jsx>{`
        .support-hero {
          position: relative;
          overflow: hidden;
          padding: 70px 20px 86px;
          text-align: center;
          border-radius: 0 0 30px 30px;
          background:
            radial-gradient(circle at 12% 22%, rgba(155, 255, 226, 0.22), transparent 30%),
            radial-gradient(circle at 86% 14%, rgba(109, 196, 255, 0.2), transparent 28%),
            linear-gradient(145deg, #13212d, #173746 56%, #1b4b5a);
        }

        .support-hero-inner {
          max-width: 760px;
          margin: 0 auto;
        }

        .support-hero-icon {
          width: 66px;
          height: 66px;
          border-radius: 50%;
          margin: 0 auto 18px;
          background: rgba(127, 227, 197, 0.18);
          border: 1px solid rgba(208, 255, 246, 0.34);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .support-hero-title {
          margin: 0;
          color: #f3fcff;
          font-size: clamp(2rem, 4.6vw, 3.2rem);
          line-height: 1.05;
          letter-spacing: 0.01em;
          text-shadow: 0 4px 22px rgba(0, 0, 0, 0.28);
        }

        .support-hero-subcopy {
          margin: 12px auto 0;
          color: #e4fbff;
          font-size: 1.05rem;
          max-width: 640px;
          line-height: 1.68;
        }

        :global(.support-contact-card.ant-card) {
          background: var(--ts-bg-card) !important;
          box-shadow: 0 16px 34px rgba(18, 28, 36, 0.12);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }

        :global(.support-contact-card.ant-card:hover) {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(18, 28, 36, 0.18);
        }

        :global(.support-faq.ant-collapse) {
          border-radius: 14px;
          border: 1px solid var(--ts-border) !important;
          box-shadow: 0 12px 28px rgba(18, 28, 36, 0.08);
        }

        :global(.support-form-card.ant-card) {
          box-shadow: 0 14px 32px rgba(18, 28, 36, 0.1);
          border-radius: 18px !important;
        }

        :global(.support-urgent-card.ant-card) {
          box-shadow: 0 18px 38px rgba(8, 18, 26, 0.32);
          border-radius: 18px !important;
        }
      `}</style>
    </div>
  );
}
