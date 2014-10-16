function drawCarte(carte,positionTag){
	var position=$(positionTag);
	var carteDisplay=[];
	var jqowner="<div > Sort de "+carte.nomPerso+"</div>";
	var jqnom="<div>"+carte.nom+"</div>";
	var jqeffet="<p class='texte_bloc_carte' >"+carte.effet+"</p>";
	var jqimage="<img  class='image_carte' />";

	carteDisplay.push("<div class='carte_container' id='bloc"+carte.nom+"'style='font-size:12px;'>");
	carteDisplay.push(jqnom);
	carteDisplay.push(jqimage);
	carteDisplay.push(jqowner);
	carteDisplay.push(jqeffet);
	carteDisplay.push("</div>");
	console.log("drawing : " +carte.nom);
	position.append(carteDisplay.join(""));
}


