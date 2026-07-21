"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthState } from "@/features/auth/actions";
import Field from "@/components/Field";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";

const initialState: AuthState = undefined;

export default function RegisterForm({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["auth"]["register"];
}) {
  const [state, formAction, pending] = useActionState(registerAction.bind(null, lang), initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label={dict.nameLabel} name="name" type="text" required autoComplete="name" />
      <Field label={dict.emailLabel} name="email" type="email" required autoComplete="email" />
      <Field
        label={dict.passwordLabel}
        name="password"
        type="password"
        required
        minLength={6}
        autoComplete="new-password"
      />
      <Field
        label={dict.confirmPasswordLabel}
        name="confirmPassword"
        type="password"
        required
        minLength={6}
        autoComplete="new-password"
      />

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? dict.submitPending : dict.submit}
      </button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        {dict.hasAccount}{" "}
        <Link href={`/${lang}/login`} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
          {dict.loginLink}
        </Link>
      </p>
    </form>
  );
}
