import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/constants/locales";
import type { Hotel, Destination, Testimonial } from "@/types";

// Yapılandırılmış veride (JSON-LD) kullanılan mutlak URL ve marka sabitleri.
// Root layout'taki metadataBase ile aynı ortam değişkenini kullanır.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "OtelKirala";
export const SITE_EMAIL = "destek@otelkirala.com";
export const SITE_PHONE = "+908500000000";

function localeTag(lang: Locale): string {
  return lang === "tr" ? "tr-TR" : "en-US";
}

// Verilen dilsiz yol (ör. "" ana sayfa, "/hotels/5" otel detayı) için
// kendine referans veren canonical URL'i ve tüm diller için hreflang
// alternatiflerini üretir. Root layout'taki metadataBase sayesinde göreli
// yollar mutlak URL'e çözülür, böylece arama motorları yinelenen içerik
// yerine tek bir kanonik sürüm görür.
export function localeAlternates(
  lang: Locale,
  path = ""
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `/${locale}${path}`;
  }
  languages["x-default"] = `/${defaultLocale}${path}`;

  return {
    canonical: `/${lang}${path}`,
    languages,
  };
}

// Ana sayfa için WebSite şeması + site içi arama kutusu (SearchAction). Arama
// motorlarının sonuç sayfasında OtelKirala için bir arama kutusu göstermesini
// mümkün kılar; sorgu doğrudan otel arama sayfasına yönlenir.
export function websiteJsonLd(lang: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/${lang}`,
    description,
    inLanguage: localeTag(lang),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/${lang}/hotels?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Markayı tanımlayan Organization şeması: arama motorları ve LLM'lerin
// işletmeyi, iletişim bilgilerini ve logoyu tanımasını sağlar. Misafir
// yorumları verildiğinde aynı düğüme aggregateRating (ortalama puan) ve
// review (tek tek yorumlar) alanları eklenir; böylece yorumlar ayrı bir
// Organization düğümü oluşturmak yerine markayla ilişkilendirilir.
export function organizationJsonLd(lang: Locale, testimonials: Testimonial[] = []) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/${lang}`,
    logo: `${SITE_URL}/icon`,
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE_EMAIL,
      telephone: SITE_PHONE,
      contactType: "customer support",
      areaServed: "TR",
      availableLanguage: ["Turkish", "English"],
    },
  };

  // Yalnızca geçerli (0'dan büyük) puanlı yorumları dahil et; 0 puanlı bir
  // kayıt ortalamayı bozar ve reviewRating aralığının dışına düşer.
  const rated = testimonials.filter((t) => t.rating > 0);
  if (rated.length) {
    const average = rated.reduce((sum, t) => sum + t.rating, 0) / rated.length;
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.round(average * 10) / 10,
      reviewCount: rated.length,
      bestRating: 5,
      worstRating: 1,
    };
    data.review = rated.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: t.quote,
    }));
  }

  return data;
}

// Otel detay sayfası için Hotel (LodgingBusiness) şeması: ad, açıklama,
// görseller, konum, misafir puanı, fiyat aralığı ve helal konsept olanaklarını
// yapılandırılmış biçimde tanımlar.
export function hotelJsonLd(
  hotel: Hotel,
  { lang, amenities }: { lang: Locale; amenities: string[] }
) {
  const prices = hotel.rooms.map((room) => room.price).filter((price) => price > 0);
  const minPrice = prices.length ? Math.min(...prices) : hotel.price;
  const maxPrice = prices.length ? Math.max(...prices) : hotel.price;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    url: `${SITE_URL}/${lang}/hotels/${hotel.id}`,
    image: [hotel.image, ...hotel.images],
    address: {
      "@type": "PostalAddress",
      addressLocality: hotel.location,
      addressCountry: "TR",
    },
    priceRange: `₺${minPrice.toLocaleString("tr-TR")} - ₺${maxPrice.toLocaleString("tr-TR")}`,
  };

  if (hotel.description) data.description = hotel.description;

  if (hotel.reviewCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: hotel.rating,
      reviewCount: hotel.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (amenities.length) {
    data.amenityFeature = amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    }));
  }

  return data;
}

// Kırıntı navigasyonu (BreadcrumbList): arama motorlarının sayfa hiyerarşisini
// anlamasını sağlar. Yollar SITE_URL ile mutlak URL'e çevrilir.
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

// Oteller listeleme sayfası için ItemList şeması: sayfada gösterilen otelleri
// sıralı bir liste olarak tanımlar; arama motorları ve LLM'lerin bunun bir otel
// listesi olduğunu ve her otelin bağlantısını anlamasını sağlar.
export function itemListJsonLd(hotels: Hotel[], lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: hotels.length,
    itemListElement: hotels.map((hotel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/${lang}/hotels/${hotel.id}`,
      name: hotel.name,
    })),
  };
}

// Bölgeler sayfası için ItemList şeması: her tatil bölgesini, o bölgenin
// otellerini listeleyen arama URL'ine bağlanan sıralı bir öğe olarak tanımlar.
export function destinationListJsonLd(destinations: Destination[], lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: destinations.length,
    itemListElement: destinations.map((destination, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: destination.name,
      url: `${SITE_URL}/${lang}/hotels?q=${encodeURIComponent(destination.name)}`,
    })),
  };
}

// Genel amaçlı WebPage şeması: bir sayfanın türünü, başlığını, açıklamasını ve
// ait olduğu web sitesini tanımlar. FAQPage/ContactPage gibi özel bir tür
// gerektirmeyen sayfalarda (ör. giriş, kayıt) sayfayı arama motorları ve
// LLM'ler için bağlama oturtur.
export function webPageJsonLd(
  lang: Locale,
  { title, description, path }: { title: string; description: string; path: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/${lang}${path}`,
    inLanguage: localeTag(lang),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/${lang}`,
    },
  };
}

// İletişim sayfası için ContactPage şeması: sayfanın türünü (iletişim sayfası),
// başlığını, açıklamasını ve ait olduğu web sitesini tanımlar. İletişim
// kanalları (e-posta, telefon) Organization şemasındaki contactPoint alanında
// yer aldığından bu sayfada iki şema birlikte yayınlanır.
export function contactPageJsonLd(
  lang: Locale,
  { title, description }: { title: string; description: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: title,
    description,
    url: `${SITE_URL}/${lang}/contact`,
    inLanguage: localeTag(lang),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/${lang}`,
    },
  };
}

// SSS bölümü için FAQPage şeması: soru/cevapları LLM ve arama motorlarının
// doğrudan yanıt olarak kullanabileceği biçimde tanımlar.
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
