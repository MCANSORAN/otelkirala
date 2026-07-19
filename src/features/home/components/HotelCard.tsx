import Image from "next/image";
import Link from "next/link";
import type { Hotel } from "@/types";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";

export default function HotelCard({
  hotel,
  dict,
  lang,
}: {
  hotel: Hotel;
  dict: Dictionary["hotelCard"];
  lang: Locale;
}) {
  return (
    <Link
      href={`/${lang}/hotels/${hotel.id}`}
      className="group block overflow-hidden rounded-2xl border border-gold-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900"
    >
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
              className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-300"
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
          <span className="rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-brand-950 transition-colors group-hover:bg-gold-600">
            {dict.viewDetails}
          </span>
        </div>
      </div>
    </Link>
  );
}
