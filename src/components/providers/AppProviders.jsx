"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import { TravelDataProvider } from "@/hooks/useTravelData";
import { ThemeProvider, useTheme, THEMES, antdThemeConfig } from "@/context/ThemeContext";

function AntdThemeWrapper({ children }) {
  const { theme, isDark, isHighContrast } = useTheme();

  const algorithm = isDark || isHighContrast
    ? antdTheme.darkAlgorithm
    : antdTheme.defaultAlgorithm;

  const themeConfig = antdThemeConfig[theme] || antdThemeConfig[THEMES.LIGHT];

  return (
    <ConfigProvider
      theme={{
        algorithm,
        ...themeConfig,
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AntdThemeWrapper>
        <TravelDataProvider>{children}</TravelDataProvider>
      </AntdThemeWrapper>
    </ThemeProvider>
  );
}
