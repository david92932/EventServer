var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');


var Event = require('../models/eventModel');
//var Event = eventModel.model;
var User = require('../models/userModel');
var userModel = User.model;


//Check Authentication
var authCheck = function(req, res, next)
{

    res.header("Access-Control-Allow-Origin", "https://david92932.github.io");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if(!req.user)
    {
        console.log('Cannot Find User');

    }

    else {
        next();
    }
};

//get all messages using ID
router.get('/allMessages', authCheck, function(req,res)
{

    //returns an array of users with matching ID
    userModel.find({_id: req.user.id}).exec(function(err, userMessages){

        res.header("Access-Control-Allow-Origin", 'https://david92932.github.io');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        var allMessages = userMessages[0].messages;

        res.json(allMessages);

    });

});

//Get Message Details
router.get('/messageDetails/:messageID', authCheck, function(req, res)
{

    var mID = req.params.messageID;
    console.log('ID: ' + mID);

    //mark message as read
    // userModel.find({_id: mID}).exec(function (err, readMessage) {
    //
    // });

    //returns an array of users with matching ID
    userModel.find({_id: req.user.id}).exec(function(err, userMessages){

        res.header("Access-Control-Allow-Origin", "https://david92932.github.io");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        var allMessages = userMessages[0].messages;

        for(var i = 0; i < allMessages.length; i++) {
             if(allMessages[i]._id == mID)
                 res.json(allMessages[i]);
        }

    });


});

//test route to metaldistortion
router.post('/addMessage', function(req,res){

    userModel.updateOne({googleID: '108910345875280046061' },
        {
            $push: {
                messages: {
                    $each: [{subject: 'Test Message 2', sender: 'Daddy', message: 'Ya logo Ya', read: false}]
                }
            }
        }).then(res.send('message added')).catch(function(err){console.log(err)});

});

module.exports = router;
