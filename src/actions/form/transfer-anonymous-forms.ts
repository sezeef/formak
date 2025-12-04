"use server";
import { getDb } from "@/db";
import { formTable } from "@/db/schema/form";
import { eq } from "drizzle-orm";

export async function transferAnonymousForms(fromUserId: string, toUserId: string) {
  try {
    const db = await getDb();

    console.log(`[TRANSFER] Transferring forms from ${fromUserId} to ${toUserId}`);

    // Check how many forms exist for old user
    const oldForms = await db
      .select()
      .from(formTable)
      .where(eq(formTable.userId, fromUserId))
      .all();

    console.log(`[TRANSFER] Found ${oldForms.length} forms to transfer:`, oldForms.map(f => f.name));

    // Transfer all forms from anonymous user to new registered user
    const result = await db
      .update(formTable)
      .set({ userId: toUserId })
      .where(eq(formTable.userId, fromUserId));

    console.log(`[TRANSFER] Transfer complete, rows affected:`, result.rowsAffected);

    // Verify transfer
    const newForms = await db
      .select()
      .from(formTable)
      .where(eq(formTable.userId, toUserId))
      .all();

    console.log(`[TRANSFER] New user now has ${newForms.length} forms`);

    return { success: true };
  } catch (error) {
    console.error("[TRANSFER] Failed to transfer forms:", error);
    return { success: false };
  }
}
