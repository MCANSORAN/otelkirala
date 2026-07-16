import Image from "next/image";
import type { Hotel } from "@/lib/types";
import type { Dictionary } from "@/lib/dictionaries";

export default function HotelCard({ hotel, dict }: { hotel: Hotel; dict: Dictionary["hotelCard"] }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-neutral-900">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-800 backdrop-blur-sm">
          ★ {hotel.rating} · {hotel.reviewCount} {dict.reviews}
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {hotel.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mt-3 text-lg font-semibold text-neutral-900 dark:text-white">
          {hotel.name}
        </h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          📍 {hotel.location}
        </p>

        <div className="mt-4 flex items-end justify-between border-t border-black/5 pt-4 dark:border-white/10">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{dict.startingFrom}</p>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              ₺{hotel.price.toLocaleString("tr-TR")}
            </p>
          </div>
          <button className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700">
            {dict.viewDetails}
          </button>
        </div>
      </div>
    </article>
  );
}
