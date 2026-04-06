"use client";

import { TravelDataProvider } from "@/hooks/useTravelData";

export default function AppProviders({ children }) {
  return <TravelDataProvider>{children}</TravelDataProvider>;
}
