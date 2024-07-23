"use server";
import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { LoginSchema } from "@/lib/schemas";
import { getUserByEmail } from "@/db/query/user";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmationById,
  deleteTwoFactorTokenById,
  getTwoFactorTokenByEmail
} from "@/db/query/two-factor-token";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/email";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { AppError, ERROR_CODES } from "@/lib/error";
import {
  generateVerificationToken,
  generateTwoFactorToken
} from "@/lib/tokens";
import { getTwoFactorConfirmationByUserId } from "@/db/query/two-factor-token";
import type { SelectUser } from "@/db/schema/user";

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) {
  const { email, password, code } = handleValidation(values);
  const user = await handleGetUser(email);

  if (!user.emailVerified) {
    return await handleEmailNotVerified(user);
  }

  const generatedToken = await handle2fa(user, code);
  if (generatedToken) return generatedToken;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      throw new AppError(ERROR_CODES.AUTH_INVALID_CRED);
    } else {
      throw new AppError(ERROR_CODES.AUTH_UNK_ERR);
    }
  }
}

async function handleEmailNotVerified(user: SelectUser) {
  const verificationToken = await generateVerificationToken(user.email);

  if (!verificationToken) {
    throw new AppError(ERROR_CODES.AUTH_UNK_ERR);
  }

  const res = await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token
  );

  if (res.error) {
    console.error(res.error);
    throw new AppError(ERROR_CODES.SYS_EMAIL_SERVICE_ERR);
  }

  return { messageCode: "message:success" };
}

function handleValidation(input: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(input);
  if (!validatedFields.success) {
    throw new AppError(ERROR_CODES.VAL_INVALID_FIELD);
  }

  return validatedFields.data;
}

async function handleGetUser(email: string): Promise<SelectUser> {
  const user = await getUserByEmail(email);

  if (!user || !user.email || !user.password) {
    throw new AppError(ERROR_CODES.AUTH_INVALID_CRED);
  }

  return user;
}

async function handle2faValidation(user: SelectUser, code: string) {
  const twoFactorToken = await getTwoFactorTokenByEmail(user.email);

  if (!twoFactorToken || twoFactorToken.token !== code) {
    throw new AppError(ERROR_CODES.AUTH_INVALID_CODE);
  }

  const hasExpired = new Date(twoFactorToken.expires) < new Date();
  if (hasExpired) {
    throw new AppError(ERROR_CODES.AUTH_EXPIRED_CODE);
  }

  await deleteTwoFactorTokenById(twoFactorToken.id);

  const existingConfirmation = await getTwoFactorConfirmationByUserId(user.id);

  if (existingConfirmation) {
    await deleteTwoFactorConfirmationById(existingConfirmation.id);
  }

  await createTwoFactorConfirmation(user.id);
}

async function handle2faGeneration(user: SelectUser) {
  const twoFactorToken = await generateTwoFactorToken(user.email);
  await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

  return { twoFactor: true };
}

async function handle2fa(user: SelectUser, code?: string) {
  if (code) {
    await handle2faValidation(user, code);
  } else {
    return await handle2faGeneration(user);
  }
}
