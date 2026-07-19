import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, LOGIN_PATH, ADMIN_HOME_PATH } from "@/config/auth.config";
import { verifyToken } from "@/services/auth.service";

// Burada yalnızca cookie'ye dayalı "optimistic" bir kontrol yapılır;
// gerçek yetkilendirme her Server Action/Component içinde services/auth.service.ts ile tekrar doğrulanır.
export function handleAdminAuth(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const isAuthenticated = verifyToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  const isLoginPath = pathname === LOGIN_PATH;

  if (!isAuthenticated && !isLoginPath) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl));
  }

  if (isAuthenticated && isLoginPath) {
    return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.nextUrl));
  }

  return NextResponse.next();
}
