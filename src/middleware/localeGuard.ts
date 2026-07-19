import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, hasLocale, type Locale } from "@/constants/locales";
import { LOCALE_COOKIE } from "@/config/i18n.config";

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

// Genel site: URL'de desteklenen bir dil öneki yoksa, tercih edilen dile yönlendirir.
export function handleLocaleRouting(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
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
