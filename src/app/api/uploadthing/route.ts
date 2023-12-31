import { createNextRouteHandler } from 'uploadthing/next';
import { fileRouter } from './lib';

export const { GET, POST } = createNextRouteHandler({
  router: fileRouter,
});
