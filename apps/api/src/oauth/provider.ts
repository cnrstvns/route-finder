type Profiles = {
  raw: unknown;
  standard: {
    id: string;
    photoUrl: string;
    firstName: string;
    lastName: string;
    email: string;
    verified: boolean;
  };
};

export interface Provider {
  clientId: string;
  clientSecret: string;
  redirectURI: string;

  createAuthorizationUrl: (opts: {
    scope: string | undefined;
    state: string;
  }) => string;

  exchangeCode: (opts: { code: string }) => Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    scope: string;
    profiles: Profiles;
  }>;

  getProfile: (opts: { accessToken: string }) => Promise<Profiles>;
}
