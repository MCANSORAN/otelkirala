import { NextResponse } from "next/server";
import { getCurrentUser } from "@/services/customerAuth.service";

// Oturumdaki kullanıcıyı döndürür. Oturum çerezi httpOnly olduğu için istemci
// doğrudan okuyamaz; Header bu uçtan çeker. Böylece genel sayfalar cookie okumaz
// ve statik/ISR olarak üretilebilir (yalnızca bu küçük uç istek anında çalışır).
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
