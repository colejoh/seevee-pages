var express    = require('express');
var logger     = require('morgan');
var app        = express();
var pug        = require('pug');
var fs         = require('fs');
var request    = require('request');

app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));

var port = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.get('/:pageName', function(req, res) {
    var requestUrlBase = process.env.REQUEST_URL_BASE || 'http://localhost:8080/';
    var url = requestUrlBase + 'api/pages/' + req.params.pageName;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var pugCode = fs.readFileSync(__dirname + '/views/simple.pug', "utf8");
            var fn = pug.compile(pugCode);

            res.send(fn(data));
        }
    });


});

app.listen(port);
console.log('Starting app on port: ' + port);
