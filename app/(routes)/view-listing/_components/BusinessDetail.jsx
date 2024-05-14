import { Button } from '@/components/ui/button'
import { MailOpen, Router } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

function BusinessDetail({ listingDetail }) {

    return (
        <div className='flex gap-5 items-center justify-between p-5 rounded-lg shadow-md border my-2'>
            <div className='flex items-center gap-6'>
                <Image src={listingDetail?.profile_image}
                    alt='profileImage'
                    width={60}
                    height={60}
                    className='rounded-full'
                />
                <div>
                    <h2 className='text-lg font-bold'>{listingDetail?.full_name}</h2>
                    <h2 className='text-gray-500'>{listingDetail?.created_by}</h2>
                </div>
            </div>
            <Button onClick={() => window.location = 'mailto:' + listingDetail?.created_by}><MailOpen/></Button>
        </div>
    )
}

export default BusinessDetail