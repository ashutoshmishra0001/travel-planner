const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getAllTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip
} = require('../controllers/tripController');

// Apply the 'protect' middleware to all trip routes
router.route('/')
    .get(protect, getAllTrips)
    .post(protect, createTrip);

router.route('/:id')
    .get(protect, getTripById)
    .patch(protect, updateTrip)
    .delete(protect, deleteTrip);

module.exports = router;