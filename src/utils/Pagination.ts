export interface PaginationResult<T> {
  result: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 10; // default size is 10
  const offset = page ? (page - 1) * limit : 0; // calculate the offset

  return { limit, offset };
};

export const getPagingData = <T>(
  data: { count: number; rows: T[] },
  page: number,
  limit: number,
): PaginationResult<T> => {
  const { count: totalItems, rows: dataRows } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { result: dataRows, totalItems, totalPages, currentPage };
};

export const getMongoPagingData = <T>(
  data: { totalDocs: number; docs: T[] },
  page: number,
  limit: number,
): PaginationResult<T> => {
  const { totalDocs: totalItems, docs: dataRows } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { result: dataRows, totalItems, totalPages, currentPage };
};
