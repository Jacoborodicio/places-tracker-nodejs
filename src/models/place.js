const mongoose = require('mongoose');
const { Schema } = mongoose;

const placeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: String,
    imageDescription: String,
    stars: Number,
    ratio: Number,
    discoveredAt: Date,
    lastTimeVisited: Date,
    description: {
        type: String,
        required: true
    },
    address: String,
    distance: Number,
    distanceUnit: String,
    annotations: [{
        type: Schema.Types.ObjectId,
        ref: 'Annotation'
    }]
});

module.exports = mongoose.model('Place', placeSchema);
