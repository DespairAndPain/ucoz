var express = require('express');
var mongoose = require('mongoose');
var usersData =require('../models/userData');
var secrets =require('../models/secrets');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

var router = express.Router();

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

var password = randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

router.post('/', function(req, res) {
    var _phone = encrypt(req.body.phone);
    var _email = encrypt(req.body.mail);
    var objectId = '';
    var setObjectId = function (value){objectId = value;};

    var db =mongoose.createConnection('mongodb://localhost/ucoz');
    db.once('open', function () {
        var data = new usersData({
          email: _email,
          phone: _phone
        });
        
        data.save();
        console.log(data._id);
        setObjectId(data._id);
    });
    db.close();

    var db_inner = mongoose.createConnection('mongodb://localhost/secrets');
    db_inner.once('open', function () {
        console.log(objectId);
        var data_inner = new secrets({
          ObjId: objectId,
          secret: password
        });

        data_inner.save();
        console.log(data_inner);
    });
    db_inner.close();

    res.render('index', {title: 'Data saved'});
});

module.exports = router;