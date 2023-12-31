import path from 'path';
import dotenv from 'dotenv';

dotenv.config(
  process.env.NODE_ENV !== 'production'
    ? {
        path: path.resolve(process.cwd(), '.env.development.local'),
        debug: true,
      }
    : undefined,
);
