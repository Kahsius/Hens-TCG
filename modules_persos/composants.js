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

function Joueur (perso1, perso2, perso3, deck, main, defausse) {
	this.persos = [ perso1, perso2, perso3 ];
	this.deck = deck;
}

function Main (listeCartes) {
	this.listeCartes = listeCartes;
	this.taille = listeCartes.length;
}

function Deck (listeCartes) {
	this.listeCartes = listeCartes;
	this.taille = listeCartes.length;
}

function Defausse (listeCartes) {
	this.listeCartes = listeCartes;
	this.taille = listeCartes.length;
}

function Perso (nom, village, pv, pouvoir, caseTerrain) {
	this.nom = nom;	
	this.village = village;
	this.pv = pv;
	this.pouvoir = pv;
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
	this.effetsDeclenches = [];
	this.effetsPermanents = [];
}

function Case (pos, perso, effet) {
	this.pos = pos;
	this.perso = perso;
	this.effet = effet;
}

function Effet (estActive, estDeclenche, estPermanent) {
	this.estActive = estActive;
	this.estDeclenche = estDeclenche;
	this.estPermanent = estPermanent;
}

function creerJoueurBidon () {
	var carte = new Carte("yolo", "youpi", 1000, new Effet (1,1,1), 1000);
	var yolo = new Perso("yolo", "swag", 1000, new Effet (1,1,1), 0);
	var deck = new Deck([carte, carte, carte]);
	var jojo = new Joueur(yolo, yolo, yolo, deck, null, null);
	return jojo;
}

exports.Partie = Partie;
exports.Joueur = Joueur;
exports.Main = Main;
exports.Deck = Deck;
exports.Defausse = Defausse;
exports.Perso = Perso;
exports.Carte = Carte;
exports.Terrain = Terrain;
exports.Case = Case;
exports.Effet = Effet;
exports.creerJoueurBidon = creerJoueurBidon;