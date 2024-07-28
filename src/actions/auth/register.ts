"use server";
import bcrypt from "bcryptjs";
import {
  type RegisterSchema,
  registerSchema,
  unsafeValidate
} from "@/lib/schemas";
import { createUser, getUserByEmail } from "@/db/query/user";
import { sendVerificationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/tokens";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function register(values: RegisterSchema) {
  const { email, password, name } = unsafeValidate(registerSchema, values);
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new AppError(ERROR_CODES.AUTH_EXISTING_EMAIL);
  }

  const user = await createUser({
    name,
    email,
    password: hashedPassword
  });

  if (!user) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }

  const verificationToken = await generateVerificationToken(email);

  if (!verificationToken) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { status: "CONFIRMATION_SENT" as const };
}
