import BaseError from "error-handling/base-error";
import { httpStatusCode, statusMessages } from "@constants/httpStatusCode";
import { TokenExpiredError } from "jsonwebtoken";

export class APIError extends BaseError {
  constructor(error: any) {
    let description = statusMessages[error.code] || statusMessages["500"]!;
    let statusCode = httpStatusCode.SERVER_ERROR;

    if (error instanceof TokenExpiredError) {
      description = "Your session has expired. Please log in again.";
      statusCode = httpStatusCode.UNAUTHORIZED;
    }

    super("API Error", statusCode, description);
  }
}

export class DBError extends BaseError {
  constructor(error: any) {
    const description =
      statusMessages[error.code] || "An issue occurred with the database!";

    super("DB Error", httpStatusCode.SERVER_ERROR, description);
  }
}
