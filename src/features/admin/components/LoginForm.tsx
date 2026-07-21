"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/features/admin/actions";
import Field from "@/components/Field";
import trDictionary from "@/messages/tr.json";

const t = trDictionary.admin.login;
const initialState: LoginState = undefined;

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label={t.username} name="username" type="text" required autoComplete="username" />
      <Field label={t.password} name="password" type="password" required autoComplete="current-password" />

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
        {pending ? t.submitPending : t.submit}
      </button>
    </form>
  );
}
