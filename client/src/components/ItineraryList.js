import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders a list of trip cards.
 * @param {object} props - The component props.
 * @param {Array} props.trips - An array of trip objects to display.
 * @param {Function} props.onDelete - The function to call when a trip's delete button is clicked.
 */
const ItineraryList = ({ trips, onDelete }) => {
    // Display a message if there are no trips to show.
    if (!trips || trips.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-700">No trips planned yet.</h2>
                <p className="text-gray-500 mt-2">Ready for an adventure? Create your first itinerary!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map(trip => (
                <div key={trip._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                    <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start gap-4">
                             <h3 className="text-2xl font-bold text-gray-800 mb-2">{trip.title}</h3>
                             <div className="text-sm text-gray-500 whitespace-nowrap pt-1">
                                {/* Format dates for better readability */}
                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                             </div>
                        </div>
                        <p className="text-gray-600 mt-2 h-12 overflow-hidden text-ellipsis">{trip.description || 'No description provided.'}</p>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-end items-center space-x-4">
                        <Link to={`/planner/${trip._id}`} className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                            View Details
                        </Link>
                        {/* The onDelete function is passed from the HomePage component */}
                        <button onClick={() => onDelete(trip._id)} className="font-medium text-red-600 hover:text-red-800 transition-colors duration-200">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItineraryList;