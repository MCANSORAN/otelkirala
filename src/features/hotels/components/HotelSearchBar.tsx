"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/constants/locales";

export default function HotelSearchBar({
  lang,
  initialQuery,
  placeholder,
  actionLabel,
  preserved = {},
}: {
  lang: Locale;
  initialQuery: string;
  placeholder: string;
  actionLabel: string;
  preserved?: Record<string, string>;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(preserved);
    const trimmed = value.trim();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    const qs = params.toString();
    router.push(`/${lang}/hotels${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-colors focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100"
      role="search"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-400">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
      >
        {actionLabel}
      </button>
    </form>
  );
}
