import { USER } from "@db/schemas/usersSchema";
import { Request } from "express";

type REQUEST_USER = Omit<USER, "password">;

export type CUSTOM_REQUEST = Request & {
  user: REQUEST_USER;
};
