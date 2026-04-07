"use client";

import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;

const inputStyle = {
  background: "var(--ts-input-bg)",
  border: "1px solid var(--ts-input-border)",
  borderRadius: 10,
  height: 48,
};

const labelStyle = {
  fontWeight: 600,
  color: "var(--ts-text-primary)",
  fontSize: 13,
};

export default function PassengerForm({ onSubmit, disabled }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={labelStyle}>First Name</span>}
              name="firstName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="John" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={labelStyle}>Last Name</span>}
              name="lastName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Doe" style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={labelStyle}>Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Required" },
                { type: "email", message: "Invalid email" },
              ]}
            >
              <Input placeholder="john@example.com" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={labelStyle}>Phone Number</span>}
              name="phone"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="+254 7XX XXX XXX" style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={labelStyle}>ID Type</span>}
              name="idType"
              initialValue="national_id"
            >
              <Select
                style={{ ...inputStyle, height: "auto" }}
                classNames={{ popup: { root: "rounded-dropdown" } }}
              >
                <Option value="national_id">National ID</Option>
                <Option value="passport">Passport</Option>
                <Option value="driving_license">Driving License</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={labelStyle}>ID Number</span>}
              name="idNumber"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Enter identification number" style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <style jsx global>{`
        .ant-input::placeholder,
        .ant-select-selection-placeholder {
          color: var(--ts-text-secondary) !important;
        }
        .ant-select-selector {
          background: var(--ts-input-bg) !important;
          border: 1px solid var(--ts-input-border) !important;
          border-radius: 8px !important;
          height: 48px !important;
        }
        .ant-select-selection-item {
          line-height: 46px !important;
        }
        .rounded-dropdown {
          border-radius: 8px !important;
        }
      `}</style>
    </>
  );
}