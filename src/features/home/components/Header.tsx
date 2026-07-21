"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";
import type { User } from "@/types";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { logoutAction } from "@/features/auth/actions";

function BrandMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-9 w-9 text-brand-600"
      aria-hidden="true"
    >
      <rect x="11.5" y="3" width="1" height="5.5" rx="0.5" fill="currentColor" />
      <path d="M12.2 3.4 L16.6 4.7 L12.2 6 Z" fill="#38bdf8" />
      <path
        d="M4.5 21.5 V9.5 a2 2 0 0 1 2-2 h11 a2 2 0 0 1 2 2 V21.5 Z"
        fill="currentColor"
      />
      <g fill="#ffffff">
        <rect x="6.3" y="11" width="2.2" height="2.2" rx="0.4" />
        <rect x="10.4" y="11" width="2.2" height="2.2" rx="0.4" />
        <rect x="14.5" y="11" width="2.2" height="2.2" rx="0.4" />
        <rect x="6.3" y="14.4" width="2.2" height="2.2" rx="0.4" />
        <rect x="14.5" y="14.4" width="2.2" height="2.2" rx="0.4" />
        <path d="M10.3 21.5 v-2.8 a1.7 1.7 0 0 1 3.4 0 v2.8 Z" />
      </g>
    </svg>
  );
}

export default function Header({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["header"];
}) {
  const [open, setOpen] = useState(false);
  // Sayfalar statik/ISR kalsın diye kullanıcı sunucuda değil, burada (mount sonrası)
  // /api/me üzerinden çekilir. Başlangıçta çıkış yapmış görünür; oturum varsa değişir.
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data: { user: User | null }) => {
        if (active) setUser(data.user ?? null);
      })
      .catch(() => {
        /* ağ hatası: çıkış yapmış durumda kal */
      });
    return () => {
      active = false;
    };
  }, []);

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
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-brand-700"
        >
          <BrandMark />
          {dict.brand}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-[15px] font-semibold text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
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
                  className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                >
                  {dict.logout}
                </button>
              </form>
            </>
          ) : (
            <Link
              href={`/${lang}/login`}
              className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/25 transition-colors hover:bg-brand-700"
            >
              {dict.login}
            </Link>
          )}
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
              className="rounded-lg px-3 py-2.5 text-base font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
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
                <button type="submit" className="text-sm font-semibold text-red-500">
                  {dict.logout}
                </button>
              </form>
            </div>
          ) : (
            <Link
              href={`/${lang}/login`}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {dict.login}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
