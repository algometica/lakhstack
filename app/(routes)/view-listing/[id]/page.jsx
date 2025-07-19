"use client";

import { supabase } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import Image from 'next/image';
import Details from '../_components/Details';

function ViewListing({params}) {
    // Unwrap params using React.use() for Next.js 15 compatibility
    const resolvedParams = React.use(params);
    const [listingDetail, setListingDetail] = useState();

    useEffect(() => {
        GetListingDetail();
    }, [])

    const GetListingDetail = async () => {
        const {data, error} = await supabase
        .from('listing')
        .select('*, listing_images(url, listing_id)')
        .eq('id', resolvedParams.id)
        .eq('active', true);

        if (data) {
            console.log(data)
            setListingDetail(data[0]);
        }
        if (error) {
            toast('Server side error!')
        }
    }

  return (
    <div className='min-h-screen bg-background'>
        {/* Hero Image Section */}
        <div className='relative h-[50vh] sm:h-[60vh] overflow-hidden'>
            {listingDetail?.listing_images && listingDetail.listing_images.length > 0 ? (
                <div className='relative h-full w-full'>
                    <Image
                        src={listingDetail.listing_images[0].url}
                        fill
                        alt={`${listingDetail?.business_name} hero image`}
                        className='object-cover'
                        priority
                    />
                </div>
            ) : (
                <div className='w-full h-full bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center'>
                    <div className="text-muted-foreground text-lg font-medium">Loading business image...</div>
                </div>
            )}
            <div className='absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent' />
        </div>

        {/* Content Section */}
        <div className='relative -mt-20 md:-mt-32 z-10'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='bg-card rounded-t-3xl shadow-2xl border border-border/50'>
                    <Details listingDetail={listingDetail} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ViewListing