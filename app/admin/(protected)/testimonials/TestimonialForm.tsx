import type { Testimonial } from "@/lib/types";

export default function TestimonialForm({
  testimonial,
  action,
}: {
  testimonial?: Testimonial;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Ad Soyad
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={testimonial?.name}
            required
            className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Şehir
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={testimonial?.location}
            required
            className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Avatar URL
        </label>
        <input
          id="avatar"
          name="avatar"
          type="url"
          defaultValue={testimonial?.avatar}
          required
          placeholder="https://i.pravatar.cc/150?img=1"
          className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="quote" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Yorum Metni
        </label>
        <textarea
          id="quote"
          name="quote"
          rows={4}
          defaultValue={testimonial?.quote}
          required
          className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Puan (1-5)
        </label>
        <input
          id="rating"
          name="rating"
          type="number"
          min={1}
          max={5}
          defaultValue={testimonial?.rating}
          required
          className="mt-1 w-32 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700"
      >
        {testimonial ? "Değişiklikleri Kaydet" : "Yorum Ekle"}
      </button>
    </form>
  );
}
