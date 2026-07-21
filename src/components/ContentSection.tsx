// Sayfalara arama motorları ve LLM'lerin okuyabileceği açıklayıcı metin ve bir
// h2 başlığı ekleyen, yeniden kullanılabilir içerik bölümü. Başlık hiyerarşisini
// (h1 → h2) güçlendirir ve içerik derinliğini artırır. Oteller ve Bölgeler
// sayfalarında ortak kullanılır.
export default function ContentSection({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-4 pt-12">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-slate-600">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
