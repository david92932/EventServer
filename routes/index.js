var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Event = require('../models/eventModel');

/* GET home page. */



router.get('/', function(req, res, next) {
  res.redirect('/events/');
});

module.exports = router;

