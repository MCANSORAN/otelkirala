import type { Dictionary } from "@/messages/dictionaries";

export default function HotelSearchForm({ dict }: { dict: Dictionary["hero"]["form"] }) {
  return (
    <form className="mt-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-cream via-white to-gold-100 text-left shadow-2xl shadow-brand-950/30 ring-2 ring-gold-400/40 dark:from-brand-950/60 dark:via-neutral-900 dark:to-gold-950/30">
      <div className="grid grid-cols-1 divide-y divide-gold-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5 dark:divide-neutral-800">
        <Field icon="📍" label={dict.destinationLabel} className="lg:col-span-2">
          <input
            type="text"
            placeholder={dict.destinationPlaceholder}
            className="w-full bg-transparent text-sm font-medium text-neutral-900 outline-none placeholder:font-normal placeholder:text-neutral-400 dark:text-white"
          />
        </Field>

        <Field icon="📅" label={dict.checkinLabel}>
          <input
            type="date"
            className="w-full bg-transparent text-sm font-medium text-neutral-900 outline-none dark:text-white"
          />
        </Field>

        <Field icon="📅" label={dict.checkoutLabel}>
          <input
            type="date"
            className="w-full bg-transparent text-sm font-medium text-neutral-900 outline-none dark:text-white"
          />
        </Field>

        <Field icon="👤" label={dict.guestsLabel}>
          <select className="w-full bg-transparent text-sm font-medium text-neutral-900 outline-none dark:text-white dark:[color-scheme:dark]">
            {dict.guestsOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-4 text-sm font-bold text-brand-950 transition-colors hover:from-gold-600 hover:to-gold-700"
      >
        🔍 {dict.submit}
      </button>
    </form>
  );
}

function Field({
  icon,
  label,
  className = "",
  children,
}: {
  icon: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`group flex items-center gap-3 px-5 py-3.5 transition-colors focus-within:bg-gold-50/80 dark:focus-within:bg-gold-950/20 ${className}`}
    >
      <span className="text-lg" aria-hidden>
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{label}</span>
        {children}
      </span>
    </label>
  );
}
