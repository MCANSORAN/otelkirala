import { notFound } from "next/navigation";
import { getHotelById } from "@/lib/hotels";
import ErrorBanner from "../../../components/ErrorBanner";
import HotelForm from "../HotelForm";
import { updateHotelAction } from "../../../actions";

export default async function EditHotelPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const hotel = await getHotelById(id);

  if (!hotel) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Oteli Düzenle</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{hotel.name}</p>

      <div className="mt-6">
        <ErrorBanner message={error} />
        <HotelForm hotel={hotel} action={updateHotelAction.bind(null, id)} />
      </div>
    </div>
  );
}
