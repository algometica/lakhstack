import { Button } from '@/components/ui/button'
import { MailOpen, Router } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

function BusinessDetail({ listingDetail }) {
    // Use business email if available, otherwise fallback to created_by email
    const contactEmail = listingDetail?.business_email || listingDetail?.created_by;

    return (
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center justify-between p-4 sm:p-5 rounded-lg shadow-md border my-2'>
            <div className='flex items-center gap-4 sm:gap-6 w-full sm:w-auto'>
                {listingDetail?.profile_image && listingDetail.profile_image.trim() !== '' ? (
                    <Image src={listingDetail.profile_image}
                        alt='profileImage'
                        width={50}
                        height={50}
                        className='rounded-full w-12 h-12 sm:w-15 sm:h-15'
                    />
                ) : (
                    <div className='rounded-full w-12 h-12 sm:w-15 sm:h-15 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg'>
                        {listingDetail?.business_name?.charAt(0) || listingDetail?.full_name?.charAt(0) || 'B'}
                    </div>
                )}
                <div className='flex-1 sm:flex-none'>
                    <h2 className='text-base sm:text-lg font-bold'>{listingDetail?.full_name}</h2>
                    <h2 className='text-sm sm:text-base text-muted-foreground break-words'>{contactEmail}</h2>
                    {listingDetail?.business_email && (
                        <p className='text-xs text-muted-foreground/70'>Business Contact</p>
                    )}
                </div>
            </div>
            <button 
                onClick={() => window.location.href = 'mailto:' + contactEmail}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto"
                title={`Send email to ${contactEmail}`}
            >
                <MailOpen className="w-4 h-4 mr-2 sm:mr-0"/>
                <span className="sm:hidden">Send Email</span>
            </button>
        </div>
    )
}

export default BusinessDetail