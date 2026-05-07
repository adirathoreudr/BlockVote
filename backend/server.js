const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'BlockVote Backend is running.' });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

// Database connection logic for serverless
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI is not defined in environment variables');
    }

    try {
        await mongoose.connect(uri, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Database connection error:', err);
        throw err; // Re-throw to be caught by middleware
    }
};

// Start server locally if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Local Server running on port ${PORT}`);
        });
    });
}

// Ensure DB connects for every serverless invocation
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database middleware error:', err);
        res.status(503).json({ 
            message: 'Database connection failed. Please ensure MONGO_URI is correct and IP 0.0.0.0/0 is whitelisted in Atlas.' 
        });
    }
});

module.exports = app;

