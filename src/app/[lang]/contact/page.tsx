import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import { getCurrentUser } from "@/services/customerAuth.service";
import Header from "@/features/home/components/Header";
import Footer from "@/features/home/components/Footer";
import ContactSection from "@/features/contact/components/ContactSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: `${dict.contactPage.title} | OtelKirala` };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const user = await getCurrentUser();

  return (
    <>
      <Header lang={lang} dict={dict.header} user={user} />
      <main>
        <ContactSection dict={dict.contactPage} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
