import ErrorBanner from "@/components/ErrorBanner";
import TestimonialForm from "@/features/admin/components/TestimonialForm";
import { createTestimonialAction } from "@/features/admin/actions";
import { getHotels } from "@/repositories/hotel.repository";
import trDictionary from "@/messages/tr.json";

const t = trDictionary.admin.testimonials.new;

export default async function NewTestimonialPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const hotels = await getHotels();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{t.title}</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t.subtitle}</p>

      <div className="mt-6">
        <ErrorBanner message={error} />
        <TestimonialForm hotels={hotels} action={createTestimonialAction} />
      </div>
    </div>
  );
}
