"use server";
import { redirect } from "next/navigation";
import { safeGetUser } from "@/lib/user";
import { formSchema, unsafeValidate, type FormSchema } from "@/lib/schemas";
import { createForm } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";
import { createGuestUser } from "@/db/query/user";
import { signIn } from "@/lib/auth";
import { USER_ROLES } from "@/db/schema/user";
import { type Locale, localize } from "@/lib/locale";

export async function create(data: FormSchema, locale: Locale) {
  const user = await safeGetUser();
  const { name, description } = unsafeValidate(formSchema, data);

  if (user && user?.role !== USER_ROLES.GUEST) {
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
  } else if (user && user?.role === USER_ROLES.GUEST) {
    // TODO: better handling of this edge case
    // (it shouldn't be allowed in the current version
    // of guest access implementation)
    throw new Error("how did you get here?");
  } else {
    // If guest
    const guest = await createGuestUser();

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

    await signIn("credentials", {
      email: guest.email,
      password: guest.id,
      redirectTo: localize(locale, `/builder/${form.formId}`)
    });
  }
}
