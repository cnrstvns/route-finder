import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
	beforeAuth: (request: Request) => {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const requestHeaders = new Headers(request.headers);

		requestHeaders.set('x-pathname', pathname);

		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	},
	ignoredRoutes: ['/((?!api|trpc))(_next.*|.+.[w]+$)', '/api/clerk'],
	publicRoutes: ['/sign-in', '/sign-up'],
	signInUrl: '/sign-in',
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
