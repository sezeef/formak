"use server";
import { getFormById } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";
import { unsafeGetUser } from "@/lib/user";

export async function getForm(id: string) {
  const user = await unsafeGetUser();
  const form = await getFormById({
    formId: id,
    userId: user.id
  });
  if (!form) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }
  return form;
}
