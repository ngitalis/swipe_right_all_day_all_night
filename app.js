var config = require("./config");
var express = require('express');


var app = express( );
app.use(express.static(__dirname + '/public'));

var server = app.listen(config.server_port, function( ) {
	console.log( "Server Up @: " + config.server_port );
});


















