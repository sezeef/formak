"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { NewPasswordSchema } from "@/lib/schemas";
import { getPasswordResetTokenByToken } from "@/db/query/password-reset-token";
import { getUserByEmail } from "@/db/query/user";
import { passwordResetTokenTable, userTable } from "@/db/schema/user";
import { eq } from "drizzle-orm";

export async function newPassword(
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .update(userTable)
    .set({ password: hashedPassword })
    .where(eq(userTable.id, existingUser.id));
  await db
    .delete(passwordResetTokenTable)
    .where(eq(passwordResetTokenTable.id, existingToken.id));

  return { success: "Password updated!" };
}
