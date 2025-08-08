const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const tripRoutes = require('./routes/tripRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const { protect } = require('./middleware/authMiddleware'); // Import protect middleware


const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000', // For your local development
    process.env.CLIENT_URL   // The URL of your deployed frontend
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));




app.use(express.json());

// Routes
app.use('/api/trips', tripRoutes);
app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/trips',  tripRoutes); // Protect all trip routes



// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => console.error('Could not connect to MongoDB', err));