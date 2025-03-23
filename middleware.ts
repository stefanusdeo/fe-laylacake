import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const publicPaths = ["/login", "/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const token = request.cookies.get("access_token")?.value;

  if (!isPublicPath && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}
