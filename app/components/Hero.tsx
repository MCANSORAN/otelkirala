import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";

export default function Hero({ dict }: { dict: Dictionary["hero"] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80&auto=format&fit=crop"
          alt="Plaj kenarında otel"
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-white dark:to-neutral-950" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 pb-28 text-center text-white sm:pt-28">
        <span className="rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur-sm">
          {dict.badge}
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          {dict.titleBefore} <span className="text-sky-300">{dict.titleHighlight}</span> {dict.titleAfter}
        </h1>
        <p className="mt-4 max-w-xl text-base text-neutral-100 sm:text-lg">{dict.subtitle}</p>

        <form className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-3 rounded-2xl bg-white p-4 text-left shadow-xl sm:grid-cols-2 lg:grid-cols-5 lg:gap-2 dark:bg-neutral-900">
          <label className="flex flex-col gap-1 px-2 py-1 lg:col-span-2">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {dict.form.destinationLabel}
            </span>
            <input
              type="text"
              placeholder={dict.form.destinationPlaceholder}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </label>

          <label className="flex flex-col gap-1 px-2 py-1">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {dict.form.checkinLabel}
            </span>
            <input
              type="date"
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </label>

          <label className="flex flex-col gap-1 px-2 py-1">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {dict.form.checkoutLabel}
            </span>
            <input
              type="date"
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </label>

          <label className="flex flex-col gap-1 px-2 py-1">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {dict.form.guestsLabel}
            </span>
            <select className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
              {dict.form.guestsOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="col-span-full mt-1 rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 lg:col-span-5"
          >
            {dict.form.submit}
          </button>
        </form>

        <div className="mt-10 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold sm:text-3xl">10K+</p>
            <p className="text-xs text-neutral-200 sm:text-sm">{dict.stats.hotels}</p>
          </div>
          <div>
            <p className="text-2xl font-bold sm:text-3xl">500K+</p>
            <p className="text-xs text-neutral-200 sm:text-sm">{dict.stats.guests}</p>
          </div>
          <div>
            <p className="text-2xl font-bold sm:text-3xl">4.8/5</p>
            <p className="text-xs text-neutral-200 sm:text-sm">{dict.stats.rating}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
