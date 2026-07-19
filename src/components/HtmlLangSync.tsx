"use client";

import { useEffect } from "react";
import type { Locale } from "@/constants/locales";

// Kök layout tek bir <html lang> döndürdüğü için (App Router'da yalnızca bir
// root layout olabilir), aktif dile göre düzeltmeyi burada, client tarafında yapıyoruz.
export default function HtmlLangSync({ lang }: { lang: Locale }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
