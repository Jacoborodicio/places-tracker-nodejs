const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/user');
const placeRoutes = require("./routes/place");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/v1/', userRoutes);
app.use('/api/v1/', placeRoutes);


// Routes
app.get('/', (req, res) => {
    res.send("Welcome to my api");
})

app.get('/places-tracker/uploads/:imgName', (req, res) => {
    console.log('%c in upload', 'color: #ecb1f2; font-style:italic');
    const {imgName} = req.params;
    console.log('%cFile: index.js, Function: dir, Line 27 __dirname: ', 'color: pink', __dirname);
    console.log('%cFile: place.js, Function: imagn, Line 80 imgName: ', 'color: pink', imgName);
    res.sendFile(__dirname + `/uploads/${imgName}`);
})

// Mongodb connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.log('File: index.js, Function: Error connecting to MongoDB Atlas, Line 17 --> error: ', error));

app.listen(9000, () => console.log('Server running on port ', port));
