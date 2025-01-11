import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Check if the user is trying to access protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login if no token is found
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Check if user is already logged in and trying to access login page
  if (request.nextUrl.pathname === '/login' && token) {
    // Redirect to dashboard if token exists
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ]
};
