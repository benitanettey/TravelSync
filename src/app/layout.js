import "antd/dist/reset.css";
import "./globals.css";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AppProviders from "@/components/providers/AppProviders";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "TravelSync",
  description: "Bus Seat Booking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
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
          <main style={{ padding: "24px 18px 36px" }} className="ts-page-shell">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}