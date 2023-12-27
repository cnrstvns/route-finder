import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import status from 'http-status';
import { createTRPCContext } from '@/server/trpc';

const handler = async (req: Request) => {
	const { userId } = auth();
	if (!userId) return new NextResponse(null, { status: status.UNAUTHORIZED });

	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		createContext: createTRPCContext,
		onError:
			process.env.NODE_ENV === 'development'
				? ({ path, error }) => {
						console.error(
							`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
						);
				  }
				: undefined,
	});
};

export { handler as GET, handler as POST };
