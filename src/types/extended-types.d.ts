import { USER } from "@db/schemas/usersSchema";
import { Table } from "drizzle-orm";
import { Request } from "express";

type REQUEST_USER = Omit<USER, "password">;

interface CUSTOM_QUERY<TTable extends Table> {
  page: string;
  limit: string;
  sortBy: keyof TTable["_"]["columns"];
  sortOrder: "asc" | "desc";
}

export type CUSTOM_REQUEST = Request & {
  user: REQUEST_USER;
  query: CUSTOM_QUERY;
};
