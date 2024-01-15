import { SQL } from "drizzle-orm";
import db from "@db/connection";

const generateExecutableQuery = (sqlQuery: SQL) => {
  return db.execute(sqlQuery);
};

export default generateExecutableQuery;
