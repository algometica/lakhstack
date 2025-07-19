import ListingMapView from '@/app/_components/ListingMapView'
import React from 'react'

function AllListings() {
    return (
        <div>
            <ListingMapView featured={[true, false]} />
        </div>
    )
}

export default AllListings