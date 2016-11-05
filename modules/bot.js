var tinder = require('tinder');
var config = require("../config")


var STATES = {
    IDLE: 0,
    LOGIN: 1,
    SWIPE: 2
};


function log(s) {
    console.log(s);
}

function calc_delta_interval(seconds, delta) {
    if ( !delta ) {
        delta = 0.3;
    }
    var jitter = Math.ceil(delta * seconds);
    var max = seconds + jitter;
    var min = seconds - jitter;
    interval = Math.floor(Math.random() * (max - min + 1)) + min;
    return interval;
}

function human_sleep (seconds, callback, delta) {
    sleep_time = calc_delta_interval(seconds, delta);

    log("Waiting: " + sleep_time + " Seconds!");

    setTimeout( function( ) { 
        callback( ); 
    }, sleep_time*1000); 
}

function runFunctions( fns, seconds, callback, count ) {
    if (!count)
        count = 0;

    var fn = fns.shift( );

    if ( fn ) {
        count++;
        fn( function ( ) {
            if ( seconds ) {
                human_sleep(seconds, function ( ) {
                    runFunctions(fns, seconds, callback, count);
                });
            }
            else 
                runFunctions(fns, seconds, callback, count);
        })
    }
    else {
        callback(count)
    }
}


var Bot = function ( ) {
    this.state = STATES.LOGIN;
    this.client = new tinder.TinderClient( );

    this.run = function ( ) {
        log("Starting Bot!~~~")
        this.step( );
    }

    this.step = function ( ) {
        switch (this.state) {
            case STATES.LOGIN:
                this.login(function ( ) {
                    this.cycles = calc_delta_interval(10, .5);
                    this.changeState(STATES.SWIPE);
                    this.step( );
                }.bind(this));
                break;

            case STATES.SWIPE:                
                if ( this.cycles > 0 ) {
                    this.swipe(function ( ) {
                        this.step( );
                    }.bind(this));
                }
                else {
                    log("Nap Time")
                    human_sleep(1200, function ( ) {
                        this.changeState(STATES.LOGIN);
                        this.step( );
                    }.bind(this));
                }
                break;
        }
    }


    this.login = function (callback) {
        log("LOGGIN IN BRO - U RDY")
        this.client.authorize(config.token, config.id, function(err, res) {
            if (err) {
                log("PANIC");
                log(err)
                log(res)
                process.exit(1)
            }

            log("YAAA!");
            log("");

            human_sleep(10, function ( ) {
                callback( )
            });
        });
    }

    this.swipe = function (callback) {
        log("")
        log("SWIPESSSSIIEEEEESSSZZZ!!!")
        log(this.cycles + " Cycles to go~");
        log("")

        var defaults = this.client.getDefaults();
        var recs_size = defaults.globals.recs_size;

        this.client.getRecommendations(recs_size, function(err, data){
            if (err) {
                log("PANIC");
                log(err)
                log(res)
                process.exit(1)
            }

            var likes = [ ];

            for ( var i in data.results ) {
                var thing = data.results[i];

                likes.push(
                    (function (dudegal, client) {
                        return function (dun) {
                            // swipe
                            log("I LIKE: " + dudegal.name);
                            log("");
                            client.like(dudegal._id, function(err, res) {
                                if (err) {
                                    log("PANIC");
                                    log(err);
                                    log(res);
                                    process.exit(1);
                                }

                                if ( !res.likes_remaining ) {
                                    log("Outta likes! \n PEACE~");
                                    process.exit(1);
                                }

                                dun( ); 
                            });
                        }
                    })(thing, this.client)
                );
            }

            runFunctions(likes, 3, function ( ) {
                this.cycles--;
                callback( );
            }.bind(this));
        }.bind(this));
    }

    this.changeState = function (state) {
        this.state = state;
    }
};



module.exports = Bot;


