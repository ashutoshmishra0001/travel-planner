import React, { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';

// Define libraries array outside the component to prevent re-renders.
const libraries = ["places"];

const TripDetails = ({ trip, onSave }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries, // Use the constant here
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(trip);
    const [locationInput, setLocationInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData(trip);
    }, [trip]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddLocation = (e) => {
        e.preventDefault();
        if (!locationInput) return;
        if (!isLoaded) {
            setError("Map service is not loaded yet. Please try again.");
            return;
        }
        setError('');

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ 'address': locationInput }, (results, status) => {
            if (status === 'OK') {
                const newLocation = {
                    name: results[0].formatted_address,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                };
                setFormData(prev => ({
                    ...prev,
                    route: [...prev.route, newLocation]
                }));
                setLocationInput('');
            } else {
                setError(`Could not find location: ${status}`);
            }
        });
    };

    const handleRemoveLocation = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            route: prev.route.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSave(formData);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSave} className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Edit Trip</h2>
                {/* Title and Description */}
                <div>
                    <label className="block text-gray-700 font-bold mb-1">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                </div>
                
                <hr/>

                {/* Route Editing UI */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Edit Route</h3>
                    <div className="flex items-start space-x-2">
                        <input type="text" placeholder="Add a new destination" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        <button onClick={handleAddLocation} type="button" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 mt-1">Add</button>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {loadError && <p className="text-red-500 text-sm">Error loading map services.</p>}
                    
                    <div className="space-y-2">
                        {formData.route.map((loc, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                <span className="text-gray-700">{index + 1}. {loc.name}</span>
                                <button onClick={() => handleRemoveLocation(index)} type="button" className="text-red-500 hover:text-red-700 font-bold">Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save/Cancel Buttons */}
                <div className="flex space-x-4 pt-4">
                    <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded w-full hover:bg-indigo-700">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded w-full hover:bg-gray-400">Cancel</button>
                </div>
            </form>
        );
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{trip.title}</h2>
                <button onClick={() => setIsEditing(true)} className="font-medium text-indigo-600 hover:underline">Edit</button>
            </div>
            <p className="text-gray-600 mb-4">{trip.description || "No description."}</p>
            <p className="font-semibold mb-2">Dates: {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}</p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Route</h3>
            {trip.route && trip.route.length > 0 ? (
                <ol className="list-decimal list-inside space-y-1">
                    {trip.route.map((location, index) => (
                        <li key={index}>{location.name}</li>
                    ))}
                </ol>
            ) : (
                <p className="text-gray-500">No route planned yet. Edit the trip to add destinations!</p>
            )}
        </div>
    );
};

export default TripDetails;