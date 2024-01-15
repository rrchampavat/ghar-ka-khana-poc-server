import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { badRequestRes } from "@helpers/httpResponseGenerator";

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
      return badRequestRes(res, JSON.parse(error.message)?.[0]?.message);
    }
  };
};

export default validate;
