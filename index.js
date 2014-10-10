var vnstat = require('vnstat-dumpdb'),
    cacheManager = require('cache-manager'),
    util = require('util'),
    express = require('express');

var app = express();
var cache = cacheManager.caching({
    store: 'memory',
    max: 100,
    ttl: 60*5 /* 5 minutes */
});
var id = 1;

function getVnstat(callback) {
	vnstat.dumpdb(function (err, data) {
	    if (err) {
            console.log(err.message, err.stack);
	    }
	    else {
            callback(data);
	    }
	});
}

app.get('/', function (req, res) {
    var callback = function callback(data) {
        res.type('text/plain');
        res.send(data);
    };

    cache.get(id, function (err, result) {
        if (err) {return;}
        if (result) {
            callback(result);
            return;
        }

        getVnstat(function (data) {
            cache.set(id, data);
            res.type('text/plain');
            res.send(data);
        });
    });
});

var port = process.env.PORT || 8080;
console.log("Listening on port " + port);
app.listen(port);
