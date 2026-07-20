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
      className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/10"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
          <span className="text-amber-400">★</span> {hotel.rating}
          <span className="font-normal text-slate-500">
            · {hotel.reviewCount} {dict.reviews}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {hotel.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mt-3 text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand-700">
          {hotel.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500">📍 {hotel.location}</p>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">{dict.startingFrom}</p>
            <p className="text-xl font-bold text-slate-900">
              ₺{hotel.price.toLocaleString("tr-TR")}
            </p>
          </div>
          <span className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-brand-700">
            {dict.viewDetails}
          </span>
        </div>
      </div>
    </Link>
  );
}
