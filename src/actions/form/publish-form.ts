"use server";
import { getFormById, publishFormById } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";
import { unsafeGetUser } from "@/lib/user";

export async function publishForm(id: string) {
  const user = await unsafeGetUser();

  const form = await getFormById({
    userId: user.id,
    formId: id
  });

  if (!form) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }

  if (!form.content) {
    throw new AppError(ERROR_CODES.VAL_INVALID_FIELD);
  }

  const result = await publishFormById({
    formId: id,
    userId: user.id
  });

  if (!result) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }
}
