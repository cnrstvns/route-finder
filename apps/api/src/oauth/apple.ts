import type { Bindings } from '../types';
import { Provider } from './provider';
import { z } from 'zod';
import { decodeJwt, SignJWT } from 'jose';

const tokenSchema = z.object({
  id_token: z.string(),
  access_token: z.string(),
});

const profileSchema = z.object({
  sub: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
});

export class Apple implements Provider {
  clientId = '';
  clientSecret = '';
  redirectURI = '';
  env: Bindings;

  constructor(env: Bindings) {
    this.clientId = env.APPLE_CLIENT_ID;
    this.redirectURI = `${env.BASE_URL}/auth/apple/callback`;
    this.env = env;
  }

  createAuthorizationUrl({ state }: { state: string }) {
    const url = new URL('https://appleid.apple.com/auth/authorize');
    url.searchParams.set('scope', 'name email');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('response_mode', 'form_post');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.redirectURI);
    url.searchParams.set('state', state);
    return url.toString();
  }

  async exchangeCode({ code }: { code: string }) {
    const response = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: await this.generateClientSecret(),
        code,
        grant_type: 'authorization_code',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok)
      throw new Error(
        `Invalid OAuth response. (exchangeCode) Code=${response.status}`,
      );

    const responseData = await response.json();
    const parsedTokenResponse = tokenSchema.safeParse(responseData);

    if (!parsedTokenResponse.success)
      throw new Error(
        `Invalid OAuth response (exchangeCode): ${parsedTokenResponse.error.message}`,
      );

    const parsedToken = parsedTokenResponse.data;
    const decoded = decodeJwt(parsedToken.id_token);

    if (!decoded)
      throw new Error(
        'Invalid OAuth response (exchangeCode): No decoded token',
      );

    const parsedProfileResponse = profileSchema.safeParse(decoded);

    if (!parsedProfileResponse.success)
      throw new Error(
        `Invalid OAuth response (exchangeCode): ${parsedProfileResponse.error.message}`,
      );

    return {
      accessToken: parsedToken.access_token,
      refreshToken: '',
      expiresIn: 0,
      scope: '',
      profiles: {
        raw: parsedProfileResponse.data,
        standard: {
          id: parsedProfileResponse.data.sub,
          photoUrl: '',
          firstName: '',
          lastName: '',
          email: parsedProfileResponse.data.email,
          verified: parsedProfileResponse.data.email_verified,
        },
      },
    };
  }

  async getProfile() {
    return {
      raw: {},
      standard: {
        id: '',
        photoUrl: '',
        firstName: '',
        lastName: '',
        email: '',
        verified: false,
      },
    };
  }

  async generateClientSecret() {
    const payload = {
      iss: this.env.APPLE_TEAM_ID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      aud: 'https://appleid.apple.com',
      sub: this.clientId,
    };

    const pem = this.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const privateKey = await importPrivateKey(pem);

    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'ES256', kid: this.env.APPLE_KEY_ID })
      .sign(privateKey);
  }
}

async function importPrivateKey(pem: string) {
  const pemContents = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '');

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer.buffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign'],
  );
}
