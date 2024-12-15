import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  // Check if the user is trying to access a private route
  const isPrivateRoute = req.nextUrl.pathname.startsWith('/(private)/');

  if (isPrivateRoute && !token) {
    // Redirect to signin if not authenticated
    const signinUrl = new URL('/signin', req.url);
    return NextResponse.redirect(signinUrl);
  }

  // Allow access if authenticated or accessing public routes
  return NextResponse.next();
}

// Apply middleware only to certain routes
export const config = {
  matcher: '/(private)/:path*', // Restrict middleware to private routes
};
