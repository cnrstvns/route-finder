declare namespace NodeJS {
  interface ProcessEnv {
    POSTGRES_HOST: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DATABASE: string;
    POSTGRES_URL: string;
  }
}
