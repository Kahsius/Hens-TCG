var app = require('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
fs = require('fs'),
composants = require('./modules_persos/composants');

var j1 ,j2;
var nombreDeJoueurs = 0;

j1 = composants.creerJoueursBidons()[0];
j2 = composants.creerJoueursBidons()[1];

var terrain = composants.creerTerrain();

app.get('/game', function (req, res) {
	res.render('game.ejs', {});
});

io.sockets.on('connection', function (socket) {
	console.log('connection');
	
	socket.on('rejoint', function(pseudo) {
		console.log('Un joueur rejoint');
		if (pseudo == j1.pseudo) {
			socket.jCourant = j1;
			socket.jAdverse = j2;
			// iCourant et iAdverse = indice du joueur j1 = 0 et j2 = 1
			// 0 et 1 plutôt que 1 et 2 pour chercher plus facilement dans des tableaux
			socket.iCourant = 0;
			socket.iAdverse = 1;
			nombreDeJoueurs++;
			console.log("Nombre de joueurs : " + nombreDeJoueurs);
			socket.emit('rejointOK');
		}
		else if (pseudo == j2.pseudo) {
			socket.jCourant = j2;
			socket.jAdverse = j1;
			socket.iCourant = 1;
			socket.iAdverse = 0;
			nombreDeJoueurs++;
			console.log("Nombre de joueurs : " + nombreDeJoueurs);
			socket.emit('rejointOK');
		}
		else {
			socket.emit('rejointNOK');
		}
	});

	socket.on('rejointFini', function() {
		console.log('rejointFini : iCourant == ' + socket.iCourant);
		if ( nombreDeJoueurs == 2 ) {
			if (socket.iCourant == 0) {
				socket.emit('placements', socket.iCourant, socket.jCourant.persos);
			}
			else {
				socket.broadcast.emit('placements', socket.iAdverse, socket.jCourant.persos);
			}
		}
	});



	socket.on('placementFini', function(indice, placements) {
		console.log('placementFini de j' + (indice+1));
		for (var i = 0; i < 3; i ++) {
			// attribut au i eme perso la case i (cf composants.js pour structure de terrain)
			socket.jCourant.persos[i].caseTerrain = terrain.listeCases[socket.iCourant,placements[i]-1];
		}
		// Si placements de j1 effectués
		if(indice == 0) {
			socket.broadcast.emit('placements', 1, socket.jAdverse.persos);
		}
	});
});


server.listen(8080);

// SANDBOX pour faire tourner le reste