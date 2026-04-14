"use client";

import React, { useState, useEffect } from 'react'
import Header from './_components/Header'
import Footer from './_components/Footer'
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

  const layout = (content) => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mt-16 sm:mt-[72px]">
        {content}
      </main>
      <Footer />
    </div>
  );

  if (isLoading) {
    return (
      <AuthSessionProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {layout(children)}
        </ThemeProvider>
      </AuthSessionProvider>
    );
  }

  return (
    <AuthSessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        {mapsApiKey ? (
          <LoadScript googleMapsApiKey={mapsApiKey} libraries={[]}>
            {layout(children)}
          </LoadScript>
        ) : (
          layout(children)
        )}
      </ThemeProvider>
    </AuthSessionProvider>
  )
}

export default Provider
