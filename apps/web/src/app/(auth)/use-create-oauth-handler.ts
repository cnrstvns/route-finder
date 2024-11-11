'use client';
import { OAuthStrategy } from '@clerk/clerk-sdk-node';
import { useSignUp } from '@clerk/nextjs';
import { useCallback } from 'react';

export const useCreateOauthHandler = () => {
  const { isLoaded, signUp } = useSignUp();

  const createOauthHandler = useCallback(
    (provider: OAuthStrategy) => {
      if (!isLoaded) return;

      return async () => {
        await signUp.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: '/auth/callback',
          redirectUrlComplete: '/home',
        });
      };
    },
    [isLoaded, signUp],
  );

  return createOauthHandler;
};
