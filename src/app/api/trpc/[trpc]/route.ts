import { appRouter } from '@/server/routers/_app';
import { createTRPCContext } from '@/server/trpc';
import { auth } from '@clerk/nextjs/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import status from 'http-status';
import { NextResponse } from 'next/server';

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
