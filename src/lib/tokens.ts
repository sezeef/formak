"use server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { passwordResetTokenTable, twoFactorTokenTable } from "@/db/schema/user";
import { getPasswordResetTokenByEmail } from "@/db/query/password-reset-token";
import {
  createVerificationToken,
  deleteVerificationTokenById,
  getVerificationTokenByEmail
} from "@/db/query/verification-token";
import {
  deleteTwoFactorTokenById,
  getTwoFactorTokenByEmail
} from "@/db/query/two-factor-token";

export async function generateTwoFactorToken(email: string) {
  const db = await getDb();
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await deleteTwoFactorTokenById(existingToken.id);
  }

  return await db
    .insert(twoFactorTokenTable)
    .values({ email, token, expires })
    .returning()
    .then((res) => res?.[0]);
}

export async function generatePasswordResetToken(email: string) {
  const db = await getDb();
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetTokenTable)
      .where(eq(passwordResetTokenTable.id, existingToken.id));
  }

  return await db
    .insert(passwordResetTokenTable)
    .values({ email, token, expires })
    .returning()
    .then((res) => res?.[0]);
}

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await deleteVerificationTokenById(existingToken.id);
  }

  return await createVerificationToken({
    email,
    token,
    expires
  });
}
