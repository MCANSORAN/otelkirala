import type { Dictionary } from "@/messages/dictionaries";

// Ana sayfadaki Sıkça Sorulan Sorular bölümü. Native <details>/<summary> ile
// akordeon davranışı sağlar; tüm soru ve cevap metni DOM'da her zaman mevcut
// olduğundan arama motorları ve LLM'ler içeriği okuyabilir. Aynı içerik
// page.tsx'te FAQPage yapılandırılmış verisi olarak da yayınlanır.
export default function Faq({ dict }: { dict: Dictionary["faq"] }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {dict.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">{dict.subtitle}</p>
      </div>

      <div className="mt-12 space-y-4">
        {dict.items.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-colors open:border-brand-200"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
              {item.question}
              <span
                aria-hidden
                className="shrink-0 text-2xl leading-none text-brand-600 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
