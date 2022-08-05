const express = require('express');
const PlaceSchema = require('../models/place');
const annotationSchema = require('../models/annotation');
const router = express.Router();
const PlacesController = require('../controllers/users');
// create a place
router.post('/places', (req, res) => {
    const place = PlaceSchema(req.body);
    console.log(place);
    place.save().then((data) => res.json(data)).catch((error) => res.json({message: error}));
})

// get all places
router.get('/places', (req, res) => {
    PlaceSchema
        .find().populate('annotations')
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// get place by id
router.get('/places/:id', (req, res) => {
    const {id} = req.params;
    console.log('File: place.js, Function: get by id, Line 23 --> req.params: ', req.params);
    PlaceSchema
        .findById(id).populate('annotations')
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// update place
router.patch('/places/:id', (req, res) => {
    const {id} = req.params;
    // TODO: Allow more fields update
    const {name, description, rating, distance} = req.body;
    PlaceSchema
        .updateOne({_id: id}, {$set: {name, description, rating, distance}})
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// Delete place by id
router.delete('/places/:id', (req, res) => {
    const {id} = req.params;
    console.log('id inside place delete: ', id)
    PlaceSchema
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
})

// Create an annotation for a concrete place
router.post('/places/:id/annotation', (req, res) => {
    const {id} = req.params;
    PlaceSchema.findById(id)
        .then(data => {
            console.log('File: place.js, Function: then, Line 62 --> data: ', data);
            const annotation = annotationSchema(req.body);
            const place = PlaceSchema(data);
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
    PlaceSchema.findById(id).populate('annotations')
        .then(response => res.json(response['annotations'])
            .catch(error => res.json({message: error})));

})



module.exports = router;
