/* eslint-disable no-console */
import { httpStatusCode, statusMessages } from "@constants/httpStatusCode";
import { APIError, DBError } from "error-handling/extended-error";
import { NextFunction, Request, Response } from "express";
import { Error } from "postgres";

export const logError = ({
  error,
  message
}: {
  error: Error;
  message: string;
}) => {
  console.error(`<===== ${message} =====>`);
  console.error(error);
};

export const logErrorMiddleware = async (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (err.constructor.name === "PostgresError") {
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
  return res.status(err.statusCode || httpStatusCode.SERVER_ERROR).json({
    message: err.description || statusMessages["500"],
    success: false
  });
};
