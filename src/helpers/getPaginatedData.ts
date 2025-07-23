import db from "@db/connection";
import { SQL, Table, count } from "drizzle-orm";

type PaginationOptions = {
  baseTable: Table;
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
  query: any,
  options: PaginationOptions
): Promise<PaginatedResult<T>> => {
  const { baseTable, page = 1, limit = 10, countWhere } = options;
  const offset = (page - 1) * limit;

  const data: T[] = await query.limit(limit).offset(offset);

  const countQuery = db.select({ totalCount: count() }).from(baseTable);
  if (countWhere) countQuery.where(countWhere);

  const [{ totalCount }] = await countQuery;
  const total = Number(totalCount);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1
  };
};

export default getPaginatedData;
