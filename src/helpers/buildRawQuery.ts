import { SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";

const buildRawQuery = (query: SQL) => {
  const pgDialect = new PgDialect();

  return pgDialect.sqlToQuery(query);
};

export default buildRawQuery;
