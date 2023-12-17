import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/neon-serverless';

export const db = drizzle(sql, { logger: true });

export * from './schema';
