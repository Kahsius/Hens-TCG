var app = require('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
fs = require('fs');

app.get('/game', function (req, res) {
	res.render('game.ejs', {});
});

io.sockets.on('connection', function (socket, pseudo) {
	console.log("Connection au socket réussie");
});



server.listen(8080);

// SANDBOX pour faire tourner le reste