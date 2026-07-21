import { NextResponse, type NextRequest } from "next/server";
import { handleAdminAuth } from "@/middleware/adminGuard";
import { handleLocaleRouting } from "@/middleware/localeGuard";

// Next.js'in kod ile ürettiği metadata route'ları (icon, apple-icon,
// opengraph-image, twitter-image) uzantısız servis edilir; bu yüzden
// matcher'daki ".*\\..*" hariç tutmasına takılmaz, buraya kadar gelirler.
// Locale önekiyle yönlendirilirlerse (ör. /tr/icon) 404 olurlar; bu yüzden
// locale/admin mantığından önce olduğu gibi geçirilirler.
const METADATA_ROUTE = /^\/(icon|apple-icon|opengraph-image|twitter-image)\d*$/;

// Next.js 16: middleware.ts -> proxy.ts olarak yeniden adlandırıldı.
// src/ klasörü kullanıldığında proxy.ts src/ içinde bulunmalıdır.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (METADATA_ROUTE.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    return handleAdminAuth(request);
  }

  return handleLocaleRouting(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
