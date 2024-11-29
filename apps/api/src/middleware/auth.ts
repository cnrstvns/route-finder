import type { HonoGenerics } from '../types';
import { session, user } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';

export const authMiddleware = (admin: boolean) =>
  createMiddleware<HonoGenerics>(async (c, next) => {
    const sessionToken =
      getCookie(c, 'session_token') ||
      c.req.header('Authorization')?.split(' ')[1];

    if (!sessionToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const [sessionData] = await c.var.db
      .select()
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(eq(session.token, sessionToken));

    if (!sessionData) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (admin && !sessionData.user.admin) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    c.set('user', sessionData.user);

    return next();
  });
