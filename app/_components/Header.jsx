"use client";

import { Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



function Header() {
  const path = usePathname();
  const { data: session, status } = useSession();
  
  const user = session?.user;
  const isAuthenticated = !!session;
  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  useEffect(() => {
    console.log(path)
  }, [])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className='px-6 lg:px-10 py-4 flex justify-between items-center fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm'>
      <div className='flex gap-8 items-center'>
        <Link href={'/'} className="flex items-center gap-3">
          <Image src={'/logo.svg'} width={40} height={40} alt='logo' className="object-contain" />
          <span className="text-xl font-black hidden sm:block" style={{ color: '#db4a2b' }}>LakhStack</span>
        </Link>
        
        <nav className='hidden md:flex gap-1'>
          <Link href={'/'}>
            <div className={`transition-all duration-300 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer
              ${path === '/' 
                ? 'text-primary bg-primary/10 border border-primary/20' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}>
              Featured
            </div>
          </Link>
          <Link href={'/all-listings'}>
            <div className={`transition-all duration-300 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer
              ${path === '/all-listings' 
                ? 'text-primary bg-primary/10 border border-primary/20' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}>
              All Listings
            </div>
          </Link>
        </nav>
      </div>
      <div className='flex gap-3 items-center' id="navbar-default">
        <ThemeToggle />
        
        {isAuthenticated && isAdmin && (
          <Link href={'/add-new-listing'}>
            <Button className='flex gap-2 h-10 px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
              <Plus className='h-4 w-4' />
              Add Listing
            </Button>
          </Link>
        )}

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-10 h-10 bg-gradient-to-br from-neural to-neural/80 rounded-full flex items-center justify-center text-white font-bold cursor-pointer ring-2 ring-neural/20 hover:ring-neural/40 transition-all duration-300 transform hover:scale-105 shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl">
              <DropdownMenuLabel className="font-semibold text-foreground">
                {user?.name || 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />

              <DropdownMenuItem className="hover:bg-muted/50 transition-colors cursor-pointer">
                <Link href={'/user'} className="flex items-center w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-muted/50 transition-colors cursor-pointer">
                <Link href={'/user#/my-listing'} className="flex items-center w-full">
                  My Listings
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <Link href={'/admin'} className="flex items-center w-full text-primary font-medium">
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer font-medium"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Sign-in hidden for regular users in admin-curated mode
          // Admins can access sign-in directly via /auth/signin URL
          null
        )}
      </div>
    </div >
  )
}

export default Header