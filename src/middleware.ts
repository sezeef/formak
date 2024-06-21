import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { type NextRequest, NextResponse } from "next/server";

// list of supported locales
export const i18n = {
  defaultLocale: "en",
  locales: ["en", "ar"],
} as const;

// derived union type of supported locales
export type Locale = (typeof i18n)["locales"][number];

function getLocale(request: NextRequest) {
  // negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // negotiator requires a mutable string[], i18n.locales is readonly
  // this variable is only used for this purpose and should never be mutated
  const mutLocales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    mutLocales,
  );

  // best option based on user preference ("Accept-Language" header)
  const locale = matchLocale(languages, i18n.locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }

  return;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
