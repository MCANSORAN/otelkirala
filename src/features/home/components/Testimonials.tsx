import Image from "next/image";
import { getTestimonials } from "@/repositories/testimonial.repository";
import type { Dictionary } from "@/messages/dictionaries";

export default async function Testimonials({ dict }: { dict: Dictionary["testimonials"] }) {
  const testimonials = await getTestimonials();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {dict.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">{dict.subtitle}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => {
          // rating kesirli olabilir (ör. 4.8); yıldız sayısını 0-5 aralığına yuvarla.
          // Doğrudan repeat(t.rating) kullanmak kesirli değerlerde yıldızı kırpar ve
          // aralık dışı bir değerde repeat(negatif) RangeError fırlatır.
          const filledStars = Math.max(0, Math.min(5, Math.round(t.rating)));

          return (
          <figure
            key={t.id}
            className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-brand-600/5"
          >
            <div className="flex items-center gap-2 text-lg text-amber-400">
              <span aria-hidden>
                {"★".repeat(filledStars)}
                <span className="text-slate-200">{"★".repeat(5 - filledStars)}</span>
              </span>
              <span className="text-sm font-semibold text-slate-700">{t.rating}</span>
            </div>
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
              <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-brand-100">
                <Image src={t.avatar} alt={t.name} fill sizes="44px" className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.location}</p>
              </div>
            </figcaption>
          </figure>
          );
        })}
      </div>
    </section>
  );
}
