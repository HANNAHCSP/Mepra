// src/lib/shipping-rates.ts

export type ShippingMethodType = "standard" | "express";

export interface ShippingRate {
  id: ShippingMethodType;
  name: string;
  description: string;
  priceCents: number;
}

// 1. Official List of Egyptian Governorates
export const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Monufia",
  "Minya",
  "Qalyubia",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr Al Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
] as const;

export type Governorate = (typeof GOVERNORATES)[number];

// 2. Zone Mapping (Grouping Governorates by Price)
const ZONE_MAP: Record<string, string[]> = {
  CAIRO_GIZA: ["Cairo", "Giza", "Helwan", "6th of October"], // Kept aliases for backward compat if needed
  ALEXANDRIA: ["Alexandria"],
  DELTA: [
    "Qalyubia",
    "Gharbia",
    "Monufia",
    "Beheira",
    "Dakahlia",
    "Kafr Al Sheikh",
    "Damietta",
    "Sharkia",
  ],
  CANAL: ["Port Said", "Ismailia", "Suez"],
  UPPER_EGYPT: ["Beni Suef", "Fayoum", "Minya", "Assiut", "Sohag", "Qena", "Luxor", "Aswan"],
  RED_SEA: ["Red Sea", "Hurghada", "South Sinai", "North Sinai", "Matrouh", "New Valley"],
};

// 3. Rates per Zone (in Cents)
const ZONE_RATES: Record<string, number> = {
  default: 6000, // 60 EGP
  cairo_giza: 4000, // 40 EGP
  alexandria: 5000, // 50 EGP
  delta: 5500, // 55 EGP
  canal: 6000, // 60 EGP
  upper_egypt: 7500, // 75 EGP
  red_sea: 9000, // 90 EGP
};

function getZoneKey(state: string): string {
  const normalizedState = state.trim().toLowerCase();

  if (ZONE_MAP.CAIRO_GIZA.some((c) => normalizedState.includes(c.toLowerCase())))
    return "cairo_giza";
  if (ZONE_MAP.ALEXANDRIA.some((c) => normalizedState.includes(c.toLowerCase())))
    return "alexandria";
  if (ZONE_MAP.DELTA.some((c) => normalizedState.includes(c.toLowerCase()))) return "delta";
  if (ZONE_MAP.CANAL.some((c) => normalizedState.includes(c.toLowerCase()))) return "canal";
  if (ZONE_MAP.UPPER_EGYPT.some((c) => normalizedState.includes(c.toLowerCase())))
    return "upper_egypt";
  if (ZONE_MAP.RED_SEA.some((c) => normalizedState.includes(c.toLowerCase()))) return "red_sea";

  return "default";
}

export function getShippingOptions(state: string): ShippingRate[] {
  const zoneKey = getZoneKey(state);
  const basePrice = ZONE_RATES[zoneKey] ?? ZONE_RATES.default;

  return [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "Delivery in 3-5 business days",
      priceCents: basePrice,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "Delivery in 1-2 business days",
      priceCents: basePrice * 2,
    },
  ];
}
