import { Hono } from 'hono';
import { z } from 'zod';
import { assert } from '../lib/assert';
import { getProvider } from '../oauth/get-provider';
import type { HonoGenerics } from '../types';
import { oauthSession, session, user } from '../db/schema';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import { setCookie } from 'hono/cookie';

const oauthRouter = new Hono<HonoGenerics>();

function validateRedirect(redirect: string | undefined) {
  assert(redirect, 400, 'Redirect query param is required');
  const parsed = decodeURIComponent(redirect);
  assert(parsed.startsWith('/'), 400, 'Redirect must be a relative url');
  return parsed;
}

function generateState() {
  return randomBytes(16).toString('hex');
}

oauthRouter.get('/:provider/init', async (c) => {
  const provider = z.enum(['google', 'discord']).parse(c.req.param('provider'));
  const redirect = validateRedirect(c.req.query('redirect'));

  const OAuthProvider = await getProvider({ provider, env: c.env });

  const [createdSession] = await c.var.db
    .insert(oauthSession)
    .values({
      provider,
      state: generateState(),
      redirectUrl: redirect,
      ttl: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    })
    .returning();

  const redirectURI = OAuthProvider.createAuthorizationUrl({
    state: createdSession.state,
  });

  return c.redirect(redirectURI);
});

oauthRouter.get('/:provider/callback', async (c) => {
  const provider = z.enum(['google', 'discord']).parse(c.req.param('provider'));

  const { state, code, error } = z
    .object({
      state: z.string(),
      code: z.string().optional(),
      error: z.string().optional(),
    })
    .parse(c.req.query());

  const [sessionData] = await c.var.db
    .select()
    .from(oauthSession)
    .where(eq(oauthSession.state, state));

  assert(sessionData, 404, 'Session not found');
  assert(sessionData.ttl > new Date(), 403, 'Session not valid');

  if (error) {
    const returnLink = new URL('/auth/callback', c.env.APP_BASE_URL);
    returnLink.searchParams.set('error', error);

    return c.redirect(returnLink.href);
  }

  const OAuthProvider = await getProvider({ provider, env: c.env });

  assert(code, 403, 'Code not valid');

  const { profiles } = await OAuthProvider.exchangeCode({ code });

  if (!profiles.standard.verified) {
    return c.redirect(
      new URL('/auth/callback?error=email-not-verified', c.env.APP_BASE_URL),
    );
  }

  const [userData] = await c.var.db
    .insert(user)
    .values({
      emailAddress: profiles.standard.email,
      firstName: profiles.standard.firstName,
      lastName: profiles.standard.lastName,
    })
    .onConflictDoUpdate({
      target: [user.emailAddress],
      set: {
        firstName: profiles.standard.firstName,
        lastName: profiles.standard.lastName,
      },
    })
    .returning();

  await c.var.db.delete(oauthSession).where(eq(oauthSession.state, state));

  const [createdSession] = await c.var.db
    .insert(session)
    .values({
      userId: userData.id,
      expiresAt: new Date(Date.now() + 7 * 1000 * 60 * 60 * 24), // 7 days
      token: randomBytes(32).toString('hex'),
    })
    .returning();

  setCookie(c, 'session_token', createdSession.token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 7 * 1000 * 60 * 60 * 24), // 7 days
  });

  const returnUrl = new URL(sessionData.redirectUrl, c.env.APP_BASE_URL);

  return c.redirect(returnUrl.href);
});

export { oauthRouter };
