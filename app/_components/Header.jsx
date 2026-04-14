"use client";

import { Plus, Settings, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const user = session?.user;
  const isAuthenticated = !!session;
  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  useEffect(() => {
    // Close mobile menu when path changes
    setIsMobileMenuOpen(false);
  }, [path])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className='fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-border/70 shadow-[0_8px_30px_rgba(15,23,42,0.06)]'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex justify-between items-center'>
        <div className='flex gap-8 items-center'>
          <Link href={'/'} className="flex items-center">
            <span className="text-xl font-black font-display" style={{color: '#ff914d'}}>LakhStack</span>
          </Link>
        
          {/* Desktop Navigation */}
          <nav className='hidden md:flex gap-1'>
          <Link href={'/'}>
            <div className={`transition-all duration-300 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer
              ${path === '/' 
                ? 'text-foreground bg-secondary/70 border border-border/70' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}>
              Featured
            </div>
          </Link>
          <Link href={'/all-listings'}>
            <div className={`transition-all duration-300 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer
              ${path === '/all-listings'
                ? 'text-foreground bg-secondary/70 border border-border/70'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}>
              All Vendors
            </div>
          </Link>
          <Link href={'/notes'}>
            <div className={`transition-all duration-300 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer
              ${path === '/notes' || path.startsWith('/notes/')
                ? 'text-foreground bg-secondary/70 border border-border/70'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}>
              Notes
            </div>
          </Link>
          </nav>
        </div>
        <div className='flex gap-3 items-center' id="navbar-default">
        {/* Mobile Menu Button - positioned with other controls */}
        <Button 
          variant="ghost" 
          size="icon" 
          className='md:hidden h-11 w-11 hover:bg-secondary/60 transition-all duration-300'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </Button>
        
        {isAuthenticated && isAdmin && (
          <Link href={'/add-new-listing'}>
            <Button className='flex gap-2 h-10 px-4 bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.25)] transition-all duration-300 transform hover:-translate-y-0.5'>
              <Plus className='h-4 w-4' />
              Add Listing
            </Button>
          </Link>
        )}

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-white font-bold cursor-pointer ring-2 ring-foreground/10 hover:ring-foreground/30 transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_10px_18px_rgba(15,23,42,0.18)]">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border border-border/70 shadow-xl">
              <DropdownMenuLabel className="font-semibold text-foreground">
                {user?.name || 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />

              <DropdownMenuItem className="hover:bg-secondary/60 transition-colors cursor-pointer">
                <Link href={'/user'} className="flex items-center w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-secondary/60 transition-colors cursor-pointer">
                <Link href={'/user#/my-listing'} className="flex items-center w-full">
                  My Listings
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem className="hover:bg-secondary/60 transition-colors cursor-pointer">
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
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border/70 shadow-lg'>
          <nav className='flex flex-col p-4 gap-2'>
            <Link href={'/'} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={`transition-all duration-300 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer w-full text-center
                ${path === '/' 
                  ? 'text-primary bg-primary/10 border border-primary/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}>
                Featured
              </div>
            </Link>
            <Link href={'/all-listings'} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={`transition-all duration-300 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer w-full text-center
                ${path === '/all-listings'
                  ? 'text-primary bg-primary/10 border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}>
                All Vendors
              </div>
            </Link>
            <Link href={'/notes'} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={`transition-all duration-300 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer w-full text-center
                ${path === '/notes' || path.startsWith('/notes/')
                  ? 'text-primary bg-primary/10 border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}>
                Notes
              </div>
            </Link>
          </nav>
        </div>
      )}
    </div >
  )
}

export default Header
