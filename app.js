var express    = require('express');   
var app        = express();            
var bodyParser = require('body-parser');
var ssense_order      = require('./ssense_order');
var order      = require('./order')

app.use(bodyParser());

var port = process.env.PORT || 8080;       

var router = express.Router();

router.get('/order', function(req, res) {
    ssense_order.start_spooky(order, function(response){
    	res.send(response);
    });
});

app.use('/', router);

app.listen(port);
console.log('Magic happens on port ' + port);
