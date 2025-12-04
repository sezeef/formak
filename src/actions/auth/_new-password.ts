// "use server";
// import bcrypt from "bcryptjs";
// import {
//   type NewPasswordSchema,
//   newPasswordSchema,
//   unsafeValidate
// } from "@/lib/schemas";
// import {
//   deleteResetPasswordTokenByTokenId,
//   getPasswordResetTokenByToken
// } from "@/db/query/password-reset-token";
// import { getUserByEmail, updateUserPasswordById } from "@/db/query/user";
// import { AppError, ERROR_CODES } from "@/lib/error";
//
// export async function newPassword(
//   values: NewPasswordSchema,
//   token?: string | null
// ) {
//   if (!token) {
//     throw new AppError(ERROR_CODES.AUTH_INVALID_TOKEN);
//   }
//
//   const { password } = unsafeValidate(newPasswordSchema, values);
//
//   const existingToken = await getPasswordResetTokenByToken(token);
//
//   if (!existingToken) {
//     throw new AppError(ERROR_CODES.AUTH_INVALID_TOKEN);
//   }
//
//   const hasExpired = new Date(existingToken.expires) < new Date();
//
//   if (hasExpired) {
//     throw new AppError(ERROR_CODES.AUTH_EXPIRED_TOKEN);
//   }
//
//   const existingUser = await getUserByEmail(existingToken.email);
//
//   if (!existingUser) {
//     throw new AppError(ERROR_CODES.AUTH_INVALID_EMAIL);
//   }
//
//   const hashedPassword = await bcrypt.hash(password, 10);
//
//   const isUserUpdated = await updateUserPasswordById({
//     id: existingUser.id,
//     password: hashedPassword
//   });
//
//   const isResetTokenDeleted = await deleteResetPasswordTokenByTokenId(
//     existingToken.id
//   );
//
//   if (!isUserUpdated || !isResetTokenDeleted) {
//     throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
//   }
//   return { status: "PASSWORD_RESET" as const };
// }
