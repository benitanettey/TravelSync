import "antd/dist/reset.css";
import "./globals.css";
export const metadata = {
  title: "TravelSync",
  description: "Bus Seat Booking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}