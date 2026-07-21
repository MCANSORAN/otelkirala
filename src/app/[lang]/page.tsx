import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import { localeAlternates, websiteJsonLd, organizationJsonLd, faqJsonLd } from "@/utils/seo";
import { getCurrentUser } from "@/services/customerAuth.service";
import { getDestinations } from "@/repositories/destination.repository";
import JsonLd from "@/components/JsonLd";
import Header from "@/features/home/components/Header";
import Hero from "@/features/home/components/Hero";
import PopularHotels from "@/features/home/components/PopularHotels";
import Destinations from "@/features/home/components/Destinations";
import WhyUs from "@/features/home/components/WhyUs";
import Testimonials from "@/features/home/components/Testimonials";
import Faq from "@/features/home/components/Faq";
import Newsletter from "@/features/home/components/Newsletter";
import Footer from "@/features/home/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { alternates: localeAlternates(lang, "") };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const user = await getCurrentUser();
  const destinations = await getDestinations();

  const structuredData = [
    websiteJsonLd(lang, dict.meta.description),
    organizationJsonLd(lang),
    faqJsonLd(dict.faq.items),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Header lang={lang} dict={dict.header} user={user} />
      <main>
        <Hero dict={dict.hero} lang={lang} />
        <PopularHotels
          dict={dict.popularHotels}
          hotelCardDict={dict.hotelCard}
          lang={lang}
          limit={6}
          viewAll
        />
        <Destinations dict={dict.destinations} lang={lang} destinations={destinations} />
        <WhyUs dict={dict.whyUs} />
        <Testimonials dict={dict.testimonials} />
        <Faq dict={dict.faq} />
        <Newsletter dict={dict.newsletter} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
