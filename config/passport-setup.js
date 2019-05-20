const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const UserModel = require('../models/userModel');
const mongoose = require('mongoose');
const User = UserModel.model;

passport.serializeUser(function(user, done)
{

    done(null, user.id);
});

passport.deserializeUser(function(id, done)
{

    User.findById(id).then(function(user)
    {

        done(null, user);

    });

});

passport.use(
    new GoogleStrategy({
    //option
        //'/auth/google/redirect' 'http://localhost:4200/list'
        callbackURL: '/auth/google/redirect',
        clientID: '954863362638-lr110t09fp7ifcrajvt7j1c04ebpaan3.apps.googleusercontent.com',
        clientSecret: 'ZwfUT0TO4dacPYUSsL6fUgiw'


}, function(accessToken, refreshToken, profile, done)
{


    console.log(profile);

    User.findOne({googleID: profile.id}).then(function(returnUser)
    {
        if(returnUser)
        {

            //User found
            console.log('User Exists:' + returnUser);

            done(null, returnUser);

        }

        else
        {

            //create new user
            var newUser = new User();

            newUser.userID = mongoose.Types.ObjectId();
            newUser.googleID = profile.id;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;

            newUser.save().then(function()
            {
                    console.log('New User: ' + newUser);
                    //res.redirect
                    done(null, newUser);
            });

        }

    });

}));
