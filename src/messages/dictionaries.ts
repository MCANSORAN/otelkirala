import type { Locale } from "@/constants/locales";
import trDictionary from "./tr.json";
import enDictionary from "./en.json";

const dictionaries = {
  tr: trDictionary,
  en: enDictionary,
} satisfies Record<Locale, typeof trDictionary>;

export type Dictionary = typeof trDictionary;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export { locales, defaultLocale, hasLocale, type Locale } from "@/constants/locales";
