var mongoose = require('mongoose');

// Схема
var usersDataSchema = new mongoose.Schema({
    email: String,
    phone: String
});

// возвращаем модель
module.exports = mongoose.model('usersData', usersDataSchema);