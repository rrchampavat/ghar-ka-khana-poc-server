import loginSchema from "@validation-schemas/authSchemas/loginSchema";
import registerBodySchema from "@validation-schemas/authSchemas/registerSchema";
import { Request } from "express";
import z from "zod";

type REGISTER_BODY_SCHEMA_TYPE = z.infer<typeof registerBodySchema>["body"];

interface REGISTER_REQUEST extends Request {
  body: REGISTER_BODY_SCHEMA_TYPE;
}

type LOGIN_BODY_SCHEMA_TYPE = z.infer<typeof loginSchema>["body"];

interface LOGIN_REQUEST extends Request {
  body: LOGIN_BODY_SCHEMA_TYPE;
}
