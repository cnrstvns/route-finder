import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';

export type Bindings = {
  DATABASE_URL: string;
  BASE_URL: string;
  APP_BASE_URL: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;

  APPLE_CLIENT_ID: string;
  APPLE_TEAM_ID: string;
  APPLE_KEY_ID: string;
  APPLE_PRIVATE_KEY: string;
};

export type Variables = {
  db: NeonHttpDatabase<typeof schema>;
  user?: schema.User;
};

export type HonoGenerics = {
  Bindings: Bindings;
  Variables: Variables;
};
