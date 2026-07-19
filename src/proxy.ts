import type { NextRequest } from "next/server";
import { handleAdminAuth } from "@/middleware/adminGuard";
import { handleLocaleRouting } from "@/middleware/localeGuard";

// Next.js 16: middleware.ts -> proxy.ts olarak yeniden adlandırıldı.
// src/ klasörü kullanıldığında proxy.ts src/ içinde bulunmalıdır.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return handleAdminAuth(request);
  }

  return handleLocaleRouting(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
