var vnstat = require('vnstat-dumpdb'),
    cacheManager = require('cache-manager'),
    util = require('util'),
    express = require('express'),
    path = require('path');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use('/angular', express.static(path.join(__dirname, 'node_modules/angular')));
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/vnstat/', function (req, res) {
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

app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: path.resolve(app.get('views'))
  });
});

app.listen(app.get('port'), function () {
  console.log("Listening on port %d", app.get('port'));
});
