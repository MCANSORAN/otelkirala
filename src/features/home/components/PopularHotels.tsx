import Link from "next/link";
import { getHotels } from "@/repositories/hotel.repository";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";
import HotelCard from "./HotelCard";

export default async function PopularHotels({
  dict,
  hotelCardDict,
  lang,
  limit,
  viewAll = false,
}: {
  dict: { eyebrow?: string; title: string; subtitle: string; viewAll?: string };
  hotelCardDict: Dictionary["hotelCard"];
  lang: Locale;
  limit?: number;
  viewAll?: boolean;
}) {
  const all = await getHotels();
  const hotels = limit ? all.slice(0, limit) : all;

  return (
    <section aria-labelledby="popular-hotels-heading" className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          {dict.eyebrow && (
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              ★ {dict.eyebrow}
            </span>
          )}
          <h2
            id="popular-hotels-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {dict.title}
          </h2>
          <p className="mt-2 max-w-xl text-slate-600">{dict.subtitle}</p>
        </div>
        {viewAll && dict.viewAll && (
          <Link
            href={`/${lang}/hotels`}
            className="shrink-0 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            {dict.viewAll} →
          </Link>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} dict={hotelCardDict} lang={lang} />
        ))}
      </div>
    </section>
  );
}
