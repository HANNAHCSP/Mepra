// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req: NextRequestWithAuth) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // If user is admin, allow access to /admin routes
    if (pathname.startsWith("/admin") && token?.role === "admin") {
      return NextResponse.next();
    }

    // If user is not admin and tries to access /admin, redirect to home
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // The `authorized` callback determines if a user is authorized to access a page.
      // Returning `true` allows access, `false` redirects to the sign-in page.
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        
        // Define routes that require authentication
        const protectedRoutes = ["/account"];
        
        // Admin routes are a special case of protected routes
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        
        // Check if the current path is one of the protected routes
        if (protectedRoutes.some((route) => pathname.startsWith(route))) {
          // If it is, the user must be logged in (token must exist)
          return !!token;
        }

        // For all other routes (public pages, products, cart, checkout), allow access
        return true;
      },
    },
  }
);

// This config ensures the middleware runs on all paths except for specific static/API routes.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};