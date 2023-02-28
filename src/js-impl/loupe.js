(function() {
	if(!document.querySelector(".c-zoom")) return;
	switch (window.location.hostname) {
		case "localhost": stir.addScript('/src/js-other/loupe.js'); break;
		case "www.stir.ac.uk":
		case "stiracuk-cms01-production.terminalfour.net":
			stir.addScript('<t4 type="media" id="158075" formatter="path/*" />'); break;
		default:
			break;
	}
})();