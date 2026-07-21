import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";
import type { Destination } from "@/types";

// Bölge kartları ızgarası. Veriyi çağıran sayfa yükler (böylece aynı liste
// yapılandırılmış veride de kullanılabilir). `showHeading=false` verildiğinde
// başlık gizlenir; adanmış Bölgeler sayfası kendi <h1> başlığını sağladığından
// başlık tekrarını önler.
export default function Destinations({
  dict,
  lang,
  destinations,
  showHeading = true,
}: {
  dict: Dictionary["destinations"];
  lang: Locale;
  destinations: Destination[];
  showHeading?: boolean;
}) {
  return (
    <section className="bg-brand-50/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {showHeading && (
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {dict.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">{dict.subtitle}</p>
          </div>
        )}

        <div
          className={`grid grid-cols-2 gap-4 sm:grid-cols-4${showHeading ? " mt-12" : ""}`}
        >
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/${lang}/hotels?q=${encodeURIComponent(dest.name)}`}
              className="group relative block h-60 overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5"
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/15 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <p className="text-lg font-bold">{dest.name}</p>
                <p className="text-xs text-brand-100">
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
