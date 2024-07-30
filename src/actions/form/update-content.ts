"use server";
import { updateFormContentById } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";
import { unsafeGetUser } from "@/lib/user";

export async function updateContent(id: string, content: string) {
  const user = await unsafeGetUser();

  const result = await updateFormContentById({
    userId: user.id,
    formId: id,
    content
  });

  if (!result) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }
}
