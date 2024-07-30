import { getFormWithSubmissionsById } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";
import { unsafeGetUser } from "@/lib/user";

export async function getFormWithSubmissions(id: string) {
  await unsafeGetUser();

  const form = await getFormWithSubmissionsById({
    formId: id
  });

  if (!form) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }

  return form;
}
