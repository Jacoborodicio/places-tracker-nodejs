const express = require('express');
const placeSchema = require('../models/place');
const annotationSchema = require('../models/annotation');
const router = express.Router();
const PlacesController = require('../controllers/users');
// create a place
router.post('/places', (req, res) => {
    const place = placeSchema(req.body);
    place.save().then((data) => res.json(data)).catch((error) => res.json({message: error}));
})

// get all places
router.get('/places', (req, res) => {
    placeSchema
        .find().populate('annotations')
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// get place by id
router.get('/places/:id', (req, res) => {
    const {id} = req.params;
    console.log('File: place.js, Function: get by id, Line 23 --> req.params: ', req.params);
    placeSchema
        .findById(id).populate('annotations')
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// update place
router.put('/places/:id', (req, res) => {
    const {id} = req.params;
    const {name, description, rating} = req.body;
    placeSchema
        .updateOne({_id: id}, {$set: {name, description, rating}})
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// Delete place by id
router.delete('/places/:id', (req, res) => {
    const {id} = req.params;
    placeSchema
        .remove({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// Create an annotation for a concrete place
router.post('/places/:id/annotation', (req, res) => {
    const {id} = req.params;
    placeSchema.findById(id)
        .then(data => {
            console.log('File: place.js, Function: then, Line 62 --> data: ', data);
            const annotation = annotationSchema(req.body);
            const place = placeSchema(data);
            console.log('File: place.js, Function: post with annotation, Line 52 --> place, annotation: ', place, annotation);
            annotation.place = data;
            place.annotations.push(annotation);
            annotation.save().then(annotationResponse => {
                place.save().then(() =>
                    res.json(annotationResponse))
                    .catch(err => res.json({message: err}))
            })
            .catch(error => res.json({message: error}));
        });

})


router.get('/places/:id/annotation', (req, res) => {
    const {id} = req.params;
    placeSchema.findById(id).populate('annotations')
        .then(response => res.json(response['annotations'])
            .catch(error => res.json({message: error})));

})



module.exports = router;
