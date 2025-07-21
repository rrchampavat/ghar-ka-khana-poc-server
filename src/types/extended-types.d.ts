import { USER } from "@db/schemas/usersSchema";
import { Request } from "express";

type REQUEST_USER = Omit<USER, "password">;

interface CUSTOM_REQUEST extends Request {
  user: REQUEST_USER;
}
