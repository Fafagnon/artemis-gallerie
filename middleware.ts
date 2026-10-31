import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminSecret,
  verifySessionToken,
} from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secret = getAdminSecret();
  const isAuthenticated = await verifySessionToken(token, secret);

  // 1. Handling /admin/login
  if (pathname === "/admin/login") {
    // If user is already authenticated, redirect straight to /admin
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protecting all other /admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("from", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. Protecting file upload API route
  if (pathname.startsWith("/api/upload")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Accès non autorisé. Veuillez vous connecter au Back-Office." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 4. Protecting mutations on artworks and artists API routes
  if (
    pathname.startsWith("/api/artworks") ||
    pathname.startsWith("/api/artists")
  ) {
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(
      request.method.toUpperCase()
    );

    if (isMutation && !isAuthenticated) {
      return NextResponse.json(
        { error: "Accès non autorisé. Veuillez vous connecter au Back-Office." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/upload/:path*",
    "/api/artworks/:path*",
    "/api/artists/:path*",
  ],
};

