// models/Certificate.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    recipientName: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    certificateHash: {
        type: String,
        required: true
    },
    issuedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Certificate', certificateSchema);
