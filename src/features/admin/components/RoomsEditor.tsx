"use client";

import { useState } from "react";
import type { Room } from "@/types";
import { inputClassName } from "@/components/Field";
import trDictionary from "@/messages/tr.json";

const t = trDictionary.admin.hotels.rooms;

// Grid hücrelerinde etiket olmadığı için ortak input stilinin üst boşluksuz hali.
const cellClassName = inputClassName.replace("mt-1 ", "");

function emptyRoom(): Room {
  return { id: "", name: "", price: 0, capacity: 2, image: "" };
}

export default function RoomsEditor({ rooms: initialRooms }: { rooms?: Room[] }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms?.length ? initialRooms : [emptyRoom()]);

  function updateRoom(index: number, field: keyof Room, value: string) {
    setRooms((current) =>
      current.map((room, i) =>
        i === index
          ? { ...room, [field]: field === "price" || field === "capacity" ? Number(value) : value }
          : room
      )
    );
  }

  function addRoom() {
    setRooms((current) => [...current, emptyRoom()]);
  }

  function removeRoom(index: number) {
    setRooms((current) => current.filter((_, i) => i !== index));
  }

  return (
    <div>
      <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t.title}</span>
      <input type="hidden" name="roomsJson" value={JSON.stringify(rooms)} />

      <div className="mt-2 space-y-3">
        {rooms.map((room, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-3 rounded-lg border border-black/10 p-3 sm:grid-cols-[2fr_1fr_1fr_2fr_auto] dark:border-white/10"
          >
            <input
              type="text"
              placeholder={t.namePlaceholder}
              value={room.name}
              onChange={(event) => updateRoom(index, "name", event.target.value)}
              className={cellClassName}
            />
            <input
              type="number"
              min={0}
              placeholder={t.pricePlaceholder}
              value={room.price}
              onChange={(event) => updateRoom(index, "price", event.target.value)}
              className={cellClassName}
            />
            <input
              type="number"
              min={1}
              placeholder={t.capacityPlaceholder}
              value={room.capacity}
              onChange={(event) => updateRoom(index, "capacity", event.target.value)}
              className={cellClassName}
            />
            <input
              type="url"
              placeholder={t.imagePlaceholder}
              value={room.image}
              onChange={(event) => updateRoom(index, "image", event.target.value)}
              className={cellClassName}
            />
            <button
              type="button"
              onClick={() => removeRoom(index)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              {t.remove}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRoom}
        className="mt-3 rounded-full border border-brand-600 px-4 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/30"
      >
        {t.add}
      </button>
    </div>
  );
}
