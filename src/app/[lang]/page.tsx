import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import { getCurrentUser } from "@/services/customerAuth.service";
import Header from "@/features/home/components/Header";
import Hero from "@/features/home/components/Hero";
import WhyUs from "@/features/home/components/WhyUs";
import Newsletter from "@/features/home/components/Newsletter";
import Footer from "@/features/home/components/Footer";

export default async function Home({
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
        <Hero dict={dict.hero} />
        <WhyUs dict={dict.whyUs} />
        <Newsletter dict={dict.newsletter} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
