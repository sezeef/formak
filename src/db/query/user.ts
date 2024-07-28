"use server";
import { getDb } from "@/db";
import { userTable } from "@/db/schema/user";
import { eq } from "drizzle-orm";

export async function createUser({
  name,
  email,
  password
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const db = await getDb();
    return await db.insert(userTable).values({
      name,
      email,
      password
    });
  } catch (error) {
    console.error("Failed to create user: ", error);
  }
}

export async function updateUserPasswordById({
  id,
  password
}: {
  id: string;
  password: string;
}) {
  try {
    const db = await getDb();
    return await db
      .update(userTable)
      .set({ password })
      .where(eq(userTable.id, id));
  } catch (error) {
    console.error("Failed to update user: ", error);
  }
}

export async function updateUserVerifiedById({
  id,
  email
}: {
  id: string;
  email: string;
}) {
  try {
    const db = await getDb();
    return await db
      .update(userTable)
      .set({ email, emailVerified: new Date() })
      .where(eq(userTable.id, id));
  } catch (error) {
    console.error("Failed to update user: ", error);
  }
}

export async function getUserByEmail(email: string) {
  try {
    const db = await getDb();
    return await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch user: ", error);
  }
}

export async function getUserById(id: string) {
  try {
    const db = await getDb();
    return await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch user: ", error);
  }
}
