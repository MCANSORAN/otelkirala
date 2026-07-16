import { notFound } from "next/navigation";
import { getDestinationById } from "@/lib/destinations";
import ErrorBanner from "../../../components/ErrorBanner";
import DestinationForm from "../DestinationForm";
import { updateDestinationAction } from "../../../actions";

export default async function EditDestinationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const destination = await getDestinationById(id);

  if (!destination) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Bölgeyi Düzenle</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{destination.name}</p>

      <div className="mt-6">
        <ErrorBanner message={error} />
        <DestinationForm destination={destination} action={updateDestinationAction.bind(null, id)} />
      </div>
    </div>
  );
}
