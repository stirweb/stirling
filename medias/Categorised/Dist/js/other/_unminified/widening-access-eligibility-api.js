var stir = stir || {};

(function() {
	var form    = document.getElementById("postcodeform");
	var output  = document.getElementById("postcodereply");
	var success = document.querySelector('[name="success"]');
	var failure = document.querySelector('[name="failure"]');
	if(!form || !output) { return; }

	form.addEventListener("submit", function(event){
		event.preventDefault();
		var formData = new FormData(form);

		output.innerHTML = '&nbsp;';
		if(formData.get("postcode")) {
			var url = form.getAttribute("action") 
					+ (form.getAttribute("action").indexOf('?')>-1?'&':'?')
					+ "format=json&postcode=" + encodeURIComponent(formData.get("postcode"));
			stir.getJSON(url , function(data) {
				if(data) {
					var regex = /__1__/gi;
					if(data.result === true) {
						if(data.postcode) { output.innerHTML = success ? success.value.replace(regex, data.postcode) : data.message.replace(regex, data.postcode); }
						else {output.innerHTML = success ? success.value : data.message}
					}
					else if(data.result === false) {
						if(data.postcode) {output.innerHTML = failure ? failure.value.replace(regex, data.postcode) : data.message.replace(regex, data.postcode);}
						else {output.innerHTML = failure ? failure.value : data.message}
					} else {
						data.message && (output.innerHTML = data.postcode ? data.message.replace(regex, data.postcode) : data.message);
					}
				}
				data && data.error && console.error(data.error);
			});
		}
	});
})();