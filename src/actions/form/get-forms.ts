"use server";
import { unsafeGetUser } from "@/lib/user";
import { getAllFormsByUserId } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function getForms() {
  const user = await unsafeGetUser();
  const forms = await getAllFormsByUserId(user.id);
  if (!forms) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }
  return forms;
}
