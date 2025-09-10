import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = (req as NextRequestWithAuth).nextUrl.pathname;

      // public routes:
  if (path === "/" || path === "/sign-in" || path === "/sign-up") return true;

      // admin only:
      if (path.startsWith("/admin")) return !!token && token.role === "admin";

      // everything else requires auth
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:.*)).*)",
  ],
};
