import { z } from 'zod';
import type { Provider } from './provider';
import type { Bindings } from '../types';

const tokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
  id_token: z.string(),
});

const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().url(),
  email: z.string().email(),
});

export class Google implements Provider {
  clientId = '';
  clientSecret = '';
  redirectURI = '';

  constructor(env: Bindings) {
    this.redirectURI = `${env.BASE_URL}/auth/google/callback`;
    this.clientId = env.GOOGLE_CLIENT_ID;
    this.clientSecret = env.GOOGLE_CLIENT_SECRET;
  }

  createAuthorizationUrl({ state }: { state: string }) {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('scope', 'openid profile');
    url.searchParams.set('include_granted_scopes', 'true');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('redirect_uri', this.redirectURI);
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('state', state);
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('prompt', 'consent');

    return url.toString();
  }

  async exchangeCode({ code }: { code: string }) {
    const body = new URLSearchParams();
    body.set('code', code);
    body.set('redirect_uri', this.redirectURI);
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);
    body.set('scope', 'openid profile');
    body.set('grant_type', 'authorization_code');

    const response = await fetch('https://oauth2.googleapis.com/token', {
      body,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!response.ok)
      throw new Error(
        `Invalid OAuth response. (exchangeCode) Code=${response.status}`,
      );

    const data = await response.json();
    const parsedTokenResponse = tokenSchema.safeParse(data);

    if (!parsedTokenResponse.success)
      throw new Error(
        `Invalid OAuth response (exchangeCode): ${parsedTokenResponse.error.message}`,
      );
    const parsedToken = parsedTokenResponse.data;

    const profiles = await this.getProfile({
      accessToken: parsedToken.access_token,
    });

    return {
      accessToken: parsedToken.access_token,
      refreshToken: parsedToken.refresh_token,
      expiresIn: parsedToken.expires_in,
      scope: parsedToken.scope,
      profiles,
    };
  }

  async getProfile({ accessToken }: { accessToken: string }) {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!response.ok)
      throw new Error(
        `Invalid profile response. (getProfile) Code=${response.status}`,
      );

    const responseData = await response.json();
    const parsedProfileResponse = profileSchema.safeParse(responseData);

    if (!parsedProfileResponse.success)
      throw new Error(
        `Invalid profile response. (getProfile): ${parsedProfileResponse.error.message}`,
      );
    const parsedProfile = parsedProfileResponse.data;

    return {
      raw: responseData,
      standard: {
        id: parsedProfile.id,
        photoUrl: parsedProfile.picture,
        name: parsedProfile.name,
        email: parsedProfile.email,
        firstName: parsedProfile.given_name,
        lastName: parsedProfile.family_name,
        verified: true,
      },
    };
  }
}
