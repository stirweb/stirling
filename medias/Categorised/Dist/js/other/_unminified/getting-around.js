/**
 * Give the map stuff it's own scope and accessor methods
 */
var UoS_GettingAround = function () {
  /**
   * We wanna only change these in one place as they are used when comparing
   * status etc (e.g. compare value of checkbox to determine whether to show/
   * hide a marker)
   * var {obejct}
   */
  var types = {
    RESIDENCES: "Residences",
    SPORT_FACILITES: "Sports",
    BUILDINGS: "Buildings",
    EATING: "Food and drink",
    NEXTBIKE: "NextBike",
    // BICYCLE_PARKING: "Bicycle parking",
    PARKING: "Car parking",
    DISABLED_PARKING: "Disabled parking",
    SHORT_STAY_PARKING: "Short stay car parking",
    ELECTRIC_BIKES: "Electric bike hire",
    CHARGING_POINT: "Electric car charging point",
    DROP_OFF: "Drop off point",
    PEDESTRIAN_AREA: "No vehicular access "
  };

  /**
   * This is the data for the markers. Notice that coords is a string
   * although it's probably better suited to have this as an object, however
   * it's easier to add new markers when copying/pasting from tools such as
   * latlng.net etc
   * var {Array<object>}
   */
  var _markerData = [{
    name: "Campus Central / Atrium",
    type: types.BUILDINGS,
    coords: "56.145922, -3.920283"
  }, {
    name: "Students' Union",
    type: types.BUILDINGS,
    coords: "56.145926, -3.918393"
  }, {
    name: "Queens Court drop off point",
    type: types.DROP_OFF,
    coords: "56.144959, -3.920038"
  }, {
    name: "No vehicular access - pedestrians only",
    type: types.PEDESTRIAN_AREA,
    coords: "56.145610, -3.923317"
  }, {
    name: "No vehicular access - pedestrians only",
    type: types.PEDESTRIAN_AREA,
    coords: "56.145245, -3.920502"
  }, {
    name: "Parking",
    type: types.PARKING,
    coords: "56.149712, -3.925524"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.145336, -3.920214"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.149366, -3.916759"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.148727, -3.913141"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.149104, -3.906754"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.148378, -3.927181"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.149931, -3.926829"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.145243, -3.922320"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.144765, -3.921848"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.143794, -3.919998"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.143627, -3.923367"
  }, {
    name: "Parking",
    // pathfoot
    type: types.PARKING,
    coords: "56.148595, -3.928518"
  }, {
    name: "Parking",
    // pathfoot
    type: types.PARKING,
    coords: "56.148320, -3.926168"
  }, {
    name: "Parking",
    // beach court, etc
    type: types.PARKING,
    coords: "56.149372, -3.922807"
  }, {
    name: "Parking",
    // beach court, etc
    type: types.PARKING,
    coords: "56.149416, -3.921820"
  }, {
    name: "Parking",
    // beach court, etc
    type: types.PARKING,
    coords: "56.148940, -3.919535"
  }, {
    name: "Parking",
    // medical centre
    type: types.PARKING,
    coords: "56.149215, -3.915994"
  }, {
    name: "Parking",
    // medical centre
    type: types.PARKING,
    coords: "56.148767, -3.913752"
  }, {
    name: "Parking",
    // medical centre
    type: types.PARKING,
    coords: "56.149469, -3.910930"
  }, {
    name: "Parking",
    // medical centre
    type: types.PARKING,
    coords: "56.149603, -3.909943"
  }, {
    name: "Parking",
    // medical centre
    type: types.PARKING,
    coords: "56.148790, -3.906778"
  }, {
    name: "Disabled Parking",
    type: types.DISABLED_PARKING,
    coords: "56.146569, -3.925578"
  }, {
    name: "Parking",
    // into
    type: types.PARKING,
    coords: "56.145128, -3.923044"
  }, {
    name: "Parking",
    // court
    type: types.PARKING,
    coords: "56.143813, -3.923044"
  }, {
    name: "Parking",
    // court behind
    type: types.PARKING,
    coords: "56.142424, -3.921624"
  }, {
    name: "Parking",
    // cottrell over road
    type: types.PARKING,
    coords: "56.143172, -3.919779"
  }, {
    name: "Parking",
    // cottrell over road 2
    type: types.PARKING,
    coords: "56.142968, -3.918878"
  }, {
    name: "Parking",
    // colin bell
    type: types.PARKING,
    coords: "56.143435, -3.918148"
  }, {
    name: "Parking",
    // property management office
    type: types.PARKING,
    coords: "56.142472, -3.913620"
  }, {
    name: "The Bite",
    type: types.EATING,
    coords: "56.144471, -3.920713"
  }, {
    name: "Haldane's",
    type: types.EATING,
    coords: "56.145882, -3.918882"
  }, {
    name: "Scran",
    type: types.EATING,
    coords: "56.146062, -3.920032"
  }, {
    name: "SUP",
    type: types.EATING,
    coords: "56.145762, -3.920271"
  }, {
    name: "Pathfoot Dining Room",
    type: types.EATING,
    coords: "56.149127, -3.925329"
  }, {
    name: "Crush Hall Pod",
    type: types.EATING,
    coords: "56.149494, -3.926526"
  }, {
    name: "Stirling Court Hotel",
    type: types.EATING,
    coords: "56.143324, -3.922643"
  }, {
    name: "Food and Drink at Macrobert",
    type: types.EATING,
    coords: "56.145644, -3.920007"
  }, {
    name: "Nourish",
    type: types.EATING,
    coords: "56.145701, -3.924482"
  }, {
    name: "Refresh Bar and Bistro",
    type: types.EATING,
    coords: "56.149127, -3.92082"
  }, {
    name: "Students’ Union",
    description: "Studio, Underground and Venue",
    type: types.EATING,
    coords: "56.146026, -3.918340"
  }, {
    name: "UMAMI",
    type: types.EATING,
    coords: "56.144384, -3.921226"
  }, {
    name: "Parking",
    // cottrell behind
    type: types.SHORT_STAY_PARKING,
    coords: "56.143692, -3.919897"
  }, {
    name: "Alangrange",
    type: types.RESIDENCES,
    coords: "56.150993, -3.929349"
  }, {
    name: "Alexander Court",
    type: types.RESIDENCES,
    coords: "56.149023, -3.906662"
  }, {
    name: "Andrew Stewart Hall",
    type: types.RESIDENCES,
    coords: "56.148859, -3.922686"
  }, {
    name: "Beech Court",
    type: types.RESIDENCES,
    coords: "56.148575,-3.919705"
  }, {
    name: "Fraser of Allander House",
    type: types.RESIDENCES,
    coords: "56.148525, -3.921504"
  }, {
    name: "Friarscroft",
    type: types.RESIDENCES,
    coords: "56.140727,-3.9261935"
  }, {
    name: "H H Donnelly House",
    type: types.RESIDENCES,
    coords: "56.149045, -3.921639"
  }, {
    name: "John Forty's Court",
    type: types.RESIDENCES,
    coords: "56.129741, -3.934522"
  }, {
    name: "Juniper Court Standard Flats",
    type: types.RESIDENCES,
    coords: "56.149070, -3.917518"
  }, {
    name: "Lyon Crescent",
    type: types.RESIDENCES,
    coords: "56.149936, -3.947224"
  }, {
    name: "Muirhead House",
    type: types.RESIDENCES,
    coords: "56.149126, -3.919097"
  }, {
    name: "Pendreich Way",
    type: types.RESIDENCES,
    coords: "56.149918, -3.924077"
  }, {
    name: "Polwarth House",
    type: types.RESIDENCES,
    coords: "56.148953, -3.920406"
  }, {
    name: "Spittal Hill",
    type: types.RESIDENCES,
    coords: "56.141321, -3.92499"
  }, {
    name: "Thistle Chambers",
    type: types.RESIDENCES,
    coords: "56.118522, -3.935718"
  }, {
    name: "Union Street, Bridge of Allan",
    type: types.RESIDENCES,
    coords: "56.154105, -3.948818"
  }, {
    name: "Union Street Development",
    type: types.RESIDENCES,
    coords: "56.126040, -3.940609"
  }, {
    name: "Willow Court",
    type: types.RESIDENCES,
    coords: "56.149183, -3.921046"
  }, {
    name: "Swimming pool",
    type: types.SPORT_FACILITES,
    coords: "56.146876, -3.925188"
  }, {
    name: "Sports Pavilion",
    type: types.SPORT_FACILITES,
    coords: "56.149051,-3.910593"
  }, {
    name: "Sports Facilities",
    type: types.SPORT_FACILITES,
    coords: "56.145705, -3.924490"
  }, {
    name: "National Tennis Centre",
    type: types.SPORT_FACILITES,
    coords: "56.145541, -3.925086"
  }, {
    name: "Airthrey Castle",
    type: types.BUILDINGS,
    coords: "56.148213,-3.913375"
  }, {
    name: "Pathfoot Building",
    type: types.BUILDINGS,
    coords: "56.149210,-3.926748"
  }, {
    name: "Colin Bell Building",
    type: types.BUILDINGS,
    coords: "56.143963, -3.917316"
  }, {
    name: "Iris Murdoch Building",
    type: types.BUILDINGS,
    coords: "56.143974, -3.91697"
  }, {
    name: "Macrobert Arts Centre",
    type: types.BUILDINGS,
    coords: "56.145636,-3.920355"
  }, {
    name: "Airthrey Medical Centre",
    type: types.BUILDINGS,
    coords: "56.149604, -3.917463"
  }, {
    name: "Innovation Park",
    type: types.BUILDINGS,
    coords: "56.142750, -3.917021"
  }, {
    name: "Stirling Court Hotel",
    type: types.BUILDINGS,
    coords: "56.143324, -3.922643"
  }, {
    name: "Scottish Institute of Sport",
    type: types.BUILDINGS,
    coords: "56.143065, -3.926171"
  }, {
    name: "Cottrell Building",
    type: types.BUILDINGS,
    coords: "56.145389, -3.921220"
  }, {
    name: "INTO Building",
    type: types.BUILDINGS,
    coords: "56.144384, -3.921226"
  }, {
    name: "NextBike Willow Café",
    type: types.NEXTBIKE,
    coords: "56.149110, -3.921319"
  }, {
    name: "NextBike Alexander Court",
    type: types.NEXTBIKE,
    coords: "56.148906, -3.906572"
  },
  // {
  // 	"name": "Sports Centre Cycle parking",
  // 	"type": types.BICYCLE_PARKING,
  // 	"coords": "56.146166, -3.925530"
  //
  // },
  {
    name: "NextBike Cottrell Building",
    type: types.NEXTBIKE,
    coords: "56.144154, -3.922263"
  }, {
    name: "Electric Car Charge Point",
    type: types.CHARGING_POINT,
    coords: "56.144836, -3.922242"
  }, {
    name: "Electric Car Charge Point",
    type: types.CHARGING_POINT,
    coords: "56.149575, -3.925748"
  }, {
    name: "Electric Bikes",
    type: types.ELECTRIC_BIKES,
    coords: "56.144053, -3.920842"
  }];

  // we have different urls for the json feed depending on the environment
  // update 2023-02-28 to use t4 media URLs instead
  /* //icons
  path: "dist/images/markers/food_and_drink.png";
        name: "uos-fork-knife";
        path: "dist/images/markers/residences.png";
        name: "uos-home";
        path: "dist/images/markers/buildings.png";
        name: "uos-history-large";
        path: "dist/images/markers/sports_facilities.png";
        name: "uos-runner";
        path: "dist/images/markers/nextbike.png";
      // 	path: "dist/images/markers/bicycle_parking.png";
      // 	name: "uos-cyclist";
        path: "dist/images/markers/parking.png";
        name: "uos-car";
        path: "dist/images/markers/disabled_parking.png";
        name: "uos-wheelchair";
        path: "dist/images/markers/short-stay-car-park.png";
        name: "uos-car";
        path: "dist/images/markers/electric-charge.png";
        name: "uos-car";
        path: "dist/images/markers/drop-off.png";
        name: "uos-car";
        path: "dist/images/markers/no_road_access.png";
        name: "uos-pedestrian";
        path: "dist/images/markers/electric-bike.png";
  */

  var isDev = UoS_env.name === "dev" ? true : false;
  var iconRoot = UoS_env.wc_path + "/images/markers/";

  // set icons based on type
  for (var i = 0; i < _markerData.length; i++) {
    switch (_markerData[i].type) {
      case types.EATING:
        _markerData[i].icon = isDev ? iconRoot + "food_and_drink.png" : '<t4 type="media" id="158271" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-fork-knife";
        continue;
      case types.RESIDENCES:
        _markerData[i].icon = isDev ? iconRoot + "residences.png" : '<t4 type="media" id="158276" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-home";
        continue;
      case types.BUILDINGS:
        _markerData[i].icon = isDev ? iconRoot + "buildings.png" : '<t4 type="media" id="158266" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-history-large";
        continue;
      case types.SPORT_FACILITES:
        _markerData[i].icon = isDev ? iconRoot + "sports_facilities.png" : '<t4 type="media" id="158278" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-runner";
        continue;
      case types.NEXTBIKE:
        _markerData[i].icon = isDev ? iconRoot + "nextbike.png" : '<t4 type="media" id="158272" formatter="path/*" />';
        continue;
      // case types.BICYCLE_PARKING:
      // 	_markerData[i].icon = '<t4 type="media" id="158264" formatter="path/*" />';
      // 	_markerData[i].usoIconClassName = "uos-cyclist";
      // 	continue;
      case types.PARKING:
        _markerData[i].icon = isDev ? iconRoot + "parking.png" : '<t4 type="media" id="158274" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-car";
        continue;
      case types.DISABLED_PARKING:
        _markerData[i].icon = isDev ? iconRoot + "disabled_parking.png" : '<t4 type="media" id="158267" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-wheelchair";
        continue;
      case types.SHORT_STAY_PARKING:
        _markerData[i].icon = isDev ? iconRoot + "short-stay-car-park.png" : '<t4 type="media" id="158277" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-car";
        continue;
      case types.CHARGING_POINT:
        _markerData[i].icon = isDev ? iconRoot + "electric-charge.png" : '<t4 type="media" id="158270" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-car";
        continue;
      case types.DROP_OFF:
        _markerData[i].icon = isDev ? iconRoot + "drop-off.png" : '<t4 type="media" id="158268" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-car";
        continue;
      case types.PEDESTRIAN_AREA:
        _markerData[i].icon = isDev ? iconRoot + "no_road_access.png" : '<t4 type="media" id="158273" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-pedestrian";
        continue;
      case types.ELECTRIC_BIKES:
        _markerData[i].icon = isDev ? iconRoot + "electric-bike.png" : '<t4 type="media" id="158269" formatter="path/*" />';
        _markerData[i].usoIconClassName = "uos-bike";
        continue;
    }
  }

  /**
   * Where current location is available, we'll store here
   * var {null|boolean}
   */
  var _currentLocation = null;

  /**
   * Options used in this scope
   * var {object}
   */
  var _options = {
    zoom: 16,
    center: {
      lat: 56.14643094488868,
      lng: -3.918399958166454
    },
    travelMode: "WALKING",
    checkCurrentLocationWithinBounds: true
  };

  /**
   * var {google.maps.Map}
   */
  var _map;

  /**
   * var {array}
   */
  var validDirectionSelectTypes = [types.RESIDENCES, types.SPORT_FACILITES, types.BUILDINGS
  // types.EATING,
  // types.NEXTBIKE,
  // types.BICYCLE_PARKING
  ];

  /**
   * We want other methods to be able to access this so it's defined here
   * var {google.maps.InfoWindow}
   */
  var infowindow;

  // PUBLIC METHODS

  /**
   * This is the JSONP callback for when the google maps script loads
   */
  function _initMap() {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    // if center has not been specified, we'll auto center based on the marker positions
    var bounds = new google.maps.LatLngBounds();
    _map = new google.maps.Map(document.getElementById("getting-around__map"), {
      zoom: _options.zoom,
      center: _options.center
    });
    directionsDisplay.setMap(_map);

    // // fetch data...

    // create markers
    infowindow = new google.maps.InfoWindow();
    for (var i = 0; i < _markerData.length; i++) {
      markerOptions = {
        position: _getPosObject(_markerData[i].coords),
        map: _map,
        title: _markerData[i].title
      };

      // insert icon is there
      if (typeof _markerData[i].icon !== "undefined") {
        markerOptions["icon"] = _markerData[i].icon;
      }

      // create marker
      _markerData[i].marker = new google.maps.Marker(markerOptions);

      // Allow each marker to have an info window listener
      google.maps.event.addListener(_markerData[i].marker, "click", function (marker, i) {
        return function () {
          var getDirectionsLink = "";

          // only show get deirections link if in if validDirectionSelectTypes array
          if (validDirectionSelectTypes.indexOf(_markerData[i].type) > -1) {
            //getDirectionsLink = '<p><a href="#" class="c-link" onclick="UoS_GettingAround.setDirectionsFromLink(event)" data-name="' + _markerData[i].coords.replace(/\s/gi, "") + '">Get directions</a></p>';
            getDirectionsLink = "";
          }
          infowindow.setContent("<p><strong>" + _markerData[i].name + "</strong></p>" + (_markerData[i].description ? "<p>" + _markerData[i].description + "</p>" : "") + '<p><span class="' + _markerData[i].usoIconClassName + '"></span> ' + _markerData[i].type + "</strong></p>" + getDirectionsLink);
          infowindow.open(_map, marker);
        };
      }(_markerData[i].marker, i));

      // extend the bounds to include each marker's position. If zoom and
      // center have been given, we should ignore this later

      bounds.extend(_markerData[i].marker.position);
    }

    // only if center and zoom have been given, use options - otherwise, auto bounds
    if (_options.center && _options.zoom) {
      // center and zoom zccording to options
      _map.setCenter(new google.maps.LatLng(_options.center.lat, _options.center.lng));
      _map.setZoom(_options.zoom);
    } else {
      //now fit the map to the newly inclusive bounds
      _map.fitBounds(bounds);
    }

    // format data into groups, we'll use this groupsData in the select and checkboxes
    var groupsData = {};
    var suggestionsData = [];
    for (var i = 0; i < _markerData.length; i++) {
      // create empty array for this group if not yet set
      if (!groupsData[_markerData[i].type]) groupsData[_markerData[i].type] = [];

      // push this location into that group
      groupsData[_markerData[i].type].push(_markerData[i]);

      // suggestions are the "What are you looking for" dataList
      suggestionsData.push(_markerData[i].name);
    }

    // populate select boxes with locations, and checkboxes
    var start, $end, $optgroup, group, location, filtersEl, filtersLabel;
    var html = [];
    //	html.push('<div style="width: 100%; float: left;">');
    //	html.push(' <label style="font-weight: bold;" for="filter__all">');
    //	html.push('    <input id="filter__all" type="checkbox" class="filter" name="all"> Show/ Hide All');
    //	html.push("  </label>");
    //	html.push("</div>");

    start = document.getElementById("getting-around-directions__origin");
    end = document.getElementById("getting-around-directions__destination");
    groupselect = document.createElement("select");
    filtersEl = document.getElementById("filters");
    filtersLabel = document.createElement("label");
    filtersLabel.textContent = "Mark locations on the map:";
    filtersLabel.appendChild(groupselect);
    filtersEl.appendChild(filtersLabel);
    for (var name in groupsData) {
      group = groupsData[name];
      // select boxes for 'Get directions' tab
      if (validDirectionSelectTypes.indexOf(name) > -1) {
        //$optgroup = ('<optgroup label="' + name + '">');
        optgroup = document.createElement("optgroup");
        optgroup.label = name;
        //        for (var j = 0; j < group.length; j++) {
        groupsData[name].forEach(function (location) {
          var option = document.createElement("option");
          option.value = location.coords.replace(/\s/gi, "");
          option.textContent = location.name;
          optgroup.appendChild(option);
        });
        start.appendChild(optgroup);
        end.appendChild(optgroup.cloneNode(true));
      }

      //		html.push('<div style="width: 50%; float: left;">');
      //		html.push('  <label>'); // for="filter__' + name.toLowerCase() + '"
      //		html.push('    <input class="filter" type="checkbox" name="' + name + '"> ' + name); //id="filter__' + name.toLowerCase() + '"
      //		html.push("  </label>");
      //		html.push("</div>");
      var groupoption = document.createElement("option");
      //groupoption.value = name;
      groupoption.textContent = name;
      groupselect.appendChild(groupoption);
    }

    // Nodes
    var suggestDataList = stir.node("#getting-around__suggestions");
    var suggestInput = stir.node("#getting-around__suggestions-input");

    // populate the suggestions datalist
    suggestionsData.sort();
    for (var i = 0; i < suggestionsData.length; i++) {
      suggestDataList.append('<option value="' + suggestionsData[i] + '">');
    }

    // add behaviour to suggestions to center and show info
    suggestInput.addEventListener("change", function (e) {
      // get the desired marker by value (e.g. "Sports Centre")
      var marker;
      for (var i = 0; i < _markerData.length; i++) {
        if (_markerData[i].name === this.value) {
          marker = _markerData[i];
        }
      }

      // open infowindow
      if (marker) {
        var coords = _getPosObject(marker.coords);
        _map.setCenter(new google.maps.LatLng(coords["lat"], coords["lng"]));
        _map.setZoom(17); //

        infowindow.setContent("<p><strong>" + marker.name + "</strong></p>" + (marker.description ? "<p>" + marker.description + "</p>" : ""));
        infowindow.open(_map, marker.marker);
      }

      // clear the input coz it filters the drop down options
      //("#getting-around__suggestions-input").val("");
      suggestInput.value = "";
    });

    //    ("#filters").html(html.join(""));

    var travelModeInputs = stir.nodes("input[name='travelmode']");

    // set travel mode
    //("input[name='travelmode'][value='" + _options.travelMode.toLowerCase() + "']").attr("checked", true);

    //("input[name='travelmode']").on("click", function (e) {
    var travelInputHandler = function travelInputHandler(element) {
      _options.travelMode = element.value.toUpperCase();
      _calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    travelModeInputs.forEach(travelInputHandler);

    // set event handlers for select boxes
    var onChangeHandler = function onChangeHandler() {
      _calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById("getting-around-directions__origin").addEventListener("change", onChangeHandler);
    document.getElementById("getting-around-directions__destination").addEventListener("change", onChangeHandler);

    // set event handlers for filters
    //    ("#filters input[type='checkbox']").on("change", function () {
    //      _filterMarkers(_map); // will re-render the show/hide
    //    });

    filtersEl.addEventListener("change", _filterMarkers);

    // ("#filter__all").on("change", function () {
    //   var items = document.getElementsByClassName("filter");
    //   var x = document.getElementById("filter__all").checked;
    //   if (x == true) {
    //     for (var i = 0; i < items.length; i++) {
    //       if (items[i].type == "checkbox") {
    //         items[i].checked = true;
    //       }
    //     }
    //     _filterMarkers();
    //   } else if (x == false) {
    //     for (var i = 0; i < items.length; i++) {
    //       if (items[i].type == "checkbox") {
    //         items[i].checked = false;
    //       }
    //     }
    //     _filterMarkers();
    //   }
    // });

    var items = document.getElementsByClassName("filter");
    for (var i = 0; i < items.length; i++) {
      if (items[i].type === "checkbox" && items[i].name === "Buildings") {
        items[i].checked = true;
      }
    }

    // apply filters just so they match the defaults
    _filterMarkers();

    // });
  }

  function _setDirectionsFromLink(e) {
    //var link = e.target;

    // pre-select the <select>
    //("#getting-around-directions__destination").val(link.getAttribute("data-name"));

    // reset the start
    //("#getting-around-directions__origin option").eq(0).prop("selected", true);

    // open tab
    //("#getting-around-tabs__directions-label").trigger("click");
    //stir.node("#tab_1_2").click();

    e.preventDefault();
    return false;
  }
  function _setGoogleMapsLink() {
    /* var origin      = ("#getting-around-directions__origin").val();
    var destination = ("#getting-around-directions__destination").val();
    var travelmode  = ("input[name='travelmode']:checked").val();
    if (origin && destination && travelmode) {
    var gmUrl = "https://www.google.com/maps/dir/?api=1&origin="+origin+"&destination="+destination+"&travelmode="+travelmode.toLowerCase();
    //("#getting-around__google-maps-link").attr("href", gmUrl).show();
    //console.info({gmUrl: gmUrl});
    } */
    /* else {
    ("#getting-around__google-maps-link").hide();
    } */
  }

  // PRIVATE METHODS

  /**
   * When this function is called it will loop through the marker
   * and show/hide that marker whether or not the checkbox is checked
   */

  var _showMarkerIfLocationTypeIsEnabled = function _showMarkerIfLocationTypeIsEnabled(location) {
    var type = groupselect.options[groupselect.selectedIndex].value;
    location.marker.setMap(location.type === type ? _map : null);
  };
  var _filterMarkers = function _filterMarkers() {
    return _markerData.forEach(_showMarkerIfLocationTypeIsEnabled);
  };
  // loop through each marker
  //	var isValid;
  //	for (var i = 0; i < _markerData.length; i++) {
  //		isValid = ("#filters input[name='" + _markerData[i].type + "']").is(":checked");
  //		_markerData[i].marker.setMap(isValid ? _map : null);
  //	}

  /**
   * a helper function that will convert a csv string of coords
   * (e.g. 123.2,-3.4) to and object of lat/lng
   */
  function _getPosObject(coords) {
    return {
      lat: parseFloat(coords.split(",")[0]),
      lng: parseFloat(coords.split(",")[1])
    };
  }
  function _calculateAndDisplayRoute(directionsService, directionsDisplay) {
    //var origin = ("#getting-around-directions__origin").find(":selected").data("latlng"),
    // destination = ("#getting-around-directions__destination").find(":selected").data("latlng");

    //var origin = ("#getting-around-directions__origin").val();
    var originNode = stir.node("#getting-around-directions__origin");
    var origin = originNode.options[originNode.selectedIndex].value;

    //var destination = ("#getting-around-directions__destination").val();
    var destinationNode = stir.node("#getting-around-directions__destination");
    var destination = destinationNode.options[destinationNode.selectedIndex].value;

    //_setGoogleMapsLink();

    // only search if we have both
    if (!origin || !destination) return;

    // don't search if origin and destination are the same
    if (origin === destination) return;

    // hide the infowindow if it's open
    infowindow.close();
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: _options.travelMode
    }, function (response, status) {
      if (status === "OK") {
        directionsDisplay.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    });
  }
  return {
    initMap: _initMap,
    // setCurrentLocation: _setCurrentLocation,
    setDirectionsFromLink: _setDirectionsFromLink,
    setGoogleMapsLink: _setGoogleMapsLink
  };
}();