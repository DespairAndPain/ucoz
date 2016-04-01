var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
var grid = require('gridfs-stream');

grid.mongo = mongoose.mongo;

router.get('/', function(req, res) {
    var id = 123123131231321; // id of file what you want to download
    var con =mongoose.createConnection('mongodb://localhost/ucoz');
    try {
        con.once('open', function () {
            var gfs = grid(con.db);
            var gfs = gfs.createReadStream({_id: ObjectId(id)}).pipe(res);
        });
    }
    catch (err){
        res.render('error', {
            message: err
        });
    }
    con.close();
    res.cookie('referrer', req.get('Referer'));
    res.redirect('/');
});

module.exports = router;