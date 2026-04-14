"use client";

import { useSession } from 'next-auth/react'
import { ScrollText, User as UserIcon } from 'lucide-react'
import React from 'react'
import UserListing from './_components/UserListing';

function User() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <div className='px-4 sm:px-6 md:px-10 lg:px-32 py-6'>
            <div className='bg-card rounded-2xl p-5 sm:p-8 border border-border/50 shadow-lg mb-6'>
                <div className='flex items-center gap-4'>
                    <div className='w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-gradient-to-br from-neural to-neural/80 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold'>
                        {user?.name?.charAt(0)?.toUpperCase() || <UserIcon className="w-7 h-7" />}
                    </div>
                    <div className="min-w-0">
                        <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>Profile</h1>
                        <p className='text-base text-muted-foreground truncate'>{user?.name}</p>
                        <p className='text-sm text-muted-foreground truncate'>{user?.email}</p>
                    </div>
                </div>
            </div>

            <div className='bg-card rounded-2xl p-5 sm:p-8 border border-border/50 shadow-lg'>
                <div className='flex items-center gap-3 mb-6'>
                    <ScrollText className='h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0'/>
                    <h2 className='text-xl sm:text-2xl font-bold text-foreground'>My Listings</h2>
                </div>
                <UserListing/>
            </div>
        </div>
    )
}

export default User