# CLAUDE.md

## Commands
- `pnpm dev` - Dev server
- `pnpm build` - Production build  
- `pnpm lint` - ESLint
- `node scripts/setup-admin.js` - DB & admin setup
- `node scripts/verify-deployment.js [domain]` - Check deployment

## Environment
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_API_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_PLACES_API_KEY=your_google_places_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_CLIENT_ID=your_google_oauth_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
AUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://www.lakhstack.com
ADMIN_EMAIL=admin@example.com
```

## Stack
**Auth**: NextAuth.js v5 + Google OAuth  
**DB**: Supabase (PostgreSQL)  
**API**: Google Places API (New)  
**UI**: Next.js 15 App Router, shadcn/ui, Tailwind

## Routes
- **Public**: `/`, `/all-listings`, `/view-listing/[id]`
- **Protected**: `/add-new-listing`, `/edit-listing/[id]`, `/user`  
- **Admin**: `/admin` (admin role required)

## Architecture
- Admin-curated platform (whitelisted admins only)
- Component co-location (`_components` folders)
- NextAuth middleware protection
- Geographical filtering with 50km radius (PostgreSQL function: `get_listings_within_radius`)
- Mobile-responsive with hamburger navigation

## Key Tasks
**Protected Routes**: Add to `middleware.js` + `useSession()`  
**Admin Features**: Add to admin whitelist + check `user.role === 'admin'`  
**Database**: Use Supabase service role for admin operations  
**Location Search**: Coordinates stored as JSON, filtered via PostgreSQL Haversine formula