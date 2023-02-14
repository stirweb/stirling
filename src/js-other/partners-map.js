function initialize() {

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: new google.maps.LatLng(22.821757, 57.041016),
		scrollwheel: false,
		navigationControl: false,
		mapTypeControl: false,
		scaleControl: false,
		draggable: true,
		minZoom: 3,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow();

	var bounds = new google.maps.LatLngBounds();

	// this will contain markers so we can show/hide them when checkboxes
	// are clicked
	var markers = [];

	// this is to set the url of where to fetch partner xml
	var url;
	switch (window.location.hostname) {
		case "localhost":
			url = "partners.xml"
			break;
		case "t4cms.stir.ac.uk":
			url = "https://t4cms.stir.ac.uk/terminalfour/preview/1/en/3689";
			break;
		default:
			url = "/data/our-partners/index.xml";
	}

	// this is set the base path to web components depending on the environment
	var marker_base_path;
	switch (window.location.hostname) {
		case "localhost":
			marker_base_path = "";
			break;
		default:
			marker_base_path = "/webcomponents/";
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		success: function(xml) {

			$(xml).find('partner').each(function(index) {

				var title = $(this).find('title').text();
				var location = $(this).find('location').text();
				var agreement = $(this).find('agreement').text();
				var url = $(this).find('url').text();
				var lat = $(this).find('lat').text();
				var lng = $(this).find('lng').text();
				var type = $(this).find('type').text();

				var marker, i;

				var icon_urls = {
					teaching: marker_base_path + "dist/images/markers/red_pin.png",
					research: marker_base_path + "dist/images/markers/blue_pin.png",

					// default marker when icon not defined
					default: marker_base_path + "dist/images/markers/red_pin.png"
				}

				// if lat n lng have been defined we can show a marker, yey
				if (lat && lng) {

					marker = new google.maps.Marker({
						position: new google.maps.LatLng(lat, lng),
						map: map,
						icon: icon_urls[type] || icon_urls["default"]
					});

					// we'll attach a little info to the marker so that we
					// can determine it's purpose (e.g. so we can hive it it's a given type)
					marker.__meta_type = type;


					google.maps.event.addListener(marker, 'click', (function(marker, i) {
						return function() {

							var html = [];

							if (type === "teaching") { // teaching
								if (url) {
									html.push('<p><strong><a href="'+url+'">'+title+'</a></strong><br><span style="font-size: 16px">'+location+'</span><p style="font-size: 16px">'+agreement+'</p>');
								} else {
									html.push('<p><strong>'+title+'</strong><br><span style="font-size: 16px">'+location+'</span><p style="font-size: 16px">'+agreement+'</p>');
								}
							} else { // default, research
								html.push('<p>'+title+'</p>');
							}

							infowindow.setContent( html.join("") );
							infowindow.open(map, marker);
						}
					})(marker, i));

					bounds.extend(marker.getPosition());

					markers.push(marker);

				}

			});

			map.fitBounds(bounds);

		},
		error: function() {
			alert("Failed to get xml")
		}
	});

	// apply styles to legend
	$(".c-full-width-map__legend input[type='checkbox']").on("change", function(e) {

		var isVisible = $(this).is(':checked');
		var type = $(this).data("type");

		// loop though each marker and check it's type and decide whether to show/hide
		for (var i=0; i<markers.length; i++) {

			// we only need to apply this logic to the selected type
			// we can use the __meta_type we assigned earlier to compare
			if (type === markers[i].__meta_type) {
				markers[i].setMap(isVisible ? map : null);
			}
		}
	});

}
