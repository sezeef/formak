"use server";
import {
  type RegisterSchema,
  registerSchema,
  unsafeValidate
} from "@/lib/schemas";
// import { createUser, getUserByEmail } from "@/db/query/user";
// import { sendVerificationEmail } from "@/lib/email";
// import { generateVerificationToken } from "@/lib/tokens";
import { auth } from "@/lib/auth";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function register(values: RegisterSchema) {
  const { email, password, name } = unsafeValidate(registerSchema, values);

  // const existingUser = await getUserByEmail(email);
  //
  // if (existingUser) {
  //   throw new AppError(ERROR_CODES.AUTH_EXISTING_EMAIL);
  // }

  // const user = await createUser({
  //   name,
  //   email,
  //   password: hashedPassword
  // });
  const { user } = await auth.api.signUpEmail({
    body: { email, password, name }
  });

  if (!user) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }

  // Email verification disabled for now
  // const verificationToken = await generateVerificationToken(email);
  //
  // if (!verificationToken) {
  //   throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  // }
  //
  // await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { status: "CONFIRMATION_SENT" as const };
}
