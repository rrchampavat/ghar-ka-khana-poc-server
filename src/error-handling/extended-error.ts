import BaseError from "error-handling/base-error.ts";
import { httpStatusCode, statusMessages } from "@constants/httpStatusCode.ts";

export class APIError extends BaseError {
  constructor(error: any) {
    const description = statusMessages[error.code] || statusMessages["500"]!;
    super("API Error", httpStatusCode["SERVER_ERROR"], description);
  }
}

export class DBError extends BaseError {
  constructor(error: any) {
    const description =
      statusMessages[error.code] || "An issue occurred with the database!";

    super("DB Error", httpStatusCode["SERVER_ERROR"], description);
  }
}
