import React from 'react';
import { GoogleMap, useLoadScript, Marker, Polyline } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// A default center for the map when no route is available.
const defaultCenter = {
  lat: 48.8566, // Paris, France
  lng: 2.3522,
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
};

const MapComponent = ({ route }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Use environment variable for API key
        libraries: ["places"],
    });

    if (loadError) return <div className="flex items-center justify-center h-full"><p>Error loading maps</p></div>;
    if (!isLoaded) return <div className="flex items-center justify-center h-full"><p>Loading Maps...</p></div>;
    
    // Create the path for the Polyline
    const path = route.map(loc => ({ lat: loc.lat, lng: loc.lng }));

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={route && route.length > 0 ? 8 : 4}
            center={route && route.length > 0 ? { lat: route[0].lat, lng: route[0].lng } : defaultCenter}
            options={mapOptions}
        >
            {route && route.map((location, index) => (
                <Marker 
                    key={index} 
                    position={{ lat: location.lat, lng: location.lng }} 
                    label={{ text: `${index + 1}`, color: "white" }}
                />
            ))}
            {path.length > 1 && (
                 <Polyline
                    path={path}
                    options={{
                        strokeColor: '#4f46e5',
                        strokeOpacity: 1.0,
                        strokeWeight: 3,
                    }}
                />
            )}
        </GoogleMap>
    );
};

export default React.memo(MapComponent);