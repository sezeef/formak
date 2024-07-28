"use server";
import { auth } from "@/lib/auth";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function safeGetUser() {
  const session = await auth();
  return session?.user;
}

export async function unsafeGetUser() {
  const user = await safeGetUser();
  if (!user) {
    throw new AppError(ERROR_CODES.NET_UNAUTHORIZED);
  }
  return user;
}
