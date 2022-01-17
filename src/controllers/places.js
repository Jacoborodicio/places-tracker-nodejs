// TODO: Apply promise based router to the application
const Annotation = require('../models/annotation');
const Place = require('../models/place');

module.exports = {
    index: async (req, res, next) => {
        const places = await Place.find({});
    },
    newPlace: async (req, res, next) => {
        const newPlace = new Place(req.body);
        const place = await newPlace.save();
    }
}
