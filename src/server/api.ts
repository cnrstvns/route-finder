import {
	TRPCClientError,
	createTRPCProxyClient,
	loggerLink,
} from '@trpc/client';
import { callProcedure } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { type TRPCErrorResponse } from '@trpc/server/rpc';
import { cache } from 'react';
import 'server-only';
import superjson from 'superjson';
import { appRouter } from './routers/_app';
import { createTRPCContext } from './trpc';

const createContext = cache(() => {
	return createTRPCContext();
});

export const api = createTRPCProxyClient<typeof appRouter>({
	transformer: superjson,
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === 'development' ||
				(op.direction === 'down' && op.result instanceof Error),
		}),
		/**
		 * Custom RSC link that lets us invoke procedures without using http requests. Since Server
		 * Components always run on the server, we can just call the procedure as a function.
		 */
		() =>
			({ op }) =>
				observable((observer) => {
					createContext()
						.then((ctx) => {
							return callProcedure({
								procedures: appRouter._def.procedures,
								path: op.path,
								rawInput: op.input,
								ctx,
								type: op.type,
							});
						})
						.then((data) => {
							observer.next({ result: { data } });
							observer.complete();
						})
						.catch((cause: TRPCErrorResponse) => {
							observer.error(TRPCClientError.from(cause));
						});
				}),
	],
});
