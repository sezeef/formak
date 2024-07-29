"use server";
import { sql, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { formTable, type InsertForm } from "@/db/schema/form";

export async function createForm(data: InsertForm) {
  try {
    const db = await getDb();
    return await db
      .insert(formTable)
      .values(data)
      .returning({ formId: formTable.id })
      .get();
  } catch (error) {
    console.error("Failed to create form: ", error);
  }
}

export async function getAllFormsByUserId(userId: string) {
  try {
    const db = await getDb();
    return await db
      .select()
      .from(formTable)
      .where(sql`${formTable.userId} = ${userId}`)
      .orderBy(desc(formTable.createdAt))
      .all();
  } catch (error) {
    console.error("Failed to fetch forms: ", error);
  }
}

export async function getFormStatsByUserId(userId: string) {
  try {
    const db = await getDb();
    return await db
      .select({
        totalVisits: sql<number>`sum(${formTable.visits})`,
        totalSubmissions: sql<number>`sum(${formTable.submissions})`
      })
      .from(formTable)
      .where(sql`${formTable.userId} = ${userId}`)
      .get();
  } catch (error) {
    console.error("Failed to fetch form stats: ", error);
  }
}
