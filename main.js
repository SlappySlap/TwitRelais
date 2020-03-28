var http = require('http');
var fs = require('fs');
var cfg = require('./config')
var Twitter = require('node-tweet-stream')
    , t = new Twitter(cfg);

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

t.track('coronavirus');

t.on('tweet', function (tweet) {
    io.emit('tweet', tweet);
});

server.listen(8080);