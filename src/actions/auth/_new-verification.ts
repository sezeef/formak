// "use server";
// import { getUserByEmail, updateUserVerifiedById } from "@/db/query/user";
// import {
//   deleteVerificationTokenById,
//   getVerificationTokenByToken
// } from "@/db/query/verification-token";
// import { AppError, ERROR_CODES } from "@/lib/error";
//
// export async function newVerification(token: string) {
//   const existingToken = await getVerificationTokenByToken(token);
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
//   const isUserUpdated = await updateUserVerifiedById({
//     id: existingUser.id,
//     email: existingToken.email
//   });
//   const isTokenDeleted = await deleteVerificationTokenById(existingToken.id);
//
//   if (!isUserUpdated || !isTokenDeleted) {
//     throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
//   }
//
//   return { status: "EMAIL_VERIFIED" as const };
// }
