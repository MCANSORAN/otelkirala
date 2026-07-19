import { HALAL_FEATURE_KEYS } from "@/constants/hotel";
import trDictionary from "@/messages/tr.json";
import type { Hotel } from "@/types";
import Field, { inputClassName, labelClassName } from "@/components/Field";
import RoomsEditor from "./RoomsEditor";

const t = trDictionary.admin.hotels.form;

export default function HotelForm({
  hotel,
  action,
}: {
  hotel?: Hotel;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-4">
      <Field label={t.name} name="name" defaultValue={hotel?.name} required />
      <Field
        label={t.location}
        name="location"
        defaultValue={hotel?.location}
        placeholder={t.locationPlaceholder}
        required
      />

      <div className="grid grid-cols-3 gap-4">
        <Field
          label={t.price}
          name="price"
          type="number"
          min={0}
          step="0.01"
          defaultValue={hotel?.price}
          required
        />
        <Field
          label={t.rating}
          name="rating"
          type="number"
          min={0}
          max={5}
          step="0.1"
          defaultValue={hotel?.rating}
          required
        />
        <Field
          label={t.reviewCount}
          name="reviewCount"
          type="number"
          min={0}
          defaultValue={hotel?.reviewCount}
          required
        />
      </div>

      <Field
        label={t.image}
        name="image"
        type="url"
        defaultValue={hotel?.image}
        placeholder={t.imagePlaceholder}
        required
      />

      <Field
        label={t.tags}
        name="tags"
        defaultValue={hotel?.tags?.join(", ")}
        placeholder={t.tagsPlaceholder}
      />

      <div>
        <label htmlFor="description" className={labelClassName}>
          {t.description}
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={hotel?.description}
          placeholder={t.descriptionPlaceholder}
          className={inputClassName}
        />
      </div>

      <Field
        label={t.images}
        name="images"
        defaultValue={hotel?.images?.join(", ")}
        placeholder={t.imagesPlaceholder}
      />

      <div>
        <span className={labelClassName}>{t.halalTitle}</span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {HALAL_FEATURE_KEYS.map((key) => (
            <label
              key={key}
              className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700 dark:border-white/10 dark:text-neutral-300"
            >
              <input
                type="checkbox"
                name="halalFeatures"
                value={key}
                defaultChecked={hotel?.halalFeatures?.includes(key)}
                className="h-4 w-4 rounded border-black/20 text-gold-600 focus:ring-gold-500 dark:border-white/20"
              />
              {trDictionary.hotelDetail.halalFeatures[key]}
            </label>
          ))}
        </div>
      </div>

      <RoomsEditor rooms={hotel?.rooms} />

      <button
        type="submit"
        className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-brand-950 hover:bg-gold-600"
      >
        {hotel ? t.save : t.create}
      </button>
    </form>
  );
}
