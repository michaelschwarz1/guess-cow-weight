// KuhTipp nodeJs Server

// set up =======================
var express = require('express');
var app = express(); //create our app w/ express
var mongoose = require('mongoose'); //mongoose for mongodb
var morgan = require('morgan'); //log requests to the console (express4)
var bodyParser = require('body-parser'); //pull information from HTML POST (express4)
var methodOverride = require('method-override'); //simulate DELETE and PUT (express4)

// configuration ================

//port the app ist listening on
var port = 7788;
//connect to mongoDB on localhost
mongoose.connect('mongodb://127.0.0.1/kuhtipp', function (err) {
    if (err) {
        console.log('connection error', err);
    } else {
        console.log('connection successfull');
    }
});


app.use(express.static(__dirname + '/public')); //set the static files location /public/img will be /img for users
app.use(morgan('dev')); //log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); //parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());

var Tipp = require('./models/Tipp.js');


// routes ======================================================================

// api ---------------------------------------------------------------------
// get all tipps
app.get('/api/tipps', function (req, res) {

    // use mongoose to get all tipps in the database
    Tipp.find(function (err, tipps) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(tipps); // return all tipps in JSON format
    });
});


// create tipp and send back all tipps after creation
app.post('/api/tipps', function (req, res) {

    // create a tipp, information comes from AJAX request from Angular
    Tipp.create({
        vorname: req.body.vorname,
        nachname: req.body.nachname,
        tippnr: req.body.tippnr,
        tippgewicht: req.body.tippgewicht,
        ort: req.body.ort,
        plz: req.body.plz,
        strasse: req.body.strasse,
    }, function (err, tipp) {
        if (err) {
            res.send(err);
            console.log(err);
        } else console.log("Tipp eingetragen: " + tipp);

        // get and return all the tipps after you create another
        Tipp.find(function (err, tipps) {
            if (err)
                res.send(err)
            res.json(tipps);
        });
    });

});

// delete a tipp
app.delete('/api/tipps/:tipp_id', function (req, res) {
    Tipp.remove({
        _id: req.params.tipp_id
    }, function (err, tipp) {
        if (err)
            res.send(err);

        // get and return all the tipps after you create another
        Tipp.find(function (err, tipps) {
            if (err)
                res.send(err)
            res.json(tipps);
        });
    });
});

// application -------------------------------------------------------------
app.get('/', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);