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
      <body>
        <AppProviders>
          <Navbar />
          <main style={{ padding: "20px" }}>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}