import Link from "next/link";
import Image from "next/image";
import { getDestinationsOrThrow } from "@/repositories/destination.repository";
import { deleteDestinationAction } from "@/features/admin/actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import ErrorBanner from "@/components/ErrorBanner";
import DbConnectionError from "@/components/DbConnectionError";
import trDictionary from "@/messages/tr.json";

const t = trDictionary.admin.destinations.list;

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  let destinations: Awaited<ReturnType<typeof getDestinationsOrThrow>> | null = null;
  try {
    destinations = await getDestinationsOrThrow();
  } catch {
    destinations = null;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{t.title}</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t.subtitle}</p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {t.add}
        </Link>
      </div>

      <div className="mt-6">
        <ErrorBanner message={error} />
      </div>

      {destinations === null ? (
        <DbConnectionError />
      ) : destinations.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">{t.empty}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-neutral-900"
            >
              <div className="relative h-32 w-full">
                <Image src={dest.image} alt={dest.name} fill sizes="400px" className="object-cover" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-neutral-900 dark:text-white">{dest.name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {dest.hotelCount.toLocaleString("tr-TR")} {t.hotelsSuffix}
                </p>
                <div className="mt-3 flex gap-3">
                  <Link
                    href={`/admin/destinations/${dest.id}`}
                    className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
                  >
                    {trDictionary.admin.edit}
                  </Link>
                  <form action={deleteDestinationAction}>
                    <input type="hidden" name="id" value={dest.id} />
                    <ConfirmSubmitButton
                      confirmMessage={t.deleteConfirm.replace("{name}", dest.name)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      {trDictionary.admin.delete}
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
