// schema.org yapılandırılmış verisini (JSON-LD) <script type="application/ld+json">
// olarak basar. Next.js JSON-LD kılavuzunun önerdiği gibi, XSS'i önlemek için
// "<" karakteri unicode karşılığı ile değiştirilir. `data` tek bir şema nesnesi
// ya da birden fazla şemayı içeren bir dizi olabilir.
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
