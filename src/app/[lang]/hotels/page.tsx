import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import { localeAlternates, breadcrumbJsonLd, itemListJsonLd, faqJsonLd } from "@/utils/seo";
import { getCurrentUser } from "@/services/customerAuth.service";
import { getHotels } from "@/repositories/hotel.repository";
import { searchHotels } from "@/features/hotels/searchHotels";
import JsonLd from "@/components/JsonLd";
import ContentSection from "@/components/ContentSection";
import Header from "@/features/home/components/Header";
import HotelSearchSection from "@/features/hotels/components/HotelSearchSection";
import Faq from "@/features/home/components/Faq";
import Footer from "@/features/home/components/Footer";

const PRESERVED_KEYS = ["checkin", "checkout", "adults", "children"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: `${dict.allHotels.title} | OtelKirala`,
    alternates: localeAlternates(lang, "/hotels"),
  };
}

export default async function HotelsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const user = await getCurrentUser();

  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const preserved: Record<string, string> = {};
  for (const key of PRESERVED_KEYS) {
    const value = resolvedParams[key];
    if (typeof value === "string" && value) preserved[key] = value;
  }

  const allHotels = await getHotels();
  const hotels = searchHotels(allHotels, query);

  const structuredData = [
    breadcrumbJsonLd([
      { name: "OtelKirala", path: `/${lang}` },
      { name: dict.allHotels.title, path: `/${lang}/hotels` },
    ]),
    itemListJsonLd(hotels, lang),
    faqJsonLd(dict.allHotels.faq.items),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Header lang={lang} dict={dict.header} user={user} />
      <main>
        <HotelSearchSection
          hotels={hotels}
          query={query}
          preserved={preserved}
          dict={dict.allHotels}
          hotelCardDict={dict.hotelCard}
          lang={lang}
        />
        <ContentSection
          title={dict.allHotels.aboutTitle}
          paragraphs={dict.allHotels.aboutBody}
        />
        <Faq dict={dict.allHotels.faq} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
