// Start point

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var ssense_order      = require('./ssense_order');
var order      = require('./order')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080;       

var router = express.Router();              // get an instance of the express Router


router.get('/order', function(req, res) {
    ssense_order.start_spooky(order, function(response){
    	res.send(response);
    });
});



app.use('/', router);


app.listen(port);
console.log('Magic happens on port ' + port);
