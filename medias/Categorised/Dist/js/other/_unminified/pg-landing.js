// update the UI with design / layout amends
// this will be called as a personalisation callback
// [rwm] Is this still in use? Google Optimise?
function doUIChanges() {
  // change promo widths
  var elements = ['[id="d.en.53142"]', '[id="d.en.53143"]', '[id="d.en.53144"]'];
  for (var i = 0; i < elements.length; i++) {
    var el = document.querySelector(elements[i]);
    el && el.classList.remove('large-4', 'medium-4');
    el && el.classList.add('medium-6', 'large-6');
  }

  // change CTA Promo panel background colour    
  var el = document.querySelector('[id="d.en.53146"]');
  el && el.classList.remove('u-bg-grey');
  el && el.classList.add('u-bg-heritage-berry', 'u-white--all');
}

/* UoS_locationService removed 2020-11-09 [rwm] */
/* (function () {

	UoS_locationService.do(function (data) {
		window.dataLayer = window.dataLayer || [];
		var el = document.getElementsByTagName("BODY")[0];
		el.setAttribute('data-countrycode', 'DEFAULT');
		if (data.country_code === "TH" || data.country_code === "IN" || data.country_code === "US") {
			el.setAttribute('data-countrycode', data.country_code);
			window.dataLayer.push({ 'countrycode': data.country_code });
		}
	});

})(); */