import type { Dictionary } from "@/messages/dictionaries";

export default function WhyUs({ dict }: { dict: Dictionary["whyUs"] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {dict.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">{dict.subtitle}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dict.features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/5"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl transition-colors group-hover:bg-brand-100">
              {feature.icon}
            </div>
            <h3 className="mt-5 font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
