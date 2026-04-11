import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

// Define protected and public routes clearly
const protectedRoutes = ["/"];
const authRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  // Parse session securely safely (using await cookies() for Next.js 15+ safety)
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;
  const session = await decrypt(sessionValue);

  // Redirect to /login if unauthenticated and trying to access a protected route
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to dashboard if logged in and trying to explicitly load auth routes
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // Setup the matcher to only run on core paths so we don't slow down static files globally
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
