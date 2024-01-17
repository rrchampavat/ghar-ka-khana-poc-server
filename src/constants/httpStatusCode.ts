/* eslint-disable @typescript-eslint/naming-convention */
export const httpStatusCode = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500
};

export const statusMessages: { [key: number | string]: string } = {
  200: "Data retrieved successfully.",
  201: "The data has been successfully inserted.",
  400: "Invalid request.",
  401: "Access unauthorized.",
  403: "Access to this request is forbidden.",
  404: "The requested resource was not found.",
  500: "There is an internal server error.",
  UPDATE_SUCCESS: "The data has been successfully updated!",
  DELETE_SUCCESS: "The data has been successfully deleted!",
  DUPLICATE_ENTRY: "The data already exists."
};
