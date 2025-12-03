export type ShippingMethodType = "standard" | "express";

export interface ShippingRate {
  id: ShippingMethodType;
  name: string;
  description: string;
  priceCents: number; // Stored in cents (e.g., 5000 = 50.00 EGP)
}

// 1. Define Zones
const ZONES = {
  CAIRO_GIZA: ["Cairo", "Giza", "Helwan", "6th of October"],
  ALEXANDRIA: ["Alexandria"],
  DELTA: [
    "Qalyubia",
    "Gharbia",
    "Menofia",
    "Beheira",
    "Dakahlia",
    "Kafr El Sheikh",
    "Damietta",
    "Sharqia",
  ],
  CANAL: ["Port Said", "Ismailia", "Suez"],
  UPPER_EGYPT: ["Beni Suef", "Fayoum", "Minya", "Asyut", "Sohag", "Qena", "Luxor", "Aswan"],
  RED_SEA: ["Red Sea", "Hurghada", "South Sinai", "North Sinai", "Matrouh", "New Valley"],
};

// 2. Define Base Rates per Zone (in Cents)
const ZONE_RATES: Record<string, number> = {
  default: 6000, // 60 EGP
  cairo_giza: 4000, // 40 EGP
  alexandria: 5000, // 50 EGP
  delta: 5500, // 55 EGP
  canal: 6000, // 60 EGP
  upper_egypt: 7500, // 75 EGP
  red_sea: 9000, // 90 EGP
};

// 3. Helper to determine zone from state name
function getZoneKey(state: string): string {
  const normalizedState = state.trim().toLowerCase();

  if (ZONES.CAIRO_GIZA.some((c) => normalizedState.includes(c.toLowerCase()))) return "cairo_giza";
  if (ZONES.ALEXANDRIA.some((c) => normalizedState.includes(c.toLowerCase()))) return "alexandria";
  if (ZONES.DELTA.some((c) => normalizedState.includes(c.toLowerCase()))) return "delta";
  if (ZONES.CANAL.some((c) => normalizedState.includes(c.toLowerCase()))) return "canal";
  if (ZONES.UPPER_EGYPT.some((c) => normalizedState.includes(c.toLowerCase())))
    return "upper_egypt";
  if (ZONES.RED_SEA.some((c) => normalizedState.includes(c.toLowerCase()))) return "red_sea";

  return "default";
}

/**
 * Calculates available shipping methods and costs based on the address state.
 */
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
      priceCents: basePrice * 2, // Express is double the price
    },
  ];
}
