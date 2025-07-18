import { Button } from '@/components/ui/button'
import { Bath, BedDouble, MapPin, Ruler, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function MarkerListingItem({ item, closeHandler }) {
    return (
        <div>
            <div className='cursor-pointer rounded-lg w-[170px]'>
                <X onClick={() => closeHandler()} />
                <Image src={item?.listing_images[0]?.url}
                    width={800}
                    height={150}
                    alt={item?.business_name || 'Listing image'}
                    className='rounded-lg object-cover w-[165px] h-[100px]'
                />
                <div className='bg-white flex mt-2 flex-col gap-2 p-2'>
                    <h2 className='font-bold text-xl'>${item?.price}</h2>
                    <h2 className='flex gap-2 text-sm text-gray-400'><MapPin className='h-4 w-4' />{item.address}</h2>
                    <div className='flex gap-2 mt-2 justify-between'>
                        <h2 className='flex gap-2 text-sm bg-slate-200 w-full rounded-md p-2 text-gray-500 justify-center items-center'>
                            <BedDouble className='h-4 w-4' />
                            {item?.bedroom}
                        </h2>
                        <h2 className='flex gap-2 text-sm bg-slate-200 w-full rounded-md p-2 text-gray-500 justify-center items-center'>
                            <Bath className='h-4 w-4' />
                            {item?.bathroom}
                        </h2>
                    </div>
                    {/* <Link href={'view-listing/' + item.id} className='w-full'>
                        <Button size='sm'>View Details</Button>
                    </Link> */}

                </div>

            </div>
        </div>
    )
}

export default MarkerListingItem