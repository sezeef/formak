// "use server";
// import { getDb } from "@/db";
// import {
//   InsertVerificationToken,
//   verificationTokenTable
// } from "@/db/schema/user";
// import { eq } from "drizzle-orm";
//
// export async function getVerificationTokenByToken(token: string) {
//   try {
//     const db = await getDb();
//     return db
//       .select()
//       .from(verificationTokenTable)
//       .where(eq(verificationTokenTable.token, token))
//       .then((res) => res?.[0]);
//   } catch (error) {
//     console.error("Failed to fetch verification token: ", error);
//   }
// }
//
// export async function getVerificationTokenByEmail(email: string) {
//   try {
//     const db = await getDb();
//     return db
//       .select()
//       .from(verificationTokenTable)
//       .where(eq(verificationTokenTable.email, email))
//       .then((res) => res?.[0]);
//   } catch (error) {
//     console.error("Failed to fetch verification token: ", error);
//   }
// }
//
// export async function deleteVerificationTokenById(id: string) {
//   try {
//     const db = await getDb();
//     return await db
//       .delete(verificationTokenTable)
//       .where(eq(verificationTokenTable.id, id));
//   } catch (error) {
//     console.error("Failed to delete verification token: ", error);
//   }
// }
//
// export async function createVerificationToken({
//   email,
//   token,
//   expires
// }: InsertVerificationToken) {
//   try {
//     const db = await getDb();
//     return await db
//       .insert(verificationTokenTable)
//       .values({ email, token, expires })
//       .returning()
//       .then((res) => res?.[0]);
//   } catch (error) {
//     console.error("Failed to create verification token: ", error);
//   }
// }
