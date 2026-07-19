import type { InputHTMLAttributes } from "react";

// Formlar genelinde tekrarlanan input/label sınıfları. Tek kaynaktan gelir ki
// stiller sürüklenmesin (bkz. admin/auth/contact formları).
export const inputClassName =
  "mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 dark:border-white/10 dark:bg-neutral-900 dark:text-white";

export const labelClassName =
  "block text-sm font-medium text-neutral-700 dark:text-neutral-300";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string };

// Etiket + metin girişi ikilisi için ortak alan bileşeni. textarea/select gibi
// özel durumlar doğrudan inputClassName/labelClassName kullanır.
export default function Field({ label, id, name, ...rest }: FieldProps) {
  const fieldId = id ?? name;
  return (
    <div>
      <label htmlFor={fieldId} className={labelClassName}>
        {label}
      </label>
      <input id={fieldId} name={name} className={inputClassName} {...rest} />
    </div>
  );
}
