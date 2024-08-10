"use server";
import { USER_ROLES } from "@/db/schema/user";
import { auth } from "@/lib/auth";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function safeGetUser() {
  const session = await auth();
  if (session?.user && session.user.role !== USER_ROLES.GUEST) {
    return session.user;
  }
}

export async function unsafeGetUser() {
  const user = await safeGetUser();
  if (!user) {
    throw new AppError(ERROR_CODES.NET_UNAUTHORIZED);
  }
  return user;
}

export async function safeGetUserOrGuest() {
  const session = await auth();
  return session?.user;
}

export async function unsafeGetUserOrGuest() {
  const user = await safeGetUserOrGuest();
  if (!user) {
    throw new AppError(ERROR_CODES.NET_UNAUTHORIZED);
  }
  return user;
}
