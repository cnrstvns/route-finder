export const getSafePageSize = (pageSize: number) => {
  if (pageSize > 100) {
    return 100;
  }

  return pageSize;
};

export const getOffset = (page: number, pageSize: number) => {
  const parsedPageSize = getSafePageSize(pageSize);

  return page * parsedPageSize - parsedPageSize;
};
