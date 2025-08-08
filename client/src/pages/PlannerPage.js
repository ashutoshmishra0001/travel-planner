import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById, createTrip, updateTrip } from '../services/api';
import MapComponent from '../components/MapComponent';
import TripDetails from '../components/TripDetails';
import CreateTrip from '../components/CreateTrip';

const PlannerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState(null);

    const fetchTrip = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const response = await getTripById(id);
            setTrip(response.data);
        } catch (err) {
            setError("Could not fetch trip details.");
            console.error("Error fetching trip:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTrip();
    }, [fetchTrip]);

    const handleSave = async (tripData) => {
        try {
            let savedTrip;
            if (id) {
                // Update existing trip
                savedTrip = await updateTrip(id, tripData);
                setTrip(savedTrip.data);
            } else {
                // Create new trip
                savedTrip = await createTrip(tripData);
                navigate(`/planner/${savedTrip.data._id}`);
            }
        } catch (err) {
            setError("Failed to save trip.");
            console.error("Failed to save trip:", err);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-lg map-container">
                 <MapComponent route={trip ? trip.route : []} />
            </div>
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
                {loading && <p>Loading planner...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                    id && trip ? <TripDetails trip={trip} onSave={handleSave} /> : <CreateTrip onSave={handleSave} />
                )}
            </div>
        </div>
    );
};

export default PlannerPage;