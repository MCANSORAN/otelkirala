import Link from "next/link";
import Image from "next/image";
import { getHotelsOrThrow } from "@/lib/hotels";
import { deleteHotelAction } from "../../actions";
import ConfirmSubmitButton from "../../components/ConfirmSubmitButton";
import ErrorBanner from "../../components/ErrorBanner";

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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Oteller</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Sitede listelenen otelleri yönetin.
          </p>
        </div>
        <Link
          href="/admin/hotels/new"
          className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700"
        >
          + Otel Ekle
        </Link>
      </div>

      <div className="mt-6">
        <ErrorBanner message={error} />
      </div>

      {hotels === null ? (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
          MongoDB&apos;ye bağlanılamadı. <code>MONGODB_URI</code> ayarınızı kontrol edin.
        </p>
      ) : hotels.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
          Henüz otel eklenmemiş. Panelden veya &quot;Örnek Verileri Yükle&quot; ile başlayabilirsiniz.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-neutral-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 text-neutral-500 dark:border-white/10 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3 font-medium">Otel</th>
                <th className="px-4 py-3 font-medium">Konum</th>
                <th className="px-4 py-3 font-medium">Fiyat</th>
                <th className="px-4 py-3 font-medium">Puan</th>
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
                        className="font-medium text-sky-700 hover:underline dark:text-sky-400"
                      >
                        Düzenle
                      </Link>
                      <form action={deleteHotelAction}>
                        <input type="hidden" name="id" value={hotel.id} />
                        <ConfirmSubmitButton
                          confirmMessage={`"${hotel.name}" silinsin mi?`}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Sil
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
