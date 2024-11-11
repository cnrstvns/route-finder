import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';

export type Bindings = {
  DATABASE_URL: string;
};

export type Variables = {
  db: NeonHttpDatabase<typeof schema>;
};

export type HonoGenerics = {
  Bindings: Bindings;
  Variables: Variables;
};
