"use server";

import { redirect } from "next/navigation";
import { registerFromForm, loginFromForm, deleteCustomerSession } from "@/services/customerAuth.service";
import { getDictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";

export type AuthState = { error?: string } | undefined;

export async function registerAction(
  lang: Locale,
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const result = await registerFromForm(formData);
  if (!result.ok) return { error: getDictionary(lang).auth.errors[result.error] };

  redirect(`/${lang}`);
}

export async function loginAction(
  lang: Locale,
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const result = await loginFromForm(formData);
  if (!result.ok) return { error: getDictionary(lang).auth.errors[result.error] };

  redirect(`/${lang}`);
}

export async function logoutAction(lang: Locale): Promise<void> {
  await deleteCustomerSession();
  redirect(`/${lang}`);
}
