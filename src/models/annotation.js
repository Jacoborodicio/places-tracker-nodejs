const mongoose = require('mongoose');
const { Schema } = mongoose;

const annotationSchema = new Schema({
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place'
    },
    title: {
        type: String,
        required: true
    },
    note: String,
    createdAt: Date
}, {timestamps: true});

module.exports = mongoose.model('Annotation', annotationSchema);
