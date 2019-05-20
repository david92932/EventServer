var mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    //userID: mongoose.Types.ObjectId,
    googleID: String,
    username: String,
    email: String,
    eventsAttending: [String],
    messages: [{subject: String, sender: String, message: String, read: Boolean}]

});

module.exports =
    {model: mongoose.model('User', userSchema), schema: userSchema};