var app = require('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
fs = require('fs'),
composants = require('./modules_persos/composants');

var j1 ,j2;

j1 = composants.creerJoueursBidons()[0];
j2 = composants.creerJoueursBidons()[1];

var terrain = composants.creerTerrain();

app.get('/game', function (req, res) {
	res.render('game.ejs', {});
});

io.sockets.on('connection', function (socket) {
	socket.on('rejoint', function(pseudo) {
		if (pseudo == j1.pseudo || pseudo == j2.pseudo) {
			socket.emit('rejointOK', pseudo);
		}
		else {
			socket.emit('rejointNOK');
		}
	})
});



server.listen(8080);

// SANDBOX pour faire tourner le reste