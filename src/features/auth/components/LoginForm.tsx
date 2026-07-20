"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/features/auth/actions";
import Field from "@/components/Field";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";

const initialState: AuthState = undefined;

export default function LoginForm({ lang, dict }: { lang: Locale; dict: Dictionary["auth"]["login"] }) {
  const [state, formAction, pending] = useActionState(loginAction.bind(null, lang), initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label={dict.emailLabel} name="email" type="email" required autoComplete="email" />
      <Field
        label={dict.passwordLabel}
        name="password"
        type="password"
        required
        autoComplete="current-password"
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
        {dict.noAccount}{" "}
        <Link href={`/${lang}/register`} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
          {dict.registerLink}
        </Link>
      </p>
    </form>
  );
}
