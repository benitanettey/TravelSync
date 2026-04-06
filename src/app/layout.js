import "antd/dist/reset.css";
import "./globals.css";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AppProviders from "@/components/providers/AppProviders";

export const metadata = {
  title: "TravelSync",
  description: "Bus Seat Booking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "var(--ts-bg, #f8fafc)",
          color: "var(--ts-text-primary, #0d1f3c)",
          transition: "background 0.3s, color 0.3s",
          minHeight: "100vh",
        }}
      >
        <AppProviders>
          <Navbar />
          <main style={{ padding: "20px" }}>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}