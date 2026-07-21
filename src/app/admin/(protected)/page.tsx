import Link from "next/link";
import { countHotels } from "@/repositories/hotel.repository";
import { countDestinations } from "@/repositories/destination.repository";
import { countTestimonials } from "@/repositories/testimonial.repository";
import { countRequests } from "@/repositories/request.repository";
import { seedAction } from "@/features/admin/actions";
import ErrorBanner from "@/components/ErrorBanner";
import trDictionary from "@/messages/tr.json";

const t = trDictionary.admin;

type Counts = { hotels: number; destinations: number; testimonials: number; requests: number };

async function getCounts(): Promise<Counts | null> {
  try {
    const [hotels, destinations, testimonials, requests] = await Promise.all([
      countHotels(),
      countDestinations(),
      countTestimonials(),
      countRequests(),
    ]);
    return { hotels, destinations, testimonials, requests };
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ seeded?: string; error?: string }>;
}) {
  const { seeded, error } = await searchParams;
  const counts = await getCounts();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{t.dashboard.title}</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t.dashboard.subtitle}</p>

      <div className="mt-4">
        <ErrorBanner message={error} />
      </div>

      {seeded && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          {t.dashboard.seeded}
        </p>
      )}

      {!counts ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/40">
          <h2 className="font-semibold text-amber-800 dark:text-amber-300">{t.dbError.title}</h2>
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">{t.dbError.body}</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={t.dashboard.cards.hotels} value={counts.hotels} href="/admin/hotels" />
            <StatCard label={t.dashboard.cards.destinations} value={counts.destinations} href="/admin/destinations" />
            <StatCard label={t.dashboard.cards.testimonials} value={counts.testimonials} href="/admin/testimonials" />
            <StatCard label={t.dashboard.cards.requests} value={counts.requests} href="/admin/requests" />
          </div>

          {counts.hotels === 0 && counts.destinations === 0 && counts.testimonials === 0 && (
            <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">
              <h2 className="font-semibold text-neutral-900 dark:text-white">{t.dashboard.empty.title}</h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t.dashboard.empty.body}</p>
              <form action={seedAction} className="mt-4">
                <button
                  type="submit"
                  className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  {t.dashboard.empty.seedButton}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-neutral-900"
    >
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
    </Link>
  );
}
