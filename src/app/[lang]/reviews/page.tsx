import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import { localeAlternates, organizationJsonLd } from "@/utils/seo";
import { getTestimonials } from "@/repositories/testimonial.repository";
import JsonLd from "@/components/JsonLd";
import Header from "@/features/home/components/Header";
import Testimonials from "@/features/home/components/Testimonials";
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
    title: `${dict.testimonials.title} | OtelKirala`,
    alternates: localeAlternates(lang, "/reviews"),
  };
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const testimonials = await getTestimonials();

  return (
    <>
      <JsonLd data={organizationJsonLd(lang, testimonials)} />
      <Header lang={lang} dict={dict.header} />
      <main>
        <Testimonials dict={dict.testimonials} testimonials={testimonials} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
