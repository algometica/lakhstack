"use client";

import React, { useState, useEffect } from 'react'
import Header from './_components/Header'
import { LoadScript } from '@react-google-maps/api'
import { ThemeProvider } from "next-themes"
import { AuthSessionProvider } from "@/components/providers/session-provider"

function Provider({ children }) {
  const [mapsApiKey, setMapsApiKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMapsConfig = async () => {
      try {
        const response = await fetch('/api/maps/config');
        if (response.ok) {
          const data = await response.json();
          setMapsApiKey(data.apiKey);
        } else {
          console.error('Failed to fetch Google Maps API key');
        }
      } catch (error) {
        console.error('Error fetching Google Maps config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapsConfig();
  }, []);

  if (isLoading) {
    return (
      <AuthSessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div>
            <Header />
            <div className='mt-40'>
              {children}
            </div>
          </div>
        </ThemeProvider>
      </AuthSessionProvider>
    );
  }

  return (
    <AuthSessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div>
          {mapsApiKey ? (
            <LoadScript
              googleMapsApiKey={mapsApiKey}
              libraries={[]}
            >
              <Header />
              <div className='mt-40'>
                {children}
              </div>
            </LoadScript>
          ) : (
            <>
              <Header />
              <div className='mt-40'>
                {children}
              </div>
            </>
          )}
        </div>
      </ThemeProvider>
    </AuthSessionProvider>
  )
}

export default Provider