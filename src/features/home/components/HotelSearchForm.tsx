import type { Dictionary } from "@/messages/dictionaries";

export default function HotelSearchForm({ dict }: { dict: Dictionary["hero"]["form"] }) {
  return (
    <form className="mt-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white p-2 text-left shadow-2xl shadow-brand-950/25 ring-1 ring-black/5">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <Field icon="📍" label={dict.destinationLabel}>
          <input
            type="text"
            placeholder={dict.destinationPlaceholder}
            className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
          />
        </Field>

        <Field icon="📅" label={dict.checkinLabel}>
          <input
            type="date"
            className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
          />
        </Field>

        <Field icon="📅" label={dict.checkoutLabel}>
          <input
            type="date"
            className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
          />
        </Field>

        <Field icon="👤" label={dict.guestsLabel}>
          <select className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none">
            {dict.guestsOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>

        <div className="flex items-stretch p-1">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            🔍 <span>{dict.submit}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="group flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors focus-within:bg-brand-50">
      <span className="text-lg" aria-hidden>
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        {children}
      </span>
    </label>
  );
}
