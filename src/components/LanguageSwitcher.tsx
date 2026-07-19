"use client";

import { useLocaleSwitcher } from "@/hooks/useLocaleSwitcher";
import { locales, type Locale } from "@/constants/locales";

const LOCALE_LABELS: Record<Locale, string> = { tr: "TR", en: "EN" };

export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const { switchTo } = useLocaleSwitcher();

  return (
    <div className="flex items-center gap-1 rounded-full border border-gold-500/30 p-0.5 text-xs font-semibold">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-current={locale === lang}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === lang ? "bg-gold-500 text-brand-950" : "text-brand-50/70 hover:text-gold-400"
          }`}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
