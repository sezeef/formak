"use server";
import { type ResetSchema, resetSchema, unsafeValidate } from "@/lib/schemas";
import { getUserByEmail } from "@/db/query/user";
import { sendPasswordResetEmail } from "@/lib/email";
import { generatePasswordResetToken } from "@/lib/tokens";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function reset(values: ResetSchema) {
  const { email } = unsafeValidate(resetSchema, values);

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    throw new AppError(ERROR_CODES.AUTH_INVALID_EMAIL);
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  if (!passwordResetToken) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }

  const res = await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  if (!res) {
    throw new AppError(ERROR_CODES.SYS_EMAIL_SERVICE_ERR);
  }

  return { status: "REST_EMAIL_SENT" as const };
}
