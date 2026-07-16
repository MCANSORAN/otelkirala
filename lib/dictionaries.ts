import type { Locale } from "./locales";
import trDictionary from "./dictionaries/tr.json";
import enDictionary from "./dictionaries/en.json";

const dictionaries = {
  tr: trDictionary,
  en: enDictionary,
} satisfies Record<Locale, typeof trDictionary>;

export type Dictionary = typeof trDictionary;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export { locales, defaultLocale, hasLocale, type Locale } from "./locales";
