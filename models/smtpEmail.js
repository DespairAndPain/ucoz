var mongoose = require('mongoose');

// Схема
var smtpEmail = new mongoose.Schema({
    login: String,
    password: String
});

// возвращаем модель
module.exports = mongoose.model('smtpEmail', smtpEmail);