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
  ignoredRoutes: [
    '/((?!api))(_next.*|.+.[w]+$)',
    '/api/clerk',
    '/api/inngest',
    '/api/uploadthing',
  ],
  publicRoutes: ['/', '/sign-in', '/sign-up', '/auth/callback'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
