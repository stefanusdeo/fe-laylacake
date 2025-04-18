import { type NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Define role types
type Role = "Kasir" | "Admin" | "Super Admin";

// Define JWT token structure based on the provided format
interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
  id: number;
  role_id: number;
}

// Map role_id to role string
const roleMapping: Record<number, Role> = {
  1: "Super Admin",
  2: "Admin",
  3: "Kasir",
  // Add more mappings if needed
};

const pathPermissions: Record<string, Role[]> = {
  // Transaction section
  "/transaction": ["Kasir", "Admin", "Super Admin"],
  "/transaction/detail": ["Kasir", "Admin", "Super Admin"],
  "/cashier": ["Kasir"],
  "/payment-method": ["Super Admin"],

  // Store section
  "/store/outlets": ["Admin"],

  // Account section
  "/account": ["Kasir", "Admin", "Super Admin"],

  // User Management section
  "/user-management/user-list": ["Admin", "Super Admin"],
  "/user-management/create-user": ["Admin", "Super Admin"],
  "/user-management/edit-user": ["Admin", "Super Admin"],
};

// Public paths that don't require authentication
const publicPaths = ["/login", "/", "/403", "/404"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths and non-page requests
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Get access token from cookies
  const accessToken = request.cookies.get("access_token")?.value;

  // If no access token, redirect to login
  if (!accessToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  let userRole: Role | undefined;

  try {
    // Decode the JWT token to get user information
    const decodedToken = jwtDecode<DecodedToken>(accessToken);

    // Map role_id to actual role string
    userRole = roleMapping[decodedToken.role_id];

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      // Token is expired, redirect to login
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // If role_id doesn't map to a valid role
    if (!userRole) {
      console.error("Invalid role_id in token:", decodedToken.role_id);
      return NextResponse.redirect(new URL("/403", request.url));
    }
  } catch (error) {
    // If token decoding fails, redirect to login
    console.error("Error decoding JWT token:", error);
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Check if the current path requires specific permissions
  const requiredPath = Object.keys(pathPermissions).find(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If this is a protected path, check role permissions
  if (requiredPath) {
    const allowedRoles = pathPermissions[requiredPath];

    // If user doesn't have the required role, redirect to access denied page
    if (!userRole || !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
