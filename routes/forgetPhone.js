var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var usersData =require('../models/userData');
var secrets =require('../models/secrets');
var mongoose = require('mongoose');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

var user = 'user';
var password = '';

var transporter = nodemailer.createTransport('smtps://'+user+'%40gmail.com:' + password + '@smtp.gmail.com');

router.get('/', function(req, res) {

    var Data = {};
    var decryptKey = '';
    var cryptPhone = '';
    var sendTo = '';

    var getData = function (value, key) { Data = value; decriptKey = key; };
    var getPhone = function (phone) { cryptPhone = phone; };

    var db =mongoose.createConnection('mongodb://localhost/secrets');

    db.once('open', function () {
        var _cryptData =  secrets.find({email: req.body.email});
        getData(_cryptData.email, _cryptData,secret);
    });
    db.close();


    db = mongoose.createConnection('mongodb://localhost/ucoz');

    db.once('open', function () {
        var _cryptData =  secrets.find({_id: Data._id});
        getPhone(_cryptData.phone);
    });
    db.close();

    var decrypt = function (text){
        var decipher = crypto.createDecipher(algorithm, decryptKey);
        var dec = decipher.update(text,'hex','utf8');
        dec += decipher.final('utf8');
        return dec;
    };

    var mailOptions = {
        from: '"Fred Foo " <' + user + '@gmail.com>', // sender address
        to: sendTo, // list of receivers
        subject: 'Hello! Phone repair', // Subject line
        text: "You'r phone: " + decrypt(cryptPhone), // plaintext body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

    res.send('respond with a resource');
});

module.exports = router;
