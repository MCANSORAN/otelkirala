import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import {
  localeAlternates,
  breadcrumbJsonLd,
  destinationListJsonLd,
  faqJsonLd,
} from "@/utils/seo";
import { getDestinations } from "@/repositories/destination.repository";
import JsonLd from "@/components/JsonLd";
import ContentSection from "@/components/ContentSection";
import Header from "@/features/home/components/Header";
import Destinations from "@/features/home/components/Destinations";
import Faq from "@/features/home/components/Faq";
import Footer from "@/features/home/components/Footer";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: `${dict.destinations.pageTitle} | OtelKirala`,
    description: dict.destinations.pageIntro,
    alternates: localeAlternates(lang, "/destinations"),
  };
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const destinations = await getDestinations();

  const structuredData = [
    breadcrumbJsonLd([
      { name: "OtelKirala", path: `/${lang}` },
      { name: dict.destinations.pageTitle, path: `/${lang}/destinations` },
    ]),
    destinationListJsonLd(destinations, lang),
    faqJsonLd(dict.destinations.faq.items),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Header lang={lang} dict={dict.header} />
      <main>
        <section className="mx-auto max-w-3xl px-6 pb-4 pt-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {dict.destinations.pageTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            {dict.destinations.pageIntro}
          </p>
        </section>

        <Destinations
          dict={dict.destinations}
          lang={lang}
          destinations={destinations}
          showHeading={false}
        />

        <ContentSection
          title={dict.destinations.aboutTitle}
          paragraphs={dict.destinations.aboutBody}
        />
        <Faq dict={dict.destinations.faq} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
