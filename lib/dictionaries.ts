import type { Locale } from "./locales";
import trDictionary from "./messages/tr.json";
import enDictionary from "./messages/en.json";

const messages = {
  tr: trDictionary,
  en: enDictionary,
} satisfies Record<Locale, typeof trDictionary>;

export type Dictionary = typeof trDictionary;

export function getDictionary(locale: Locale): Dictionary {
  return messages[locale];
}

export { locales, defaultLocale, hasLocale, type Locale } from "./locales";
