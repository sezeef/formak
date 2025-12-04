"use server";
import { redirect } from "next/navigation";
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
    // If guest
    const guest = (await auth.api.signInAnonymous())?.user;

    if (!guest) {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    }

    const form = await createForm({
      userId: guest.id,
      name,
      description
    });

    if (!form?.formId) {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    }

    redirect(localize(locale, `/builder/${form.formId}`));
  }
}
