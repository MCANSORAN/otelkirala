import { getRequestsOrThrow } from "@/repositories/request.repository";
import { updateRequestStatusAction, deleteRequestAction } from "@/features/admin/actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import ErrorBanner from "@/components/ErrorBanner";
import DbConnectionError from "@/components/DbConnectionError";
import trDictionary from "@/messages/tr.json";
import type { ReservationStatus } from "@/types";

const dict = trDictionary.admin.requests;

const STATUS_STYLES: Record<ReservationStatus, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  contacted: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  closed: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  let requests: Awaited<ReturnType<typeof getRequestsOrThrow>> | null = null;
  try {
    requests = await getRequestsOrThrow();
  } catch {
    requests = null;
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{dict.list.title}</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{dict.list.subtitle}</p>
      </div>

      <div className="mt-6">
        <ErrorBanner message={error} />
      </div>

      {requests === null ? (
        <DbConnectionError />
      ) : requests.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">{dict.list.empty}</p>
      ) : (
        <div className="mt-6 space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-neutral-900 dark:text-white">{req.fullName}</h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[req.status]}`}
                    >
                      {dict.status[req.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">{formatDate(req.createdAt)}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-neutral-900 dark:text-white">{req.hotelName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {req.roomName ?? dict.fields.generalRequest}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                <Info label={dict.fields.phone} value={req.phone} />
                <Info label={dict.fields.email} value={req.email ?? dict.fields.noEmail} />
                <Info
                  label={dict.fields.guests}
                  value={
                    req.children > 0
                      ? `${req.guests} ${dict.fields.adults}, ${req.children} ${dict.fields.children}`
                      : `${req.guests} ${dict.fields.adults}`
                  }
                />
                <Info
                  label={dict.fields.dates}
                  value={req.checkIn && req.checkOut ? `${req.checkIn} → ${req.checkOut}` : dict.fields.noDates}
                />
                {req.roomCount && req.roomCount > 1 && (
                  <Info label={dict.fields.roomCount} value={String(req.roomCount)} />
                )}
                {req.totalPrice && (
                  <Info
                    label={dict.fields.totalPrice}
                    value={`₺${req.totalPrice.toLocaleString("tr-TR")}`}
                  />
                )}
              </dl>

              {req.message && (
                <div className="mt-3">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{dict.fields.message}</p>
                  <p className="mt-0.5 text-sm text-neutral-700 dark:text-neutral-300">{req.message}</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-black/5 pt-4 dark:border-white/10">
                <form action={updateRequestStatusAction.bind(null, req.id)} className="flex items-center gap-2">
                  <label htmlFor={`status-${req.id}`} className="text-sm text-neutral-500 dark:text-neutral-400">
                    {dict.statusLabel}
                  </label>
                  <select
                    id={`status-${req.id}`}
                    name="status"
                    defaultValue={req.status}
                    className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none focus:border-brand-600 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="new">{dict.status.new}</option>
                    <option value="contacted">{dict.status.contacted}</option>
                    <option value="closed">{dict.status.closed}</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    {dict.updateStatus}
                  </button>
                </form>

                <form action={deleteRequestAction} className="ml-auto">
                  <input type="hidden" name="id" value={req.id} />
                  <ConfirmSubmitButton
                    confirmMessage={dict.list.deleteConfirm.replace("{name}", req.fullName)}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    {trDictionary.admin.delete}
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd className="mt-0.5 font-medium text-neutral-900 dark:text-white">{value}</dd>
    </div>
  );
}
