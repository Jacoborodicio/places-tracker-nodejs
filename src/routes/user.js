const express = require('express');
const UserSchema = require('../models/user');
const router = express.Router();
const UserController = require('../controllers/users');
// create user
router.post('/users', (req, res) => {
    const user = UserSchema(req.body);
    user.save().then((data) => res.json(data)).catch((error) => res.json({message: error}));
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
    const {id} = req.params;
    UserSchema
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

module.exports = router;
