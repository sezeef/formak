import type { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import type { CustomMiddleware } from "@/middlewares/chain";
import { auth } from "@/lib/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  isGuestWhitelistRoute,
  isPublicRoute as isPublicRouteFn
} from "@/lib/routes";

export function withAuthMiddleware(
  middleware: CustomMiddleware
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const { nextUrl } = request;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    if (isApiAuthRoute) {
      return middleware(request, event, response);
    }

    let authResult = null;
    try {
      const session = await auth.api.getSession({
        headers: request.headers
      });

      authResult = session?.user ? { user: session.user } : null;
    } catch (error) {
      console.error("[AUTH_MIDDLEWARE] Session fetch error:", error);
      authResult = null;
    }

    const isLoggedIn = authResult?.user != null;
    const isPublicRoute = isPublicRouteFn(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isGuest = authResult?.user?.isAnonymous;
    const isGuestWhitelist = isGuestWhitelistRoute(nextUrl.pathname);

    // Handle auth routes (login, register, etc.)
    if (isAuthRoute) {
      // Redirect logged-in non-guest users away from auth routes
      if (isLoggedIn && !isGuest) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      // Allow non-users and guests to access auth routes
      return middleware(request, event, response);
    }

    // Handle private routes - redirect non-authenticated users or unauthorized guests
    if (!isPublicRoute && (!isLoggedIn || (isGuest && !isGuestWhitelist))) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      return Response.redirect(
        new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      );
    }

    return middleware(request, event, response);
  };
}

// import type { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import type { CustomMiddleware } from "@/middlewares/chain";
// import { auth } from "@/lib/auth";
// import {
//   DEFAULT_LOGIN_REDIRECT,
//   apiAuthPrefix,
//   authRoutes,
//   isGuestWhitelistRoute,
//   isPublicRoute as isPublicRouteFn
// } from "@/lib/routes";
// import { USER_ROLES } from "@/db/schema/user";
//
// export function withAuthMiddleware(
//   middleware: CustomMiddleware
// ): CustomMiddleware {
//   return async (
//     request: NextRequest,
//     event: NextFetchEvent,
//     response: NextResponse
//   ) => {
//     let authResult = await auth();
//     const { nextUrl } = request;
//
//     const isLoggedIn = authResult?.user != null;
//     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//     const isPublicRoute = isPublicRouteFn(nextUrl.pathname);
//     const isAuthRoute = authRoutes.includes(nextUrl.pathname);
//     const isGuest = authResult?.user.role === USER_ROLES.GUEST;
//     const isGuestWhitelist = isGuestWhitelistRoute(nextUrl.pathname);
//
//     // all api auth routes are public
//     if (isApiAuthRoute) {
//       return middleware(request, event, response);
//     }
//
//     if (isAuthRoute) {
//       // redirect users away from auth routes to default redirect
//       if (isLoggedIn && !isGuest) {
//         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//       }
//       // non-users and guests can access auth routes
//       return middleware(request, event, response);
//     }
//
//     // redirect non-users & guests trying to access private routes to login
//     if (!isPublicRoute && (!isLoggedIn || (isGuest && !isGuestWhitelist))) {
//       let callbackUrl = nextUrl.pathname;
//       if (nextUrl.search) {
//         callbackUrl += nextUrl.search;
//       }
//
//       const encodedCallbackUrl = encodeURIComponent(callbackUrl);
//
//       return Response.redirect(
//         new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
//       );
//     }
//
//     return middleware(request, event, response);
//   };
// }
