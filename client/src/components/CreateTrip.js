import React, { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';

// Define libraries array outside the component to prevent re-renders.
const libraries = ["places"];

const CreateTrip = ({ onSave }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries, // Use the constant here
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        route: [],
    });
    
    const [locationInput, setLocationInput] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddLocation = (e) => {
        e.preventDefault();
        if (!locationInput) return;
        if (!isLoaded) {
            setError("Map service is not loaded yet. Please try again in a moment.");
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
                setError(`Geocode was not successful for the following reason: ${status}`);
            }
        });
    };
    
    const handleRemoveLocation = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            route: prev.route.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Plan a New Trip</h2>
            
            {/* Trip Details Section */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Trip Title</label>
                <input id="title" name="title" type="text" required placeholder="e.g., European Adventure" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" name="description" rows="3" placeholder="A brief summary of your trip" value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input id="startDate" name="startDate" type="date" required value={formData.startDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <input id="endDate" name="endDate" type="date" required value={formData.endDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>

            {/* Location Planning Section */}
            <hr/>
            <div>
                <h3 className="text-xl font-semibold text-gray-800">Build Your Route</h3>
                <div className="flex items-start space-x-2 mt-2">
                    <input type="text" placeholder="Add a destination" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    <button onClick={handleAddLocation} type="button" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 mt-1">Add</button>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                {loadError && <p className="text-red-500 text-sm mt-1">Error loading map services.</p>}
            </div>

            {/* Display Added Locations */}
            <div className="space-y-2">
                {formData.route.map((loc, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                        <span className="text-gray-700">{index + 1}. {loc.name}</span>
                        <button onClick={() => handleRemoveLocation(index)} type="button" className="text-red-500 hover:text-red-700 font-bold">Remove</button>
                    </div>
                ))}
            </div>

            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create and Start Planning
            </button>
        </form>
    );
};

export default CreateTrip;