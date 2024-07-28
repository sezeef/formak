export const ERROR_CODES = {
  AUTH_UNK_ERR: "AUTH_UNK_ERR",
  AUTH_INVALID_CRED: "AUTH_INVALID_CRED",
  AUTH_INVALID_CODE: "AUTH_INVALID_CODE",
  AUTH_EXPIRED_CODE: "AUTH_EXPIRED_CODE",
  NET_UNAUTHORIZED: "NET_UNAUTHORIZED",
  SYS_EMAIL_SERVICE_ERR: "SYS_EMAIL_SERVICE_ERR",
  SYS_DB_FAILURE: "SYS_DB_FAILURE",
  SYS_DB_DOWN: "SYS_DB_DOWN",
  SYS_INTERNAL_ERR: "SYS_INTERNAL_ERR",
  VAL_INVALID_FIELD: "VAL_INVALID_FIELD"
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
