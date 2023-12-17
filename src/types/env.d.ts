declare namespace NodeJS {
	interface ProcessEnv {
		POSTGRES_HOST: string;
		POSTGRES_USER: string;
		POSTGRES_PASSWORD: string;
		POSTGRES_DATABASE: string;
		POSTGRES_URL: string;
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
		CLERK_SECRET_KEY: string;
		CLERK_WEBHOOK_SIGNING_SECRET: string;
		NEXT_PUBLIC_POSTHOG_KEY: string;
		NEXT_PUBLIC_POSTHOG_HOST: string;
	}
}
