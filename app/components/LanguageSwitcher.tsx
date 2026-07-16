"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/locales";

const LOCALE_LABELS: Record<Locale, string> = { tr: "TR", en: "EN" };
const LOCALE_COOKIE = "NEXT_LOCALE";

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale: Locale) {
    setLocaleCookie(locale);
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/") || `/${locale}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-black/10 p-0.5 text-xs font-semibold dark:border-white/10">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-current={locale === lang}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === lang
              ? "bg-sky-600 text-white"
              : "text-neutral-500 hover:text-sky-700 dark:text-neutral-400 dark:hover:text-sky-400"
          }`}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
