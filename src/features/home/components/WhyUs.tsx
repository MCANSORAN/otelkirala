import type { Dictionary } from "@/messages/dictionaries";

export default function WhyUs({ dict }: { dict: Dictionary["whyUs"] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
        {dict.title}
      </h2>
      <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">{dict.subtitle}</p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dict.features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl dark:bg-brand-950">
              {feature.icon}
            </div>
            <h3 className="mt-4 font-semibold text-neutral-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
