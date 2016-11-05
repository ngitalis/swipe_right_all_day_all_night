var config = require("./config");
var express = require('express');
var bodyParser = require('body-parser');

var app = express( );
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public'));


app.post('/token.html', function(req, res, next) {
    console.log(req.body)

    res.send("")
});


var server = app.listen(config.server_port, function( ) {
    console.log( "Server Up @: " + config.server_port );
});


















