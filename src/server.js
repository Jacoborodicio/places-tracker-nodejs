const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const placeRoutes = require("./routes/place");
require('dotenv').config();

const cors = require("cors");
const passport = require("passport");
const app = express();
const port = process.env.PORT || 9000;
// const isLoggedIn = (req, res, next) => req.user ? next() : res.sendStatus(401);

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/v1/', userRoutes);
app.use('/api/v1/', placeRoutes);


// Routes
app.get('/', (req, res) => {
    res.send("Welcome to my api");
})

app.get('/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile']}, () => {
        console.log('WHATEVER')
    })
)
app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
    }))


// Mongodb connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.log('File: server.js, Function: Error connecting to MongoDB Atlas, Line 17 --> error: ', error));

app.listen(port, () => console.log('Server running on port ', port));
