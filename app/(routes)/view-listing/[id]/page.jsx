"use client";

import { supabase } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import Slider from '../_components/Slider';
import Details from '../_components/Details';

function ViewListing({params}) {

    const [listingDetail, setListingDetail] = useState();

    useEffect(() => {
        GetListingDetail();
    }, [])

    const GetListingDetail = async () => {
        const {data, error} = await supabase
        .from('listing')
        .select('*, listing_images(url, listing_id)')
        .eq('id', params.id)
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
        <div className='relative h-[60vh] overflow-hidden'>
            <Slider imageList={listingDetail?.listing_images} />
            <div className='absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent' />
        </div>

        {/* Content Section */}
        <div className='relative -mt-32 z-10'>
            <div className='max-w-7xl mx-auto px-6 lg:px-8'>
                <div className='bg-card rounded-t-3xl shadow-2xl border border-border/50'>
                    <Details listingDetail={listingDetail} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ViewListing