# Environment Variables for URL Configuration

## For Production Deployment

Add this environment variable to your production environment (Vercel, Netlify, etc.):

```
NEXT_PUBLIC_BASE_URL=https://www.lakhstack.com
```

## For Local Development

The application will automatically use `http://localhost:3000` in development mode.

## How It Works

The `getBaseUrl()` function in `lib/url-utils.js` will:

1. **In Browser**: Use `window.location.origin` (automatically detects localhost vs production)
2. **In Server/SSR**: Use `NEXT_PUBLIC_BASE_URL` environment variable if set
3. **Fallback**: Use `https://www.lakhstack.com` as default

## Benefits

- ✅ **Automatic Detection**: Works in both local and production without code changes
- ✅ **Environment Variable Support**: Can be overridden via `NEXT_PUBLIC_BASE_URL`
- ✅ **SSR Compatible**: Works during server-side rendering
- ✅ **Reusable**: Can be used throughout the application for URL generation

## Usage Examples

```javascript
import { getBaseUrl, getListingUrl } from '@/lib/url-utils';

// Get base URL
const baseUrl = getBaseUrl(); // localhost:3000 or https://www.lakhstack.com

// Get full listing URL
const listingUrl = getListingUrl('mossad-raw'); // https://www.lakhstack.com/view-listing/mossad-raw
```
