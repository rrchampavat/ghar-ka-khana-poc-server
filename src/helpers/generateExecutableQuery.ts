import db from "@db/connection";
import { SQL } from "drizzle-orm";

const generateExecutableQuery = (sqlQuery: SQL) => {
  return db.execute(sqlQuery);
};

export default generateExecutableQuery;
