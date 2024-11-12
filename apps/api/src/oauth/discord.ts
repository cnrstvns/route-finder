import { Bindings } from '../types';
import { Provider } from './provider';
import { z } from 'zod';

const tokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  token_type: z.string(),
});

const profileSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string(),
  discriminator: z.string(),
  email: z.string().email(),
  global_name: z.string(),
  verified: z.boolean(),
});

export class Discord implements Provider {
  clientId = '';
  clientSecret = '';
  redirectURI = '';

  constructor(env: Bindings) {
    this.redirectURI = `${env.BASE_URL}/auth/discord/callback`;
    this.clientId = env.DISCORD_CLIENT_ID;
    this.clientSecret = env.DISCORD_CLIENT_SECRET;
  }

  createAuthorizationUrl({ state }: { state: string }) {
    const url = new URL('https://discord.com/oauth2/authorize');
    url.searchParams.set('scope', 'identify email');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.redirectURI);
    url.searchParams.set('state', state);
    return url.toString();
  }

  async exchangeCode({ code }: { code: string }) {
    const body = new URLSearchParams();
    body.set('code', code);
    body.set('redirect_uri', this.redirectURI);
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);
    body.set('grant_type', 'authorization_code');

    const response = await fetch('https://discord.com/api/oauth2/token', {
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
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok)
      throw new Error(
        `Invalid profile response. (getProfile) Code=${response.status}`,
      );

    const responseData = await response.json();
    const parsedProfileResponse = profileSchema.safeParse(responseData);

    if (!parsedProfileResponse.success)
      throw new Error(
        `Invalid profile response (getProfile): ${parsedProfileResponse.error.message}`,
      );
    const parsedProfile = parsedProfileResponse.data;

    return {
      raw: responseData,
      standard: {
        id: parsedProfile.id,
        photo_url: `https://cdn.discordapp.com/avatars/${parsedProfile.id}/${parsedProfile.avatar}.png`,
        name: parsedProfile.global_name,
        email: parsedProfile.email,
        firstName: parsedProfile.global_name || parsedProfile.username,
        lastName: '',
        verified: parsedProfile.verified,
      },
    };
  }
}
