import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/",
    "/verify-user/:path*",
    "/video-room/:path*",
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page

  const protectedRoutes = ["/dashboard", "/video-room"];
  const unprotectedRoutes = ["/sign-in", "/sign-up", "/verify-user", "/"];
  if (token && unprotectedRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && protectedRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
