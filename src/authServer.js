const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserSchema = require("./models/user");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 9001;
const cors = require("cors");
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

app.post('/login',  async (req, res) => {
    console.log('%c inside', 'color: #ecb1f2; font-style:italic');
    const user = await UserSchema.findOne({email: req.body.email});
    // If the user email is not in DB
    if (user == null) return res.status(400).json({errorCode: 400, message: `User with email ${req.body.email} not found`});
    try {
        if (await bcrypt.compare(req.body.password, user['password'])) {
            const userJson = user.toJSON();
            const accessToken = generateAccessToken(userJson);
            const refreshToken = jwt.sign(userJson, process.env.REFRESH_TOKEN_SECRET);
            // TODO: should we send the user? Info is already in the token...
            res.status(200).json({...userJson, accessToken, refreshToken});
        } else {
            res.status(401).json({errorCode: 401, message: `Password for the user with email ${req.body.email} is incorrect`});
        }
    } catch (err) {
        console.log('%cFile: user.js, Function: er, Line 39 err: ', 'color: pink', err);
        res.status(500).json({error: err, errorCode: 500, message: 'There was an error when trying to login'});
    }
})

// TODO: Log out

// TODO: Refresh tokens

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user
        next()
    })
}

// TODO: Change to 10m-15m, 15s only for testing purposes
const generateAccessToken = user => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.log('File: server.js, Function: Error connecting to MongoDB Atlas, Line 17 --> error: ', error));

app.listen(port, () => console.log('Server running on port ', port));

// const passport = require('passport');
// const Module = require("module");
// const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
// const jwt = require('jsonwebtoken');

// export const authenticateToken = (res, req, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null) return res.sendStatus(401);
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user
//         next()
//     })
// }

// passport.use(new GoogleStrategy({
//         clientID:     process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://localhost:3000/places-tracker/",
//         passReqToCallback   : true
//     },
//     function(request, accessToken, refreshToken, profile, done) {
//         User.findOrCreate({ googleId: profile.id }, function (err, user) {
//             return done(err, user);
//         });
//     }
// ));

