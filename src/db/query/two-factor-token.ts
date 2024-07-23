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

export async function deleteTwoFactorTokenById(id: string) {
  try {
    return await db
      .delete(twoFactorTokenTable)
      .where(eq(twoFactorTokenTable.id, id));
  } catch (error) {
    console.error("Failed to delete verification token: ", error);
  }
}

export async function deleteTwoFactorConfirmationById(id: string) {
  try {
    return await db
      .delete(twoFactorConfirmationTable)
      .where(eq(twoFactorConfirmationTable.id, id));
  } catch (error) {
    console.error("Failed to delete confirmation token: ", error);
  }
}

export async function createTwoFactorConfirmation(userId: string) {
  try {
    return await db.insert(twoFactorConfirmationTable).values({ userId });
  } catch (error) {
    console.error("Failed to create confirmation token: ", error);
  }
}
