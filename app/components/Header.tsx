"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ lang, dict }: { lang: Locale; dict: Dictionary["header"] }) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "#oteller", label: dict.nav.hotels },
    { href: "#bolgeler", label: dict.nav.destinations },
    { href: "#yorumlar", label: dict.nav.reviews },
    { href: "#iletisim", label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-sky-700 dark:text-sky-400"
        >
          <span className="text-2xl">🏨</span>
          {dict.brand}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-sky-700 dark:text-neutral-300 dark:hover:text-sky-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher lang={lang} />
          <button className="text-sm font-medium text-neutral-600 hover:text-sky-700 dark:text-neutral-300 dark:hover:text-sky-400">
            {dict.login}
          </button>
          <a
            href="#oteller"
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            {dict.cta}
          </a>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-neutral-700 md:hidden dark:border-white/10 dark:text-neutral-200"
          onClick={() => setOpen((v) => !v)}
          aria-label={dict.menuToggle}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/5 px-6 py-4 md:hidden dark:border-white/10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex justify-center">
            <LanguageSwitcher lang={lang} />
          </div>
          <a
            href="#oteller"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            {dict.cta}
          </a>
        </nav>
      )}
    </header>
  );
}
