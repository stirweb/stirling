(function() {
	if(!document.querySelector(".c-zoom")) return;
	switch (window.location.hostname) {
		case "localhost": stir.addScript('/src/js-other/loupe.js'); break;
		default: stir.addScript('/webcomponents/dist/js/other/loupe.js'); break;
	}
})();