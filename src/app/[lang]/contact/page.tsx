import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import {
  localeAlternates,
  contactPageJsonLd,
  organizationJsonLd,
  faqJsonLd,
} from "@/utils/seo";
import JsonLd from "@/components/JsonLd";
import Header from "@/features/home/components/Header";
import Footer from "@/features/home/components/Footer";
import ContactSection from "@/features/contact/components/ContactSection";
import Faq from "@/features/home/components/Faq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.contactPage.metaTitle,
    alternates: localeAlternates(lang, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);

  const structuredData = [
    contactPageJsonLd(lang, {
      title: dict.contactPage.title,
      description: dict.contactPage.subtitle,
    }),
    organizationJsonLd(lang),
    faqJsonLd(dict.contactPage.faq.items),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Header lang={lang} dict={dict.header} />
      <main>
        <ContactSection dict={dict.contactPage} />
        <Faq dict={dict.contactPage.faq} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
