import { getHotels } from "@/repositories/hotel.repository";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";
import HotelCard from "./HotelCard";

export default async function PopularHotels({
  dict,
  hotelCardDict,
  lang,
}: {
  dict: Dictionary["popularHotels"];
  hotelCardDict: Dictionary["hotelCard"];
  lang: Locale;
}) {
  const hotels = await getHotels();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
          {dict.title}
        </h2>
        <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">{dict.subtitle}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} dict={hotelCardDict} lang={lang} />
        ))}
      </div>
    </section>
  );
}
