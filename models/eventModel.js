var mongoose = require('mongoose');
var User = require('../models/userModel');

const eventSchema = mongoose.Schema({

    organizerName: String,
    organizerID: String,
    _id: mongoose.Types.ObjectId,
    date: { type: String, default: Date.now },
    time: String,
    location: String,
    numberAttending: Number,
    eventName: String,
    comments: String,
    attending: [String]

});

module.exports = mongoose.model('Event', eventSchema);
