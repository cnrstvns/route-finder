import { Google } from './google';
import { Discord } from './discord';
import type { Bindings } from '../types';

export const getProvider = async ({
  provider,
  env,
}: {
  provider: string;
  env: Bindings;
}) => {
  switch (provider) {
    case 'google':
      return new Google(env);

    case 'discord':
      return new Discord(env);

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
};
