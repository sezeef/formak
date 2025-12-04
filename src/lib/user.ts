"use server";
import { headers } from "next/headers";
// import { USER_ROLES } from "@/db/schema/user";
import { auth } from "@/lib/auth";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function safeGetUser() {
  let authState: Awaited<ReturnType<typeof auth.api.getSession>> = null;

  try {
    authState = await auth.api.getSession({
      headers: await headers(),
    });
    return authState?.user ?? null;
  } catch (error) {
    console.error("[HOMEPAGE] Error:\n", error);
    return null;
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
  return safeGetUser();
  // const session = await auth();
  // return session?.user;
}

export async function unsafeGetUserOrGuest() {
  return unsafeGetUser();
  // const user = await safeGetUserOrGuest();
  // if (!user) {
  //   throw new AppError(ERROR_CODES.NET_UNAUTHORIZED);
  // }
  // return user;
}
