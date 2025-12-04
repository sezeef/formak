"use server";
import { redirect } from "next/navigation";
import { headers as getHeaders, cookies } from "next/headers";
import {
  type RegisterSchema,
  registerSchema,
  unsafeValidate
} from "@/lib/schemas";
import { auth } from "@/lib/auth";
import { AppError, ERROR_CODES } from "@/lib/error";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

export async function register(values: RegisterSchema) {
  const { email, password, name } = unsafeValidate(registerSchema, values);

  try {
    const response = await auth.api.signUpEmail({
      body: { email, password, name },
      headers: await getHeaders(),
      asResponse: true
    });

    if (!response?.ok) {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    }

    // Extract and set cookies from the response
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const cookieStore = await cookies();
      // Parse and set each cookie
      const cookiePairs = setCookieHeader.split(", ").map(c => c.split(";")[0]);
      for (const pair of cookiePairs) {
        const [name, value] = pair.split("=");
        if (name && value) {
          cookieStore.set(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
          });
        }
      }
    }

    // Redirect to dashboard after successful registration (no email verification)
    redirect(DEFAULT_LOGIN_REDIRECT);
  } catch (error) {
    // Re-throw redirect errors
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    // Handle better-auth specific errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("already exists") || errorMessage.includes("duplicate")) {
      throw new AppError(ERROR_CODES.AUTH_EXISTING_EMAIL);
    }
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }
}
