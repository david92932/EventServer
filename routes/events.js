var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var ObjectID = require('mongodb').ObjectID;


var Event = require('../models/eventModel');
//var Event = eventModel.model;
var User = require('../models/userModel');
var userModel = User.model;


//Check Authentication
var authCheck = function(req, res, next)
{

    console.log('auth Triggered');
    console.log('authCheck ID: ' + req.user._id);

    res.header("Access-Control-Allow-Origin", "https://david92932.github.io");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if(!req.user)
    {
        console.log('No User Found');
        //res.redirect('/auth/login');
        res.status(401).statusText('Failed AuthCheck');

    }

    else {
        next();
    }
};


router.get('/addEvent', authCheck, function (req, res, next) {

    res.render('newEvent');

});

router.post('/newEvent', authCheck, function(req, res, next)
{

    res.header("Access-Control-Allow-Origin", 'https://david92932.github.io');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    console.log('Date: ' + req.body.date);

    const event = new Event({

            organizerName: req.user.username,
            organizerID: req.user.id,
            _id: mongoose.Types.ObjectId(),
            date: req.body.date,
            time: req.body.time,
            eventName: req.body.eventName,
            location: req.body.location,
            numberAttending: 1,
            comments: req.body.comments,
            attending: [req.user.id]

    });

    console.log(event);

    var responseString = 'Event Successfully Added';
    //res.redirect('/events/')
    event.save().then(res.json(responseString)).catch(err => console.log(err));

    //res.json(event);

});

router.get('/', function(req, res, next)
{


    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    Event.find({}).sort({attending: -1, name: 1}).exec(function(err, events)
    {

        if(err)
            throw err;

        if(events.length > 0)
        {

            //res.render('index', {events: events});
            res.json(events);

        }

        else
        {
            res.send('noEvents');
        }



    });//.catch(err => console.log(err));

});

//router.post('/details'
router.get('/details/:id', function(req,res,next)
{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const id = req.params.id;

    Event.find({_id: id}).exec(function(err, eventsFound)
    {

        if(err)
            throw err;

        console.log('Events Found: ' + eventsFound[0]);
        console.log(eventsFound[0]);

        res.json(eventsFound[0]);

    });//.catch(err => console.log(err));

    // Event.find({_id: req.params.id}).exec(function(err, eventsFound)
    // {
    //
    //     console.log(eventsFound);
    //     res.render('details', {event: eventsFound[0]});
    //
    //     console.log('Attending: ' + eventsFound[0].attending);
    //
    // });


});

//Get Id from button and then add 1 to the number of attending
router.post('/attending', authCheck, function(req, res)
{

    res.header('Access-Control-Allow-Origin', 'https://david92932.github.io');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');


    console.log('attending triggered ' + req.user.username);

    console.log(req.body.eventID);

    const id = req.body.eventID;

    Event.updateOne({_id: id}, {$addToSet: {attending: req.user.id}, $inc: {numberAttending: 1}}).then(function()
    {

        //res.json(Successfully Attending Event)
        userModel.updateOne({_id: mongoose.Types.ObjectId(req.user._id)}, {$addToSet: {eventsAttending: id}}).
        then(res.json('Successfully Attending Event')).catch(function(err){console.log(err);});

    }).catch(function(err){console.log(err);});

});

//remove name from the list of attending
router.post('/remove', authCheck, function (req, res)
{



});

//update event
router.post('/updateform', authCheck, function(req,res,next)
{

    console.log(req.body.updateID);

    Event.find({_id: req.body.updateID}).exec(function (err, updateEvent)
    {

        if(err)
            throw err;

        console.log(updateEvent[0]);
        res.render('updateEvent', {event: updateEvent[0]});

    }).catch(function(err){console.log(err)});

});

router.post('/update', authCheck, function(req, res, next)
{


    Event.updateOne({_id: req.body.updateID},
        { $set: {eventName: req.body.eventName, location: req.body.location, date: req.body.date, comments: req.body.comments}},
        {upsert: true}).then(function()
            {

                userModel.updateMany({eventsAttending: req.body.updateID},
                    {
                        $push: {
                            messages: {
                                $each: [{subject: 'EVENT UPDATED - IMPORTANT',
                                    sender: req.user.username,
                                    message: 'The event, ' + req.body.eventName +
                                        ', has been updated. Please contact the event organizer for more information.',
                                    read: false}]
                            }
                        }
                    }).then(res.redirect('/profile')).catch(function(err){console.log(err)});

            }).catch(function(err){console.log(err)});

});

//ca
router.post('/cancel', authCheck, function(req,res,next)
{


    Event.find({_id: req.body.eventID}).exec(function(err, cancelEvent)
    {

        if(err)
            throw err;

            console.log(cancelEvent[0].attending[0]);


            console.log('sendingMessages');

            userModel.updateMany({eventsAttending: req.body.eventID},
                {
                    $push: {
                        messages: {
                            $each: [{subject: 'EVENT CANCELLED - IMPORTANT',
                                sender: req.user.username,
                                message: 'The event, ' + cancelEvent[0].eventName +
                                    ', has been cancelled. Please contact the event organizer for more information.',
                                read: false}]
                        }
                    }
                }).then(function()
                {

                    //delete the event
                    Event.deleteOne({_id: req.body.eventID}).then(res.json('Event Canceled; Message sent to all participants')).catch(function(err){console.log(err)});

                }).catch(function(err){console.log(err)});

        });

});

//Test endpoint
router.post('/testing', function(req, res, next)
{

    console.log('Roger, Roger');
    console.log(req.body.eventID);

    res.send('Received');
});

module.exports = router;
