import { notFound } from "next/navigation";
import { getDestinationById } from "@/repositories/destination.repository";
import ErrorBanner from "@/components/ErrorBanner";
import DestinationForm from "@/features/admin/components/DestinationForm";
import { updateDestinationAction } from "@/features/admin/actions";
import trDictionary from "@/messages/tr.json";

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
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{trDictionary.admin.destinations.edit.title}</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{destination.name}</p>

      <div className="mt-6">
        <ErrorBanner message={error} />
        <DestinationForm destination={destination} action={updateDestinationAction.bind(null, id)} />
      </div>
    </div>
  );
}
