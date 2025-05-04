import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  routeAccessMap,
} from "@/lib/routes";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

// Helper: Get required roles for the route
function getRequiredRolesForRoute(pathname: string): string[] | null {
  for (const pattern in routeAccessMap) {
    // const regex = new RegExp(`^${pattern}$`);
    const regex = new RegExp(`^${pattern.replace(/\(\.\*\)/g, "(?:/.*)?")}$`);

    if (regex.test(pathname)) {
      return routeAccessMap[pattern];
    }
  }

  return null;
}

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role || null;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return;

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(
      new URL(`/dashboard/${userRole?.toLowerCase()}`, nextUrl)
    );
  }

  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) callbackUrl += nextUrl.search;

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // 🔒 Role-based access control check
  const requiredRoles = getRequiredRolesForRoute(nextUrl.pathname);

  if (
    !isApiAuthRoute &&
    requiredRoles &&
    (!userRole || !requiredRoles.includes(userRole))
  ) {
    const fallback = userRole
      ? `/dashboard/${userRole.toLowerCase()}`
      : DEFAULT_LOGIN_REDIRECT;
    return Response.redirect(new URL(fallback, nextUrl));
  }

  return;
});

// Middleware config
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
