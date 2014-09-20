var app = require('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
fs = require('fs'),
composants = require('./modules_persos/composants');

var nombreDeJoueurs = 0;

var j1 = composants.creerJoueursBidons()[0];
var j2 = composants.creerJoueursBidons()[1];
var terrain = composants.creerTerrain();
var partie = new composants.Partie (j1, j2, terrain);

app.get('/game', function (req, res) {
	res.render('game.ejs', {});
});

io.sockets.on('connection', function (socket) {
	console.log('connection');
	
	socket.on('rejoint', function(pseudo) {
		console.log('Un joueur rejoint');
		if (pseudo == partie.joueurs[0].pseudo) {
			// iCourant et iAdverse = indice du joueur partie.joueurs[0] = 0 et partie.joueurs[1] = 1
			// 0 et 1 plutôt que 1 et 2 pour chercher plus facilement dans des tableaux
			socket.iCourant = 0;
			socket.iAdverse = 1;
			nombreDeJoueurs++;
			console.log("Nombre de joueurs : " + nombreDeJoueurs);
			socket.emit('rejointOK');
		}
		else if (pseudo == partie.joueurs[1].pseudo) {
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
				socket.emit('placements', socket.iCourant, partie.joueurs[socket.iCourant].persos);
			}
			else {
				socket.broadcast.emit('placements', socket.iAdverse, partie.joueurs[socket.iCourant].persos);
			}
		}
	});



	socket.on('placementFini', function(indice, placements) {
		console.log('placementFini de j' + (indice+1));
		for (var i = 0; i < 3; i ++) {
			// attribut au i eme perso la case i (cf composants.js pour structure de terrain)
			partie.joueurs[socket.iCourant].persos[i].caseTerrain = terrain.listeCases[socket.iCourant,placements[i]-1];
		}
		// Si placements de partie.joueurs[0] effectués
		if(indice == 0) {
			socket.broadcast.emit('placements', 1, partie.joueurs[socket.iAdverse].persos);
		}
	});

	socket.on('clic', function(joueur, pos) {
		console.log('clic - serveur');
		socket.emit('clic', joueur, pos);
	});

	socket.on('recup', function() {
		console.log('clic - serveur');
		socket.emit('recup', socket.iCourant, partie);
	});

	socket.on('carteJouee', function(carte, cible) {
		console.log('carteJouee - serveur');
		// TODO : PHASE DE DEPLACEMENT PRES LANCEMENT DU SORT
		carte.effet(cible);

		// Défausse du sort joué
		var indexCarte = partie.joueurs[socket.iCourant].main.indexOf(carte);
		partie.joueurs[socket.iCourant].defausse.push(joueur.main[indexCarte]); 
		partie.joueurs[socket.iCourant].main.splice(indexCarte, 1);
	});

});


server.listen(8080);

// SANDBOX pour faire tourner le reste