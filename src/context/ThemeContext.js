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
    "--ts-bg": "#dfeaf0",
    "--ts-bg-elevated": "#edf4f8",
    "--ts-bg-card": "#f7fbfd",
    "--ts-bg-hero": "radial-gradient(circle at 20% 20%, #31505e 0%, #162a35 45%, #101a22 100%)",
    "--ts-text-primary": "#182a38",
    "--ts-text-secondary": "#4d6477",
    "--ts-text-on-hero": "#ffffff",
    "--ts-border": "#bfd1dc",
    "--ts-accent": "#0f766e",
    "--ts-accent-green": "#5dd4be",
    "--ts-nav-bg": "rgba(238, 246, 250, 0.86)",
    "--ts-nav-border": "rgba(24, 42, 56, 0.16)",
    "--ts-footer-border": "#b6c9d5",
    "--ts-seat-available": "#d1fae5",
    "--ts-seat-booked": "#e2e8f0",
    "--ts-seat-selected": "#0f766e",
    "--ts-input-bg": "#eef5f9",
    "--ts-input-border": "#c2d4de",
    "--ts-shadow": "0 8px 24px rgba(20, 28, 36, 0.08)",
    "--ts-shadow-hover": "0 18px 44px rgba(20, 28, 36, 0.18)",
    "--ts-glow": "0 0 0 2px rgba(15, 118, 110, 0.25)",
  },
  [THEMES.DARK]: {
    "--ts-bg": "#0f161c",
    "--ts-bg-elevated": "#16222c",
    "--ts-bg-card": "#182630",
    "--ts-bg-hero": "radial-gradient(circle at 10% 15%, #325567 0%, #17222c 50%, #0b1117 100%)",
    "--ts-text-primary": "#edf4f8",
    "--ts-text-secondary": "#9fb0bd",
    "--ts-text-on-hero": "#f1f5f9",
    "--ts-border": "#314654",
    "--ts-accent": "#38b2ac",
    "--ts-accent-green": "#52d8bf",
    "--ts-nav-bg": "rgba(15, 22, 28, 0.9)",
    "--ts-nav-border": "rgba(255,255,255,0.06)",
    "--ts-footer-border": "#2e3f4c",
    "--ts-seat-available": "#064e3b",
    "--ts-seat-booked": "#334155",
    "--ts-seat-selected": "#38b2ac",
    "--ts-input-bg": "#12202a",
    "--ts-input-border": "#304655",
    "--ts-shadow": "0 10px 24px rgba(0,0,0,0.35)",
    "--ts-shadow-hover": "0 20px 42px rgba(0,0,0,0.6)",
    "--ts-glow": "0 0 0 2px rgba(56, 178, 172, 0.35)",
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
    "--ts-glow": "0 0 0 3px #ffff00",
  },
};

// Ant Design theme config per theme
export const antdThemeConfig = {
  [THEMES.LIGHT]: {
    token: {
      colorPrimary: "#0f766e",
      colorInfo: "#155e75",
      colorSuccess: "#0f766e",
      borderRadius: 10,
    },
  },
  [THEMES.DARK]: {
    token: {
      colorPrimary: "#38b2ac",
      colorBgContainer: "#182630",
      colorBgElevated: "#16222c",
      colorBgLayout: "#0f161c",
      colorText: "#edf4f8",
      colorTextSecondary: "#9fb0bd",
      colorBorder: "#314654",
      colorBorderSecondary: "#314654",
      borderRadius: 10,
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
