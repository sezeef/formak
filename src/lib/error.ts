export const ERROR_CODES = {
  VAL_INVALID_FIELD: "VAL_INVALID_FIELD",
  AUTH_INVALID_CRED: "AUTH_INVALID_CRED",
  AUTH_INVALID_CODE: "AUTH_INVALID_CODE",
  AUTH_EXPIRED_CODE: "AUTH_EXPIRED_CODE",
  AUTH_UNK_ERR: "AUTH_UNK_ERR",
  SYS_EMAIL_SERVICE_ERR: "SYS_EMAIL_SERVICE_ERR"
} as const;

export type ErrorType = keyof typeof ERROR_CODES;

export class AppError extends Error {
  constructor(public message: ErrorType) {
    super(message);
  }
}

export function isAppError(error: unknown): error is AppError {
  return (
    error != null &&
    typeof error === "object" &&
    "message" in error &&
    Object.values(ERROR_CODES).includes(error.message as ErrorType)
  );
}
