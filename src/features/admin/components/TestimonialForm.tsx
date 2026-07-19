import type { Hotel, Testimonial } from "@/types";
import Field, { inputClassName, labelClassName } from "@/components/Field";
import trDictionary from "@/messages/tr.json";

const t = trDictionary.admin.testimonials.form;

export default function TestimonialForm({
  testimonial,
  hotels,
  action,
}: {
  testimonial?: Testimonial;
  hotels: Hotel[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="hotelId" className={labelClassName}>
          {t.hotel}
        </label>
        <select
          id="hotelId"
          name="hotelId"
          defaultValue={testimonial?.hotelId ?? ""}
          className={inputClassName}
        >
          <option value="">{t.hotelNone}</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label={t.name} name="name" defaultValue={testimonial?.name} required />
        <Field label={t.location} name="location" defaultValue={testimonial?.location} required />
      </div>

      <Field
        label={t.avatar}
        name="avatar"
        type="url"
        defaultValue={testimonial?.avatar}
        required
        placeholder={t.avatarPlaceholder}
      />

      <div>
        <label htmlFor="quote" className={labelClassName}>
          {t.quote}
        </label>
        <textarea
          id="quote"
          name="quote"
          rows={4}
          defaultValue={testimonial?.quote}
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="rating" className={labelClassName}>
          {t.rating}
        </label>
        <input
          id="rating"
          name="rating"
          type="number"
          min={1}
          max={5}
          defaultValue={testimonial?.rating}
          required
          className={inputClassName.replace("w-full", "w-32")}
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-brand-950 hover:bg-gold-600"
      >
        {testimonial ? t.save : t.create}
      </button>
    </form>
  );
}
