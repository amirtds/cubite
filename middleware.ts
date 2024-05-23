import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Check authentication
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Define the protected routes
  const protectedRoutes = ["/admin"];

  // Find hostname, if the hostname is main domain or subdomain
  const hostname = request.headers.get("host");
  const mainDomain = process.env.ROOT_URL;
  const isMainDomain = hostname === mainDomain;
  const isSubDomain = !isMainDomain && hostname?.endsWith(mainDomain!);
  const subDomain = isSubDomain && hostname?.split(`.${process.env.ROOT_URL}`)[0];

  // If it is a subdomain rewrite the request to send it to the domain dynamic route
  if (isSubDomain) {
    return NextResponse.rewrite(new URL(`/${subDomain}`, request.url));
  }

  // Redirect to login if the user is not authenticated and trying to access a protected route
  if (!token && protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    const loginUrl = new URL("/api/auth/signin", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
