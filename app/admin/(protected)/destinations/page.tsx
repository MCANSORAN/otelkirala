import Link from "next/link";
import Image from "next/image";
import { getDestinationsOrThrow } from "@/lib/destinations";
import { deleteDestinationAction } from "../../actions";
import ConfirmSubmitButton from "../../components/ConfirmSubmitButton";
import ErrorBanner from "../../components/ErrorBanner";

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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Bölgeler</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Ana sayfada gösterilen popüler bölgeleri yönetin.
          </p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700"
        >
          + Bölge Ekle
        </Link>
      </div>

      <div className="mt-6">
        <ErrorBanner message={error} />
      </div>

      {destinations === null ? (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
          MongoDB&apos;ye bağlanılamadı. <code>MONGODB_URI</code> ayarınızı kontrol edin.
        </p>
      ) : destinations.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">Henüz bölge eklenmemiş.</p>
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
                  {dest.hotelCount.toLocaleString("tr-TR")} otel
                </p>
                <div className="mt-3 flex gap-3">
                  <Link
                    href={`/admin/destinations/${dest.id}`}
                    className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
                  >
                    Düzenle
                  </Link>
                  <form action={deleteDestinationAction}>
                    <input type="hidden" name="id" value={dest.id} />
                    <ConfirmSubmitButton
                      confirmMessage={`"${dest.name}" silinsin mi?`}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Sil
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
