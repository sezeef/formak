// "use server";
// import { getDb } from "@/db";
// import { eq } from "drizzle-orm";
// import { passwordResetTokenTable } from "@/db/schema/user";
//
// export async function getPasswordResetTokenByToken(token: string) {
//   try {
//     const db = await getDb();
//     return await db
//       .select()
//       .from(passwordResetTokenTable)
//       .where(eq(passwordResetTokenTable.token, token))
//       .then((res) => res?.[0]);
//   } catch (error) {
//     console.error("Failed to fetch password reset token: ", error);
//   }
// }
//
// export async function getPasswordResetTokenByEmail(email: string) {
//   try {
//     const db = await getDb();
//     return await db
//       .select()
//       .from(passwordResetTokenTable)
//       .where(eq(passwordResetTokenTable.email, email))
//       .then((res) => res?.[0]);
//   } catch (error) {
//     console.error("Failed to fetch password reset token: ", error);
//   }
// }
//
// export async function deleteResetPasswordTokenByTokenId(tokenId: string) {
//   try {
//     const db = await getDb();
//     return await db
//       .delete(passwordResetTokenTable)
//       .where(eq(passwordResetTokenTable.id, tokenId));
//   } catch (error) {
//     console.error("Failed to delete reset password token: ", error);
//   }
// }
