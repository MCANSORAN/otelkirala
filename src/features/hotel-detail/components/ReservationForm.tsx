"use client";

import { useActionState, useState } from "react";
import { submitReservationRequest, type RequestFormState } from "@/features/hotel-detail/actions";
import Field, { inputClassName, labelClassName } from "@/components/Field";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";
import type { Room } from "@/types";
import { useReservation } from "./ReservationProvider";

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

  const r = dict.request;
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const displayPrice = selectedRoom?.price ?? price;

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
      </div>

      <input type="hidden" name="hotelId" value={hotelId} />
      <input type="hidden" name="hotelName" value={hotelName} />
      <input type="hidden" name="roomId" value={selectedRoom?.id ?? ""} />
      <input type="hidden" name="roomName" value={selectedRoom?.name ?? ""} />

      <Field label={r.fullNameLabel} name="fullName" type="text" required autoComplete="name" />
      <Field label={r.phoneLabel} name="phone" type="tel" required autoComplete="tel" />
      <Field label={r.emailLabel} name="email" type="email" autoComplete="email" />

      <div className="grid grid-cols-2 gap-3">
        <Field label={r.checkInLabel} name="checkIn" type="date" />
        <Field label={r.checkOutLabel} name="checkOut" type="date" />
      </div>

      <Field label={r.guestsLabel} name="guests" type="number" min={1} max={30} defaultValue={2} />

      <div>
        <label htmlFor="request-message" className={labelClassName}>
          {r.messageLabel}
        </label>
        <textarea
          id="request-message"
          name="message"
          rows={3}
          placeholder={r.messagePlaceholder}
          className={inputClassName}
        />
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
