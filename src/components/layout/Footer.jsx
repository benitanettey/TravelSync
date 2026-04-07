"use client";

const Footer = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px 20px",
        marginTop: "48px",
        borderTop: "1px solid var(--ts-footer-border, #eee)",
        color: "var(--ts-text-secondary, #666)",
        background: "var(--ts-bg, transparent)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--ts-text-primary)", lineHeight: 1 }}>
        TravelSync
      </div>
      <div style={{ marginTop: 8, fontSize: 13 }}>
        Crafted itineraries. Reliable departures. Smoother roads.
      </div>
      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>
        © 2026 TravelSync. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;