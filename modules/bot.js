var tinder = require('tinder');
var config = require("../config")

var STATES = {
    LOGIN: 'login',
    LOGIN: 'swipe',

};

var Bot = function (callback) {
    this.state = STATES.LOGIN;
    this.client = new tinder.TinderClient();

    this.run = function ( ) {
        // start main loop

        console.log("running")

    }

    this.login = function ( ) {

    }

    this.swipe = function ( ) {

    }

    this.human_sleep = function ( ) {
        // sleeps with random!
    }

    // constructor
    this.client.authorize(config.token, config.id, function(err, res) {
        if ( err )
            console.log("AUTH ERROR, CHECK YOUR TOKEN");

        callback( );
    });
};



module.exports = Bot;


