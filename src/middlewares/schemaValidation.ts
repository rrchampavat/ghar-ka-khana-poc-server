import httpStatusCode from "@constants/httpStatusCode.ts";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body, query, params } = req;

      await schema.parseAsync({
        body,
        query,
        params
      });

      return next();
    } catch (error: any) {
      return res.status(httpStatusCode["BAD_REQUEST"]).json({
        message: JSON.parse(error.message)?.[0]?.message,
        success: false
      });
    }
  };
};

export default validate;
