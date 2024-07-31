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

// Define a schema and model for storing IP addresses
const IpSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true, unique: true }, // Ensure IP addresses are unique
    timestamp: { type: Date, default: Date.now },
});

const IpModel = mongoose.model('IpAddress', IpSchema);

// Endpoint to receive IP address
app.post('/api/store-ip', async (req, res) => {
    const { ipAddress } = req.body;

    const newIp = new IpModel({ ipAddress });
    
    try {
        await newIp.save();
        res.status(201).json({ message: 'IP address saved successfully!' });
    } catch (error) {
        if (error.code === 11000) { // Handle duplicate IP address error
            return res.status(409).json({ message: 'IP address already exists.' });
        }
        res.status(500).json({ message: 'Error saving IP address', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
