var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    
    if(req.cookies.referrer) {
        var message = 'You have my cookie!';
    }
  
    res.render('index', {title: message});
});

module.exports = router;
