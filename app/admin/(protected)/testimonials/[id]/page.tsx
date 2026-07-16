import { notFound } from "next/navigation";
import { getTestimonialById } from "@/lib/testimonials";
import ErrorBanner from "../../../components/ErrorBanner";
import TestimonialForm from "../TestimonialForm";
import { updateTestimonialAction } from "../../../actions";

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Yorumu Düzenle</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{testimonial.name}</p>

      <div className="mt-6">
        <ErrorBanner message={error} />
        <TestimonialForm testimonial={testimonial} action={updateTestimonialAction.bind(null, id)} />
      </div>
    </div>
  );
}
