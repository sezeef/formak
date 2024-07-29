"use server";
import { getFormStatsByUserId } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";
import { unsafeGetUser } from "@/lib/user";

export async function getStats() {
  const user = await unsafeGetUser();
  const stats = await getFormStatsByUserId(user.id);
  if (!stats) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }

  // It's typed as number but it might be null
  const visits = ensureNumber(stats.totalVisits);
  const submissions = ensureNumber(stats.totalSubmissions);
  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;
  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate
  };
}

function ensureNumber(x: number | null | undefined): number {
  if (x == null) return 0;
  return x;
}
