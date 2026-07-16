import type { Hotel } from "@/lib/types";

export default function HotelForm({
  hotel,
  action,
}: {
  hotel?: Hotel;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <Field label="Otel Adı" name="name" defaultValue={hotel?.name} required />
      <Field
        label="Konum"
        name="location"
        defaultValue={hotel?.location}
        placeholder="Bodrum, Muğla"
        required
      />

      <div className="grid grid-cols-3 gap-4">
        <Field
          label="Gecelik Fiyat (₺)"
          name="price"
          type="number"
          min={0}
          step="0.01"
          defaultValue={hotel?.price}
          required
        />
        <Field
          label="Puan (0-5)"
          name="rating"
          type="number"
          min={0}
          max={5}
          step="0.1"
          defaultValue={hotel?.rating}
          required
        />
        <Field
          label="Değerlendirme Sayısı"
          name="reviewCount"
          type="number"
          min={0}
          defaultValue={hotel?.reviewCount}
          required
        />
      </div>

      <Field
        label="Görsel URL"
        name="image"
        type="url"
        defaultValue={hotel?.image}
        placeholder="https://images.unsplash.com/..."
        required
      />

      <Field
        label="Etiketler (virgülle ayırın)"
        name="tags"
        defaultValue={hotel?.tags?.join(", ")}
        placeholder="Her Şey Dahil, Özel Plaj"
      />

      <button
        type="submit"
        className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700"
      >
        {hotel ? "Değişiklikleri Kaydet" : "Otel Ekle"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
  min,
  max,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string | number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
      />
    </div>
  );
}
