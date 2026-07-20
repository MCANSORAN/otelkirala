"use client";

import { useLocaleSwitcher } from "@/hooks/useLocaleSwitcher";
import { locales, type Locale } from "@/constants/locales";

const LOCALE_LABELS: Record<Locale, string> = { tr: "TR", en: "EN" };

export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const { switchTo } = useLocaleSwitcher();

  return (
    <div className="flex items-center gap-1 rounded-full border border-brand-200 p-0.5 text-xs font-semibold">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-current={locale === lang}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === lang ? "bg-brand-600 text-white" : "text-slate-500 hover:text-brand-600"
          }`}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
