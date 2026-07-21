import type { Dictionary } from "@/messages/dictionaries";

export default function Newsletter({ dict }: { dict: Dictionary["newsletter"] }) {
  return (
    <section aria-labelledby="newsletter-heading" className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-brand-600 px-6 py-14 text-center text-white sm:px-16">
        {/* Ferah his için hafif ışık lekeleri */}
        <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-gold-400/20 blur-3xl" />
        <h2 id="newsletter-heading" className="relative text-2xl font-bold sm:text-3xl">
          {dict.title}
        </h2>
        <p className="relative max-w-lg text-sm text-brand-50/90 sm:text-base">{dict.subtitle}</p>
        <form className="relative flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder={dict.placeholder}
            className="w-full rounded-full bg-white px-5 py-3 text-sm text-slate-900 outline-none ring-2 ring-transparent focus:ring-white/60"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-700 shadow-lg transition-all hover:scale-105 hover:bg-brand-50"
          >
            {dict.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
