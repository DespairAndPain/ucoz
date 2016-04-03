var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var mongoose = require('mongoose');
var userData =require('../models/userData');
var secrets =require('../models/secrets');
var smtpEmail = require('../models/smtpEmail');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

router.post('/', function(req, res) {

    // настройки для отправки почты: логин
    var user = 'user';
    var password = '';
    var setPassword = function (pass) { password = pass; };

    // Достаём из базы данных логин для эмайла с которого будет отправлять номера телефонов
    var db = mongoose.createConnection('mongodb://localhost/secrets');
    db.once('open', function () {
        var _password =  smtpEmail.find({login: user});
        setPassword(_password.password);
        mongoose.connection.close();
    });
    

    // настройка smtp
    var transporter = nodemailer.createTransport('smtps://'+user+'%40gmail.com:' + password + '@smtp.gmail.com');
    
    var Data = {};
    var decryptKey = '';
    var cryptPhone = '';
    var sendTo = '';

    var setData = function (value) { Data = value; };
    var setPhone = function (phone) { cryptPhone = phone; };

    db =mongoose.createConnection('mongodb://localhost/secrets');
    // достаём из базы секретов по эмайлу ключ с помощью которого шифровали данные
    db.once('open', function () {
        var _cryptData =  secrets.find({email: req.body.fmail});
        setData(_cryptData);
        mongoose.connection.close();
    });
    


    db = mongoose.createConnection('mongodb://localhost/ucoz');
    // достаём из базы клиентов по ObjectId телефон
    db.once('open', function () {
        var _cryptData =  userData.find({_id: Data._id});
        setPhone(_cryptData.phone);
        mongoose.connection.close();
    });
    

    // дешифратор
    var decrypt = function (text){
        var decipher = crypto.createDecipher(algorithm, decryptKey);
        var dec = decipher.update(text,'hex','utf8');
        dec += decipher.final('utf8');
        return dec;
    };

    // настройка письма которое хотим отослать
    var mailOptions = {
        from: '"Fred Foo " <' + user + '@gmail.com>',
        to: sendTo, // list of receivers
        subject: 'Hello! Phone repair',
        text: "You'r phone: " + decrypt(cryptPhone) // дешифруем телефон и отправляем
    };

    // отправка письма
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

    res.render('index', {title: 'Phone sent by e-mail'});
});

module.exports = router;
