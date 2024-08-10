import { localizeRoutes, i18n } from "@/lib/locale";

/**
 * Supported locales
 */
const locales: string[] = [...i18n.locales];

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const staticPublicRoutes = localizeRoutes(locales, [
  "/",
  "/auth/new-verification"
]);

/**
 * This is an array of regex patterns of allowed dynamic routes
 * The pattern `[^/]+` mean match anything except a `/` character
 */
const dynamicPublicRoutes = [createLocaleRoutePattern("/submit/[^/]+")];

const dynamicGuestWhitelistRoutes = [
  createLocaleRoutePattern("/builder/[^/]+")
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 */
export const authRoutes = localizeRoutes(locales, [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset-password",
  "/auth/new-password"
]);

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

/**
 * Function to create a regular expression for dynamic routes with locales
 */
function createLocaleRoutePattern(baseRoute: string): RegExp {
  const localePattern = `(${locales.join("|")})`;
  return new RegExp(`^/${localePattern}${baseRoute}$`);
}

function isStaticPublicRoute(pathname: string): boolean {
  return staticPublicRoutes.includes(pathname);
}

function isDynamicPublicRoute(pathname: string): boolean {
  for (const pattern of dynamicPublicRoutes) {
    if (pattern.test(pathname)) return true;
  }
  return false;
}

function isDynamicGuestWhitelistRoute(pathname: string): boolean {
  for (const pattern of dynamicGuestWhitelistRoutes) {
    if (pattern.test(pathname)) return true;
  }
  return false;
}

export function isPublicRoute(pathname: string): boolean {
  return isStaticPublicRoute(pathname) || isDynamicPublicRoute(pathname);
}

export function isGuestWhitelistRoute(pathname: string): boolean {
  return isDynamicGuestWhitelistRoute(pathname);
}
