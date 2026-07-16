import type { Destination } from "@/lib/types";

export default function DestinationForm({
  destination,
  action,
}: {
  destination?: Destination;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Bölge Adı
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={destination?.name}
          required
          placeholder="Antalya"
          className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="hotelCount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Otel Sayısı
        </label>
        <input
          id="hotelCount"
          name="hotelCount"
          type="number"
          min={0}
          defaultValue={destination?.hotelCount}
          required
          className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Görsel URL
        </label>
        <input
          id="image"
          name="image"
          type="url"
          defaultValue={destination?.image}
          required
          placeholder="https://images.unsplash.com/..."
          className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700"
      >
        {destination ? "Değişiklikleri Kaydet" : "Bölge Ekle"}
      </button>
    </form>
  );
}
