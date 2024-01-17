import { Request, Response } from "express";
import { httpStatusCode } from "./httpStatusCode";

export const DEFAULT_WINDOW_MS = 60 * 1000;

export const DEFAULT_LIMIT = 3;

export const defaultRateLimitHandler = (_req: Request, res: Response) =>
  res
    .status(httpStatusCode.TOO_MANY_REQUESTS)
    .json({ message: "You have exceeded your 3 requests per minute limit." });
