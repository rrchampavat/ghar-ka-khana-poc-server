import db from "@db/connection";
import { SQL, Table, count } from "drizzle-orm";

type PaginateWithJoinOptions<T> = {
  baseTable: Table;
  queryBuilder: () =>
    | Promise<T[]>
    | { limit: (n: number) => any; offset: (n: number) => any }; // handles Drizzle query chain or pre-resolved query
  page?: number;
  limit?: number;
  countWhere?: SQL; // optional filter for count
};

type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

const getPaginatedData = async <T>(
  props: PaginateWithJoinOptions<T>
): Promise<PaginatedResult<T>> => {
  const { baseTable, queryBuilder, page = 1, limit = 10, countWhere } = props;
  const offset = (page - 1) * limit;

  const query = queryBuilder();

  const data: T[] = await (query as any).limit(limit).offset(offset);

  const countQuery = db.select({ totalCount: count() }).from(baseTable);
  if (countWhere) countQuery.where(countWhere);

  const [{ totalCount }] = await countQuery;
  const total = Number(totalCount);
  const totalPages = Math.ceil(total / limit);

  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrevious
  };
};

export default getPaginatedData;
