"use client";

import { Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    console.log(path)
  }, [])

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className='p-4 px-10 flex justify-between shadow-sm fixed top-0 w-full z-10 bg-white'>
      <div className='flex gap-6 items-center'>
        <Link href={'/'}>
          <Image src={'/logo.svg'} width={100} height={100} alt='logo' />
        </Link>
        {/* <ul className='hidden sm:flex gap-10'>*/}
        <ul className='sm:flex gap-8'>
          <Link href={'/'}>
            <li className={`transition-all duration-200 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-sm cursor-pointer
              ${path === '/' ? 'text-primary bg-gray-50' : 'text-gray-600 hover:text-primary'}`}>
              Featured
            </li>
          </Link>
          <Link href={'/all-listings'}>
            <li className={`transition-all duration-200 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-sm cursor-pointer
              ${path === '/all-listings' ? 'text-primary bg-gray-50' : 'text-gray-600 hover:text-primary'}`}>
              All
            </li>
          </Link>
          {/* <li className='hover:text-primary font-medium text-sm cursor-pointer'>Agent Finder</li> */}
        </ul>
      </div>
      <div className='flex gap-2 items-center' id="navbar-default">
        {isAuthenticated && (
          <Link href={'/add-new-listing'}>
            <Button className='flex gap-2'><Plus className='h-5 w-3' />List</Button>
          </Link>
        )}

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium cursor-pointer">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link href={'/user'}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={'/user#/my-listing'}>My Listing</Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem>
                  <Link href={'/admin'}>Admin Panel</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div >
  )
}

export default Header