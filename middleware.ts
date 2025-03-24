import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const publicPaths = ["/login", "/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const token = request.cookies.get("access_token")?.value;
  const response = NextResponse.next();

  return response;
}
