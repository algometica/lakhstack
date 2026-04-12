import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { getAdminEmails, isAdminEmail } from "@/lib/admin-emails"

// Skip validation during `next build` — env vars are only available at runtime.
// Set ADMIN_EMAIL (or ADMIN_EMAILS) + auth vars in your Vercel project settings.
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

if (!isBuildPhase) {
  const requiredEnvVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars)
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  const adminEmails = getAdminEmails()
  if (adminEmails.length === 0) {
    throw new Error('ADMIN_EMAILS is required and must contain at least one email.')
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if email is in admin whitelist
      if (!isAdminEmail(user?.email)) {
        return false
      }

      // For Google OAuth, also verify email is verified by Google
      if (account?.provider === 'google') {
        const isVerified = profile?.email_verified === true
        if (!isVerified) {
          console.log(`Unverified Google email: ${user.email}`)
          return false
        }
      }

      console.log(`Access granted for admin: ${user.email}`)
      return true
    },

    async jwt({ token, user, account }) {
      // Add admin role and additional info to token
      if (user && isAdminEmail(user.email)) {
        token.role = 'admin'
        token.isAdmin = true
      }
      return token
    },

    async session({ session, token }) {
      // Add role and admin status to session
      if (token.role) {
        session.user.role = token.role
        session.user.isAdmin = token.isAdmin
      }
      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 15, // 15 minutes
      },
    },
  },

  secret: process.env.AUTH_SECRET,

  trustHost: true,

  debug: process.env.NODE_ENV === 'development',
  
  // Additional security settings
  useSecureCookies: process.env.NODE_ENV === 'production',
  
  // Session configuration
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
})
