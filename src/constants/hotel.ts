import type { HalalFeatureKey } from "@/types";

export const HALAL_FEATURE_KEYS: HalalFeatureKey[] = [
  "separatePool",
  "separateBeach",
  "halalFood",
  "noAlcohol",
  "prayerRoom",
  "separateSpa",
];

export const HALAL_FEATURE_ICONS: Record<HalalFeatureKey, string> = {
  separatePool: "🏊",
  separateBeach: "🏖️",
  halalFood: "🍽️",
  noAlcohol: "🚫",
  prayerRoom: "🕌",
  separateSpa: "💆",
};

export function isHalalFeatureKey(value: unknown): value is HalalFeatureKey {
  return typeof value === "string" && (HALAL_FEATURE_KEYS as string[]).includes(value);
}
