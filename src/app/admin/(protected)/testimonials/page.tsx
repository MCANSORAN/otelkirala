import Link from "next/link";
import Image from "next/image";
import { getTestimonialsOrThrow } from "@/repositories/testimonial.repository";
import { deleteTestimonialAction } from "@/features/admin/actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import ErrorBanner from "@/components/ErrorBanner";
import DbConnectionError from "@/components/DbConnectionError";
import trDictionary from "@/messages/tr.json";

const dict = trDictionary.admin.testimonials.list;

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  let testimonials: Awaited<ReturnType<typeof getTestimonialsOrThrow>> | null = null;
  try {
    testimonials = await getTestimonialsOrThrow();
  } catch {
    testimonials = null;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{dict.title}</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{dict.subtitle}</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {dict.add}
        </Link>
      </div>

      <div className="mt-6">
        <ErrorBanner message={error} />
      </div>

      {testimonials === null ? (
        <DbConnectionError />
      ) : testimonials.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">{dict.empty}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.location}</p>
                </div>
              </div>
              <p className="mt-3 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-2 text-amber-400">{"★".repeat(t.rating)}</p>
              <div className="mt-3 flex gap-3">
                <Link
                  href={`/admin/testimonials/${t.id}`}
                  className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
                >
                  {trDictionary.admin.edit}
                </Link>
                <form action={deleteTestimonialAction}>
                  <input type="hidden" name="id" value={t.id} />
                  <ConfirmSubmitButton
                    confirmMessage={dict.deleteConfirm.replace("{name}", t.name)}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    {trDictionary.admin.delete}
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
