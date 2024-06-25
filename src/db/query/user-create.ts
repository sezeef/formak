"use server";
import { db } from "@/db";
import { InsertUser, userTable } from "@/db/schema/user";

export async function createUser(data: InsertUser) {
  await db.insert(userTable).values(data);
}
