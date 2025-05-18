import { NextResponse } from "next/server";
import { jwtService, COOKIE_NAME } from "./lib/jwt";

const PUBLIC_API = ["/api/auth"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api");
  const isLoginPage = pathname === "/login";
  const isSuperuserPage = pathname === "/superuser";
  const isRoot = pathname === "/";

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (
    isApi &&
    !PUBLIC_API.some((pub) => pathname.startsWith(pub))
  ) {
    if (!cookie) {
      return NextResponse.json(
        { message: "Unauthorized: No token" },
        { status: 401 }
      );
    }
    const user = await jwtService.verify(cookie);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }
    const response = NextResponse.next();
    response.headers.set("x-user", encodeURIComponent(JSON.stringify(user)));
    return response;
  }

  if (!isApi && !isLoginPage) {
    if (!cookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const user = await jwtService.verify(cookie);
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role === "admin" && !isSuperuserPage) {
      return NextResponse.redirect(new URL("/superuser", request.url));
    }
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next|static|favicon.ico|login|register|assets).*)",
  ],
};
