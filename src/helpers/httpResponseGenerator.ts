import { Response } from "express";
import { httpStatusCode, statusMessages } from "@constants/httpStatusCode.ts";

export const notFoundRes = (
  res: Response,
  message = statusMessages[httpStatusCode["SUCCESS"]]!
) => {
  return res
    .status(httpStatusCode["SUCCESS"])
    .json({ message, success: false });
};

export const fetchSuccess = (
  res: Response,
  message = statusMessages[httpStatusCode["SUCCESS"]]!,
  data: any
) => {
  return res
    .status(httpStatusCode["SUCCESS"])
    .json({ message, data, success: true });
};

export const postSuccess = (
  res: Response,
  message = statusMessages[httpStatusCode["CREATED"]]!
) => {
  return res.status(httpStatusCode["CREATED"]).json({ message, success: true });
};

export const updateSuccess = (
  res: Response,
  message = statusMessages["UPDATE_SUCCESS"]!,
  data?: any
) => {
  return res
    .status(httpStatusCode["NO_CONTENT"])
    .json({ message, data, success: true });
};

export const deleteSuccess = (
  res: Response,
  message = statusMessages["DELETE_SUCCESS"]!
) => {
  return res
    .status(httpStatusCode["NO_CONTENT"])
    .json({ message, success: true });
};

export const notAuthorizedRes = (
  res: Response,
  message = statusMessages[httpStatusCode["UNAUTHORIZED"]]!
) => {
  return res
    .status(httpStatusCode["UNAUTHORIZED"])
    .json({ message, success: false });
};

export const forbiddenRes = (
  res: Response,
  message = statusMessages[httpStatusCode["FORBIDDEN"]]!
) => {
  return res
    .status(httpStatusCode["FORBIDDEN"])
    .json({ message, success: false });
};

export const badRequestRes = (
  res: Response,
  message = statusMessages[httpStatusCode["BAD_REQUEST"]]!
) => {
  return res
    .status(httpStatusCode["BAD_REQUEST"])
    .json({ message, success: false });
};

export const duplicateEntry = (
  res: Response,
  message = statusMessages["DUPLICATE_ENTRY"]!
) => {
  return res
    .status(httpStatusCode["SUCCESS"])
    .json({ message, success: false });
};
