import Image from "next/image";
import type { Dictionary } from "@/messages/dictionaries";
import type { Testimonial } from "@/types";

export default function HotelReviews({
  reviews,
  dict,
}: {
  reviews: Testimonial[];
  dict: Dictionary["hotelDetail"];
}) {
  return (
    <section>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{dict.reviewsTitle}</h2>

      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">{dict.noReviews}</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-gold-100 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image src={review.avatar} alt={review.name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{review.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{review.location}</p>
                </div>
                <span className="ml-auto text-sm font-semibold text-amber-400">★ {review.rating}</span>
              </div>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{review.quote}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
