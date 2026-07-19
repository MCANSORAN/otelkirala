import Image from "next/image";
import Link from "next/link";
import { getDestinations } from "@/repositories/destination.repository";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";

export default async function Destinations({
  dict,
  lang,
}: {
  dict: Dictionary["destinations"];
  lang: Locale;
}) {
  const destinations = await getDestinations();

  return (
    <section className="bg-neutral-50 py-20 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
          {dict.title}
        </h2>
        <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">{dict.subtitle}</p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/${lang}/hotels`}
              className="group relative block h-56 overflow-hidden rounded-2xl"
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <p className="text-lg font-bold">{dest.name}</p>
                <p className="text-xs text-neutral-200">
                  {dest.hotelCount.toLocaleString("tr-TR")} {dict.hotelsSuffix}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
