import { PAGE_SIZE } from './constants';

export const getOffset = (page: number) => {
  return page * PAGE_SIZE - PAGE_SIZE;
};
