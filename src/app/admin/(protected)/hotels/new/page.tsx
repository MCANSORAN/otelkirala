import ErrorBanner from "@/components/ErrorBanner";
import HotelForm from "@/features/admin/components/HotelForm";
import { createHotelAction } from "@/features/admin/actions";
import trDictionary from "@/messages/tr.json";

const t = trDictionary.admin.hotels.new;

export default async function NewHotelPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{t.title}</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t.subtitle}</p>

      <div className="mt-6">
        <ErrorBanner message={error} />
        <HotelForm action={createHotelAction} />
      </div>
    </div>
  );
}
