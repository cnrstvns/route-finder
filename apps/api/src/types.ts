import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';

export type Bindings = {
  DATABASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  APP_BASE_URL: string;
  BASE_URL: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
};

export type Variables = {
  db: NeonHttpDatabase<typeof schema>;
  user?: schema.User;
};

export type HonoGenerics = {
  Bindings: Bindings;
  Variables: Variables;
};
