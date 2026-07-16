import ErrorBanner from "../../../components/ErrorBanner";
import DestinationForm from "../DestinationForm";
import { createDestinationAction } from "../../../actions";

export default async function NewDestinationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Yeni Bölge</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Ana sayfada gösterilecek yeni bir bölge ekleyin.
      </p>

      <div className="mt-6">
        <ErrorBanner message={error} />
        <DestinationForm action={createDestinationAction} />
      </div>
    </div>
  );
}
