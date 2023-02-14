/**
 * Site wide tools
 */
var AvatarImageSVG = (function() {

	// PRIVATE

	/**
	 * Get initials from name E.g. "Robert Morrison" ( -> RM icon)
	 * @param name {string}
	 * @return string Initials e.g. RM
	 */
	var _initials = function (name) {
		if ((typeof (name) == "undefined") || (name == "Unknown name")) return "";
		var nameChunk = name.split(" ");
		return nameChunk[0].charAt(0) + nameChunk[nameChunk.length - 1].charAt(0);
	}

	/**
	 * Generate the html for svg initials icon from name
	 * @param alpha {string}
	 * @return integer
	 */
	var _hue = function (alpha) {
		if (typeof (alpha) == "undefined") return 0;
		return 360 * ((1 / 26) * (alpha.toLowerCase().charCodeAt(0) - 96)) - 0.01;
	}


	// PUBLIC

	/**
	 * Generate the html for svg initials icon from name
	 * @param id {string} ?
	 * @param name {string} E.g. "Robert Morrison" ( -> RM icon)
	 * @return string SVG HTML
	 */
	var _generateIcon = function(id, name) {
		var hue = _hue(name);
		var initials = _initials(name);

		return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" width="158" height="158">'+
			'<defs><style type="text/css">.st1{fill:#FFFFFF;}.st3{font-size:102.68px;}</style></defs>'+
			'<linearGradient id="SVGID_'+id+'_" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="300" y2="0">'+
			'	<stop offset="0" style="stop-color:#FFFFFF; stop-color:hsl('+hue+', 33%, 40%)"/>'+
			'	<stop offset="1" style="stop-color:#CCCCCC; stop-color:hsl('+hue+', 33%, 60%)"/>'+
			'</linearGradient>'+
			'<rect x="0" y="0" style="fill:url(#SVGID_'+id+'_);" width="300" height="300"/>'+
			'<title>'+name+'</title>'+
			'<text x="50%" y="50%" class="st1 st3" alignment-baseline="central" dominant-baseline="central" text-anchor="middle">'+ initials +'</text>'+
			'</svg>';
	}

	return {
		generateIcon: _generateIcon
	}

})();
