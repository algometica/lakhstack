"use client";

import React from 'react'
import Header from './_components/Header'
import { LoadScript } from '@react-google-maps/api'
import { ThemeProvider } from "next-themes"
import { AuthSessionProvider } from "@/components/providers/session-provider"

function Provider({ children }) {
  return (
    <AuthSessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        suppressHydrationWarning
      >
        <div>
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY} 
            libraries={['places']}
          >
          <Header />
          <div className='mt-40'>
            {children}
          </div>
          </LoadScript>
        </div>
      </ThemeProvider>
    </AuthSessionProvider>
  )
}

export default Provider