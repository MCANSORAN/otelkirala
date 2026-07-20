"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";
import type { User } from "@/types";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { logoutAction } from "@/features/auth/actions";

export default function Header({
  lang,
  dict,
  user,
}: {
  lang: Locale;
  dict: Dictionary["header"];
  user: User | null;
}) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}/hotels`, label: dict.nav.hotels },
    { href: `/${lang}/destinations`, label: dict.nav.destinations },
    { href: `/${lang}/reviews`, label: dict.nav.reviews },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-brand-700"
        >
          <span className="text-2xl">🏨</span>
          {dict.brand}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher lang={lang} />
          {user ? (
            <>
              <span className="text-sm font-medium text-slate-600">
                {dict.greeting}, {user.name}
              </span>
              <form action={logoutAction.bind(null, lang)}>
                <button
                  type="submit"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
                >
                  {dict.logout}
                </button>
              </form>
            </>
          ) : (
            <Link
              href={`/${lang}/login`}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
            >
              {dict.login}
            </Link>
          )}
          <Link
            href={`/${lang}/hotels`}
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700"
          >
            {dict.cta}
          </Link>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-200 text-brand-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={dict.menuToggle}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-brand-100 px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex justify-center">
            <LanguageSwitcher lang={lang} />
          </div>
          {user ? (
            <div className="mt-2 flex items-center justify-between px-3">
              <span className="text-sm font-medium text-slate-600">
                {dict.greeting}, {user.name}
              </span>
              <form action={logoutAction.bind(null, lang)}>
                <button type="submit" className="text-sm font-medium text-red-500">
                  {dict.logout}
                </button>
              </form>
            </div>
          ) : (
            <Link
              href={`/${lang}/login`}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-brand-50"
            >
              {dict.login}
            </Link>
          )}
          <Link
            href={`/${lang}/hotels`}
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {dict.cta}
          </Link>
        </nav>
      )}
    </header>
  );
}
