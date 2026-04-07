"use client";

import { Button, Tooltip } from "antd";
import { BulbOutlined, BulbFilled, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, THEMES } from "@/context/ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, isDark, isHighContrast, mounted } = useTheme();

  const navItems = [
    { href: "/", label: "Discover" },
    { href: "/trips", label: "Routes" },
    { href: "/my-bookings", label: "Manage" },
    { href: "/support", label: "Help Desk" },
  ];

  const toggleTheme = () => {
    if (theme === THEMES.DARK) {
      setTheme(THEMES.LIGHT);
      return;
    }
    setTheme(THEMES.DARK);
  };

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
    <div className="nav-wrap">
      <div className="nav-frame">
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="brand-wrap">
            <span className="brand-dot" />
            <h2 className="brand-title">TravelSync</h2>
          </div>
        </Link>

        <div className="nav-actions">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                type="text"
                className={`nav-link-pill ${pathname === item.href ? "active" : ""}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}

          {mounted && (
            <Tooltip title={`Switch to ${theme === THEMES.DARK ? "Light" : "Dark"} mode`}>
              <Button
                type="text"
                icon={themeIcon}
                className="theme-chip"
                onClick={toggleTheme}
              >
                {themeLabel}
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      <style jsx>{`
        .nav-wrap {
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 10px 16px;
          background: linear-gradient(to bottom, var(--ts-bg), var(--ts-bg));
          backdrop-filter: blur(9px);
          -webkit-backdrop-filter: blur(9px);
          border-bottom: 1px solid var(--ts-nav-border);
        }

        .nav-frame {
          max-width: 1220px;
          margin: 0 auto;
          border-radius: 18px;
          border: 1px solid rgba(90, 112, 130, 0.24);
          background: var(--ts-bg-elevated);
          box-shadow: 0 14px 28px rgba(21, 31, 40, 0.08);
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .brand-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px;
        }

        .brand-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(140deg, #17b6a8, #0f766e);
          box-shadow: 0 0 0 6px rgba(15, 118, 110, 0.14);
        }

        .brand-title {
          margin: 0;
          font-family: var(--font-display);
          color: var(--ts-text-primary);
          letter-spacing: 0.06em;
          font-size: clamp(1.3rem, 2vw, 1.9rem);
          line-height: 1;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        :global(.nav-link-pill.ant-btn) {
          border-radius: 999px;
          height: 38px;
          padding: 0 16px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--ts-text-primary) !important;
          border: 1px solid transparent;
          transition: all 0.22s ease;
        }

        :global(.nav-link-pill.ant-btn:hover) {
          border-color: rgba(15, 118, 110, 0.25);
          color: #0f766e !important;
          background: rgba(16, 175, 154, 0.08) !important;
        }

        :global(.nav-link-pill.ant-btn.active) {
          background: linear-gradient(130deg, #0f766e, #0b5f58) !important;
          color: #ebfffb !important;
          border-color: #0f766e !important;
          box-shadow: 0 6px 16px rgba(15, 118, 110, 0.24);
        }

        :global(.theme-chip.ant-btn) {
          margin-left: 2px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid rgba(85, 104, 118, 0.32);
          color: var(--ts-text-primary) !important;
          font-weight: 700;
          background: var(--ts-bg-card);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
        }

        @media (max-width: 768px) {
          .nav-frame {
            border-radius: 14px;
            padding: 10px;
          }

          .nav-actions {
            gap: 6px;
          }

          :global(.nav-link-pill.ant-btn) {
            height: 34px;
            padding: 0 12px;
            font-size: 12px;
          }

          :global(.theme-chip.ant-btn) {
            height: 34px;
            padding: 0 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}