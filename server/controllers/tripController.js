const Trip = require('../models/tripModel');

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check if the trip belongs to the user trying to delete it
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // CORRECTED LINE: Use the modern deleteOne() method
        await trip.deleteOne(); 
        
        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('ERROR DELETING TRIP:', error);
        res.status(500).json({ message: 'Server error while deleting trip' });
    }
};

// --- (The rest of your controller functions remain the same) ---

// @desc    Create a new trip
// @route   POST /api/trips
exports.createTrip = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    const { title, description, startDate, endDate, route } = req.body;
    if (!title || !startDate || !endDate) {
        return res.status(400).json({ message: 'Please provide title, start date, and end date.' });
    }
    try {
        const newTrip = new Trip({
            title, description, startDate, endDate, route,
            user: req.user.id,
        });
        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);
    } catch (error) {
        console.error('ERROR CREATING TRIP:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user's trips
// @route   GET /api/trips
exports.getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Get a single trip by ID
// @route   GET /api/trips/:id
exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Update a trip
// @route   PATCH /api/trips/:id
exports.updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTrip);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update trip', error });
    }
};