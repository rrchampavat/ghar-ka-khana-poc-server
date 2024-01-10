import { PgDialect } from "drizzle-orm/pg-core";
import { SQL } from "drizzle-orm";

const buildRawQuery = (query: SQL) => {
  const pgDialect = new PgDialect();

  return pgDialect.sqlToQuery(query);
};

export default buildRawQuery;
