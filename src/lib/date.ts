import { parseISO, formatDistance } from "date-fns";
import { type Locale, getDateFnsLocale } from "@/lib/locale";

export function parseDate(date: string | Date): Date {
  return typeof date === "string" ? parseISO(date) : date;
}

export function formatLocalizedDistance(
  date: string | Date,
  locale: Locale
): string {
  const createdAt = parseDate(date);

  const now = new Date();
  const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  return formatDistance(createdAt, nowUTC, {
    addSuffix: true,
    locale: getDateFnsLocale(locale)
  });
}
