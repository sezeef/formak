"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { type LoginSchema, loginSchema, unsafeValidate } from "@/lib/schemas";
import { AppError, ERROR_CODES } from "@/lib/error";
import { auth } from "@/lib/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

export async function login(values: LoginSchema, callbackUrl?: string | null) {
  const { email, password } = unsafeValidate(loginSchema, values);

  try {
    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers()
    });

    if (!result) {
      throw new AppError(ERROR_CODES.AUTH_INVALID_CRED);
    }

    // Redirect on successful login
    redirect(callbackUrl || DEFAULT_LOGIN_REDIRECT);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      // This is a redirect, not an error. Re-throw it.
      throw error;
    }
    throw new AppError(ERROR_CODES.AUTH_INVALID_CRED);
  }
}
