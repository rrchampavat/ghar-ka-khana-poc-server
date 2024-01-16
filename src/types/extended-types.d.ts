import { Request } from "express";
import { User } from "@db/schemas/userSchema";

type REQUEST_USER = Omit<User, "password">;

interface CUSTOM_REQUEST extends Request {
  user: REQUEST_USER;
}
