import type { FileRouter } from '@/app/api/uploadthing/lib';
import { generateReactHelpers } from '@uploadthing/react/hooks';

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<FileRouter>();
