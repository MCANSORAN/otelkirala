import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, SESSION_TTL_MS, LOGIN_PATH } from "@/config/auth.config";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET ortam değişkeni tanımlı değil. .env.local dosyasına ekleyin (bkz. .env.example)."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

function createToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ expiresAt })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

// NOT: middleware/adminGuard.ts bu fonksiyonu import eder; next/headers'e bağımlı olmadığı için
// hem proxy (request.cookies) hem Server Component/Action (next/headers cookies()) içinde kullanılabilir.
export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.expiresAt === "number" && Date.now() <= data.expiresAt;
  } catch {
    return false;
  }
}

export function verifyCredentials(username: string, password: string): boolean {
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;
  if (!validUsername || !validPassword) return false;
  return safeEqual(username, validUsername) && safeEqual(password, validPassword);
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

async function hasValidSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

// Server Component/Action içinde çağrılır; oturum yoksa giriş sayfasına yönlendirir.
export async function verifySession(): Promise<void> {
  if (!(await hasValidSession())) {
    redirect(LOGIN_PATH);
  }
}
