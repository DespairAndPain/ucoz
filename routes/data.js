var express = require('express');
var mongoose = require('mongoose');
var usersData =require('../models/userData');
var secrets =require('../models/secrets');
var crypto = require('crypto');
// алгоритм шифрования
var algorithm = 'aes-256-ctr';

var router = express.Router();

// рандомная строка для создания ключа шифрования
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

// рандомный ключ шифрования
var password = randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

// функция для шифрования
function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}


router.post('/', function(req, res) {
    // шифруются телефон и эмайл
    var _phone = encrypt(req.body.phone);
    var _email = encrypt(req.body.mail);
    var objectId = '';
    // сеттер для objectId
    var setObjectId = function (value){objectId = value;};
    
    // запись щифрованных данных в базу клиентов
    var db =mongoose.createConnection('mongodb://localhost/ucoz');
    db.once('open', function () {
        var data = new usersData({
            email: _email,
            phone: _phone
        });
        
        data.save();
        setObjectId(data._id);
    });
    db.close();
    
    // запись ключа шифрования, objectId записанного объекта и эмайла в базу шифров
    var db_inner = mongoose.createConnection('mongodb://localhost/secrets');
    db_inner.once('open', function () {
        var data_inner = new secrets({
            ObjId: objectId,
            email: req.body.mail,
            secret: password
        });

        data_inner.save();
    });
    db_inner.close();

    res.render('index', {title: 'Data saved'});
});

module.exports = router;