import { cookies } from "next/headers";
import { createSignedToken, verifySignedToken } from "@/lib/signedToken";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getUserByEmail, getUserById, createUser } from "@/repositories/user.repository";
import { CUSTOMER_SESSION_COOKIE_NAME, CUSTOMER_SESSION_TTL_MS } from "@/config/auth.config";
import type { User } from "@/types";

// Bu servisin döndürdüğü error string'leri görüntülenecek metin değil, dictionary anahtarıdır
// (bkz. messages/tr.json ve en.json içindeki auth.errors) — çağıran taraf (features/auth/actions.ts)
// lang'e göre çevirir. Diğer servislerin aksine burada doğrudan Türkçe metin döndürülmez, çünkü
// bu servis public/i18n'li giriş-kayıt sayfalarında kullanılır.
export type AuthErrorCode =
  | "requiredFields"
  | "invalidEmail"
  | "passwordTooShort"
  | "passwordMismatch"
  | "emailTaken"
  | "invalidCredentials"
  | "dbError";

type AuthResult = { ok: true; data: User } | { ok: false; error: AuthErrorCode };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseRegisterInput(
  formData: FormData
): { name: string; email: string; password: string } | { error: AuthErrorCode } {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name || !email || !password) {
    return { error: "requiredFields" };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "invalidEmail" };
  }
  if (password.length < 6) {
    return { error: "passwordTooShort" };
  }
  if (password !== confirmPassword) {
    return { error: "passwordMismatch" };
  }

  return { name, email, password };
}

function parseLoginInput(
  formData: FormData
): { email: string; password: string } | { error: AuthErrorCode } {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "requiredFields" };
  }

  return { email, password };
}

export async function registerFromForm(formData: FormData): Promise<AuthResult> {
  const input = parseRegisterInput(formData);
  if ("error" in input) return { ok: false, error: input.error };

  try {
    const existing = await getUserByEmail(input.email);
    if (existing) {
      return { ok: false, error: "emailTaken" };
    }

    const passwordHash = await hashPassword(input.password);
    const id = await createUser({ name: input.name, email: input.email, passwordHash });
    const user: User = { id, name: input.name, email: input.email.toLowerCase() };
    await createCustomerSession(user.id);
    return { ok: true, data: user };
  } catch {
    return { ok: false, error: "dbError" };
  }
}

export async function loginFromForm(formData: FormData): Promise<AuthResult> {
  const input = parseLoginInput(formData);
  if ("error" in input) return { ok: false, error: input.error };

  try {
    const found = await getUserByEmail(input.email);
    if (!found || !(await verifyPassword(input.password, found.passwordHash))) {
      return { ok: false, error: "invalidCredentials" };
    }

    await createCustomerSession(found.id);
    return { ok: true, data: { id: found.id, name: found.name, email: found.email } };
  } catch {
    return { ok: false, error: "dbError" };
  }
}

async function createCustomerSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  const token = createSignedToken({ userId, expiresAt: Date.now() + CUSTOMER_SESSION_TTL_MS });
  cookieStore.set(CUSTOMER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CUSTOMER_SESSION_TTL_MS / 1000,
  });
}

export async function deleteCustomerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const data = verifySignedToken(cookieStore.get(CUSTOMER_SESSION_COOKIE_NAME)?.value);
  if (!data || typeof data.userId !== "string") return null;

  try {
    return await getUserById(data.userId);
  } catch {
    return null;
  }
}
