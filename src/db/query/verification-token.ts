"use server";
import { db } from "@/db";
import {
  InsertVerificationToken,
  verificationTokenTable
} from "@/db/schema/user";
import { eq } from "drizzle-orm";

export async function getVerificationTokenByToken(token: string) {
  try {
    return db
      .select()
      .from(verificationTokenTable)
      .where(eq(verificationTokenTable.token, token))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch verification token: ", error);
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    return db
      .select()
      .from(verificationTokenTable)
      .where(eq(verificationTokenTable.email, email))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch verification token: ", error);
  }
}

export async function deleteVerificationTokenById(id: string) {
  try {
    return await db
      .delete(verificationTokenTable)
      .where(eq(verificationTokenTable.id, id));
  } catch (error) {
    console.error("Failed to delete verification token: ", error);
  }
}

export async function createVerificationToken({
  email,
  token,
  expires
}: InsertVerificationToken) {
  try {
    return await db
      .insert(verificationTokenTable)
      .values({ email, token, expires })
      .returning()
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to create verification token: ", error);
  }
}
