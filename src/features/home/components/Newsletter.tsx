import type { Dictionary } from "@/messages/dictionaries";

export default function Newsletter({ dict }: { dict: Dictionary["newsletter"] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-brand-900 to-brand-950 px-6 py-14 text-center text-white sm:px-16">
        <h2 className="text-2xl font-bold sm:text-3xl">{dict.title}</h2>
        <p className="max-w-lg text-sm text-brand-50/80 sm:text-base">{dict.subtitle}</p>
        <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder={dict.placeholder}
            className="w-full rounded-full bg-white px-5 py-3 text-sm text-neutral-900 outline-none ring-2 ring-transparent focus:ring-gold-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-gold-500 px-7 py-3 text-sm font-bold text-brand-950 shadow-lg shadow-gold-950/20 transition-all hover:scale-105 hover:bg-gold-400"
          >
            {dict.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
