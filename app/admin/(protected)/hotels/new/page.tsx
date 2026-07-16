import ErrorBanner from "../../../components/ErrorBanner";
import HotelForm from "../HotelForm";
import { createHotelAction } from "../../../actions";

export default async function NewHotelPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Yeni Otel</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Yeni bir otel ekleyip site üzerinde yayınlayın.
      </p>

      <div className="mt-6">
        <ErrorBanner message={error} />
        <HotelForm action={createHotelAction} />
      </div>
    </div>
  );
}
