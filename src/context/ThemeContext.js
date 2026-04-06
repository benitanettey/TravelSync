"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "travelsync-theme";

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  HIGH_CONTRAST: "high-contrast",
};

// CSS custom property tokens per theme
const themeTokens = {
  [THEMES.LIGHT]: {
    "--ts-bg": "#f8fafc",
    "--ts-bg-elevated": "#ffffff",
    "--ts-bg-card": "#ffffff",
    "--ts-bg-hero": "linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)",
    "--ts-text-primary": "#0d1f3c",
    "--ts-text-secondary": "#64748b",
    "--ts-text-on-hero": "#ffffff",
    "--ts-border": "#e2e8f0",
    "--ts-accent": "#1677ff",
    "--ts-accent-green": "#7FE3C5",
    "--ts-nav-bg": "rgba(255,255,255,0.75)",
    "--ts-nav-border": "rgba(0,0,0,0.05)",
    "--ts-footer-border": "#eeeeee",
    "--ts-seat-available": "#d1fae5",
    "--ts-seat-booked": "#e2e8f0",
    "--ts-seat-selected": "#1677ff",
    "--ts-input-bg": "#f5f7fa",
    "--ts-input-border": "#e8ecf1",
    "--ts-shadow": "0 2px 8px rgba(0,0,0,0.06)",
    "--ts-shadow-hover": "0 12px 30px rgba(0,0,0,0.15)",
  },
  [THEMES.DARK]: {
    "--ts-bg": "#0f172a",
    "--ts-bg-elevated": "#1e293b",
    "--ts-bg-card": "#1e293b",
    "--ts-bg-hero": "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
    "--ts-text-primary": "#f1f5f9",
    "--ts-text-secondary": "#94a3b8",
    "--ts-text-on-hero": "#f1f5f9",
    "--ts-border": "#334155",
    "--ts-accent": "#3b82f6",
    "--ts-accent-green": "#34d399",
    "--ts-nav-bg": "rgba(15,23,42,0.85)",
    "--ts-nav-border": "rgba(255,255,255,0.06)",
    "--ts-footer-border": "#334155",
    "--ts-seat-available": "#064e3b",
    "--ts-seat-booked": "#334155",
    "--ts-seat-selected": "#3b82f6",
    "--ts-input-bg": "#1e293b",
    "--ts-input-border": "#334155",
    "--ts-shadow": "0 2px 8px rgba(0,0,0,0.3)",
    "--ts-shadow-hover": "0 12px 30px rgba(0,0,0,0.5)",
  },
  [THEMES.HIGH_CONTRAST]: {
    "--ts-bg": "#000000",
    "--ts-bg-elevated": "#1a1a1a",
    "--ts-bg-card": "#1a1a1a",
    "--ts-bg-hero": "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
    "--ts-text-primary": "#ffffff",
    "--ts-text-secondary": "#e0e0e0",
    "--ts-text-on-hero": "#ffffff",
    "--ts-border": "#ffffff",
    "--ts-accent": "#ffff00",
    "--ts-accent-green": "#00ff00",
    "--ts-nav-bg": "rgba(0,0,0,0.95)",
    "--ts-nav-border": "#ffffff",
    "--ts-footer-border": "#ffffff",
    "--ts-seat-available": "#003300",
    "--ts-seat-booked": "#333333",
    "--ts-seat-selected": "#ffff00",
    "--ts-input-bg": "#1a1a1a",
    "--ts-input-border": "#ffffff",
    "--ts-shadow": "0 0 0 2px #ffffff",
    "--ts-shadow-hover": "0 0 0 3px #ffff00",
  },
};

// Ant Design theme config per theme
export const antdThemeConfig = {
  [THEMES.LIGHT]: {
    token: {
      colorPrimary: "#1677ff",
      borderRadius: 8,
    },
  },
  [THEMES.DARK]: {
    token: {
      colorPrimary: "#3b82f6",
      colorBgContainer: "#1e293b",
      colorBgElevated: "#1e293b",
      colorBgLayout: "#0f172a",
      colorText: "#f1f5f9",
      colorTextSecondary: "#94a3b8",
      colorBorder: "#334155",
      colorBorderSecondary: "#334155",
      borderRadius: 8,
    },
  },
  [THEMES.HIGH_CONTRAST]: {
    token: {
      colorPrimary: "#ffff00",
      colorBgContainer: "#1a1a1a",
      colorBgElevated: "#1a1a1a",
      colorBgLayout: "#000000",
      colorText: "#ffffff",
      colorTextSecondary: "#e0e0e0",
      colorBorder: "#ffffff",
      colorBorderSecondary: "#ffffff",
      borderRadius: 4,
      fontSize: 16,
    },
  },
};

function applyTokensToDOM(themeName) {
  const tokens = themeTokens[themeName];
  if (!tokens) return;
  const root = document.documentElement;
  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function ThemeProvider({ children }) {
  const [theme, setThemeRaw] = useState(THEMES.LIGHT);
  const [mounted, setMounted] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && Object.values(THEMES).includes(saved)) {
        setThemeRaw(saved);
        applyTokensToDOM(saved);
      } else {
        applyTokensToDOM(THEMES.LIGHT);
      }
    } catch {
      applyTokensToDOM(THEMES.LIGHT);
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme) => {
    if (!Object.values(THEMES).includes(newTheme)) return;
    setThemeRaw(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {}
    applyTokensToDOM(newTheme);
  }, []);

  const isDark = theme === THEMES.DARK;
  const isHighContrast = theme === THEMES.HIGH_CONTRAST;
  const isLight = theme === THEMES.LIGHT;

  const value = useMemo(
    () => ({ theme, setTheme, isDark, isHighContrast, isLight, mounted }),
    [theme, setTheme, isDark, isHighContrast, isLight, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
