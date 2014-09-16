// TODO : faire cible, et tester tout ce beau monde.

/*	
	Dans ce fichier on va mettre toutes les structures de donnees dont on pourrait avoir besoin
	On rassemble tout ici pour structurer au maximum le code, normalement le programme ne devrait
	pas etre tres complique, tout du moins dans un premier temps, donc on peut se permettre de
	trier le code par type plutot que par fonctionnalite 
*/

function Partie (joueur1, joueur2, terrain) {
	this.joueur1 = joueur1;
	this.joueur2 = joueur2;
	this.terrain = terrain;
}

function Joueur (pseudo,  perso1, perso2, perso3, deck) {
	this.pseudo = pseudo;
	this.persos = [ perso1, perso2, perso3 ];
	this.deck = deck;
	this.main = new Array();
	this.defausse = new Array();
}

function Deck (listeCartes) {
	this.listeCartes = listeCartes;
	this.taille = listeCartes.length;
}

function Perso (nom, village, pv, pouvoir, caseTerrain) {
	this.nom = nom;	
	this.village = village;
	this.pvInit = pv;
	this.pv = pv;
	this.pouvoirInit = pouvoir;
	this.pouvoir = pouvoir;
	this.caseTerrain = caseTerrain
}	

function Carte (nomPerso, nom, portee, effet, persistance ) {
	this.nomPerso = nomPerso;
	this.nom = nom;
	this.portee = portee;
	this.effet = effet;
	this.persistance = persistance;
}

function Terrain (listeCases) {
	this.listeCases = listeCases;
	this.effetsDeclenches = new Array();
	this.effetsPermanents = new Array();
}

function Case (pos, perso, effet) {
	this.pos = pos;
	this.effet = effet;
}

function Effet (estActive, estDeclenche, estPermanent, portee, fonction, cible) {
	this.estActive = estActive;
	this.estDeclenche = estDeclenche;
	this.estPermanent = estPermanent;
	this.portee = portee;
	this.fonction = fonction;
	this.cible = cible;
}

function cible(socket, iCourant, perso, carte) {
	// A FAIRE
}

function pioche(joueur, n) {
	for (var i = 0; i < n; i++) {
		joueur.main.push(joueur.deck[0]);
		joueur.deck.splice(0,1);
	}
}

function degats(joueur, perso, n) {
	perso.pv = perso.pv - n;
	if (perso.pv <= 0) {
		detruitPerso(joueur, perso);
	}
}

function defausse(socket, joueur, n) {
	var choix;
	for (var i = 0; i < n; i++) {
		choix = demandeInfos(socket, 'Carte à défausser (position dans votre main) ?');
		joueur.defausse.push(joueur.main[choix-1]);
		joueur.main.splice(choix-1,1);
	}
}

function defausseAleatoire(joueur, n) {
	var choix;
	for (var i = 0; i < n; i++) {
		choix = Math.floor(joueur.main.length * Math.random());
		joueur.defausse.push(joueur.main[choix]);
		joueur.main.splice(choix,1);
	}
}

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

function soigne(perso, n) {
	perso.pv = perso.pv + n;
	if (perso.pv > perso.pvInit) {
		perso.pv = perso.pvInit;
	}
}

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

function jouer(socket, joueur, carte) {
	// Récupération du perso lanceur
	var index;
	for ( var i = 0; i < joueur.persos.length; i++) {
		if (joueur.persos[i].nom == carte.nomPerso) {
			// On récupère i et pas le perso parce que sinon la fonction resterait locale
			index = i;
		}
	}

	var deplacer = -1;
	while (deplacer != 1 && deplacer != 0) {
		deplacer = demandeInfos(socket, 'Voulez-vous déplacer ce perso ?');
	}

	var ou = -1;
	if (deplacer) {
		while (ou != "d" && ou != "g") {
			ou = demandeInfos(socket, 'A droite (d) ou à gauche (g) ?');
		}
		if (ou == d) {ou = 1}
		else {ou = 0}
		deplace(joueur, joueur.perso[i], ou);
	}

	// Récupération de la cible
	var cible = cible(socket, joueur, joueur.persos[i], carte);
	carte.effet.fonction(cible);

	var indexCarte = joueur.main.indexOf(carte);
	joueur.defausse.push(joueur.main[indexCarte]); 
	joueur.main.splice(indexCarte, 1);
}

function melange(deck) {
	for ( var i = deck.length-1; i >= 1; position--) {
		var hasard = Math.floor(Math.random()*(i+1));
		var save = deck[i];
		deck[i] = deck[hasard];
		deck[hasard] = save;	
	}
}

function testActions() {}

function demandeInfos(socket, string) {
	socket.emit('info', string);
	socket.on('retourInfo', function(info) {
		return info;
	});
}

function creerJoueursBidons () {
	// Création de la carte bidon
	var carte = new Carte("yolo", "youpi", 1000, new Effet (1,1,1), 1000);
	// Création du perso bidon
	var yolo1 = new Perso("yolo1", "swag", 1000, new Effet (1,1,1), 0);
	var yolo2 = new Perso("yolo2", "swag", 1000, new Effet (1,1,1), 0);
	var yolo3 = new Perso("yolo3", "swag", 1000, new Effet (1,1,1), 0);
	// Création du deck bidon
	var deck = new Deck([]);
	for(var i = 0; i < 30; i++) {
		deck.listeCartes.push(carte);
	}
	// Création des deux joueurs bidons avec tout ce qu'il y a au dessus
	var jojo = new Joueur("jojo", yolo1, yolo2, yolo3, deck, [], []);
	var toto = new Joueur("toto", yolo1, yolo2, yolo3, deck, [], []);

	// On retourne ce qu'il faut
	return [jojo, toto];
}

function creerTerrain() {
	var listeCases = new Array(2,5);
	for (var i = 0; i < 2; i ++) { 							// i représente le joueur
		for (var j = 0; j < 5; j ++) {						// j représente la position de la case
			listeCases[i,j] = new Case (j, null);		// listeCases[i,j] = listeCases[joueur,pos]
		}
	}
	// On crée le terrain à partir du tableau de cases précédent
	var terrain = new Terrain(listeCases);
	return terrain;
}

// Liste des exports

exports.Partie = Partie;
exports.Joueur = Joueur;
exports.Deck = Deck;
exports.Perso = Perso;
exports.Carte = Carte;
exports.Terrain = Terrain;
exports.Case = Case;
exports.Effet = Effet;

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

exports.creerJoueursBidons = creerJoueursBidons;
exports.creerTerrain = creerTerrain;