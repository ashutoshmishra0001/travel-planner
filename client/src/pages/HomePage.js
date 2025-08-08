import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllTrips, deleteTrip } from '../services/api';
import ItineraryList from '../components/ItineraryList';

const HomePage = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrips = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const { data } = await getAllTrips();
            setTrips(data);
        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            try {
                await deleteTrip(id);
                fetchTrips();
            } catch (error) {
                console.error("Failed to delete trip:", error);
            }
        }
    };

    if (!user) {
        return (
            <div className="bg-white">
                <div className="relative isolate px-6 pt-14 lg:px-8">
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Your Adventure, Perfectly Planned</h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">Create, customize, and collaborate on travel itineraries with interactive maps and seamless booking integration. Your next journey starts here.</p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link to="/signup" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get started</Link>
                                <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">Log in <span aria-hidden="true">→</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-bold text-gray-800">Your Trips</h1>
                <Link to="/planner" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    + Plan New Trip
                </Link>
            </div>
            {loading ? <p className="text-center">Loading your adventures...</p> : <ItineraryList trips={trips} onDelete={handleDelete} />}
        </div>
    );
};

export default HomePage;