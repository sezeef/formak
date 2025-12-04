"use server";
import { headers } from "next/headers";
import {
  type RegisterSchema,
  registerSchema,
  unsafeValidate
} from "@/lib/schemas";
import { auth } from "@/lib/auth";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function register(values: RegisterSchema) {
  const { email, password, name } = unsafeValidate(registerSchema, values);

  try {
    const result = await auth.api.signUpEmail({
      body: { email, password, name },
      headers: await headers()
    });

    if (!result || !result.user) {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    }

    // Email verification disabled for now
    return { status: "CONFIRMATION_SENT" as const };
  } catch (error) {
    // Handle better-auth specific errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("already exists") || errorMessage.includes("duplicate")) {
      throw new AppError(ERROR_CODES.AUTH_EXISTING_EMAIL);
    }
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }
}
