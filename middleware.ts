import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Check authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Define the protected routes
  const AdminSiteProtectedRoutes = ["/admin"];
  const tenantsProtectedRoutes = ["/dashboard", "/profile", "/settings"];

  // Define the public routes for login and register
  const publicRoutes = ["/auth/signin", "/auth/register"];

  // Find hostname, if the hostname is main domain or subdomain
  const hostname = request.headers.get("host");
  const mainDomain = process.env.ROOT_URL_WITHOUT_PROTOCOL;
  const isMainDomain = hostname === mainDomain;
  const isSubDomain = !isMainDomain && hostname?.endsWith(mainDomain!);
  const subDomain =
    isSubDomain && hostname?.split(`.${process.env.ROOT_URL_WITHOUT_PROTOCOL}`)[0];
  // If it is a subdomain rewrite the request to send it to the domain dynamic route
  if (isSubDomain) {
    let path = request.nextUrl.pathname;
    if (token && (path === "/auth/register" || path === "/auth/signin")) {
      path = "/";
    }
    if (
      !token &&
      tenantsProtectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      )
    ) {
      path = "/auth/signin";
    }
    return NextResponse.rewrite(new URL(`/${subDomain}${path}`, request.url));
  }

  // Redirect to login if the user is not authenticated and trying to access a protected route
  if (
    !token &&
    AdminSiteProtectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    )
  ) {
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
