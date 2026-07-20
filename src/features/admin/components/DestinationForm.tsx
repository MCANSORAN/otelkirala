import type { Destination } from "@/types";
import Field from "@/components/Field";
import trDictionary from "@/messages/tr.json";

const t = trDictionary.admin.destinations.form;

export default function DestinationForm({
  destination,
  action,
}: {
  destination?: Destination;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <Field label={t.name} name="name" defaultValue={destination?.name} required placeholder={t.namePlaceholder} />
      <Field
        label={t.hotelCount}
        name="hotelCount"
        type="number"
        min={0}
        defaultValue={destination?.hotelCount}
        required
      />
      <Field
        label={t.image}
        name="image"
        type="url"
        defaultValue={destination?.image}
        required
        placeholder={t.imagePlaceholder}
      />

      <button
        type="submit"
        className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {destination ? t.save : t.create}
      </button>
    </form>
  );
}
