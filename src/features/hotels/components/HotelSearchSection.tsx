import Link from "next/link";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";
import type { Hotel } from "@/types";
import HotelCard from "@/features/home/components/HotelCard";
import HotelSearchBar from "./HotelSearchBar";

export default function HotelSearchSection({
  hotels,
  query,
  preserved,
  dict,
  hotelCardDict,
  lang,
}: {
  hotels: Hotel[];
  query: string;
  preserved: Record<string, string>;
  dict: Dictionary["allHotels"];
  hotelCardDict: Dictionary["hotelCard"];
  lang: Locale;
}) {
  const hasQuery = query.trim().length > 0;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {dict.title}
          </h1>
          <p className="mt-2 max-w-xl text-slate-600">{dict.subtitle}</p>
        </div>

        <HotelSearchBar
          lang={lang}
          initialQuery={query}
          placeholder={dict.searchPlaceholder}
          actionLabel={dict.searchAction}
          preserved={preserved}
        />

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span>
            <span className="font-bold text-slate-900">{hotels.length}</span> {dict.resultsSuffix}
          </span>
          {hasQuery && (
            <Link
              href={`/${lang}/hotels`}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-700 transition-colors hover:bg-brand-100"
            >
              <span>&ldquo;{query}&rdquo;</span>
              <span aria-hidden="true">✕</span>
              <span className="sr-only">{dict.clearSearch}</span>
            </Link>
          )}
        </div>
      </div>

      {hotels.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} dict={hotelCardDict} lang={lang} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-slate-900">{dict.emptyTitle}</p>
          <p className="mx-auto mt-2 max-w-md text-slate-600">{dict.emptyText}</p>
          <Link
            href={`/${lang}/hotels`}
            className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {dict.clearSearch}
          </Link>
        </div>
      )}
    </section>
  );
}
