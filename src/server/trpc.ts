import { TRPCError, initTRPC } from '@trpc/server';
import { db } from '@/db';
import superjson from 'superjson';
import { auth } from '@clerk/nextjs';
import { getUser } from '@/lib/get-user';
import { ZodError } from 'zod';
import { getIp } from '@/lib/get-ip';
import { rateLimit } from '@/lib/rate-limit';

// Create type for request context
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Create context in which we fetch the user for each incoming request
export const createTRPCContext = async () => {
	const { userId } = auth();
	const user = await getUser(userId);

	return {
		db,
		user,
	};
};

// Create trpc instance
export const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter: ({ shape, error }) => {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		};
	},
});

// Create middleware to ensure that request has a user
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return next({
		ctx: {
			...ctx,
			// infers the `user` as non-nullable
			user: { ...ctx.user },
		},
	});
});

// Create middleware to ensure that request has a user and that user is an admin
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
	if (!ctx.user || !ctx.user.admin) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return next({
		ctx: {
			...ctx,
			// infers the `user` as non-nullable
			user: { ...ctx.user },
		},
	});
});

export const rateLimitMiddleware = (limit: number, seconds: number) =>
	t.middleware(async ({ ctx, next }) => {
		const ip = getIp();
		const result = await rateLimit(ip, limit, seconds);

		// If at limit, deny request
		if (!result.success) {
			throw new TRPCError({
				code: 'TOO_MANY_REQUESTS',
				message: 'You are being rate limited.',
			});
		}

		return next({
			ctx: {
				...ctx,
			},
		});
	});

// Export router and procedures to be reused
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
export const adminProcedure = t.procedure.use(enforceUserIsAdmin);
