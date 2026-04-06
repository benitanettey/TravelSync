"use client";

const Footer = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        marginTop: "40px",
        borderTop: "1px solid var(--ts-footer-border, #eee)",
        color: "var(--ts-text-secondary, #666)",
        background: "var(--ts-bg, transparent)",
        transition: "all 0.3s ease",
      }}
    >
      TravelSync © 2026 | All Rights Reserved
    </div>
  );
};

export default Footer;