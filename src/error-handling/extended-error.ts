import { httpStatusCode, statusMessages } from "@constants/httpStatusCode";
import { logError } from "@middlewares/errorHandler";
import BaseError from "error-handling/base-error";
import { TokenExpiredError } from "jsonwebtoken";

export class APIError extends BaseError {
  constructor(error: any) {
    let description = statusMessages[error.code] || statusMessages["500"]!;
    let statusCode = httpStatusCode.SERVER_ERROR;

    logError({ error, message: "API Error" });

    if (error instanceof TokenExpiredError) {
      description = "Your session has expired. Please log in again.";
      statusCode = httpStatusCode.UNAUTHORIZED;
    }

    super("API Error", statusCode, description);
  }
}

export class DBError extends BaseError {
  constructor(error: any) {
    logError({ error, message: "Database Error" });

    const description =
      statusMessages[error.code] || "An issue occurred with the database!";

    super("DB Error", httpStatusCode.SERVER_ERROR, description);
  }
}
