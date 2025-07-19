# CLAUDE.md

## Commands
**Package Manager**: PNPM
- `pnpm dev` - Development server
- `pnpm build` - Production build  
- `pnpm lint` - ESLint
- `pnpm setup` - Install & build
- `node scripts/setup-admin.js` - Setup database & admin

## Environment (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_API_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_GOOGLE_PLACE_API_KEY=your_google_places_key
GOOGLE_CLIENT_ID=your_google_oauth_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
AUTH_SECRET=your_nextauth_secret
ADMIN_EMAIL=admin@example.com
```

## Architecture
- **Auth**: NextAuth.js v5 + Google OAuth + Supabase adapter
- **Database**: Supabase (NextAuth tables + custom `listings` table)
- **Admin Platform**: Curated content, admin whitelist via JWT
- **API**: Google Places API (New) REST endpoints for addresses

## Route Structure
- **Public**: `/`, `/all-listings`, `/view-listing/[id]`
- **Protected**: `/add-new-listing`, `/edit-listing/[id]`, `/user`
- **Admin**: `/admin` (admin role required)
- **Auth**: `/auth/signin` (redirects admins to `/admin`)

## Key Patterns
- **Admin-curated platform**: Only whitelisted admins create listings
- **App Router**: Next.js 15 with `(auth)` and `(routes)` groups
- **Component co-location**: `_components` folders
- **Server auth**: NextAuth middleware protection
- **Modern stack**: JavaScript (not TypeScript), PNPM, shadcn/ui

## Common Tasks
### Adding Protected Routes
1. Add to `protectedRoutes` in `middleware.js`
2. Use `useSession()` for auth state

### Adding Admin Features  
1. Add to `adminRoutes` in `middleware.js`
2. Check `user.role === 'admin'` in components

### Database Operations
- Use Supabase service role for admin operations
- NextAuth handles auth tables, custom tables for business logic

## Recent Migrations
- Clerk → NextAuth.js authentication
- TypeScript → JavaScript for consistency  
- Legacy Google Places → Google Places API (New)
- NPM → PNPM package manager