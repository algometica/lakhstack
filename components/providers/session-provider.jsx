"use client"

import { SessionProvider } from "next-auth/react"

export function AuthSessionProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>
}