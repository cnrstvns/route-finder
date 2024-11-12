import { OpenAPIHono } from '@hono/zod-openapi';
import { NeonQueryFunction, neon } from '@neondatabase/serverless';
import * as schema from './db/schema';
import { HonoGenerics } from './types';
import { drizzle } from 'drizzle-orm/neon-http';
import { feedbackRouter } from './routes/feedback';
import { airlineRouter } from './routes/airline';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { oauthRouter } from './routes/oauth';
import { authRouter } from './routes/auth';

const app = new OpenAPIHono<HonoGenerics>();

app.use('*', async (c, next) => {
  const sql: NeonQueryFunction<boolean, boolean> = neon(c.env.DATABASE_URL);
  const db = drizzle(sql, { schema });
  c.set('db', db);
  await next();
});

app.use(
  '*',
  cors({ origin: 'http://localhost:3000', credentials: true }),
  logger(),
);

app.route('/v1', feedbackRouter).route('/v1', airlineRouter);

app.route('/auth', oauthRouter).route('/auth', authRouter);

app.doc31('/v1/schema', {
  info: {
    title: 'RouteFinder API',
    version: '1.0.0',
  },
  openapi: '3.1.0',
});

export default app;
