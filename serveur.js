var app = require('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
fs = require('fs'),
composants = require('./modules_persos/composants');

var jojo = composants.creerJoueurBidon();

app.get('/game', function (req, res) {
	res.render('game.ejs', {});
});

io.sockets.on('connection', function (socket) {

});



server.listen(8080);

// SANDBOX pour faire tourner le reste