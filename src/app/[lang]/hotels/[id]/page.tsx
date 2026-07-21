import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import { localeAlternates, hotelJsonLd, breadcrumbJsonLd } from "@/utils/seo";
import JsonLd from "@/components/JsonLd";
import { getHotelById } from "@/repositories/hotel.repository";
import { getTestimonialsByHotelId } from "@/repositories/testimonial.repository";
import { getCurrentUser } from "@/services/customerAuth.service";
import Header from "@/features/home/components/Header";
import Footer from "@/features/home/components/Footer";
import Gallery from "@/features/hotel-detail/components/Gallery";
import HalalFeatures from "@/features/hotel-detail/components/HalalFeatures";
import RoomsList from "@/features/hotel-detail/components/RoomsList";
import HotelReviews from "@/features/hotel-detail/components/HotelReviews";
import ReservationProvider from "@/features/hotel-detail/components/ReservationProvider";
import ReservationForm from "@/features/hotel-detail/components/ReservationForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};

  const hotel = await getHotelById(id);
  if (!hotel) return {};

  const title = `${hotel.name} | OtelKirala`;
  const description = hotel.description || undefined;

  return {
    title,
    description,
    alternates: localeAlternates(lang, `/hotels/${id}`),
    openGraph: {
      type: "website",
      siteName: "OtelKirala",
      title,
      description,
      locale: lang === "tr" ? "tr_TR" : "en_US",
      images: [{ url: hotel.image, alt: hotel.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [hotel.image],
    },
  };
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();

  const hotel = await getHotelById(id);
  if (!hotel) notFound();

  const dict = getDictionary(lang);
  const reviews = await getTestimonialsByHotelId(id);
  const galleryImages = [hotel.image, ...hotel.images];
  const user = await getCurrentUser();

  const amenities = hotel.halalFeatures.map((key) => dict.hotelDetail.halalFeatures[key]);
  const structuredData = [
    hotelJsonLd(hotel, { lang, amenities }),
    breadcrumbJsonLd([
      { name: "OtelKirala", path: `/${lang}` },
      { name: dict.header.nav.hotels, path: `/${lang}/hotels` },
      { name: hotel.name, path: `/${lang}/hotels/${id}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Header lang={lang} dict={dict.header} user={user} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link href={`/${lang}/hotels`} className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400">
          ← {dict.hotelDetail.backToList}
        </Link>

        <div className="mt-4">
          <Gallery images={galleryImages} alt={hotel.name} />
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{hotel.name}</h1>
            <p className="mt-1 text-neutral-500 dark:text-neutral-400">📍 {hotel.location}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {hotel.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white">
            ★ {hotel.rating} · {hotel.reviewCount} {dict.hotelCard.reviews}
          </div>
        </div>

        <ReservationProvider>
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-10">
              {hotel.description && (
                <section>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{dict.hotelDetail.aboutTitle}</h2>
                  <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-300">{hotel.description}</p>
                </section>
              )}

              <HalalFeatures features={hotel.halalFeatures} dict={dict.hotelDetail} />
              <RoomsList rooms={hotel.rooms} dict={dict.hotelDetail} />
              <HotelReviews reviews={reviews} dict={dict.hotelDetail} />
            </div>

            <aside>
              <ReservationForm
                lang={lang}
                hotelId={hotel.id}
                hotelName={hotel.name}
                price={hotel.price}
                rooms={hotel.rooms}
                dict={dict.hotelDetail}
              />
            </aside>
          </div>
        </ReservationProvider>
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
