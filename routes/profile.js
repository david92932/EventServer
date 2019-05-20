var express = require('express');
var router = express.Router();
var passport = require('passport');
var Event = require('../models/eventModel');
var User = require('../models/userModel');

var userModel = User.model;

//Check Authentication
var authCheck = function(req, res, next)
{

    if(!req.user)
    {
        //res.redirect('/auth/login');
        console.log('Cannot Find User');

    }

    else {
        next();
    }
};

router.get('/hosting', authCheck, function(req, res, next)
{

    res.header('Access-Control-Allow-Origin', 'https://david92932.github.io');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //var attendingEvents = Event.find({attending: req.user.id});
    console.log(req.user.id);

    Event.find({organizerID: req.user.id}).exec(function(err, hostingEvent)
    {
        console.log('Hosting: \n');
        console.log(hostingEvent);

        //Event.find({attending: req.user.id}).exec(function(err, attendingEvents))

        res.json(hostingEvent);

    });

    //console.log(hostingEvents);

    //res.render('profile', {user: req.user, attendingEvents: attendingEvents, hostingEvents: hostingEvents});

});

router.get('/attending', authCheck, function (req, res) {

    res.header('Access-Control-Allow-Origin', 'https://david92932.github.io');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    userModel.find({_id: req.user.id}).exec(function(err, attendingEvents) {
        console.log(attendingEvents);

    }).then(function() {
        var attendingIDS = attendingEvents.eventsAttending;
        console.log('attendingIDS: ' + attendingIDS);
        var queryS = '';
        var i = 0;
        for(i; i < attendingIDS.length - 1; i++) {
            queryS += '{'+_id+': ' + attendingIDS[i] + '}, '
        }
        queryS += '{'+_id+': ' + attendingIDS[i] + '}';
        console.log('QueryS: ' + queryS);

        Event.find({$or: [queryS]}).exec(function (err, attendingNames) {
            console.log('Attending Events: ' + attendingNames);
            res.json(attendingNames);
        });

    });

});

router.delete('/delete', function(req,res,next)
{

    res.header('Access-Control-Allow-Origin', 'https://david92932.github.io');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    userModel.deleteOne({id: req.user.id}).catch(function(err){console.log(err)});

    res.redirect('/events');

});

module.exports = router;
