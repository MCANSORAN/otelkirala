import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import { getHotelById } from "@/repositories/hotel.repository";
import { getTestimonialsByHotelId } from "@/repositories/testimonial.repository";
import { getCurrentUser } from "@/services/customerAuth.service";
import Header from "@/features/home/components/Header";
import Footer from "@/features/home/components/Footer";
import Gallery from "@/features/hotel-detail/components/Gallery";
import HalalFeatures from "@/features/hotel-detail/components/HalalFeatures";
import RoomsList from "@/features/hotel-detail/components/RoomsList";
import HotelReviews from "@/features/hotel-detail/components/HotelReviews";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};

  const hotel = await getHotelById(id);
  if (!hotel) return {};

  return { title: `${hotel.name} | OtelKirala`, description: hotel.description || undefined };
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

  return (
    <>
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
            <div className="sticky top-24 rounded-2xl border border-gold-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{dict.hotelDetail.startingFrom}</p>
              <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-white">
                ₺{hotel.price.toLocaleString("tr-TR")}
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                {dict.hotelDetail.bookNow}
              </button>
            </div>
          </aside>
        </div>
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
