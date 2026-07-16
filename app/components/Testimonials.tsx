import Image from "next/image";
import { getTestimonials } from "@/lib/testimonials";
import type { Dictionary } from "@/lib/dictionaries";

export default async function Testimonials({ dict }: { dict: Dictionary["testimonials"] }) {
  const testimonials = await getTestimonials();

  return (
    <section id="yorumlar" className="bg-neutral-50 py-20 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
          {dict.title}
        </h2>
        <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">{dict.subtitle}</p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900"
            >
              <div className="text-amber-400" aria-hidden>
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </div>
              <blockquote className="mt-3 flex-1 text-sm text-neutral-700 dark:text-neutral-300">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
