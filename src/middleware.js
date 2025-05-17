import { NextResponse } from "next/server";
import { jwtService, COOKIE_NAME } from "./lib/jwt";

const PUBLIC_API = ["/api/auth"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") &&
    !PUBLIC_API.some((pub) => pathname.startsWith(pub))
  ) {
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
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
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
