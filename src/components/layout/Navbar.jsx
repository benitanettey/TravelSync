"use client";

import { Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // TODO: BACKEND - Implement user authentication state
  // Use auth context/hook to check if user is logged in
  // const { user, isAuthenticated, logout } = useAuth();

  // TODO: BACKEND - Update nav items based on auth state
  // If authenticated: show "My Bookings" and user profile dropdown
  // If not authenticated: show "Login" and "Sign Up" buttons
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/trips", label: "Trips" },
    { href: "/booking", label: "My Bookings" }, // TODO: BACKEND - Protect this route, require authentication
    { href: "/support", label: "Support" },
  ];

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "12px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LOGO */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <h2
            style={{
              margin: 0,
              fontWeight: "700",
              color: "#1677ff",
              letterSpacing: "0.5px",
            }}
          >
            TravelSync
          </h2>
        </Link>

        {/* NAVIGATION BUTTONS */}
        <div style={{ display: "flex", gap: "8px" }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                type={pathname === item.href ? "primary" : "text"}
                style={{ fontWeight: 500 }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}