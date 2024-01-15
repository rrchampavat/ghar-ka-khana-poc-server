/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { APIError, DBError } from "error-handling/extended-error";
import { httpStatusCode, statusMessages } from "@constants/httpStatusCode";
import { Error } from "postgres";

export const logError = (ERROR: Error) => {
  console.error({ ERROR });
};

export const logErrorMiddleware = async (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  logError(err);

  if (Number(err.code)) {
    return next(new DBError(err));
  }

  return next(new APIError(err));
};

export const returnError = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(err.statusCode || httpStatusCode["SERVER_ERROR"]).json({
    message: err.description || statusMessages["500"],
    success: false
  });
};
