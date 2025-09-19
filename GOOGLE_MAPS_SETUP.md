# Google Maps API Setup Guide

## Issue Identified
The "Loading..." issue on listing pages is caused by a missing Google Maps API key. The console shows:
```
Google Maps JavaScript API warning: NoApiKeys
```

## Solution

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Maps JavaScript API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Google Maps API Key (must be NEXT_PUBLIC_ for client-side access)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Other existing variables...
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# ... etc
```

### 3. Restart Development Server
```bash
pnpm dev
```

## What This Fixes

✅ **Before**: Pages show "Loading..." indefinitely due to Google Maps API failure  
✅ **After**: Pages load instantly, map shows properly or displays helpful error message

## Fallback Behavior

If the API key is missing, the map section will show:
- A clean "Map Unavailable" message
- The listing coordinates as text
- No more infinite loading

## Complete Environment Variables Template

Create a `.env.local` file with these variables:

```bash
# Google Maps API Key (required for map functionality)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Base URL for production
NEXT_PUBLIC_BASE_URL=https://www.lakhstack.com
```

## Security Note

The API key is now used directly from environment variables. Make sure to:
- Never commit `.env.local` to version control
- Use different API keys for development and production
- Restrict your API key to specific domains in Google Cloud Console
