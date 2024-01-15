import { Response } from "express";
import { httpStatusCode, statusMessages } from "@constants/httpStatusCode";

const createApiResponse = (
  res: Response,
  statusCode: number,
  options: API_RESPONSE_OPTIONS
): Response => {
  return res.status(statusCode).json(options);
};

export const notFoundRes = (res: Response, message?: string) => {
  return createApiResponse(res, httpStatusCode.SUCCESS, {
    message: message || statusMessages[httpStatusCode.SUCCESS]!,
    success: false
  });
};

export const fetchSuccess = (res: Response, message?: string, data?: any) => {
  return createApiResponse(res, httpStatusCode.SUCCESS, {
    message: message || statusMessages[httpStatusCode.SUCCESS]!,
    data,
    success: true
  });
};

export const postSuccess = (res: Response, message?: string, data?: any) => {
  return createApiResponse(res, httpStatusCode.CREATED, {
    message: message || statusMessages[httpStatusCode.CREATED]!,
    success: true,
    data
  });
};

export const updateSuccess = (res: Response, message?: string, data?: any) => {
  return createApiResponse(res, httpStatusCode.NO_CONTENT, {
    message: message || statusMessages.UPDATE_SUCCESS!,
    data,
    success: true
  });
};

export const deleteSuccess = (res: Response, message?: string) => {
  return createApiResponse(res, httpStatusCode.NO_CONTENT, {
    message: message || statusMessages.DELETE_SUCCESS!,
    success: true
  });
};

export const notAuthorizedRes = (res: Response, message?: string) => {
  return createApiResponse(res, httpStatusCode.UNAUTHORIZED, {
    message: message || statusMessages[httpStatusCode.UNAUTHORIZED]!,
    success: false
  });
};

export const forbiddenRes = (res: Response, message?: string) => {
  return createApiResponse(res, httpStatusCode.FORBIDDEN, {
    message: message || statusMessages[httpStatusCode.FORBIDDEN]!,
    success: false
  });
};

export const badRequestRes = (res: Response, message?: string) => {
  return createApiResponse(res, httpStatusCode.BAD_REQUEST, {
    message: message || statusMessages[httpStatusCode.BAD_REQUEST]!,
    success: false
  });
};

export const duplicateEntry = (res: Response, message?: string) => {
  return createApiResponse(res, httpStatusCode.SUCCESS, {
    message: message || statusMessages.DUPLICATE_ENTRY!,
    success: false
  });
};
