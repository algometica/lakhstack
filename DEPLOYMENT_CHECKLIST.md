# Vercel Deployment Checklist

## Environment Variables Required

Make sure ALL these environment variables are set in your Vercel project settings:

### Authentication Variables (CRITICAL)
```
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
AUTH_SECRET=your_32_character_random_secret
```

### Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_API_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Note:** The `NEXT_PUBLIC_SUPABASE_API_KEY` warning in Vercel is a **false positive**. Supabase's anon key is **designed to be public** and safe for client-side use. This is the intended behavior for Supabase.

### Google API Keys (SECURE - Server-side only)
```
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Admin Configuration
```
ADMIN_EMAIL=admin@example.com
```

## How to Set Environment Variables on Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above
5. Make sure to set them for **Production**, **Preview**, and **Development** environments

## AUTH_SECRET Generation

Generate a secure AUTH_SECRET:
```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local development)

## Testing Deployment

After setting all environment variables:

1. **Check environment variables**: Visit `/api/auth/check-env` on your deployed site
2. **Test authentication**: Try signing in with a whitelisted email
3. **Check logs**: Monitor Vercel function logs for any errors

## Common Issues

### "Configuration" Error
- Missing `AUTH_SECRET`
- Missing `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET`
- Incorrect Google OAuth redirect URIs

### "Access Denied" Error
- Email not in admin whitelist
- Google email not verified

### PKCE Errors
- Usually resolved by the updated auth configuration
- Clear browser cookies if persistent

### Supabase API Key Warning
- **This is a false positive** - Supabase's anon key is designed to be public
- The warning appears because the variable name contains "KEY"
- This is the intended behavior for Supabase client-side operations

## Debugging Steps

1. Check environment variables: `/api/auth/check-env`
2. Clear browser cookies for your domain
3. Check Vercel function logs
4. Verify Google OAuth configuration
5. Ensure all environment variables are set for all environments (Production, Preview, Development) 