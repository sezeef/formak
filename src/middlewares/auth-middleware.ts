import NextAuth from "next-auth";
import type { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import type { CustomMiddleware } from "@/middlewares/chain";
import authConfig from "@/lib/auth/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  isPublicRoute as isPublicRouteFn
} from "@/lib/routes";

const { auth } = NextAuth(authConfig);

export function withAuthMiddleware(
  middleware: CustomMiddleware
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const authResult = await auth();
    const { nextUrl } = request;

    const isLoggedIn = authResult?.user != null ? true : false;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = isPublicRouteFn(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
      return middleware(request, event, response);
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return middleware(request, event, response);
    }

    if (!isLoggedIn && !isPublicRoute) {
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
