"use client";

import Image from "next/image";
import type { Dictionary } from "@/messages/dictionaries";
import type { Room } from "@/types";
import { useReservation } from "./ReservationProvider";

export default function RoomsList({ rooms, dict }: { rooms: Room[]; dict: Dictionary["hotelDetail"] }) {
  const { selectedRoomId, selectRoom } = useReservation();

  if (rooms.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{dict.roomsTitle}</h2>
      <div className="mt-4 space-y-4">
        {rooms.map((room) => {
          const selected = selectedRoomId === room.id;
          return (
            <div
              key={room.id}
              className={`flex flex-col gap-4 rounded-2xl border p-4 transition-colors sm:flex-row sm:items-center dark:bg-neutral-900 ${
                selected
                  ? "border-brand-600 bg-brand-50/40 ring-1 ring-brand-600 dark:border-brand-500 dark:bg-brand-950/30"
                  : "border-gold-100 bg-white dark:border-white/10"
              }`}
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-36">
                <Image src={room.image} alt={room.name} fill sizes="144px" className="object-cover" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 dark:text-white">{room.name}</h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  👤 {room.capacity} {dict.roomCapacity}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <p className="text-lg font-bold text-neutral-900 dark:text-white">
                  ₺{room.price.toLocaleString("tr-TR")}
                  <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400"> {dict.roomPerNight}</span>
                </p>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectRoom(room.id)}
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    selected
                      ? "bg-brand-100 text-brand-800 hover:bg-brand-200 dark:bg-brand-900 dark:text-brand-200"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {selected ? dict.roomSelected : dict.selectRoom}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
