import { isAdmin } from '@/lib/is-admin';
import {
	createUploadthing,
	type FileRouter as UTFileRouter,
} from 'uploadthing/next';

const f = createUploadthing();

export const fileRouter = {
	airlineLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(async () => {
			const admin = isAdmin();
			if (!admin) throw new Error('Unauthorized');

			return {};
		})
		.onUploadComplete(async ({ file }) => {
			return { url: file.url };
		}),
} satisfies UTFileRouter;

export type FileRouter = typeof fileRouter;
