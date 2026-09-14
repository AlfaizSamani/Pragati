import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protect = process.env.PAIMANA_PROTECT_INGESTION === 'true' || process.env.PAIMANA_PROTECT_INTELLIGENCE === 'true';

  if (!protect) {
    return NextResponse.next();
  }

  const officerCookie = request.cookies.get('paimana_officer_session')?.value;
  const token = request.headers.get('authorization') || '';
  const officerSignedIn = Boolean(officerCookie || token.startsWith('Bearer '));

  const protectedRoutes = ['/ingestion', '/intelligence'];
  const shouldGuard = protectedRoutes.some(route => pathname === route || pathname.startsWith(route));
  if (!shouldGuard) {
    return NextResponse.next();
  }

  if (!officerSignedIn) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ingestion', '/intelligence'],
};
