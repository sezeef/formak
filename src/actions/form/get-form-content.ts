import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { formTable } from "@/db/schema/form";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function getFormContentByUrl(formUrl: string) {
  const db = await getDb();
  const form = await db
    .update(formTable)
    .set({
      visits: sql`${formTable.visits} + 1`
    })
    .where(eq(formTable.shareUrl, formUrl))
    .returning({ content: formTable.content })
    .then((res) => res[0]);

  if (!form) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }

  return form;
}
