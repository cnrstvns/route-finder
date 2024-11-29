import { isAdmin } from '@/lib/is-admin';
import {
  type FileRouter as UTFileRouter,
  createUploadthing,
} from 'uploadthing/next';

const f = createUploadthing();

export const fileRouter = {
  airlineLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies UTFileRouter;

export type FileRouter = typeof fileRouter;
