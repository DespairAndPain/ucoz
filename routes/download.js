var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var grid = require('gridfs-stream');

grid.mongo = mongoose.mongo;

router.get('/', function(req, res) {
    var outFileName = req.query.filename;

    // скачивает из базы файл file.doc
    var con =mongoose.createConnection('mongodb://localhost/ucoz');
    try {
        con.once('open', function () {
            var gfs = grid(con.db);
            var gfs = gfs.createReadStream({filename: 'file.doc'}).pipe(res);
        });
    }
    catch (err){
        res.render('error', {
            message: err
        });
    }
    con.close();
    // переименовываем файл на выходе
    res.setHeader('Content-disposition', 'attachment; filename='+ outFileName +'');
    // записывает в cookie referrer
    res.cookie('referrer', req.get('Referer'));
    res.redirect('/');
});

module.exports = router;