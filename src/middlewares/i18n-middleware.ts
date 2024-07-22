import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { CustomMiddleware } from "@/middlewares/chain";
import { i18n } from "@/lib/locale";

function getLocale(request: NextRequest) {
  // negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // negotiator requires a mutable string[], i18n.locales is readonly
  // this variable is only used for this purpose and should never be mutated
  const mutLocales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    mutLocales
  );

  // best option based on user preference ("Accept-Language" header)
  const locale = matchLocale(languages, i18n.locales, i18n.defaultLocale);

  return locale;
}

export function withI18nMiddleware(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const pathname = request.nextUrl.pathname;
    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);

      const redirectURL = new URL(request.url);

      if (locale) {
        redirectURL.pathname = `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
      }

      // Preserve query parameters
      redirectURL.search = request.nextUrl.search;

      // Not sure if stringifying is necessary
      return NextResponse.redirect(redirectURL.toString());
    }

    return middleware(request, event, response);
  };
}
