# LakhStack 2.0

A modern, unbiased local business listing platform built with Next.js 15, featuring Google OAuth authentication, advanced location-based filtering, and admin-curated content.

## 🚀 Features

### Core Platform
- **Admin-Curated Listings**: Whitelisted admin system for quality control
- **Advanced Location Search**: Google Places API integration with geographical filtering
- **Responsive Design**: Modern UI with shadcn/ui components and Tailwind CSS
- **Real-time Updates**: Instant feedback and dynamic content loading
- **Image Management**: Multiple image uploads with carousel displays
- **Mobile-First Navigation**: Professional hamburger menu and responsive layouts

### Authentication & Security
- **Google OAuth Integration**: NextAuth.js v5 with Google authentication
- **Role-Based Access Control**: Admin and user roles with protected routes
- **Secure Sessions**: HTTP-only cookies with automatic session management
- **Environment-Based Configuration**: Secure API key management

### Search & Filtering
- **Geographical Search**: 50km radius-based filtering using GPS coordinates
- **Multi-Field Search**: Business name, address, and description search
- **Category & Industry Filters**: Dropdown-based filtering system
- **Real-time Location Detection**: Google Places autocomplete integration

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js v5 + Google OAuth
- **Database**: Supabase with PostgreSQL
- **UI Framework**: React 18 + shadcn/ui + Tailwind CSS
- **Maps & Location**: Google Places API (New) + Google Maps API
- **State Management**: React hooks and context
- **Package Manager**: pnpm

### Project Structure
```
app/
├── (routes)/                    # Route groups
│   ├── admin/                   # Admin panel
│   ├── add-new-listing/         # Listing creation
│   ├── edit-listing/[id]/       # Listing editing  
│   ├── view-listing/[id]/       # Listing details
│   ├── all-listings/            # Browse listings
│   └── user/                    # User profile
├── _components/                 # Shared components
│   ├── Header.jsx              # Navigation with mobile menu
│   ├── Hero.jsx                # Landing page hero
│   ├── ListingMapView.jsx      # Main listing display
│   ├── GoogleAddressSearch.jsx # Location search
│   └── FilterSection.jsx      # Search filters
├── api/                        # API routes
│   ├── auth/[...nextauth]/     # NextAuth endpoints
│   └── places/                 # Google Places proxy
└── auth/                       # Auth pages

lib/
├── auth.js                     # NextAuth configuration
└── google-places.js           # Google Places API utilities

components/ui/                  # shadcn/ui components
```

### Database Schema

#### Core Tables
```sql
-- Listings table with geographical coordinates
CREATE TABLE listing (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_name TEXT NOT NULL,
  business_desc TEXT,
  address TEXT NOT NULL,
  contact TEXT,
  website TEXT,
  youtube TEXT,
  coordinates JSON, -- {lat: number, lng: number}
  category TEXT,
  industry TEXT,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false
);

-- Listing images
CREATE TABLE listing_images (
  id BIGSERIAL PRIMARY KEY,
  listing_id BIGINT REFERENCES listing(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NextAuth tables (auto-generated)
-- users, accounts, sessions, verification_tokens
```

#### Custom Database Functions
```sql
-- Geographical distance filtering function
CREATE OR REPLACE FUNCTION get_listings_within_radius(
    search_lat FLOAT,
    search_lng FLOAT,
    radius_km FLOAT DEFAULT 50
)
-- Returns listings within specified radius using Haversine formula
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- pnpm package manager
- Supabase project
- Google Cloud Console project (for OAuth & Places API)

### Environment Variables
Create `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_API_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google APIs
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# NextAuth
AUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://www.lakhstack.com  # or http://localhost:3000 for dev

# Admin Configuration
ADMIN_EMAIL=admin@example.com
```

### Installation Steps

1. **Clone and Install**
```bash
git clone <repository-url>
cd lakhstack
pnpm install
```

2. **Database Setup**
```bash
# Run the geographical function in Supabase SQL editor
# Copy contents from supabase-functions.sql

# Setup admin user and database
node scripts/setup-admin.js
```

3. **Google Cloud Configuration**
```bash
# Enable APIs in Google Cloud Console:
# - Places API (New)
# - Maps JavaScript API

# Configure OAuth 2.0:
# Authorized JavaScript origins:
# - http://localhost:3000 (dev)
# - https://lakhstack.com
# - https://www.lakhstack.com

# Authorized redirect URIs:
# - http://localhost:3000/api/auth/callback/google (dev)
# - https://www.lakhstack.com/api/auth/callback/google (prod)
```

4. **Development**
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
```

5. **Deployment Verification**
```bash
node scripts/verify-deployment.js www.lakhstack.com
```

## 🔧 Key Features Deep Dive

### Location-Based Search System

#### How It Works
1. **User Input**: Google Places autocomplete provides location suggestions
2. **Coordinate Extraction**: GPS coordinates extracted from selected location
3. **Database Filtering**: PostgreSQL function calculates distances using Haversine formula
4. **Results**: Listings within 50km radius returned, ordered by proximity

#### Implementation Details
```javascript
// Primary: Database-level filtering with PostgreSQL function
query = query.rpc('get_listings_within_radius', {
  search_lat: coordinates.lat,
  search_lng: coordinates.lng, 
  radius_km: 50
});

// Fallback: Client-side filtering with Haversine calculation
const distance = calculateDistance(
  coordinates.lat, coordinates.lng,
  listing.coordinates.lat, listing.coordinates.lng
);
```

### Authentication System

#### Admin Whitelist Approach
- Only pre-approved admin emails can access the platform
- No public registration - admin-curated for quality control
- Google OAuth provides secure, verified authentication

#### Role Management
```javascript
// Admin email whitelist in lib/auth.js
const ADMIN_EMAILS = [
  'harshkumaryadavg@gmail.com',
  'escoemelyn@gmail.com', 
  'lakhstack@gmail.com',
  'lakhstack.dev@gmail.com'
]
```

### Mobile-Responsive Design

#### Navigation System
- **Desktop**: Traditional horizontal navigation with Featured/All Listings
- **Mobile**: Hamburger menu positioned with theme toggle for professional UX
- **Adaptive**: Automatically adjusts based on screen size

#### Image Display
- **Hero Images**: Responsive with fallback states for missing images
- **Image Carousel**: Touch-friendly with thumbnail navigation
- **Error Handling**: Prevents empty src attributes that cause browser issues

## 🚀 Deployment

### Vercel Deployment
1. **Environment Variables**: Configure all required env vars in Vercel dashboard
2. **Domain Configuration**: 
   - Primary: www.lakhstack.com
   - Redirect: lakhstack.com → www.lakhstack.com
3. **API Keys**: Ensure Google API keys allow both domains

### Production Checklist
- [ ] All environment variables configured
- [ ] Google OAuth domains whitelisted
- [ ] Google Places API restrictions set
- [ ] Supabase database function deployed
- [ ] Admin users configured
- [ ] SSL certificates active

## 🔍 Troubleshooting

### Common Issues

#### Location Search Not Working
- **Symptoms**: All locations show same results
- **Solution**: Run `supabase-functions.sql` in Supabase SQL editor
- **Verification**: Check browser console for API errors

#### Authentication Redirects to Localhost
- **Symptoms**: Production redirects to localhost:3000
- **Solution**: Set `NEXTAUTH_URL=https://www.lakhstack.com` in Vercel
- **Related**: Update Google OAuth redirect URIs

#### Empty Image Sources
- **Symptoms**: Browser downloads entire page on missing images
- **Solution**: Use `src={imageUrl || null}` instead of empty strings
- **Prevention**: Always validate image URLs before rendering

### Development Commands
```bash
# Development
pnpm dev                                    # Start dev server
pnpm build                                  # Build for production  
pnpm lint                                   # Run ESLint
node scripts/setup-admin.js                # Setup database & admin
node scripts/verify-deployment.js [domain] # Check deployment config
```

## 📈 Performance Optimizations

### Database
- **Geographical Indexing**: Efficient location-based queries
- **Image Optimization**: Lazy loading with Next.js Image component
- **Query Optimization**: Selective field loading with join optimization

### Frontend
- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image with priority loading
- **Bundle Analysis**: Optimized imports and tree shaking

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow existing code patterns and component structure
4. Test thoroughly on both desktop and mobile
5. Update documentation if needed
6. Submit pull request with detailed description

### Code Standards
- **Components**: Use co-location pattern (`_components` folders)
- **Styling**: Tailwind CSS with consistent spacing
- **State**: React hooks with proper dependency arrays
- **API**: Consistent error handling and loading states

## 📄 License

MIT License - see LICENSE file for details

## 🏆 Recent Major Updates (LakhStack 2.0)

### Authentication Migration
- **From**: Clerk authentication system
- **To**: NextAuth.js v5 with Google OAuth
- **Benefits**: Better control, reduced dependencies, cost optimization

### Location System Enhancement  
- **Added**: Google Places API integration with GPS coordinates
- **Improved**: Geographical filtering with 50km radius search
- **Fixed**: Location search now shows different results per location

### UI/UX Improvements
- **Mobile Navigation**: Professional hamburger menu implementation
- **Hero Section**: Streamlined branding (removed "The" prefix)
- **Image Handling**: Fixed empty src attribute issues
- **Responsive Design**: Enhanced mobile experience across all components

### Technical Debt Resolution
- **Domain Issues**: Fixed localhost references in production
- **API Optimization**: Implemented fallback strategies for Google Places API
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized database queries and image loading