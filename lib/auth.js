import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Admin email whitelist - Only these emails can access the application
const ADMIN_EMAILS = [
  'harshkumaryadavg@gmail.com',
  'escoemelyn@gmail.com', 
  'lakhstack@gmail.com',
  'lakhstack.dev@gmail.com'
]

// Validate required environment variables
const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
}

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars)
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
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
      console.log('SignIn callback:', { user: user?.email, account: account?.provider, profile: profile?.email_verified });
      
      // Check if email is in admin whitelist
      if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
        console.log(`Access denied for email: ${user.email}`)
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
      if (user && ADMIN_EMAILS.includes(user.email)) {
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