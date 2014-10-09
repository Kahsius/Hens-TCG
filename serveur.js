// Appel du fichier de constantes
var constantes = require('./ressources/constantes');
var actions = require('./ressources/actions');

// Définition des composants dont on aura besoin
var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
fs = require('fs'),
composants = require('./ressources/composants');

// Le compteur de joueur pour savoir quand les deux joueurs sont là
var nombreDeJoueurs = 0;

// Les variables principales du programme
var j1 = composants.creerJoueursBidons()[0];
var j2 = composants.creerJoueursBidons()[1];
var terrain = composants.creerTerrain();
var partie = new composants.Partie (j1, j2, terrain);

app.get('/game', function (req, res) {
	res.render('game.ejs', {carteNoob:new composants.Carte("Saph","Envol","Saph et un allié sont invincible pendant 2 tours.")});
});

io.sockets.on('connection', function (socket) {
	console.log('connection');

	socket.on('rejoint', function() {
		nombreDeJoueurs++;
		var pseudo;


		//Partie bidouille à modifier dans la version finale au niveau de l'arrivée des joueurs
		if (nombreDeJoueurs == 1) {
			pseudo = 'jojo';
		}
		else if (nombreDeJoueurs == 2 ) {
			pseudo = 'toto';
		}
		else {
			pseudo = 'surcharge';
		}
		// Fin de la bidouille


		console.log('Un joueur rejoint');
		if (pseudo == partie.joueurs[0].pseudo) {
			// iCourant et iAdverse = indice du joueur partie.joueurs[0] = 0 et partie.joueurs[1] = 1
			// 0 et 1 plutôt que 1 et 2 pour chercher plus facilement dans des tableaux
			socket.iCourant = 0;
			socket.iAdverse = 1;
			console.log("Nombre de joueurs : " + nombreDeJoueurs);
			socket.emit('rejointOK', pseudo, socket.iCourant);
		}
		else if (pseudo == partie.joueurs[1].pseudo) {
			socket.iCourant = 1;
			socket.iAdverse = 0;
			console.log("Nombre de joueurs : " + nombreDeJoueurs);
			socket.emit('rejointOK', pseudo, socket.iCourant);
		}
		else {
			socket.emit('rejointNOK');
		}
	});

	socket.on('rejointFini', function() {
		console.log('rejointFini : iCourant == ' + socket.iCourant);
		if ( nombreDeJoueurs == 2 ) {
			if (constantes.debugPlacements) {
				for (var i = 0; i < 3; i ++) {
					// attribut au i eme perso la case i (cf composants.js pour structure de terrain)
					partie.joueurs[0].persos[i].caseTerrain = terrain.listeCases[0][constantes.placementsJ1[i]-1];
					partie.joueurs[1].persos[i].caseTerrain = terrain.listeCases[1][constantes.placementsJ2[i]-1];
				}
				actions.pioche(partie.joueurs[0], 5);
				actions.pioche(partie.joueurs[1], 5);
				console.log("main de j1 : " + partie.joueurs[0].main.length);
				console.log("main de j2 : " + partie.joueurs[1].main.length);
				console.log("deck de j1 : " + partie.joueurs[0].deck.listeCartes.length);
				console.log("deck de j2 : " + partie.joueurs[1].deck.listeCartes.length);
			}
			else {
				if (socket.iCourant == 0) {
					socket.emit('placements', socket.iCourant, partie.joueurs[socket.iCourant].persos);
				}
				else {
					socket.broadcast.emit('placements', socket.iAdverse, partie.joueurs[socket.iCourant].persos);
				}
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
		if(indice == 1) {
			actions.pioche(partie.joueurs[0], 5);
			actions.pioche(partie.joueurs[1], 5);
			console.log("main de j1 : " + partie.joueurs[0].main.length);
			console.log("main de j2 : " + partie.joueurs[1].main.length);
			console.log("deck de j1 : " + partie.joueurs[0].deck.listeCartes.length);
			console.log("deck de j2 : " + partie.joueurs[1].deck.listeCartes.length);
		}
	});

	socket.on('clic', function(joueur, pos) {
		console.log('clic - serveur');
		if (socket.attenteCible == true) {
			if(socket.ciblesPossibles[joueur][pos]) {
				// TODO : phase de déplacement avant lancement du sort
				socket.attenteCible = false;
				cibleChoisie = [joueur][pos];
				console.log('effet appliqué');
				socket.carteEnCours.effet.arcane(partie, cibleChoisie);
				// TODO : enlever la carte de la main du joueur
				/*
					var indexCarte = partie.joueurs[socket.iCourant].main.indexOf(carte);
					partie.joueurs[socket.iCourant].defausse.push(joueur.main[indexCarte]); 
					partie.joueurs[socket.iCourant].main.splice(indexCarte, 1);
				*/
			}
			else {
				socket.emit('message', 'La cible n\'est pas valide');
			}
		}
	});

	socket.on('recup', function() {
		console.log('clic - serveur');
		socket.emit('recup', socket.iCourant, partie);
	});

	socket.on('carteChoisie', function(index) {
		socket.carteEnCours = partie.joueurs[socket.iCourant].main[index];
		socket.emit('carteAJouer', socket.carteEnCours);
	});

	socket.on('attenteCible', function(ciblesPossibles) {
		socket.attenteCible = true;
		socket.ciblesPossibles = ciblesPossibles;
	});

});

// La ligne de la galaxie qui nous permet de tout trouver =3 !
app.use(express.static(__dirname + "/ressources"));

// Le serveur écoute sur le port indiqué
server.listen(8080);

// SANDBOX pour faire tourner le reste