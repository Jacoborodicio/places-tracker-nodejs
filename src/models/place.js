const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    image: String,
    imageDescription: String,
    thumbsUp: Number,
    ratio: Number,
    discoveredAt: Date,
    lastTimeVisited: Date,
    description: {
        type: String,
        required: false
    },
    address: String,
    distance: Number,
    distanceUnit: String,
    favourite: Boolean,
    annotations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Annotation'
    }]
});

module.exports = mongoose.model('Place', PlaceSchema);
