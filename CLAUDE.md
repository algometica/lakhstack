# CLAUDE.md

## Commands (PNPM)
- `pnpm dev` - Dev server
- `pnpm build` - Production build  
- `pnpm lint` - ESLint
- `node scripts/setup-admin.js` - DB & admin setup

## Environment
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

## Stack
**Auth**: NextAuth.js v5 + Google OAuth + Supabase  
**DB**: Supabase (NextAuth + custom tables)  
**API**: Google Places API (New)  
**UI**: Next.js 15 App Router, shadcn/ui, Tailwind CSS

## Routes
- **Public**: `/`, `/all-listings`, `/view-listing/[id]`
- **Protected**: `/add-new-listing`, `/edit-listing/[id]`, `/user`  
- **Admin**: `/admin` (admin role required)

## Patterns
- Admin-curated platform (whitelisted admins only)
- Component co-location (`_components` folders)
- NextAuth middleware protection
- Modern JS stack (no TypeScript)

## Key Tasks
**Protected Routes**: Add to `middleware.js` + `useSession()`  
**Admin Features**: Add to `adminRoutes` + check `user.role === 'admin'`  
**Database**: Supabase service role for admin ops