"use server";
import { redirect } from "next/navigation";
import { headers as getHeaders, cookies } from "next/headers";
import { type LoginSchema, loginSchema, unsafeValidate } from "@/lib/schemas";
import { AppError, ERROR_CODES } from "@/lib/error";
import { auth } from "@/lib/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

export async function login(values: LoginSchema, callbackUrl?: string | null) {
  const { email, password } = unsafeValidate(loginSchema, values);

  try {
    const response = await auth.api.signInEmail({
      body: { email, password },
      headers: await getHeaders(),
      asResponse: true
    });

    if (!response?.ok) {
      throw new AppError(ERROR_CODES.AUTH_INVALID_CRED);
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
