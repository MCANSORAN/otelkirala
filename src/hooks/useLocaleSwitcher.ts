"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE } from "@/config/i18n.config";
import type { Locale } from "@/constants/locales";

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function useLocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale: Locale) {
    setLocaleCookie(locale);
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/") || `/${locale}`);
  }

  return { switchTo };
}
