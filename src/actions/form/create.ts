"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { safeGetUser } from "@/lib/user";
import { formSchema, unsafeValidate, type FormSchema } from "@/lib/schemas";
import { createForm } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";
import { auth } from "@/lib/auth";
import { type Locale, localize } from "@/lib/locale";

export async function create(data: FormSchema, locale: Locale) {
  const user = await safeGetUser();
  const { name, description } = unsafeValidate(formSchema, data);

  if (user && !user.isAnonymous) {
    // If user is logged in
    const form = await createForm({
      userId: user.id,
      name,
      description
    });
    if (!form?.formId) {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    }

    redirect(localize(locale, `/builder/${form.formId}`));
  } else {
    // If guest - sign in anonymously with asResponse to get cookies
    const result = await auth.api.signInAnonymous({
      headers: await headers(),
      asResponse: true
    });

    if (!result) {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    }

    const data = await result.json();

    if (!data?.user) {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    }

    const form = await createForm({
      userId: data.user.id,
      name,
      description
    });

    if (!form?.formId) {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    }

    redirect(localize(locale, `/builder/${form.formId}`));
  }
}
