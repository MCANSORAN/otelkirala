"use client";

import { useActionState, useState, useSyncExternalStore } from "react";
import { submitReservationRequest, type RequestFormState } from "@/features/hotel-detail/actions";
import Field, { inputClassName, labelClassName } from "@/components/Field";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";
import { MESSAGE_MAX_LENGTH } from "@/constants/reservation";
import type { Room } from "@/types";
import { useReservation } from "./ReservationProvider";

// Ad/soyad alanlarına rakam girilemez; kullanıcı yazarken rakamlar ayıklanır
// (sunucu da aynı temizliği yapar, bkz. request.service).
const stripDigits = (value: string) => value.replace(/[0-9]/g, "");

type Props = {
  lang: Locale;
  hotelId: string;
  hotelName: string;
  price: number;
  rooms: Room[];
  dict: Dictionary["hotelDetail"];
};

const cardClassName =
  "sticky top-24 rounded-2xl border border-gold-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900";

// "YYYY-MM-DD" tarihine bir gün ekler; çıkış tarihi girişten en az bir gün sonra
// olmalı (bkz. request.service invalidDateRange), min değeri için kullanılır.
function nextDay(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

// Bugünün tarihini yalnızca istemcide üretir; sunucuda "" döner ki tarih girişinin
// "min" değeri SSR/CSR hidrasyon uyuşmazlığına yol açmasın (useSyncExternalStore deseni).
const subscribeToNothing = () => () => {};
const getTodayIso = () => new Date().toISOString().slice(0, 10);
const getEmptyDate = () => "";

// Artı/eksi butonlu sayaç. Gizli input ile form gönderimine değerini taşır.
function Stepper({
  label,
  name,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
}) {
  const btnClassName =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-lg leading-none text-neutral-700 transition-colors hover:border-brand-600 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-neutral-300 dark:hover:border-brand-400 dark:hover:text-brand-400";
  return (
    <div>
      <span className={labelClassName}>{label}</span>
      <div className="mt-1 flex items-center justify-between rounded-lg border border-black/10 bg-white px-2 py-1.5 dark:border-white/10 dark:bg-neutral-900">
        <button
          type="button"
          aria-label={`${label} azalt`}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={btnClassName}
        >
          −
        </button>
        <span className="min-w-[2ch] text-center text-sm font-semibold text-neutral-900 dark:text-white">
          {value}
        </span>
        <button
          type="button"
          aria-label={`${label} artır`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className={btnClassName}
        >
          +
        </button>
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

// Dış bileşen: başarıdan sonra "yeni talep gönder" ile formu sıfırlamak için
// key değiştirerek iç bileşeni yeniden monte eder (useActionState state'ini temizler).
export default function ReservationForm(props: Props) {
  const [attempt, setAttempt] = useState(0);
  return <ReservationFormInner key={attempt} {...props} onReset={() => setAttempt((n) => n + 1)} />;
}

function ReservationFormInner({ lang, hotelId, hotelName, price, rooms, dict, onReset }: Props & { onReset: () => void }) {
  const { selectedRoomId } = useReservation();
  const [state, formAction, pending] = useActionState<RequestFormState, FormData>(
    submitReservationRequest.bind(null, lang),
    undefined
  );

  // Ad/soyad rakamsız; telefon yalnızca rakam; tarihler için geçmiş tarih ve
  // çıkış < giriş engellenir.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [message, setMessage] = useState("");
  const today = useSyncExternalStore(subscribeToNothing, getTodayIso, getEmptyDate);

  const r = dict.request;
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const displayPrice = selectedRoom?.price ?? price;

  // Kapasiteye göre gruplama: seçilen oda N kişilikse ve toplam misafir daha
  // fazlaysa, gereken oda sayısı ceil(misafir / kapasite) olur ve gecelik toplam
  // fiyat oda sayısıyla çarpılır.
  const totalGuests = adults + children;
  const roomCount =
    selectedRoom && selectedRoom.capacity > 0
      ? Math.max(1, Math.ceil(totalGuests / selectedRoom.capacity))
      : 1;
  const totalPrice = displayPrice * roomCount;

  if (state?.ok) {
    return (
      <div className={cardClassName}>
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-950">
            ✓
          </div>
          <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">{r.successTitle}</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{r.successBody}</p>
          <button
            type="button"
            onClick={onReset}
            className="mt-5 rounded-full border border-brand-600 px-5 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/40"
          >
            {r.sendAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{r.title}</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{r.subtitle}</p>
      </div>

      <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/50">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{dict.startingFrom}</p>
        <p className="text-2xl font-bold text-neutral-900 dark:text-white">
          ₺{displayPrice.toLocaleString("tr-TR")}
        </p>
        <p className="mt-1 text-xs font-medium text-brand-700 dark:text-brand-400">
          {selectedRoom ? `${r.selectedRoom}: ${selectedRoom.name}` : r.noRoomSelected}
        </p>

        {roomCount > 1 && (
          <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/10">
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              {r.roomsNeededNote
                .replace("{count}", String(roomCount))
                .replace("{guests}", String(totalGuests))}
            </p>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {r.totalPerNight}
              </span>
              <span className="text-lg font-bold text-neutral-900 dark:text-white">
                ₺{totalPrice.toLocaleString("tr-TR")}
              </span>
            </div>
          </div>
        )}
      </div>

      <input type="hidden" name="hotelId" value={hotelId} />
      <input type="hidden" name="hotelName" value={hotelName} />
      <input type="hidden" name="roomId" value={selectedRoom?.id ?? ""} />
      <input type="hidden" name="roomName" value={selectedRoom?.name ?? ""} />
      <input type="hidden" name="roomCount" value={roomCount} />
      <input type="hidden" name="totalPrice" value={totalPrice} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label={r.firstNameLabel}
          name="firstName"
          type="text"
          required
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(stripDigits(e.target.value))}
        />
        <Field
          label={r.lastNameLabel}
          name="lastName"
          type="text"
          required
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(stripDigits(e.target.value))}
        />
      </div>
      <Field
        label={r.phoneLabel}
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={15}
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
      />
      <Field label={r.emailLabel} name="email" type="email" autoComplete="email" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label={r.checkInLabel}
          name="checkIn"
          type="date"
          value={checkIn}
          min={today || undefined}
          onChange={(e) => {
            const value = e.target.value;
            setCheckIn(value);
            // Çıkış tarihi girişten önce/eşitse temizle.
            if (checkOut && value && checkOut <= value) setCheckOut("");
          }}
        />
        <Field
          label={r.checkOutLabel}
          name="checkOut"
          type="date"
          value={checkOut}
          min={checkIn ? nextDay(checkIn) : today || undefined}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stepper label={r.adultsLabel} name="guests" value={adults} onChange={setAdults} min={1} max={10} />
        <Stepper label={r.childrenLabel} name="children" value={children} onChange={setChildren} min={0} max={10} />
      </div>

      <div>
        <label htmlFor="request-message" className={labelClassName}>
          {r.messageLabel}
        </label>
        <textarea
          id="request-message"
          name="message"
          rows={3}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder={r.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClassName}
        />
        <p className="mt-1 text-right text-xs text-neutral-400 dark:text-neutral-500">
          {message.length}/{MESSAGE_MAX_LENGTH}
        </p>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? r.submitPending : r.submit}
      </button>
    </form>
  );
}
