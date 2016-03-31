var express = require('express');
var mongoose = require('mongoose');
var usersData =require('../models/userData');

mongoose.connect('mongodb://localhost/ucoz');

var router = express.Router();

router.post('/', function(req, res) {
    var _phone = req.body.phone;
    var _email = req.body.mail;

    var db =mongoose.createConnection('mongodb://localhost/ridero');
    db.once('open', function () {
        var sds = new usersData({
            email: _email,
            phone: _phone
        });

        sds.save();
        console.log(sds);
    });
    db.close();
    res.send('yse');
});

module.exports = router;