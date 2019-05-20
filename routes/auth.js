var express = require('express');
var router = express.Router();
var passport = require('passport');


//login
router.get('/login', function(req, res, next)
{

    res.render('login');


});

router.get('/logout', function(req, res, next)
{

   //handle with passport
   res.send('Logging out');
});

router.get('/serverAuth', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://david92932.github.io");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var returnObj = {
        authVal: 0
    };
    if(!req.user)
    {

        console.log('Cant find user');

    }

    else {
        returnObj.authVal = 1;
    }

    console.log(returnObj);
    res.json(returnObj.authVal);

});

//Google authentication route
router.get('/google', passport.authenticate('google',
    {
        scope: ['profile', 'email']
    }));

router.get('/google/redirect', passport.authenticate('google'), function(req, res)
{
    res.redirect('https://david92932.github.io/EventFinder/list');
    //res.json('Authentication Successful');


});
module.exports = router;
