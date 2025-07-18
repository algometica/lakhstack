"use client";

import { useSession } from 'next-auth/react'
import { ScrollText, User as UserIcon } from 'lucide-react'
import React from 'react'
import UserListing from './_components/UserListing';

function User() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <div className='my-6 md:px-10 lg:px-32'>
            <div className='bg-card rounded-2xl p-8 border border-border/50 shadow-lg mb-8'>
                <div className='flex items-center gap-4 mb-6'>
                    <div className='w-16 h-16 bg-gradient-to-br from-neural to-neural/80 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
                        {user?.name?.charAt(0)?.toUpperCase() || <UserIcon className="w-8 h-8" />}
                    </div>
                    <div>
                        <h1 className='text-3xl font-bold text-foreground'>Profile</h1>
                        <p className='text-lg text-muted-foreground'>{user?.name}</p>
                        <p className='text-sm text-muted-foreground'>{user?.email}</p>
                    </div>
                </div>
            </div>

            <div className='bg-card rounded-2xl p-8 border border-border/50 shadow-lg'>
                <div className='flex items-center gap-3 mb-6'>
                    <ScrollText className='h-6 w-6 text-primary'/>
                    <h2 className='text-2xl font-bold text-foreground'>My Listings</h2>
                </div>
                <UserListing/>
            </div>
        </div>
    )
}

export default User