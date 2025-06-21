import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/all-listings', '/view-listing', '/sign-in', '/sign-up'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Admin routes
  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Protected routes (require authentication)
  const protectedRoutes = ['/add-new-listing', '/edit-listing', '/user'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // If accessing protected routes without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If accessing admin routes, verify admin role
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string' || decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If accessing login/signup while already authenticated, redirect to home
  if ((pathname === '/sign-in' || pathname === '/sign-up') && token) {
    const decoded = verifyToken(token);
    if (decoded && typeof decoded !== 'string') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 