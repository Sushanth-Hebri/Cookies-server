require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection using the environment variable
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Define a schema and model for the user data
const DataSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    currentUrl: { type: String, required: true },
    referer: { type: String, required: true },
    screen: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
    },
    connectionType: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const DataModel = mongoose.model('UserData', DataSchema);

// Endpoint to receive data
app.post('/api/store-data', async (req, res) => {
    const { ipAddress, userAgent, currentUrl, referer, screen, connectionType, timestamp } = req.body;

    const newData = new DataModel({ ipAddress, userAgent, currentUrl, referer, screen, connectionType, timestamp });
    
    try {
        await newData.save();
        res.status(201).json({ message: 'Data saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving data', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
