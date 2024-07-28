import * as z from "zod";
import { AppError, ERROR_CODES } from "@/lib/error";

export function unsafeValidate<T extends z.ZodTypeAny>(
  schema: T,
  input: unknown
): z.infer<T> {
  const validationResult = schema.safeParse(input);
  if (!validationResult.success)
    throw new AppError(ERROR_CODES.VAL_INVALID_FIELD);
  return validationResult.data;
}

export const loginSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(1, {
    message: "Password is required"
  }),
  code: z.optional(z.string())
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required"
  }),
  name: z.string().min(1, {
    message: "Name is required"
  })
});
export type RegisterSchema = z.infer<typeof registerSchema>;

export const newPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required"
  })
});
export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

export const resetSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  })
});
export type ResetSchema = z.infer<typeof resetSchema>;

export const formSchema = z.object({
  name: z.string().min(4),
  description: z.string().optional()
});
export type FormSchema = z.infer<typeof formSchema>;
