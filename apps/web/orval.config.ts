import { defineConfig } from 'orval';

export default defineConfig({
  routeFinderRQ: {
    output: {
      mode: 'tags',
      target: 'src/api/client/react-query.ts',
      client: 'react-query',
      baseUrl: 'http://localhost:8787',
      mock: false,
      indexFiles: true,
      override: {
        requestOptions: {
          withCredentials: true,
        },
      },
    },
    input: {
      target: 'http://localhost:8787/v1/schema',
    },
  },
  routeFinderAxios: {
    output: {
      mode: 'tags',
      target: 'src/api/server/axios.ts',
      client: 'fetch',
      baseUrl: 'http://localhost:8787',
      mock: false,
      indexFiles: true,
      override: {
        requestOptions: {
          credentials: 'include',
        },
      },
    },
    input: {
      target: 'http://localhost:8787/v1/schema',
    },
  },
});
