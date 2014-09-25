// TODO : faire cible, et tester tout ce beau monde.

/*	
	Dans ce fichier on va mettre toutes les structures de donnees dont on pourrait avoir besoin
	On rassemble tout ici pour structurer au maximum le code, normalement le programme ne devrait
	pas etre tres complique, tout du moins dans un premier temps, donc on peut se permettre de
	trier le code par type plutot que par fonctionnalite 
*/

function Partie (joueur1, joueur2, terrain) {
	this.joueurs = [joueur1, joueur2];
	this.terrain = terrain;
}

function Joueur (pseudo,  perso1, perso2, perso3, deck) {
	this.pseudo = pseudo;
	this.persos = [ perso1, perso2, perso3 ];
	this.deck = deck;
	this.main = [];
	this.defausse = [];
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

function Carte (nomPerso, nom, effet ) {
	this.nomPerso = nomPerso;
	this.nom = nom;
	this.effet = effet;
}

function Terrain (listeCases) {
	this.listeCases = listeCases;
	this.effetsDeclenches = [];
	this.effetsPermanents = [];
}

function Case (pos, perso, effet) {
	this.pos = pos;
	this.effet = effet;
}

function Effet (cibleFinale, ciblesLegales, aoe, nombre, estActive, estDeclenche, duree, portee, arcane) {
	// Partie pour les cibles
	this.cibleFinale = cibleFinale;			// le plus souvent null puisqu'elle viendra après
	this.ciblesLegales = ciblesLegales; 	// = [booléen ennemi, booléen allié]
	this.aoe = aoe;
	this.nombre = nombre;

	// Partie pour l'effet
	this.estActive = estActive;
	this.estDeclenche = estDeclenche;
	this.duree = duree;
	this.portee = portee;		// 0 si aoe

	// La fonction d'effet a proprement parler
	this.arcane = arcane;		// n'a besoin que de sa cible pour fonctionner, le reste est géré en amont
}

function creerJoueursBidons () {
	// Création de la carte bidon
	var carte = new Carte("yolo", "youpi", new Effet ());
	// Création du perso bidon
	var yolo1 = new Perso("yolo1", "swag", 1000, new Effet (), 0);
	var yolo2 = new Perso("yolo2", "swag", 1000, new Effet (), 0);
	var yolo3 = new Perso("yolo3", "swag", 1000, new Effet (), 0);
	// Création du deck bidon
	var deck = new Deck([]);
	for(var i = 0; i < 30; i++) {
		deck.listeCartes.push(carte);
	}
	// Création des deux joueurs bidons avec tout ce qu'il y a au dessus
	var jojo = new Joueur("jojo", yolo1, yolo2, yolo3, deck, [], []);
	var toto = new Joueur("toto", yolo1, yolo2, yolo3, deck, [], []);
	var carte = creerCarteBidon();
	jojo.main.push(carte);
	toto.main.push(carte);

	// On retourne ce qu'il faut
	return [jojo, toto];
}

function creerTerrain() {
	var listeCases = [];

	for (var i = 0; i < 2; i ++) { 							// i représente le joueur
		listeCases[i] = [];
		for (var j = 0; j < 5; j ++) {						// j représente la position de la case
			listeCases[i][j] = new Case (j, null);		// listeCases[i][j] = listeCases[joueur][pos]
		}
	}
	// On crée le terrain à partir du tableau de cases précédent
	var terrain = new Terrain(listeCases);
	return terrain;
}

function creerCarteBidon() {
	// Effet (cibleFinale, ciblesLegales, aoe, nombre, estActive, estDeclenche, duree, portee, sort)
	var effet = new Effet (null, [1,0], 0, 1, 0, 0, 0, 2, (function(cible) { console.log('Ca fontionne !'); }));
	var carte = new Carte ('yolo1', 'Super-Yolo', effet);
	return carte;
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

exports.creerJoueursBidons = creerJoueursBidons;
exports.creerTerrain = creerTerrain;
exports.creerCarteBidon = creerCarteBidon;