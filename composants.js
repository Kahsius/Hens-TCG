function Joueur (perso1, perso2, perso3, deck) {
	this.perso1 = perso1;
	this.perso2 = perso2;
	this.perso3 = perso3;
	this.deck = deck;
}

function Perso (nom, village, pv, pouvoir) {
	this.nom = nom;
	this.village = village;
	this.pv = pv;
	this.pouvoir = pv;
}

function Carte (nomPerso, nom, portee, effet, persistance ) {
	this.nomPerso = nomPerso;
	this.nom = nom;
	this.portee = portee;
	this.effet = effet;
	this.persistance = persistance;
}

function Case (pos, perso, effet) {
	this.pos = pos;
	this.perso = perso;
	this.effet = effet;
}

function Deck (listeCartes) {
	this.listeCartes = listeCartes;
	this.taille = listeCartes.length;
}

function Terrain (listeCases) {
	this.listeCases = listeCases;
}

function Main (listeCartes) {
	this.listeCartes = listeCartes;
	this.taille = listeCartes.length;
}

function Defausse (listeCartes) {
	this.listeCartes = listeCartes;
	this.taille = listeCartes.length;
}