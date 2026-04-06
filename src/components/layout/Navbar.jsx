"use client";

import { Button, Tooltip, Dropdown } from "antd";
import { BulbOutlined, BulbFilled, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, THEMES } from "@/context/ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, isDark, isHighContrast, mounted } = useTheme();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/trips", label: "Trips" },
    { href: "/my-bookings", label: "My Bookings" },
    { href: "/support", label: "Support" },
  ];

  const themeMenuItems = [
    {
      key: THEMES.LIGHT,
      label: "☀️  Light Mode",
      onClick: () => setTheme(THEMES.LIGHT),
    },
    {
      key: THEMES.DARK,
      label: "🌙  Dark Mode",
      onClick: () => setTheme(THEMES.DARK),
    },
    { type: "divider" },
    {
      key: THEMES.HIGH_CONTRAST,
      label: "👁  High Contrast (Accessibility)",
      onClick: () => setTheme(THEMES.HIGH_CONTRAST),
    },
  ];

  const themeIcon = isHighContrast
    ? <EyeOutlined style={{ fontSize: 18 }} />
    : isDark
      ? <BulbFilled style={{ fontSize: 18 }} />
      : <BulbOutlined style={{ fontSize: 18 }} />;

  const themeLabel = isHighContrast
    ? "High Contrast"
    : isDark
      ? "Dark"
      : "Light";

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "var(--ts-nav-bg)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--ts-nav-border)",
        transition: "background 0.3s, border 0.3s",
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
              color: "var(--ts-accent)",
              letterSpacing: "0.5px",
            }}
          >
            TravelSync
          </h2>
        </Link>

        {/* NAVIGATION + THEME */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                type={pathname === item.href ? "primary" : "text"}
                style={{
                  fontWeight: 500,
                  ...(pathname !== item.href
                    ? { color: "var(--ts-text-primary)" }
                    : {}),
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}

          {/* Theme Toggle */}
          {mounted && (
            <Dropdown
              menu={{ items: themeMenuItems, selectedKeys: [theme] }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Tooltip title={`Theme: ${themeLabel}`}>
                <Button
                  type="text"
                  icon={themeIcon}
                  style={{
                    marginLeft: 4,
                    color: "var(--ts-text-primary)",
                    border: "1px solid var(--ts-border)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {themeLabel}
                </Button>
              </Tooltip>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}