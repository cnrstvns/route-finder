import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config(
  process.env.NODE_ENV !== 'production'
    ? {
        path: path.resolve(process.cwd(), '.env.development.local'),
        debug: true,
      }
    : undefined,
);
