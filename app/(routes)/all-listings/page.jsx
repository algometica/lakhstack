import ListingMapView from '@/app/_components/ListingMapView'
import React from 'react'

function AllListings() {
    return (
        <div>
            <div className="px-10 p-10">
                <ListingMapView featured={[true, false]} />
            </div>
        </div>
    )
}

export default AllListings