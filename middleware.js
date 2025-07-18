import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/all-listings', '/view-listing']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Auth routes
  const authRoutes = ['/auth/signin', '/auth/signup', '/api/auth']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Admin routes protection
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // Allow public and auth routes
  if (isPublicRoute || isAuthRoute) {
    return NextResponse.next()
  }

  // Redirect authenticated admins from root to /admin dashboard
  if (pathname === '/' && session) {
    const isAdmin = session?.user?.role === 'admin' || session?.user?.isAdmin
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  // Protected routes require authentication
  const protectedRoutes = ['/add-new-listing', '/edit-listing', '/user']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if ((isProtectedRoute || isAdminRoute) && !session) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Admin routes require admin role
  if (isAdminRoute) {
    const isAdmin = session?.user?.role === 'admin' || session?.user?.isAdmin
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) except /api/auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api(?!/auth)|_next/static|_next/image|favicon.ico).*)',
  ],
}