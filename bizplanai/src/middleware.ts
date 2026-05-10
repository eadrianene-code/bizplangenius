import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for /admin/* routes: HTTP Basic Auth.
 *
 * Set ADMIN_BASIC_AUTH env var to "username:password" format.
 * The browser will pop the native login dialog. After login,
 * the credentials are cached by the browser for the session.
 */
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only gate /admin/* paths
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_BASIC_AUTH;
  if (!expected) {
    return new NextResponse('Admin auth not configured', { status: 500 });
  }

  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    });
  }

  const base64 = authHeader.slice(6);
  let decoded: string;
  try {
    decoded = atob(base64);
  } catch {
    return new NextResponse('Invalid auth header', { status: 400 });
  }

  if (decoded !== expected) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
