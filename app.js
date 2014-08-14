// Start point

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var hello      = require('./hello');
var order      = require('./order')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080;       

var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/order', function(req, res) {
    hello.start_spooky(order);
    res.json({ message: 'Hooray! Welcome to SSENSE api!' });   
});

/*
router.get('/order', function(req, res) {
    hello.start_spooky(order, function(response){
    	res.json(response);   
    });
});
*/


app.use('/', router);


app.listen(port);
console.log('Magic happens on port ' + port);
