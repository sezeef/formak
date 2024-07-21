"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import {
  twoFactorConfirmationTable,
  twoFactorTokenTable
} from "@/db/schema/user";

export async function getTwoFactorConfirmationByUserId(userId: string) {
  try {
    return await db
      .select()
      .from(twoFactorConfirmationTable)
      .where(eq(twoFactorConfirmationTable.userId, userId))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch two-factor auth token: ", error);
  }
}

export async function getTwoFactorTokenByToken(token: string) {
  try {
    return await db
      .select()
      .from(twoFactorTokenTable)
      .where(eq(twoFactorTokenTable.token, token))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch two-factor auth token: ", error);
  }
}

export async function getTwoFactorTokenByEmail(email: string) {
  try {
    return await db
      .select()
      .from(twoFactorTokenTable)
      .where(eq(twoFactorTokenTable.email, email))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch two-factor auth token: ", error);
  }
}
