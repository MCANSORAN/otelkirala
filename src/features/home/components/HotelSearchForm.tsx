"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";

type PanelKey = "dates" | "guests" | null;

export default function HotelSearchForm({
  dict,
  lang,
}: {
  dict: Dictionary["hero"]["form"];
  lang: Locale;
}) {
  const locale = lang === "tr" ? "tr-TR" : "en-US";

  const [openPanel, setOpenPanel] = useState<PanelKey>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openPanel) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (datesRef.current?.contains(target)) return;
      if (guestsRef.current?.contains(target)) return;
      setOpenPanel(null);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPanel(null);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPanel]);

  function togglePanel(panel: PanelKey) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  function handleDayClick(date: Date) {
    if (date < startOfDay(new Date())) return;

    if (!checkIn || checkOut) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }
    if (date <= checkIn) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }
    setCheckOut(date);
  }

  const datesValue =
    checkIn && checkOut
      ? `${formatShort(checkIn, locale)} - ${formatShort(checkOut, locale)}`
      : checkIn
        ? `${formatShort(checkIn, locale)} - ...`
        : dict.selectDates;

  const guestsValue =
    children > 0
      ? `${adults} ${dict.adultsLabel}, ${children} ${dict.childrenLabel}`
      : `${adults} ${dict.adultsLabel}`;

  return (
    <form className="mt-10 w-full max-w-4xl rounded-2xl bg-white p-2 text-left shadow-2xl shadow-brand-950/25 ring-1 ring-black/5">
      <div className="flex flex-col divide-y divide-slate-100 sm:flex-row sm:items-stretch sm:divide-x sm:divide-y-0">
        <Field icon={<IconPin className="h-5 w-5" />} label={dict.destinationLabel} className="sm:min-w-0 sm:flex-1">
          <input
            type="text"
            placeholder={dict.destinationPlaceholder}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
          />
        </Field>

        <div className="relative sm:w-60 sm:shrink-0" ref={datesRef}>
          <FieldButton
            icon={<IconCalendar className="h-5 w-5" />}
            label={dict.datesLabel}
            value={datesValue}
            active={openPanel === "dates"}
            placeholder={!checkIn}
            onClick={() => togglePanel("dates")}
          />

          {openPanel === "dates" && (
            <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl shadow-brand-950/15 ring-1 ring-black/5">
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-brand-50 px-3 py-2">
                  <p className="text-[11px] font-semibold text-brand-600">{dict.checkinLabel}</p>
                  <p className="text-sm font-bold text-slate-900">
                    {checkIn ? formatShort(checkIn, locale) : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-brand-50 px-3 py-2">
                  <p className="text-[11px] font-semibold text-brand-600">{dict.checkoutLabel}</p>
                  <p className="text-sm font-bold text-slate-900">
                    {checkOut ? formatShort(checkOut, locale) : "—"}
                  </p>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setViewMonth((m) => addMonths(m, -1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                >
                  <IconChevronLeft className="h-4 w-4" />
                </button>
                <p className="text-sm font-bold capitalize text-slate-900">
                  {formatMonthLabel(viewMonth, locale)}
                </p>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setViewMonth((m) => addMonths(m, 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                >
                  <IconChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-y-1 text-center">
                {weekdayLabels(locale).map((label) => (
                  <span key={label} className="py-1 text-[11px] font-semibold text-slate-400">
                    {label}
                  </span>
                ))}

                {buildMonthGrid(viewMonth).map((date, index) => {
                  if (!date) {
                    return <span key={`empty-${index}`} className="h-9 w-9" aria-hidden="true" />;
                  }

                  const disabled = date < startOfDay(new Date());
                  const isCheckIn = checkIn ? isSameDay(date, checkIn) : false;
                  const isCheckOut = checkOut ? isSameDay(date, checkOut) : false;
                  const inRange =
                    checkIn && checkOut ? date > checkIn && date < checkOut : false;

                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleDayClick(date)}
                      className={[
                        "flex h-9 w-9 items-center justify-center text-sm font-medium transition-colors",
                        disabled
                          ? "cursor-not-allowed text-slate-300"
                          : isCheckIn || isCheckOut
                            ? "rounded-full bg-brand-600 font-bold text-white hover:bg-brand-600"
                            : inRange
                              ? "bg-brand-50 text-brand-700 hover:bg-brand-100"
                              : "text-slate-700 hover:bg-brand-50",
                      ].join(" ")}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setCheckIn(null);
                    setCheckOut(null);
                  }}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                >
                  {dict.clear}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenPanel(null)}
                  className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  {dict.apply}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative sm:w-52 sm:shrink-0" ref={guestsRef}>
          <FieldButton
            icon={<IconUsers className="h-5 w-5" />}
            label={dict.guestsLabel}
            value={guestsValue}
            active={openPanel === "guests"}
            onClick={() => togglePanel("guests")}
          />

          {openPanel === "guests" && (
            <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl shadow-brand-950/15 ring-1 ring-black/5">
              <Counter
                label={dict.adultsLabel}
                helperText={dict.adultsHelp}
                value={adults}
                min={1}
                max={10}
                onChange={setAdults}
              />
              <div className="my-3 h-px bg-slate-100" />
              <Counter
                label={dict.childrenLabel}
                helperText={dict.childrenHelp}
                value={children}
                min={0}
                max={10}
                onChange={setChildren}
              />

              <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setOpenPanel(null)}
                  className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  {dict.done}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-stretch p-1 sm:shrink-0">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            <IconSearch className="h-4 w-4" />
            <span>{dict.submit}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  icon,
  label,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors focus-within:bg-brand-50 ${className}`}
    >
      <IconBadge>{icon}</IconBadge>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        {children}
      </span>
    </label>
  );
}

function FieldButton({
  icon,
  label,
  value,
  placeholder,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors ${
        active ? "bg-brand-50" : "hover:bg-slate-50"
      }`}
    >
      <IconBadge active={active}>{icon}</IconBadge>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <span
          className={`truncate text-sm font-semibold ${placeholder ? "text-slate-400" : "text-slate-900"}`}
        >
          {value}
        </span>
      </span>
    </button>
  );
}

function IconBadge({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors ${
        active ? "bg-brand-700" : "bg-brand-600"
      }`}
    >
      {children}
    </span>
  );
}

function Counter({
  label,
  helperText,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  helperText: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-slate-900">{label}</span>
        <span className="text-xs text-slate-400">{helperText}</span>
      </span>
      <span className="flex items-center gap-3">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
        >
          <IconMinus className="h-3.5 w-3.5" />
        </button>
        <span className="w-4 text-center text-sm font-bold text-slate-900">{value}</span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
        >
          <IconPlus className="h-3.5 w-3.5" />
        </button>
      </span>
    </div>
  );
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatShort(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(date);
}

function formatMonthLabel(date: Date, locale: string) {
  const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function weekdayLabels(locale: string) {
  return Array.from({ length: 7 }, (_, i) => {
    const reference = new Date(2024, 0, 1 + i); // 2024-01-01 is a Monday
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(reference);
  });
}

function buildMonthGrid(viewMonth: Date) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Yalnızca ayın kendi günleri. Baştaki hizalama için null hücreler eklenir;
  // sondaki komşu ay günleri hiç gösterilmez (ayda kaç gün varsa o kadar).
  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  return cells;
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21s-6.5-5.85-6.5-11.15A6.5 6.5 0 0 1 12 3.35a6.5 6.5 0 0 1 6.5 6.5C18.5 15.15 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.85" r="2.3" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="8.5" r="3" stroke="currentColor" strokeWidth="2.2" />
      <path d="M3.5 20c.6-3.4 3-5.2 5.5-5.2s4.9 1.8 5.5 5.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M15 6.2c1.4.35 2.4 1.6 2.4 3.1 0 1.5-1 2.75-2.4 3.1"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M15.5 14.9c2.1.5 3.65 2.1 4.1 5.1"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMinus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
