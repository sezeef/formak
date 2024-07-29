"use server";
import { unsafeGetUser } from "@/lib/user";
import { formSchema, unsafeValidate, type FormSchema } from "@/lib/schemas";
import { createForm } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function create(data: FormSchema) {
  const user = await unsafeGetUser();
  const { name, description } = unsafeValidate(formSchema, data);
  const formId = await createForm({
    userId: user.id,
    name,
    description
  });

  if (!formId) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }

  return formId;
}
