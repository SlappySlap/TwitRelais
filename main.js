var http = require('http');
var fs = require('fs');
var cfg = require('./config');
let id = {};
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

io.sockets.on('connection', function (socket, track) {

    console.info(`Client connected [id=${socket.id}]`);
    id[socket.id] = "";

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });

    //tracking keyword
    socket.on('track', function(track) {
        console.log("track : " + track);
        id[socket.id] = track;

        t.track(track);
        console.log(id);
    });

});

t.on('tweet', function (tweet) {
    console.log(tweet);
    Object.keys(id).forEach(function(key) {
        let val = id[key];
        let n = tweet.text;
        let pos = n.search(val);

        if(pos){
            if( io.sockets.connected[key] !== undefined){
                io.sockets.connected[key].emit('tweet', tweet);
            }
        }
    });
});

server.listen(8080);