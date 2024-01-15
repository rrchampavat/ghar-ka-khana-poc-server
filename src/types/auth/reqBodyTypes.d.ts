import { Request } from "express";
import z from "zod";

type REGISTER_BODY_SCHEMA_TYPE = z.infer<typeof registerBodySchema>["body"];
export interface REGISTER_REQUEST extends Request {
  body: REGISTER_BODY_SCHEMA_TYPE;
}
