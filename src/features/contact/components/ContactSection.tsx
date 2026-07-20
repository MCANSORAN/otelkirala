import Field, { inputClassName, labelClassName } from "@/components/Field";
import type { Dictionary } from "@/messages/dictionaries";

export default function ContactSection({ dict }: { dict: Dictionary["contactPage"] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
        {dict.title}
      </h1>
      <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">{dict.subtitle}</p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{dict.infoTitle}</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">{dict.emailLabel}</dt>
              <dd className="mt-1 font-medium text-neutral-900 dark:text-white">{dict.email}</dd>
            </div>
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">{dict.phoneLabel}</dt>
              <dd className="mt-1 font-medium text-neutral-900 dark:text-white">{dict.phone}</dd>
            </div>
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">{dict.addressLabel}</dt>
              <dd className="mt-1 font-medium text-neutral-900 dark:text-white">{dict.address}</dd>
            </div>
          </dl>
        </div>

        <form className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <Field label={dict.form.nameLabel} id="contact-name" type="text" placeholder={dict.form.namePlaceholder} />

          <div className="mt-4">
            <Field
              label={dict.form.emailLabel}
              id="contact-email"
              type="email"
              placeholder={dict.form.emailPlaceholder}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="contact-message" className={labelClassName}>
              {dict.form.messageLabel}
            </label>
            <textarea
              id="contact-message"
              rows={5}
              placeholder={dict.form.messagePlaceholder}
              className={inputClassName}
            />
          </div>

          <button
            type="submit"
            className="mt-5 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {dict.form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
