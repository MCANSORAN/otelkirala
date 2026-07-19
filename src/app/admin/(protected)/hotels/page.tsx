import Link from "next/link";
import Image from "next/image";
import { getHotelsOrThrow } from "@/repositories/hotel.repository";
import { deleteHotelAction } from "@/features/admin/actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import ErrorBanner from "@/components/ErrorBanner";
import DbConnectionError from "@/components/DbConnectionError";
import trDictionary from "@/messages/tr.json";

const t = trDictionary.admin.hotels.list;

export default async function AdminHotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  let hotels: Awaited<ReturnType<typeof getHotelsOrThrow>> | null = null;
  try {
    hotels = await getHotelsOrThrow();
  } catch {
    hotels = null;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{t.title}</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t.subtitle}</p>
        </div>
        <Link
          href="/admin/hotels/new"
          className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-brand-950 hover:bg-gold-600"
        >
          {t.add}
        </Link>
      </div>

      <div className="mt-6">
        <ErrorBanner message={error} />
      </div>

      {hotels === null ? (
        <DbConnectionError />
      ) : hotels.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">{t.empty}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-neutral-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 text-neutral-500 dark:border-white/10 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3 font-medium">{t.colHotel}</th>
                <th className="px-4 py-3 font-medium">{t.colLocation}</th>
                <th className="px-4 py-3 font-medium">{t.colPrice}</th>
                <th className="px-4 py-3 font-medium">{t.colRating}</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="border-b border-black/5 last:border-0 dark:border-white/10">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg">
                      <Image src={hotel.image} alt={hotel.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <span className="font-medium text-neutral-900 dark:text-white">{hotel.name}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{hotel.location}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    ₺{hotel.price.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">★ {hotel.rating}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/hotels/${hotel.id}`}
                        className="font-medium text-brand-700 hover:underline dark:text-brand-400"
                      >
                        {trDictionary.admin.edit}
                      </Link>
                      <form action={deleteHotelAction}>
                        <input type="hidden" name="id" value={hotel.id} />
                        <ConfirmSubmitButton
                          confirmMessage={t.deleteConfirm.replace("{name}", hotel.name)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          {trDictionary.admin.delete}
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
