import type { Dictionary } from "@/lib/dictionaries";

export default function Newsletter({ dict }: { dict: Dictionary["newsletter"] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-sky-600 px-6 py-14 text-center text-white sm:px-16">
        <h2 className="text-2xl font-bold sm:text-3xl">{dict.title}</h2>
        <p className="max-w-lg text-sm text-sky-50 sm:text-base">{dict.subtitle}</p>
        <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder={dict.placeholder}
            className="w-full rounded-full px-5 py-3 text-sm text-neutral-900 outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            {dict.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
