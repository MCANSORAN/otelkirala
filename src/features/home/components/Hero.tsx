import Image from "next/image";
import type { Dictionary } from "@/messages/dictionaries";
import HotelSearchForm from "./HotelSearchForm";

export default function Hero({ dict }: { dict: Dictionary["hero"] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-brand-950">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&auto=format&fit=crop"
          alt={dict.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Ferah, mavi tonlu ve hafif katman: fotoğraf görünür kalırken metin okunur olur. */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/85 via-brand-900/55 to-brand-700/35" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 pb-36 text-center text-white sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-gold-400" />
          {dict.badge}
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight drop-shadow-sm sm:text-5xl md:text-6xl">
          {dict.titleBefore}{" "}
          <span className="bg-gradient-to-r from-gold-300 to-gold-400 bg-clip-text text-transparent">
            {dict.titleHighlight}
          </span>{" "}
          {dict.titleAfter}
        </h1>
        <p className="mt-4 max-w-xl text-base text-brand-50/90 sm:text-lg">{dict.subtitle}</p>

        <HotelSearchForm dict={dict.form} />

        <div className="mt-12 grid grid-cols-3 gap-8 text-center sm:gap-14">
          <div>
            <p className="text-2xl font-extrabold text-white sm:text-4xl">10K+</p>
            <p className="mt-1 text-xs text-brand-100/80 sm:text-sm">{dict.stats.hotels}</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white sm:text-4xl">500K+</p>
            <p className="mt-1 text-xs text-brand-100/80 sm:text-sm">{dict.stats.guests}</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white sm:text-4xl">4.8/5</p>
            <p className="mt-1 text-xs text-brand-100/80 sm:text-sm">{dict.stats.rating}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
