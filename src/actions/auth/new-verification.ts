"use server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { getUserByEmail } from "@/db/query/user";
import { getVerificationTokenByToken } from "@/db/query/verification-token";
import { userTable, verificationTokenTable } from "@/db/schema/user";

export async function newVerification(token: string) {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db
    .update(userTable)
    .set({ email: existingToken.email, emailVerified: new Date() })
    .where(eq(userTable.id, existingUser.id));
  await db
    .delete(verificationTokenTable)
    .where(eq(verificationTokenTable.id, existingToken.id));

  return { success: "Email verified!" };
}
