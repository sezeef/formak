"use server";
import { db } from "@/db";
import { userTable } from "@/db/schema/user";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  try {
    return await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch user: ", error);
  }
}

export async function getUserById(id: string) {
  try {
    return await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch user: ", error);
  }
}
