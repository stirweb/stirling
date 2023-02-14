(function() {

	var lazy = false;
	var section   = stir.t4Globals.section;
	var formId    = stir.t4Globals.formid;
	var el 		  = document.getElementById("gecko-form");

	if(!section || !formId || !el) return;

	var geckoscript = document.createElement('script');
	var src       = 'https://app.geckoform.com/gecko-embed/form.js?uuid='+ formId;
	var urchins   = []; //['utm_campaign','utm_medium','utm_source'];
	
//	for(var i=0;i<urchins.length;i++){
//		src += '&' + urchins[i] + '=' + encodeURIComponent(localStorage.getItem(urchins[i]) || '');
//	}
	src += '&refPage=' + section.replace(/\s/g,'-');
	geckoscript.setAttribute('id', 'gecko-form-embed-script');

	if(!lazy) {
		//var clientId  = stir.ga.getClientId();			// not needed  - GTM will append the ID to the iframe
		//src += clientId ? '&_ga=' + clientId : '';
		geckoscript.setAttribute('src',src);
		el.appendChild(geckoscript);
	} else {
		// Use lazy-loading
		var observer = stir.createIntersectionObserver({
			element: el,
			threshold: [0.1],
			callback: function(entry) {
				var clientId  = stir.ga.getClientId();
				if(entry.intersectionRatio == -1 || entry.intersectionRatio > 0) {
					src += clientId ? '&_ga=' + clientId : '';
					geckoscript.setAttribute('src',src);
					el.appendChild(geckoscript);
					observer && observer.observer.unobserve(this);
				}
			}
		});
	}

})(); 
