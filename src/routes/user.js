const express = require('express');
const UserSchema = require('../models/user');
const router = express.Router();
const UserController = require('../controllers/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const {authenticateToken} = require("../auth/auth");


const authenticateToken = (res, req, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user
        next()
    })
}


// create user
router.post('/users', async (req, res) => {
    try {
        // Generate a salt, so two same passwords don't generate same hash
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new UserSchema({...req.body, password: hashedPassword});
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({error: err, errorCode: 500});
    }
})

// login
router.post('/users/login',  async (req, res) => {
    const user = await UserSchema.findOne({email: req.body.email});
    // If the user email is not in DB
    if (user == null) return res.status(400).json({errorCode: 400, message: `User with email ${req.body.email} not found`});
    try {
        if (await bcrypt.compare(req.body.password, user['password'])) {
            const userJson = user.toJSON();
            // const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
            const accessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET);
            console.log('%cFile: user.js, Function: access, Line 32 accessToken: ', 'color: pink', accessToken);
            res.status(200).json({...userJson, accessToken});
        } else {
            res.status(401).json({errorCode: 401, message: `Password for the user with email ${req.body.email} is incorrect`});
        }
    } catch (err) {
        console.log('%cFile: user.js, Function: er, Line 39 err: ', 'color: pink', err);
        res.status(500).json({error: err, errorCode: 500, message: 'There was an error when trying to login'});
    }
})

// get all users
router.get('/users', (req, res) => {
    UserSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// get user by id
router.get('/users/:id', (req, res) => {
    const {id} = req.params;
    UserSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// update user
router.patch('/users/:id', (req, res) => {
    const {id} = req.params;
    const {name, age, email} = req.body;
    UserSchema
        .updateOne({_id: id}, {$set: {name, age, email}})
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// Delete user by id
router.delete('/users/:id', (req, res) => {
    // console.log('%c Inside users', 'color: #ecb1f2; font-style:italic');
    const {id} = req.params;
    console.log(id)
    // console.log('%cFile: user.js, Function: in delete user, Line 41 id: ', 'color: pink', id);
    UserSchema
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

module.exports = router;
