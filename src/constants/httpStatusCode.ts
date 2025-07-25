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
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500
};

export const statusMessages: { [key: number | string]: string } = {
  200: "Request completed successfully.",
  201: "New data has been created.",
  400: "The request was invalid or malformed.",
  401: "You must be logged in to access this resource.",
  403: "You do not have permission to perform this action.",
  404: "We couldn’t find what you were looking for.",
  409: "The resource you are trying to create already exists.",
  500: "Something went wrong on our end. Please try again later.",
  UPDATE_SUCCESS: "Changes saved successfully.",
  DELETE_SUCCESS: "Item deleted successfully.",
  DUPLICATE_ENTRY: "This entry already exists. No action was taken."
};
