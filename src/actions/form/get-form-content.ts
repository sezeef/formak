import { getDb } from "@/db";
import { formTable } from "@/db/schema/form";
import { eq, sql } from "drizzle-orm";

export async function getFormContentByUrl(formUrl: string) {
  const db = await getDb();
  return await db
    .update(formTable)
    .set({
      visits: sql`${formTable.visits} + 1`
    })
    .where(eq(formTable.shareUrl, formUrl))
    .returning({ content: formTable.content })
    .then((res) => res[0]);
}
