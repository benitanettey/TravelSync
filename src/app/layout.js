import "antd/dist/reset.css";
import "./globals.css";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "TravelSync",
  description: "Bus Seat Booking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ padding: "20px" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}