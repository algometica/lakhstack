"use client";

import { UserButton, UserProfile } from '@clerk/nextjs'
import { ScrollText } from 'lucide-react'
import React from 'react'
import UserListing from './_components/UserListing';

function User() {
    return (
        <div className='my-6 md:px-10 lg:px-32'>
            <h2 className='font-bold text-2xl py-3'>Profile</h2>
            <UserProfile>
                <UserButton.UserProfilePage
                    label='My Listing'
                    labelIcon={<ScrollText className='h-5 w-5'/>}
                    url='my-listing'
                >
                    <UserListing/>
                </UserButton.UserProfilePage>
            </UserProfile>
        </div>
    )
}

export default User