import { getHotels } from "@/lib/hotels";
import type { Dictionary } from "@/lib/dictionaries";
import HotelCard from "./HotelCard";

export default async function PopularHotels({
  dict,
  hotelCardDict,
}: {
  dict: Dictionary["popularHotels"];
  hotelCardDict: Dictionary["hotelCard"];
}) {
  const hotels = await getHotels();

  return (
    <section id="oteller" className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            {dict.title}
          </h2>
          <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">{dict.subtitle}</p>
        </div>
        <a
          href="#"
          className="text-sm font-semibold text-sky-700 hover:underline dark:text-sky-400"
        >
          {dict.viewAll}
        </a>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} dict={hotelCardDict} />
        ))}
      </div>
    </section>
  );
}
