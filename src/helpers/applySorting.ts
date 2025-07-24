/* eslint-disable indent */
import { SQL, Table, asc, desc } from "drizzle-orm";

type SortOrder = "asc" | "desc";

interface SortOptions<TTable extends Table> {
  sortBy?: keyof TTable["_"]["columns"];
  sortOrder?: SortOrder;
}

export const applySorting =
  <TTable extends Table>(table: TTable, options: SortOptions<TTable>) =>
  (query: SQL | any) => {
    const { sortBy = "", sortOrder = "" } = options;

    if (sortBy && table[sortBy]) {
      const column = table[sortBy];

      if (sortOrder === "asc") return query.orderBy(asc(column));

      return query.orderBy(desc(column));
    }

    return query;
  };
