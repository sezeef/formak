import { updateFormAndCreateSubmission } from "@/db/query/form";
import { AppError, ERROR_CODES } from "@/lib/error";

export async function submitForm(formUrl: string, content: string) {
  const updatedForm = await updateFormAndCreateSubmission({ formUrl, content });
  if (!updatedForm) {
    throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
  }
  return updatedForm;
}
