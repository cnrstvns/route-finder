import { NextResponse } from 'next/server';
import { retrieveSession } from './api/server/auth';
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const cookies = parseCookie(request.headers.get('cookie') || '');
  console.log('[middleware] cookies', cookies);

  const sessionToken = cookies.get('session_token');

  console.log('[middleware] session token', cookies);

  if (
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname == '/'
  ) {
    return NextResponse.next();
  }

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  console.log('[middleware] session token', sessionToken);
  const session = await retrieveSession({
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: 'no-store',
  });

  if (pathname !== '/' && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (pathname.startsWith('/admin') && (!session || !session.data.admin)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|sign-in|sign-up|auth).*)'],
};
