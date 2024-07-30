"use server";
import { publishFormById } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";
import { unsafeGetUser } from "@/lib/user";

export async function publishForm(id: string) {
  const user = await unsafeGetUser();
  const result = await publishFormById({
    formId: id,
    userId: user.id
  });

  if (!result) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }
}
