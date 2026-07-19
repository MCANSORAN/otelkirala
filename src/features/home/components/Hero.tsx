import Image from "next/image";
import type { Dictionary } from "@/messages/dictionaries";
import HotelSearchForm from "./HotelSearchForm";

export default function Hero({ dict }: { dict: Dictionary["hero"] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80&auto=format&fit=crop"
          alt={dict.imageAlt}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/85 via-brand-950/55 to-cream dark:to-neutral-950" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 pb-28 text-center text-white sm:pt-28">
        <span className="rounded-full border border-gold-400/40 bg-black/20 px-4 py-1 text-sm font-medium text-gold-100 backdrop-blur-sm">
          {dict.badge}
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          {dict.titleBefore} <span className="text-gold-400">{dict.titleHighlight}</span> {dict.titleAfter}
        </h1>
        <p className="mt-4 max-w-xl text-base text-neutral-100 sm:text-lg">{dict.subtitle}</p>

        <HotelSearchForm dict={dict.form} />

        <div className="mt-10 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-gold-400 sm:text-3xl">10K+</p>
            <p className="text-xs text-neutral-200 sm:text-sm">{dict.stats.hotels}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-400 sm:text-3xl">500K+</p>
            <p className="text-xs text-neutral-200 sm:text-sm">{dict.stats.guests}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-400 sm:text-3xl">4.8/5</p>
            <p className="text-xs text-neutral-200 sm:text-sm">{dict.stats.rating}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
