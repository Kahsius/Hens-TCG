/*
	Toutes les méthodes dont on pourrait avoir besoin dans le jeu
	/!\ Toutes les fonctions commentées AR sont à revoir
*/

// Côté client

console.log('Chargement d\'actions_clients.js');

function jouer(carte) {
console.log('jouer');
	socket.emit('recup');
	socket.on('recup', function(monID, partie) {	// In your face baby !
		console.log('recup - client');

		var perso;								// Index du perso jouant le chez joueur courant
		var moi = partie.joueurs[monID];		// Joueur courant
		var lui = partie.joueurs[(monID+1)%2];	// Joueur adverse

		// Récupération du perso lanceur (index dans la liste des persos du lanceur)
		for ( var i = 0; i < moi.persos.length; i++) {
			if (moi.persos[i].nom == carte.nomPerso) {
				perso = moi.persos[i];
			}
		}

		socket.emit('carteJouee', carte, cible(monID, perso.caseTerrain.pos, carte.effet));
	});
}

/* 
	Détermine d'abord les cibles possible, puis récupère le choix du joueur.
	Fonctionnement du tableau : à chaque fois qu'une case vérifie un des critères de l'effet 
	(aoe, à portée, ennemie ou allié), sa valeur est incrémentée de 1, et par logique, les cases avec les valeurs
	maximales seront les cibles possibles du sort (si si =3).
*/
function cible(ID, pos, effet) {
	console.log('cible');
	var ciblesPossibles = new Array(2,5);
	var cibleChoisie = null;


	// Analyse des cibles à fournir
	// CAS 1 : la cible est prédeterminée par le sort
	if (effet.cibleFinale != null) {
		cibleChoisie = effet.cibleFinale;
		break;
	}
	// CAS 2 : le joueur doit choisir la cible
	else {
		// Calcul de la valeur de chaque case
		for (var i = 0; i < 2; i++) {
			for (var j = 0; j < 5; j++) {
				ciblesPossibles[i,j] = 1 + portee([i,j], [monID,pos], effet.portee) + duBonCote(i, ID, effet.ciblesLegales);
			}	
		}

		// Obtention des cases finales
		var max = maxTab(ciblesPossibles);
		for (var i = 0; i < 2; i++) {
			for (var j = 0; j < 5; j++) {
				ciblesPossibles[i,j] = Math.floor(ciblesPossibles[i,j] / max);
			}
		}

		// A ce stade là, on a un joli tableau avec plein de 1 et de 0 qui indique quelles cases on peut cibler
		// On attend que l'utilisateur clic sur la cible et on vérifie si elle est valable
		while (cibleChoisie == null) {
			socket.on('click', function(joueur, pos) {
				if(ciblesPossibles[joueur, pos]){
					cibleChoisie = [joueur, pos];
				}
			});
		}

	}

	// On renvoie pour finir la cible finale
	return cibleChoisie;
}

// Retourne 1 si à portée, 0 sinon
function portee([i,j], [monID,pos], portee) {
	console.log('portee');
	var distance = Math.abs(j-pos);
	if (i != monID) { distance++; }
	if (distance > portee) { return 0; }
	else { return 1; }
}

// Retourne la valeur du champ correspondant au côté de la case par rapport à l'effet du sort
function duBonCote(i, ID, ciblesLegales) {
	console.log('duBonCote');
	if ( i == ID ) {
		return ciblesLegales[1];
	}
	else if ( i != ID ) {
		return ciblesLegales[0];
	}
}

function maxTab(tab) {
	console.log('maxTab');
	var max = 0;
	for (var i = 0; i < 2; i++) {
		for var (j = 0; j < 5; j++) {
			if (tab[i,j] > max) { max = tab[i,j]; }
		}
	}
	return max;
}

//AR
function pioche(joueur, n) {
	for (var i = 0; i < n; i++) {
		joueur.main.push(joueur.deck[0]);
		joueur.deck.splice(0,1);
	}
}

//AR
function degats(joueur, perso, n) {
	perso.pv = perso.pv - n;
	if (perso.pv <= 0) {
		detruitPerso(joueur, perso);
	}
}

//AR
function defausse(socket, joueur, n) {
	var choix;
	for (var i = 0; i < n; i++) {
		// choix = demandeInfos(socket, 'Carte à défausser (position dans votre main) ?');
		joueur.defausse.push(joueur.main[choix-1]);
		joueur.main.splice(choix-1,1);
	}
}

//AR
function defausseAleatoire(joueur, n) {
	var choix;
	for (var i = 0; i < n; i++) {
		choix = Math.floor(joueur.main.length * Math.random());
		joueur.defausse.push(joueur.main[choix]);
		joueur.main.splice(choix,1);
	}
}

//AR
function deplace(joueur, perso, droite) { // droite est un booleen pour dire si on va à droite (1) ou à gauche (0)
	var posActuelle = perso.caseTerrain.pos;
	var deplacement;

	if (droite) { deplacement = 1 }
	else { deplacement = -1 }

	for (var i =  0; i < joueur.persos.length; i++) {
		if (joueur.persos[i].caseTerrain.pos == posActuelle + deplacement) {
			joueur.persos[i].caseTerrain.pos = joueur.persos[i].caseTerrain.pos - deplacement;
			perso.caseTerrain.pos = posActuelle + deplacement;
		}
		else {
			perso.caseTerrain.pos = posActuelle + deplacement;
		}
	}
}

//AR
function soigne(perso, n) {
	perso.pv = perso.pv + n;
	if (perso.pv > perso.pvInit) {
		perso.pv = perso.pvInit;
	}
}

//AR
function detruitPerso(joueur, perso) {
	
	// Partie terrain
	var index = joueur.persos.indexOf(perso);
	if (index > -1) {
		joueur.persos.splice(index,1);
	}

	// Partie main
	for (var i = joueur.main.length; i > -1; i--) {
		if (joueur.main[index-1].nomPerso == perso.nom) {
			joueur.main.splice(index-1,1);
		}
	}

	// Partie deck
	for (var i = joueur.deck.length; i > -1; i--) {
		if (joueur.deck[index-1].nomPerso == perso.nom) {
			joueur.deck.splice(index-1,1);
		}
	}
}

//AR
function melange(deck) {
	for ( var i = deck.length-1; i >= 1; position--) {
		var hasard = Math.floor(Math.random()*(i+1));
		var save = deck[i];
		deck[i] = deck[hasard];
		deck[hasard] = save;	
	}
}

function testActions() {}


exports.cible = cible;
exports.pioche = pioche;
exports.degats = degats;
exports.defausse = defausse;
exports.defausseAleatoire = defausseAleatoire;
exports.deplace = deplace;
exports.soigne = soigne;
exports.detruitPerso = detruitPerso;
exports.jouer = jouer;
exports.melange = melange;
exports.testActions = testActions;