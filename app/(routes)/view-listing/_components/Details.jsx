
import GoogleMapSection from '@/app/_components/GoogleMapSection'
import { Button } from '@/components/ui/button'
import { BadgeDollarSign, ExternalLink, Factory, Filter, Instagram, MapPin, Phone } from 'lucide-react'

import React from 'react'
import BusinessDetail from './BusinessDetail'

function Details({ listingDetail }) {
    return listingDetail && (
        <div className='my-6 flex gap-2 flex-col'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-bold text-3xl'>{listingDetail?.business_name}</h2>
                    <h2 className='text-gray-500 text-lg flex gap-2'>
                        <MapPin />{listingDetail.city + ", " + listingDetail.country}
                    </h2>
                </div>
                {/* <Button className="flex gap-2"> <Share /> Share</Button> */}
            </div>
            <hr></hr>
            <div className='mt-4 flex flex-col gap-3'>
                <h2 className=' font-bold text-2xl'>Key Features</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 '>
                    <h2 className='flex gap-2 items-center bg-purple-100 rounded-lg p-3 text-primary justify-center'>
                        <Factory />
                        {listingDetail?.industry}
                    </h2>
                    <h2 className='flex gap-2 items-center justify-center bg-purple-100 rounded-lg p-3 text-primary'>
                        <Filter />
                        {listingDetail?.category}
                    </h2>
                    <h2 className='flex gap-2 items-center justify-center bg-purple-100 rounded-lg p-3 text-primary'>
                        <BadgeDollarSign />
                        {listingDetail?.price_range}
                    </h2>
                    <h2 className='flex gap-2 items-center bg-purple-100 rounded-lg p-3 text-primary justify-center'>
                        <a href={listingDetail?.url} target="_blank">
                            <ExternalLink />
                        </a>
                    </h2>

                    <h2 className='flex gap-2 items-center bg-purple-100 rounded-lg p-3 text-primary justify-center'>
                        <a href={listingDetail?.instagram_url} target="_blank">
                            <Instagram />
                        </a>
                    </h2>

                    <h2 className='flex gap-2 items-center justify-center bg-purple-100 rounded-lg p-3 text-primary'>
                        <Phone />
                        {listingDetail?.phone}
                    </h2>

                </div>

            </div>
            <div className='mt-4'>
                <h2 className='font-bold text-2xl pt-4'>About this business</h2>
                <p className='text-gray-600 '>{listingDetail?.description}</p>
            </div>
            <div>
                <h2 className='font-bold text-2xl pt-4'>Find On Map</h2>
                <GoogleMapSection
                    coordinates={listingDetail.coordinates}
                    listing={[listingDetail]}
                />
            </div>
            <div>
                <h2 className='font-bold text-2xl pt-4'>Contact Business</h2>
                <BusinessDetail listingDetail={listingDetail} />
            </div>
        </div>
    )
}

export default Details