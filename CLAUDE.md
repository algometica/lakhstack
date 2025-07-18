# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses PNPM for dependency management.

- `pnpm dev` - Start development server  
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm clean` - Clean build artifacts and dependencies
- `pnpm setup` - Install dependencies and build project
- `node scripts/setup-admin.js` - Set up database and create admin user

## Environment Setup

Required environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_API_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_GOOGLE_PLACE_API_KEY=your_google_places_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
AUTH_SECRET=your_nextauth_secret
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_admin_password
ADMIN_NAME=Admin User
```

## Architecture Overview

### Authentication System
- **NextAuth.js (v5.0.0-beta.29)** for authentication
- **Google OAuth** and **Resend magic links** as providers
- **Supabase adapter** for session/user storage
- **Role-based access control**: `user` and `admin` roles
- **Middleware protection** at `middleware.js:4` handles route access
- **Admin email whitelist** restricts access to specific emails

### Route Structure
- **Public routes**: `/`, `/all-listings`, `/view-listing`, auth pages
- **Protected routes**: `/add-new-listing`, `/edit-listing`, `/user` (require login)
- **Admin routes**: `/admin` (require admin role)
- **Auth routes**: `/sign-in`, `/sign-up` (redirect if authenticated)

### API Endpoints
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `GET /api/auth/signin` - Sign-in page
- `GET /api/auth/session` - Current session data
- `POST /api/auth/signout` - Sign out user

### Database Schema (Supabase)
- **NextAuth tables**: `users`, `sessions`, `accounts`, `verification_tokens`
- **Custom tables**: `listings` for business listings with user relationships
- **Admin whitelist**: Role-based access via JWT callbacks

### Component Architecture
- **App Router** with Next.js 14 (App Directory structure)
- **Radix UI components** for accessible primitives
- **Tailwind CSS** with custom design system (primary: #7f57f1)
- **shadcn/ui pattern** with `components/ui/` directory
- **Formik** for form handling
- **Google Maps integration** via `@react-google-maps/api`

### Key Patterns
- **Server-side authentication** via NextAuth middleware
- **Client-side state** managed through `useSession` hook
- **Route groups** using `(auth)` and `(routes)` folders
- **Component co-location** with `_components` folders
- **Image optimization** configured for Supabase domains

### File Upload & Assets
- **Supabase storage** for file uploads
- **Next.js Image** component configured for `fmwkbeknpjrdaxfbmumt.supabase.co`
- **Static assets** in `/public` directory

### Migration Notes
- **Clerk to NextAuth**: Migrated from Clerk to NextAuth.js authentication system
- **NPM to PNPM**: Converted from NPM to PNPM package manager for better performance
- **Package Updates**: All dependencies updated to latest compatible versions
- **JavaScript**: Converted from TypeScript to standard JavaScript for consistency
- Legacy Clerk imports have been replaced with NextAuth session management

## Common Tasks

### Creating New Protected Routes
1. Add route to `protectedRoutes` array in `middleware.js:16`
2. Ensure SessionProvider wraps the route in layout hierarchy
3. Use `useSession()` hook for user state access

### Adding Admin Features  
1. Add route to `adminRoutes` array in `middleware.js:12`
2. Check `user.role === 'admin'` from `useSession()` hook
3. Middleware automatically handles admin role verification

### Database Changes
- Use Supabase dashboard or `scripts/setup-auth-tables.js` as reference
- Service role key required for admin operations
- NextAuth tables handle authentication, custom tables for business logic

## Business Model & Platform Strategy

### Current Phase: Admin-Curated Platform

**LakhStack Business Model:**
- **Admin-Curated Content**: Platform is run by admins who create and manage all listings
- **Quality Control**: Only whitelisted admin emails can create content
- **User Experience**: Regular users browse listings without needing accounts
- **Content Strategy**: Admins can create unlimited listings with unique addresses

### Platform Evolution Strategy

**Phase 1: Admin-Curated Platform (Current)**
- Admins create and manage all listings
- No user registration required for browsing
- High-quality, curated content
- Scalable admin workflow

**Phase 2: User Submission Platform (Future)**
- Open to user-generated content
- One listing per user with unique address validation
- Admin moderation and approval workflow
- Community features and user interactions

### Current User Experience

**For Regular Users (Visitors):**
- Clean homepage focused on content browsing
- No sign-in button visible (admin-curated approach)
- Access to all listings and business information
- Mobile-friendly browsing experience

**For Admins:**
- Direct access via `/auth/signin` URL
- Automatic redirect to `/admin` dashboard after login
- "+ Add Listing" button visible in header
- Unlimited listing creation capability
- Enhanced error messages and admin tools

### Listing Creation Process

**Current Admin Flow:**
1. **Google Sign-in** → Admin authentication via whitelisted emails
2. **Admin Dashboard** → Automatic redirect to `/admin` after login
3. **Add Listing** → Click "+ Add Listing" button (admin-only)
4. **Address Validation** → Uses Google Places API for accurate addresses
5. **Unique Address Check** → Prevents duplicate listings at same address
6. **Listing Creation** → Route to `/edit-listing/{id}` for detailed information
7. **Publish** → Save and make listing live

**Address & User Restrictions:**
- **Admins**: Can create unlimited listings (only address uniqueness enforced)
- **Regular Users**: One listing per user limit (for future Phase 2)
- **Address Validation**: Google Places API ensures accurate, standardized addresses
- **Duplicate Prevention**: Database constraints prevent duplicate addresses

### Technical Implementation

**Admin-Only Features:**
- `Header.jsx:70-77` - "+ Add Listing" button only visible to authenticated admins
- `middleware.js:25-31` - Automatic admin redirect to `/admin` dashboard
- `add-new-listing/page.jsx:31-32` - Admin role checking for unlimited listings
- `auth/signin/page.jsx:25` - Direct redirect to admin panel after login

**User Experience Enhancements:**
- `Header.jsx:119-122` - Sign-in button hidden from regular users
- `add-new-listing/page.jsx:58-67` - Enhanced error messages for different user types
- Clean, focused browsing experience for end users

### Future Scalability

**Phase 2 Preparation:**
- Technical foundation supports future user submissions
- Database schema ready for user-generated content
- Moderation workflow architecture planned
- Role-based access control system scalable

**Planned Features (Phase 2):**
- User registration and profile management
- User-submitted listing approval workflow
- Community features (reviews, ratings)
- Enhanced search and filtering capabilities
- Advanced admin moderation tools

This phased approach allows LakhStack to launch with high-quality, curated content while maintaining the flexibility to evolve into a user-generated platform when ready.