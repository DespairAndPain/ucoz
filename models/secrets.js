var mongoose = require('mongoose');

// Схема
var secrets = new mongoose.Schema({
    ObjId: String,
    email: String,
    secret: String
});

// возвращаем модель
module.exports = mongoose.model('secrets', secrets);