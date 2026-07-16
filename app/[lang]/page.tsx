import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/lib/dictionaries";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PopularHotels from "../components/PopularHotels";
import Destinations from "../components/Destinations";
import WhyUs from "../components/WhyUs";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <Header lang={lang} dict={dict.header} />
      <main>
        <Hero dict={dict.hero} />
        <PopularHotels dict={dict.popularHotels} hotelCardDict={dict.hotelCard} />
        <Destinations dict={dict.destinations} />
        <WhyUs dict={dict.whyUs} />
        <Testimonials dict={dict.testimonials} />
        <Newsletter dict={dict.newsletter} />
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
