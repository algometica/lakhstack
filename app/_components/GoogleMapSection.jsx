import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import MarkerItem from './MarkerItem';

const containerStyle = {
  width: '100%',
  height: '60vh',
  borderRadius: 12
};

function GoogleMapSection({ coordinates, listing }) {
  const [center, setCenter] = useState({
    lat: coordinates?.lat || 0,
    lng: coordinates?.lng || 0
  })
  const [map, setMap] = React.useState(null)

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })

  useEffect(() => {
    if (coordinates) {
      setCenter({
        lat: coordinates.lat,
        lng: coordinates.lng
      })
    }
  }, [coordinates])

  const onLoad = React.useCallback(function callback(map) {
    if (center.lat !== 0 && center.lng !== 0) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
    }
    setMap(map)
  }, [center])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  if (!isLoaded) {
    return (
      <div className="w-full h-[60vh] bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={9}
        onLoad={onLoad}
        onUnmount={onUnmount}
        gestureHandling="greedy"
      >
        { /* Child components, such as markers, info windows, etc. */}
        {listing && listing.map((item, index) => (
          <MarkerItem
            key={index}
            item={item}
          />
        ))}
      </GoogleMap>
    </div>
  )
}

export default GoogleMapSection