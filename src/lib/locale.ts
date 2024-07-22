export const i18n = {
  defaultLocale: "en",
  locales: ["ar", "en"]
} as const;

export type Locale = (typeof i18n)["locales"][number];

export function localize(l: string, r: string) {
  return r === "/" ? r + l : "/" + l + r;
}

export function localizeRoutes(locales: string[], routes: string[]) {
  return locales.flatMap((l) => routes.map((r) => localize(l, r)));
}
