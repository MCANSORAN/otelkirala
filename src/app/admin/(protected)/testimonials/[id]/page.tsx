import { notFound } from "next/navigation";
import { getTestimonialById } from "@/repositories/testimonial.repository";
import { getHotels } from "@/repositories/hotel.repository";
import ErrorBanner from "@/components/ErrorBanner";
import TestimonialForm from "@/features/admin/components/TestimonialForm";
import { updateTestimonialAction } from "@/features/admin/actions";
import trDictionary from "@/messages/tr.json";

export default async function EditTestimonialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const testimonial = await getTestimonialById(id);

  if (!testimonial) {
    notFound();
  }

  const hotels = await getHotels();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{trDictionary.admin.testimonials.edit.title}</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{testimonial.name}</p>

      <div className="mt-6">
        <ErrorBanner message={error} />
        <TestimonialForm testimonial={testimonial} hotels={hotels} action={updateTestimonialAction.bind(null, id)} />
      </div>
    </div>
  );
}
