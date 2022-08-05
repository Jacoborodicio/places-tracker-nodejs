const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/user');
const placeRoutes = require("./routes/place");

const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(express.json());
app.use('/api/v1/', userRoutes);
app.use('/api/v1/', placeRoutes);


// Routes
app.get('/', (req, res) => {
    res.send("Welcome to my api");
})

// Mongodb connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.log('File: index.js, Function: Error connecting to MongoDB Atlas, Line 17 --> error: ', error));

app.listen(9000, () => console.log('Server running on port ', port));
