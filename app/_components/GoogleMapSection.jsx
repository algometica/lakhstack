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
    lat: coordinates.lat,
    lng: coordinates.lng
  })
  const [map, setMap] = React.useState(null)

  useEffect(() => {
    coordinates && setCenter(coordinates)
  }, [coordinates])

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)

  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

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
        {listing.map((item, index) => (
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