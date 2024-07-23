"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { userTable } from "@/db/schema/user";
import { RegisterSchema } from "@/lib/schemas";
import { getUserByEmail } from "@/db/query/user";
import { sendVerificationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/tokens";

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.insert(userTable).values({
    name,
    email,
    password: hashedPassword
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
}
