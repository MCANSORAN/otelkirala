import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/session";
import { defaultLocale, locales, hasLocale, type Locale } from "@/lib/locales";

const LOGIN_PATH = "/admin/login";
const LOCALE_COOKIE = "NEXT_LOCALE";

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && hasLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  const preferred = acceptLanguage?.split(",")[0]?.split("-")[0];
  if (preferred && hasLocale(preferred)) {
    return preferred;
  }

  return defaultLocale;
}

// Next.js 16: middleware.ts -> proxy.ts olarak yeniden adlandırıldı.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // Burada yalnızca cookie'ye dayalı "optimistic" bir kontrol yapılır;
    // gerçek yetkilendirme her Server Action/Component içinde lib/session.ts ile tekrar doğrulanır.
    const isAuthenticated = verifyToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    const isLoginPath = pathname === LOGIN_PATH;

    if (!isAuthenticated && !isLoginPath) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl));
    }
    if (isAuthenticated && isLoginPath) {
      return NextResponse.redirect(new URL("/admin", request.nextUrl));
    }
    return NextResponse.next();
  }

  // Genel site: URL'de desteklenen bir dil öneki yoksa, tercih edilen dile yönlendir.
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (!pathnameHasLocale) {
    const locale = getPreferredLocale(request);
    const suffix = pathname === "/" ? "" : pathname;
    return NextResponse.redirect(new URL(`/${locale}${suffix}`, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
