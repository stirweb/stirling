
/**
 * Module for loading course modules
 * @author Martyn Bissett <martyn.bissett1@stir.ac.uk>
 * @author Robert Morrison <r.w.morrison@stir.ac.uk>
 */

var StirUniModules = (function () {

	// These can be changed to https://portalqa or https://portal.dev for testing.
	var calendarUrl = "https://portal.stir.ac.uk/servlet/CalendarServlet";
	var ssocUrl = "https://portal.stir.ac.uk/api/ssoc";
	var ver,debug;

	var _options = {};

	// need to remember these for callbacks
	var _routeCodes = [];
	var _selectedRoute = '';
	var _courseType = ''; // e.g. UG/PG
	var _semestersPerYear = 2;

	var _cssClasses = {
		truncateModuleCollection:'c-course-modules__accordion-content--hide-rows'
	};
	
	var _semester = {
		getYear: function(semesterCode) {
			return Math.ceil(semesterCode / _semestersPerYear);
		},
		getSemesterYearIndex: function(semesterCode) {
			var mod = semesterCode%_semestersPerYear;
			return mod===0?_semestersPerYear:mod;
		}
	}

	var _DOM = (function () {

		var els = {};
		var ids = ['routes-list', 'options-list', 'initial-text', 'pdttRept', 'accordion'];
		var prefix = 'course-modules-container__';
		for(var i=0; i<ids.length; i++) {
			els[ids[i]] = document.createElement('div');
			els[ids[i]].id = prefix + ids[i];
		}
		return els;
	})();

	var _cache = {};
	var _url = ""; // we use this so we can store the data in cache

	var _loading = {
		el: _createLoaderHTML(),  	// HTML element to show loading activity
		queue: 0					// number of things currently loading
	};
	
	// // this is a cache of all modules loaded so that we can get any info on it
	// // (e.g. description) when we require (e.g. click on module)
	// var _modulesCache = {};

	var _insertCache = function(id, data) {
		_cache[id] = JSON.parse(JSON.stringify(data));
	}

	var _getCached = function(id) {
		return _cache[id];
	}

	function _createLoaderHTML() {
		var element = document.createElement("div");
		var innerHTML = [
			"\t" + '<div class="loader"></div>',
			"\t" + '<span class="show-for-sr">Loading modules...</span>'
		];
		element.setAttribute("id", "course-modules-container__loading");
		element.classList.add("course-modules__loading");
		element.insertAdjacentHTML("afterbegin", innerHTML.join("\n"));
		return element;
	}

	function _init(options) {
		// get, and set _options
		debug = UoS_env.name !== 'prod';
		var options = _getOptions(options);
		var container = document.querySelector(options.container);
		if(container) {
			for(var id in _DOM) {
				container.insertAdjacentElement("beforeend", _DOM[id]);
			}
			container.insertAdjacentElement("beforeend", _loading.el);
		}
		debug && console.info("[StirUniModules] calendarUrl: " + calendarUrl);
	}

	function _getVersions(callback) {
		
		$.ajax({
			"url": calendarUrl + '?opt=version-menu&callback=StirUniModules.setVersion',
			dataType: "script",
			cache: true,
			success: callback || new Function()
			//,error: function() {}
		});
	}

	function _setVersion(data) {
		if(data && data[0] && data[0].versionId) {
			ver = '&ver=' + data[0].versionId.toString();
			debug && console.info("[StirUniModules] Version: " + data[0].versionId.toString());
		}
	}

	/**
	 * We first load all routes from the big list of routes. We may have multiple
	 * routes so we
	 */
	function _loadCourseRoutes(routeCodesCSV, courseType, options) {
		// we may encounter a csv list of routes and
		_routeCodes = routeCodesCSV.replace(/\s/g, '').split(",");
		_courseType = courseType;

		// get, and set _options
		options = _getOptions(options);

		// if there is only one route, just jump into it (no need to present one option to user)
		if(_routeCodes.length === 1 && _routeCodes[0]) {
			_loadCourseOptions(_routeCodes[0], courseType, options);
		} else {
			// we need to fetch all routes now so we can get the names to display
			// options

			var urls = {
				"UG": calendarUrl + "?opt=menu&callback=StirUniModules.showCourseRoutes" + (ver?ver:''),
				"PG": calendarUrl + "?opt=pgmenu&ct=PG&callback=StirUniModules.showCourseRoutes" + (ver?ver:'')
			}

			// opted not to store this in cache because it should only load once per page load
			$.ajax({
				"url": urls[courseType],
				dataType: "script",
				cache: true,
				success: function(data) {
					//uses JSONp callback insted; StirUniModules.showCourseRoutes()
				},
				error: function() {
					_hideLoading("_loadCourseRoutes")
					_showCourseRoutesError({routeCodes:_routeCodes})
				}
			});
		}
	}

	
	/* var _initialText = (function() {
		
		function _reset() {
			this.innerHTML = '';
		}
		return {
			reset: _reset.bind(_DOM['initial-text'])
		};
		
	})(); */
	
	function _reset(all) {
		if(all) {
			_DOM['options-list'].innerHTML = '';
		}
		_DOM['initial-text'].innerHTML = '';
		_DOM['pdttRept'].innerHTML = '';
		while(_DOM['accordion'].firstChild) { _DOM['accordion'].removeChild(_DOM['accordion'].firstChild); }
	}
	/**
	 * Algorithm borrowed from the Portal's academic-calendar.js
	 */
	function _moduleSort(a, b) {
		if (a.collectionStatusCode === b.collectionStatusCode) {
			return 0; //console.info("Same:");
		}
		if((a.collectionStatusCode.indexOf("E") >= 0 ) && (b.collectionStatusCode.indexOf("E") >= 0) ) {
			return 0; //console.info("Unequal but equivalent")
		}
		if(a.collectionStatusCode.indexOf("E") >= 0){
			return 1; //console.info("Sort A down");
		}
		if(b.collectionStatusCode.indexOf("E") >= 0){
			return -1; //console.info("Sort A up");
		}

		return 0; // not the same and neither is optional
	}

	/**
	 * 
	 * @param {array} data an array of all the valid route codes 
	 */
	function _showCourseRoutes(data) {

		// get, and set _options
		var options    = _getOptions(),
			routesData = [],			// will contain the subset of routes we need
			pointer    = 0;

		if(options.show_all_routes) return _showCourseRoutesRenderer(data); // option to just show all available routes

		for (var i=0; i<data.length; i++) {
			pointer = _routeCodes.indexOf(data[i]["rouCode"]);
			if(pointer >= 0) {
				routesData[pointer] = data[i]
			}
		}

		
		if(routesData.length>0){

			_showCourseRoutesRenderer(routesData);

			if (options.autoload_first_route) {
				_loadCourseOptions(routesData[0].rouCode, _courseType)
			} // else loadCourseOptions will just be triggered by the user 
		}
	}

	function _showCourseRoutesError(data) {
		_showCourseRoutesErrorRenderer(data);
	}

	/**
	 * Options are course options e.g. Part time/ full time
	 */
	function _loadCourseOptions(roucode, courseType, options) {

		// _coursecode = coursecode;
		_courseType = courseType;
		_selectedRoute = roucode;
		_setSemestersPerYear()

		// get, and set _options
		options = _getOptions(options);

		_showLoading("_loadCourseOptions");

		var urls = {

			"UG": calendarUrl + "?opt=ug-opts&rouCode=" + roucode + "&ct=UG&callback=StirUniModules.showCourseOptions" + (ver?ver:''),
			"PG": calendarUrl + "?opt=pg-opts&rouCode=" + roucode + "&ct=PG&callback=StirUniModules.showCourseOptions" + (ver?ver:'')
		}
		_url = urls[courseType];

		var cached = _getCached(_url);
		if (options.use_cache && cached !== undefined) {

			_hideLoading("_loadCourseOptions [CACHE]");
			_showCourseOptions(cached);

		} else {
			$.ajax({
				"url": _url,
				dataType: "script",
				cache: true,
				success: function() {
					_hideLoading("_loadCourseOptions [OK]");
				},
				error: function() {
					_hideLoading("_loadCourseOptions [ERROR]");
					_showCourseOptionsError({rouCode:roucode});
				}
			});
		}

	}

	/**
	 * this fixes a bug identified in the data feed
	 * @param {Array} occurrence the occurrence information from the Degree Programme Tables JSON data
	 */
	function __courseOptionFilter(occurrence) {
		var occ = occurrence[2], season = occurrence[3];
		// if the code begins with "F" then the season ought NOT to be Autumn: 
		if(occ.charAt(0)==='F'&&season==="Autumn") return false;
		// otherwise consider it valid (i.e. return true)
		return true;
		// TODO? Some other mappings we might want to test for:
		// A=August, F=Jan, G=Feb
	}

	function _validateCourseOptions(data) {
		return data.filter( __courseOptionFilter );
	}

	function _showCourseOptions(data) {

		// get, and set _options
		options = _getOptions();

		// validate the data before caching and/or using it
		data = _validateCourseOptions(data);

		// cache data
		_insertCache(_url, data);

		//if there is only one route, just jump into it (no need to present one option to user)
		if(data.length === 1){
			var opt = data.pop(); // TODO move this
			_loadCourseModules(_selectedRoute, opt[0], opt[2]);
		} else {
			_showCourseOptionsRenderer(data);

			if (options.autoload_first_option) {
				var opt = data.shift(); // TODO move this
				_loadCourseModules(_selectedRoute, opt[0], opt[2]);
			}
		}
	}

	function _showCourseOptionsError(data) {
		_showCourseOptionsErrorRenderer(data);
	}

	function _loadCourseModules(roucode, moa, occ) {
		// get, and set _options
		options = _getOptions();

		_showLoading("_loadCourseModules");

		var courseTypeQueries = {
			"UG": "opt=runcode&moa="+moa+"&occ="+occ+"&ct=UG",
			"PG": "opt=runpgcode&moa="+moa+"&occ="+occ+"&ct=PG"
		}

		_url = calendarUrl + "?"+ courseTypeQueries[_courseType] +"&rouCode="+roucode+"&callback=StirUniModules.showCourseModules"  + (ver?ver:'');

		var cached = _getCached(_url);
		if (options.use_cache && cached !== undefined) {
			_showCourseModules(cached);
			_hideLoading("_loadCourseModules [CACHE]");
			return;
		}
		$.ajax({
			"url": _url,
			dataType: "script",
			cache: true,
			success: function(data) {
				_hideLoading("_loadCourseModules [OK]")
			},
			error: function() {
				_showCourseModulesError();
				_hideLoading("_loadCourseModules [ERROR]")
			}
		});
	}

	function _showCourseModules(data) {
		_insertCache(_url, data);
		_showCourseModulesRenderer(data)
	}

	function _showCourseModulesError(data) {
		_showModuleErrorRenderer(data);
	}

	function _loadModule(moduleCode, semesterCode, occurrence, yearSession) {
		// get, and set _options
		options = _getOptions();
		_url = ssocUrl + "/module/get/"+moduleCode+"/"+yearSession+"/"+semesterCode+"/"+occurrence+"/jsonp?status=complete&client=externalweb&callback=StirUniModules.showModule";

		var cached = _getCached(_url);
		if (options.use_cache && cached !== undefined) {
			return _showModule(cached);
		}

		$.ajax({
			"url": _url,
			dataType: "script",
			cache: true,
			success: function(data) {
				// uses JSONp callback; StirUniModules.showModule()
			},
			error: function() {
				_showModuleError({"details": [moduleCode, semesterCode, occurrence, yearSession]});
			}
		});

	}

	function _showModule(data) {
		_insertCache(_url, data);
		_showModuleRenderer(data);
	}

	function _showModuleError(data) {
		_showModuleErrorRenderer(data);
	}

	function _showLoading(label) {
		_showLoadingRenderer(label);
	}

	function _hideLoading(label) {
		_hideLoadingRenderer(label);
	}

	function _getDPTModuleLink(modCode) {
		return 'https://portal.stir.ac.uk/calendar/calendar' + ( StirUniModules.getCourseType() == "PG" ? "-pg" : "") + '.jsp?modCode=' + modCode;
	}
	function _getDPTCourseLink(rouCode) {
		return 'https://portal.stir.ac.uk/calendar/calendar' + ( StirUniModules.getCourseType() == "PG" ? "-pg" : "") + '.jsp'+(rouCode?'?rouCode='+rouCode:'');
	}

	var _showCourseRoutesRenderer = function(routesData) {
		// get, and set _options
		options = _getOptions();

		//var $optslist = $(options.container);
		var html = [];

		html.push('<p>Please select your preferred route from the options below to list modules for this course:</p>');
		html.push('<select>');
		for (var i in routesData) {
			html.push('<option data-route-code="' + routesData[i].rouCode + '" data-course-type="' + _courseType + '">' + routesData[i].rouName + '</option>');
		}
		html.push('</select>');

		//$optslist.prepend( html.join("") );
		options.container.insertAdjacentHTML("afterbegin", html.join(""))
	};

	var _showCourseRoutesErrorRenderer = function(data) {
		console.error("There was a problem loading course routes data", data)
	};

	var _showCourseOptionsRenderer = function(data) {
		options = _getOptions();
		//var $optslist = $(_getOptions()["container"]);
		var html = [];

		html.push('<p>There are '+ data.length +' routes for this course:</p>');
		html.push('<ul>');
		for (var x in data) {
			html.push('<li><a href="#" data-roucode="' + StirUniModules.getSelectedRoute() + '" data-moa="'+data[x][0]+'" data-occ="'+data[x][2]+'" data-function="getmods">Starting '+data[x][3]+', '+data[x][4]+' '+data[x][1]+'</a></li>');
		}
		html.push('</ul>');

		//$optslist.html( html.join("") );
		options.container && (options.container.innerHTML = html.join(""));

	};

	var _showCourseOptionsErrorRenderer = function(data) {
		console.error("There was a problem loading course options data", data)
	};

	var _showCourseModulesRenderer = function(semestersData) {
		console.error("showCourseModulesRenderer() is not defined");
	};

	var _showCourseModulesErrorRenderer = function(data) {
		console.error("There was a problem loading modules data", data);
	};

	var _showModuleRenderer = function(data) {
		console.error("showModuleRenderer() is not defined")
	};

	var _showModuleErrorRenderer = function(data) {
		console.error("showModuleErrorRenderer() is not defined")
	};

	var _getSemestersPerYear = function() {
		return _semestersPerYear;
	}

	var _getSelectedRoute = function() {
		return _selectedRoute;
	}

	var _getCourseType = function() {
		return _courseType;
	}

	function _getOption(key) {
		return _options[key];
	}

	function _getOptions(options) {

		// options arg may come with {container:...}, but it shouldn't be null/undefined
		if (!options) options = {};

		// set defaults, get _options, and apply any new options
		_options = stir.Object.extend({ //$.extend(true, {

			// this will tell the page to auto load the first modules on load
			autoload_first_route: false,

			// this will tell the page to auto load the first modules on load
			autoload_first_option: false,

			// tell the page to open the first accordion (i.e. year one, semester one)
			auto_expand_first_accordion: true,

			// use modules lib build in cache
			use_cache: true,

			// if collection headers and notes are the same don't display same again
			collapse_collection_headers: false,

			// do not render modules that are unavailable
			hide_modules_if_not_available: false,

		}, _options, options);

		return _options;
	}

	function _setOptionShowAllRoutes(state) {
		_options.show_all_routes = state ? true : false;
	}

	function _setSemestersPerYear() {
		if (_selectedRoute.substring(0, 9) === "UXX28-CWP" || _selectedRoute.substring(0, 9) === "UXX19-EYP" || _selectedRoute === "UHC12-TRNINT") {
			_semestersPerYear = 3;
		} else {
			_semestersPerYear = 2;
		}
	}

	function _setCalendarUrl(url) {
		calendarUrl = url;
	}

	function _setShowRoutesRenderer(renderer) {
		_showCourseRoutesRenderer = renderer;
	}

	function _setShowRoutesErrorRenderer(renderer) {
		_showCourseRoutesErrorRenderer = renderer;
	}

	function _setShowOptionsRenderer(renderer) {
		_showCourseOptionsRenderer = renderer;
	}

	function _setShowOptionsErrorRenderer(renderer) {
		_showCourseOptionsErrorRenderer = renderer;
	}

	function _setShowModulesRenderer(renderer) {
		_showCourseModulesRenderer = renderer;
	}

	function _setShowModulesErrorRenderer(renderer) {
		_showCourseModulesErrorRenderer = renderer;
	}

	function _setShowModuleRenderer(renderer) {
		_showModuleRenderer = renderer;
	}

	function _setShowModuleErrorRenderer(renderer) {
		_showModuleErrorRenderer = renderer;
	}

	function _setShowLoadingRenderer(renderer) {
		_showLoadingRenderer = renderer;
	}

	function _setHideLoadingRenderer(renderer) {
		_hideLoadingRenderer = renderer;
	}

	var _showLoadingRenderer = function() {
		console.error("Show loading renderer not defined");
	}

	var _hideLoadingRenderer = function() {
		console.error("Hide loading renderer not defined");
	}


	return {

		init: _init,
		loading: _loading,
		moduleSort: _moduleSort,
		reset: _reset,
		DOM: _DOM,

		/**
		 * Routes can refer to a single course with a single ucas code, and a single
		 * course module list can be pulled. other cases may require multiple routes
		 * per course page. For example, Religion course page is only combinations and
		 * has multiple routes (e..g Religion and French, Religion and Spanish, etc)
		 */
		loadCourseRoutes: _loadCourseRoutes,
		showCourseRoutes: _showCourseRoutes,

		/**
		 * Options can be part time/ full time
		 */
		loadCourseOptions: _loadCourseOptions,
		showCourseOptions: _showCourseOptions,

		/**
		 * This will load all the modules for a course
		 */
		loadCourseModules: _loadCourseModules,
		showCourseModules: _showCourseModules,

		/**
		 * Module info modal popup
		 */
		loadModule: _loadModule,
		showModule: _showModule,

		showLoading: _showLoading,
		hideLoading: _hideLoading,

		// accessors
		setCalendarUrl:   _setCalendarUrl,
		getSelectedRoute: _getSelectedRoute,
		getOption:		  _getOption,
		getOptions:		  _getOptions,
		getCourseType:    _getCourseType,
		getDPTModuleLink: _getDPTModuleLink,
		getDPTCourseLink: _getDPTCourseLink,
		setOptionShowAllRoutes: _setOptionShowAllRoutes,
		getVersions:_getVersions,
		setVersion:_setVersion,
		

		// set renderers
		setShowRoutesRenderer: _setShowRoutesRenderer,
		setShowRoutesErrorRenderer: _setShowRoutesErrorRenderer,

		setShowOptionsRenderer: _setShowOptionsRenderer,
		setShowOptionsErrorRenderer: _setShowOptionsErrorRenderer,

		setShowModulesRenderer: _setShowModulesRenderer,
		setShowModulesErrorRenderer: _setShowModulesErrorRenderer,

		setShowModuleRenderer: _setShowModuleRenderer,
		setShowModuleErrorRenderer: _setShowModuleErrorRenderer,

		setShowLoadingRenderer: _setShowLoadingRenderer,
		setHideLoadingRenderer: _setHideLoadingRenderer,
		// setShowErrorRenderer: _setShowErrorRenderer // TODO have an error handler for each
		semester: _semester,
		css: _cssClasses
	};
}());

/**
 * Country specific entry reqs select box
 * rk8 October 2020
 */

var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};
stir.t4Globals.countries = stir.t4Globals.countries || [];

(function (scope) {

    if (!scope) return;

    // Vars
    var defaultCountry = 'United Kingdom';

    // UG or PG json in course page footer - also a full feed availabe if required
    var countryData = stir.t4Globals.countries;
    var metas = document.getElementsByTagName('meta');
    var faculty = '';

    // html element panel IDs
    var ugPanel1 = 'panelYear1'; // UG
    var ugPanel2 = "panelYear2"; // UG
    var engReqs = 'panelEngReqs'; // PG
    var pgReqs = 'panelEntryReqs'; // PG

    // html elements
    var scotQuals = document.getElementById('accordionOtherScotQuals');
    var otherQuals = document.getElementById('accordionOtherQuals');

    /*
     * INIT
     */
    var select = scope;
    var level = select.dataset.level || '';
    if (metas["stir.course.faculty"])
        faculty = metas["stir.course.faculty"].content;

    updateHTMLSelect();
    cacheDefaultData();

    /*
     * Update the select box with the full list of countries
     */
    function updateHTMLSelect() {
        var html = [];
        html.push('<option value="' + defaultCountry + '">' + defaultCountry + '</option>');
        for (var index in countryData) {
            if (countryData[index].name)
                html.push('<option value="' + countryData[index].name + '">' + countryData[index].name + '</option>');
        }
        select.innerHTML = html.join("\n");
    }

    /*
     * Extract the content from the correct DOM element
     */
    function getDefaultVal(el) {
        var myEl = document.getElementById(el)
        if (myEl) return myEl.innerHTML;
        return '';
    }

    /*
     * Keep a copy of the UK data in case its reselected 
     * Store it the current country object for ease
     */
    function cacheDefaultData() {
        var data = {
            "name": defaultCountry,
            "ugEntryYearOne": getDefaultVal(ugPanel1),
            "ugEntryYearTwo": getDefaultVal(ugPanel2),
            "englishRequirements": getDefaultVal(engReqs),
            "pgRequirements": getDefaultVal(pgReqs),
            "pgRequirementsSMS": ""
        }
        countryData.push(data);
    }

    /*
     * Fire out the required data to the page
     */
    function outputData(selCountry) {
        for (var index in countryData) {
            var txt = document.createElement("textarea");
            if (countryData[index].name === selCountry) {
                // Undergrad
                if (level === 'ug') {
                    // Year 1
                    var ugy1 = document.getElementById(ugPanel1);
                    if (ugy1) {
                        txt.innerHTML = countryData[index].ugEntryYearOne;
                        ugy1.innerHTML = txt.value;
                    }
                    // Year 2
                    var ugy2 = document.getElementById(ugPanel2);
                    if (ugy2) {
                        txt.innerHTML = countryData[index].ugEntryYearTwo;
                        ugy2.innerHTML = txt.value;
                        ugy2.parentElement.classList.remove('hide');
                        // show it if there is content
                        if ((txt.value.trim()).length < 1)
                            ugy2.parentElement.classList.add('hide');
                    }
                }
                // Postgrad
                if (level === 'pg') {
                    var pgr = document.getElementById(pgReqs);
                    if (pgr) {
                        txt.innerHTML = countryData[index].pgRequirements;
                        // China Mgt School override hack 
                        if (countryData[index].name === "China" && faculty === "Stirling Management School")
                            txt.innerHTML = countryData[index].pgRequirementsSMS;
                        pgr.innerHTML = txt.value;
                    }
                }
            }
        }
    }

    /*
     * New country selected
     */
    select.onchange = function (e) {
        var selCountry = this.options[this.selectedIndex].value;
        // hide / show content thats not relavent
        if (selCountry !== defaultCountry) {
            if (scotQuals)
                scotQuals.closest(".stir-accordion").classList.add('hide');
            if (otherQuals)
                otherQuals.closest(".stir-accordion").classList.add('hide');
        } else {
            if (scotQuals)
                scotQuals.closest(".stir-accordion").classList.remove('hide');
            if (otherQuals)
                otherQuals.closest(".stir-accordion").classList.remove('hide');
        }
        outputData(selCountry);
        e.preventDefault();
    };

})(document.querySelector("select[name='course-countries-select']"));
var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};



stir.components = stir.components || {};
/* stir.components.html = stir.components.html || {}; */
stir.components.unistats = stir.components.unistats || {};
stir.components.discoveruni = stir.components.discoveruni || {};

stir.components.unistats.widget = function (options) {
    var widget = document.createElement('iframe');
    widget.src = 'https://widget.unistats.ac.uk/Widget/10007804/' + kiscode + '/responsive/small/en-GB/' + kismode;
    widget.setAttribute('title', "Unistats widget for " + kiscode + " (" + kismode + ")");
    widget.classList.add("c-course-unistats-widget");
    return widget;
}

stir.components.id = (function () {
    var _universalId = 0;

    function _getNewId() {
        return ++_universalId;
    }
    return {
        getNewId: _getNewId
    }
})();

stir.components.discoveruni.widget = function (options) {
    var widget = document.createElement('div');
    //add this class if we want DiscoverUniWidget to trigger automatically:
    //widget.classList.add('kis-widget');
    widget.setAttribute('data-institution', 10007804);
    widget.setAttribute('data-course', options.kiscode);
    widget.setAttribute('data-kismode', options.kismode);
    widget.setAttribute('data-orientation', 'responsive');
    widget.setAttribute('data-language', 'en-GB');
    return widget;
};
/* stir.components.html.details = function (options) {
    var widget = document.createElement('details');
    options.summary && (widget.innerHTML = '<summary>' + options.summary + '</summary>');
    return widget;
}; */

stir.components.accordion = function (options) {

    var id = stir.components.id.getNewId();
    var widget = document.createElement('div');
    var label = document.createElement('h2');
    var anchor = document.createElement('a');
    var content = document.createElement('div');

    if (options.id) widget.setAttribute('id', options.id);

    widget.classList.add('stir-accordion');

    anchor.innerText = options.title || "Show more";
    anchor.id = 'accordion-js-' + id;
    anchor.setAttribute('class', 'stir-accordion--btn')
    anchor.setAttribute('aria-controls', 'panel-js-' + id)

    content.id = 'panel-js-' + id;
    content.setAttribute('data-tab-content', '');
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', 'accordion-js-' + id);
    content.setAttribute('class', 'stir__slideup stir__slidedown');

    label.appendChild(anchor);
    widget.appendChild(label);
    widget.appendChild(content);

    return widget;
};

stir.renderKISWidgets = function (kiscodes, kiswidget) {
    var debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
    var kiswidget = kiswidget || document.querySelector('#kis-widget');
    var frag = document.createDocumentFragment();
    var useUnistats = false;
    var pattern = /^U\d{2}-[A-Z]{2,3}([A-Z]{3})?$/;
    var widgets = [];

    if (debug) {
        console.info("[Discover Uni] kiscodes:", kiscodes, kiscodes.length);
        console.info("[Discover Uni] kiswidget:", kiswidget);
    }

    if (kiswidget && kiscodes) {
        kiswidget.setAttribute('data-initialised', true);
        kiswidget.innerHTML = ''; // remove loading spinner
        kiswidget.classList.remove('grid-x');

        useUnistats = kiswidget.hasAttribute('data-unistats');

        for (var i = 0; i < kiscodes.length; i++) {
            var kiscode = kiscodes[i].split(':')[0].trim();
            var kismode = kiscodes[i].split(':')[1] ? 'parttime' : 'fulltime';
            if (kiscode === "") {
                debug && console.info("[Discover Uni] Empty kiscode", i);
            } else if (!pattern.test(kiscode)) {
                console.error('Invalid KIS code: ' + kiscode);
            } else {
                var widget;
                if (useUnistats) {
                    widget = stir.components.unistats.widget({
                        kiscode: kiscode,
                        kismode: kismode
                    });
                } else {
                    widget = stir.components.discoveruni.widget({
                        kiscode: kiscode,
                        kismode: kismode
                    });
                }
                widgets.push(widget);
            }

            widget && frag.appendChild(widget);

        }

        kiswidget.appendChild(frag);

        (function (d) {
            if (useUnistats || d.getElementById('unistats-widget-script')) {
                return;
            }
            var widgetScript = d.createElement('script');

            widgetScript.id = 'unistats-widget-script';
            widgetScript.src = 'https://discoveruni.gov.uk/widget/embed-script/';
            widgetScript.addEventListener("load", function (event) {
                if (widgets.length > 1 && window.DiscoverUniWidget) {

                    var widgetStylesAdded = false;
                    var widgetsReady = 0;
                    var contentInsertionNode = new stir.components.accordion({
                        id: 'morewidgets',
                        title: "View more Discover Uni information"
                    });

                    kiswidget.insertAdjacentElement("afterend", contentInsertionNode);
                    new stir.accord(contentInsertionNode);
                    contentInsertionNode = contentInsertionNode.querySelector('[data-tab-content]');

                    // patch DiscoverUniWidget's addCss() function so it only runs once per page (not once per widget!)
                    DiscoverUniWidget.prototype._addCss = DiscoverUniWidget.prototype.addCss;
                    DiscoverUniWidget.prototype.addCss = function () {
                        widgetStylesAdded || this._addCss(), widgetStylesAdded = true;
                    };

                    // patch DiscoverUniWidget's renderWidget() function so that we can manipulate
                    // widgets *after* they've been initialised
                    DiscoverUniWidget.prototype._renderWidget = DiscoverUniWidget.prototype.renderWidget;
                    DiscoverUniWidget.prototype.renderWidget = function () {
                        // pass-through call to the original renderWidget function
                        this._renderWidget.apply(this, arguments);

                        // if the widget has no data we'll do nothing further
                        if (this.targetDiv.classList.contains('no-data')) return;

                        // skip the first widget but put the rest into a <details> accordion
                        if (++widgetsReady > 1) {
                            contentInsertionNode.appendChild(this.targetDiv);
                        }
                    };

                    // this replaces (rather than patches) DiscoverUniWidget's init()
                    // which is called as soon as the script is loaded. But since
                    // we've interrupted that, we need to manually initialise the widgets:
                }

                for (var i = 0; i < widgets.length; i++) {
                    widgets[i].classList.add('kis-widget');
                    new DiscoverUniWidget(widgets[i]);
                }
            });

            document.head.appendChild(widgetScript);

        }(document));
    }
};

var KISWidgetCaller = function () {
    return false;
};


/*
 * Clearing
 */
(function () {
    function swapCourseNavForClearingBannerSticky() {
        var clearingBannerTemplate = document.getElementById('clearing-banner-template');
        var courseStickyNav = document.querySelector(".c-course-title-sticky-menu");
        var promoAnchorElement = document.querySelector('.c-course-datasheet');
        if (promoAnchorElement && clearingBannerTemplate && clearingBannerTemplate.innerHTML) {
            promoAnchorElement.insertAdjacentHTML("afterend", clearingBannerTemplate.innerHTML);
            courseStickyNav && courseStickyNav.parentElement.removeChild(courseStickyNav);
        }
    }

    function addCoursePageAdvert(template) {
        var promoAnchorElement = document.querySelector('.c-course-datasheet');
        if (promoAnchorElement && template && template.innerHTML) {
            promoAnchorElement.insertAdjacentHTML("afterend", template.innerHTML);
        }
    }

    function relocateCTA() {
        var callstoact = document.getElementById('course-ctas');
        var whatnext = document.querySelector('.c-whats-next');
        if (callstoact && whatnext) {
            whatnext.insertAdjacentElement("beforebegin", callstoact);
            whatnext.classList.remove('u-margin-top');
            callstoact.classList.add('u-margin-top');
        }
    }

    function unshiftStirTabsOverlap() {
        var tabs = document.getElementById("c-course-tabs");
        if (tabs) {
            tabs.style.top = "-1px";
        }
    }

    if (self.stir && stir.t4Globals && stir.t4Globals.clearing) {

        // If we are in Clearing AND promos may be shown, then swap-out sticky nav:
        if (stir.t4Globals.clearing.open && stir.t4Globals.clearing.showPromos) {
            swapCourseNavForClearingBannerSticky();
            addCoursePageAdvert(document.getElementById("clearing-advert-template"));
            new UoS_StickyWidget(document.querySelector(".u-sticky"));
            relocateCTA(); // During Clearing, shunt normal CTAs to the bottom of the page so they are out of the way.
            unshiftStirTabsOverlap(); // stylistic tab ovelap not compatible with sticky/z-index etc. disable it during clearing.
        }
    }

})();

/*
 * DiscoverUni (Formerly Unistats (formerly KIS))
 */
(function () {
    if (!stir.t4Globals.unistats) return;
    var kisccordion = document.querySelector('.ug-overview-accordion__kis-widget');
    var kiscodes = stir.t4Globals.unistats.split('|').pop().split(",");
    if (kiscodes.length > 0) {
        stir.renderKISWidgets(kiscodes);
        kisccordion && (kisccordion.style.display = 'block');
    }
})();
var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};

/**
 * Fees region (e.g. home/eu) selector
 * @param {*} scope DOM element that wraps the fees information (selector and table, etc).
 */
(function (scope) {

    if (!scope) return;

    var select  = scope.querySelector('select');
    var table   = scope.querySelector('table');
	var remotes = Array.prototype.slice.call(scope.querySelectorAll('[data-action="change-region"]'));
    var region;

    function toggle(flag) {
        if (this.nodeType === 1)
            flag ? this.classList.remove('hide') : this.classList.add('hide');
    }

    function show(el) {
        toggle.call(el, true);
    }

    function hide(el) {
        toggle.call(el, false)
    }

    function hideAll() {
        hide(table);
        getRegionals().forEach(hide); // IE Compatible forEach
    }

    function getRegionals(region) {
        // querySelectorAll returns a NodeList, but IE can't use forEach() on
        // a NodeList directly, so this function converts it to a regular
        // Array, which is more compatible.
        return Array.prototype.slice.call(scope.querySelectorAll('[data-region' + (region ? '="' + region + '"' : '') + ']'));
    }

    function handleChanges() {
        // First, hide all region-specific elements:
        hideAll();
        // Then, only reveal the ones that match the selected region.
        if (region = this.options[this.options.selectedIndex].value) {
            show(table);
            getRegionals(region).forEach(show);
        }
    }

    // Initial state: hide the table and all region-specific elements (until
    // the user has selected a region):
    hideAll();

    // Now listen for the user:
	if(!select.id) select.id = 'change-region';
    select.addEventListener('change', handleChanges);

	// Set up any remote controls. Each `remote` should just be
	// a simple <span> with some text:
	remotes.forEach(function(remote, i) {
		var a = document.createElement('a');						// create a new <a> element
		remote.childNodes && a.appendChild(remote.childNodes[0]);	// move the text node (if it exists) into the link
		remote.appendChild(a);										// then move the <a> into the DOM where the text was
		a.setAttribute("tabindex", "0");							//	
		a.setAttribute("href", "#");								//	required attributes for keyboard a11y
		a.setAttribute("aria-controls", select.id);

		a.addEventListener("click", function(event) {
			select.value = this.parentNode.getAttribute('data-value');
			select.dispatchEvent(new Event("change"));
			event.preventDefault();
			select.focus();
		});
	});

})(document.getElementById("course-fees-information"));


/*
 * Handle fees info coming from a json feed 
 * rk8 Oct 2020
 * NO LONGER IN USE - NOW HANDLED IN T4
(function (scope) {

    if (!scope) return;

    var dataFees = stir.t4Globals.dataFees;

    // Use the other data if its available
    if(stir.t4Globals.dataFeesOther )
        dataFees = stir.t4Globals.dataFeesOther ;

    var tbl = scope;
    var tblRow = tbl.querySelectorAll('[data-region]');
    var cachData = []; // Cached data for use by the EU Row
    
    // loop through the table rows and output the currect data
    Array.prototype.forEach.call(tblRow, function (item) {
        var region = item.dataset.region;
        var tds = tbl.querySelectorAll('[data-region="' + region + '"] td');
        var band = tbl.getAttribute('data-' + region);

        for (var i = 0; i < dataFees.length; i++) {
            if (dataFees[i].region === region && dataFees[i].band === band) {
                tds[0].innerHTML = checkVal(dataFees[i].thisYear);
                tds[1].innerHTML = checkVal(dataFees[i].nextYear);
                // Update the cache for EU 
                cachData.push(dataFees[i].thisYear);
                cachData.push(dataFees[i].nextYear);
            }
        }
    })

    // EU data: 2020 = home val; 2021 = overseas val
    var tds = tbl.querySelectorAll('[data-region="eu"] td');
    tds[0].innerHTML = checkVal(cachData[0]);
    tds[1].innerHTML = checkVal(cachData[cachData.length - 1]);

    /* 
    * Make sure we have a value. If not return TBC  
    *
    function checkVal(val){
        return val.length > 0 ? val : '<abbr title="to be confirmed">TBC</abbr>';
    }

})(document.getElementById("feesTblPG"));
*/
/**
 * Stirling uni modules
 */

StirUniModules.setShowRoutesRenderer(function (routesData) {

	var rouList   = StirUniModules.DOM['routes-list'];
	var selector = document.createElement('select');	

	selector.id = "course-modules-container__routes-select";

    for (var i = 0; i < routesData.length; i++) {
        if (typeof routesData[i] === "undefined") {
            console.error('Error with module code ' + (i + 1));
		} else {
			selector.insertAdjacentHTML("beforeend", '<option value="' + routesData[i].rouCode + ',' + StirUniModules.getCourseType() + '">' + routesData[i].rouName + '</option>');
		}
    }

	rouList.insertAdjacentHTML("afterbegin", '<p>Please choose a course:</p>');
	rouList.appendChild(selector);
	
	selector.addEventListener("change", function (e) {
		var value = this.options[this.selectedIndex].value.split(",");
        var routeCode = value[0];
		var courseType = value[1];
		
		// Reset various DOM elements
		StirUniModules.reset(true);

        StirUniModules.loadCourseOptions(routeCode, courseType);
    });

});

StirUniModules.setShowOptionsRenderer(function (optionsData) {

	var optList   = StirUniModules.DOM['options-list'];
	var selector  = document.createElement('select');	
	
	selector.id = "#course-modules-container__options-select";

    for (var i = 0; i < optionsData.length; i++) {
		var value = StirUniModules.getSelectedRoute() + ',' + optionsData[i][0] + ',' + optionsData[i][2];
		var innerText = 'Starting ' + optionsData[i][3] + ', ' + optionsData[i][1].toLowerCase();
		if(optionsData[i][4]!=="Stirling") innerText += ' (' + optionsData[i][4] + ')';
        selector.insertAdjacentHTML("beforeend", '<option value="' + value + '">' + innerText +'</option>');
    } 

	optList.innerHTML = '<p>There are ' + stir.cardinal(optionsData.length) + ' options for this course:</p>';
	optList.appendChild(selector);

	// set behaviour of each select
	selector.addEventListener("change", function (e) {

		var value = this.options[this.selectedIndex].value.split(",");
        var rou = value[0];
        var moa = value[1];
		var occ = value[2];
		
		StirUniModules.reset(false);

		// this will load and display the modules:
        StirUniModules.loadCourseModules(rou, moa, occ);
    });

});

StirUniModules.setShowModulesRenderer(function (data) {

    var container = document.querySelector(StirUniModules.getOption('container'));
	if (!container) return;

	var debug = window.location.hostname != "www.stir.ac.uk" ? true : false;

    var accordion = StirUniModules.DOM['accordion'],
        html = [],
        initialText = StirUniModules.DOM['initial-text'],
        autoExpandFirstAccordion = StirUniModules.getOption('auto_expand_first_accordion') ? true : false; // 
    	viewMoreModulesThreshold = 4,
        viewMoreLinkText = "View all _X_ choices",
		viewLessLinkText = "View fewer choices"; //greater than 4 modules will show "show more" link (see css class for display property)

    var module,
        collection,
		year = 0, yearsWithOptions =[],
		semester,
		semesterCache = [],
        semesterNameText, //e.g. "Semester 1" / "Speing semester"
        semesterOptionIdText, //if multiple options exist (e.g. " (Option A)")
		showCollectionNotes, // boolean
		collectionId, //string
        collectionHeaderTextChanged,
        collectionlist_html, //array
        collectionNotEmpty, //boolean
		showModule; // boolean

	if (initialText && data.initialText) {
		initialText.appendChild(stir.String.fixHtml(data.initialText, true))
	}

    /**
     * get header text for collection
     **/
    var getCollectionHeaderText = function (collectionStatusCode) {

        var collectionHeaderText;

        // this was taking from how the calendar JS displays titles
        if (collectionStatusCode.indexOf("E") > -1) {
            collectionHeaderText = "Option module";
        } else if (collectionStatusCode === "D") {
            collectionHeaderText = "Dissertation";
        } else {
            collectionHeaderText = "Compulsory module";
        }

        return collectionHeaderText;
    };

    // generate a checksum so we can compare and output collection header if
    // neccessary
    var getCollectionHeaderChecksum = function (code, notes) {
        return getCollectionHeaderText(code) + notes;
	};
	
	var multi = false;

	

	if(data.pdttRept) {
		StirUniModules.DOM['pdttRept'].appendChild(stir.String.fixHtml(data.pdttRept, true));
	}

	// look-ahead: do any groups have multiple options?
	for (var g=0; g<data.semesterGroupBeans.length; g++) { // groups loop
		if (data.semesterGroupBeans[g].groupOptions.length>1) {
			multi = true;
			break;
		}
	}

	// Loop through the nested Groups and Options to get to the modules…
    for (var g=0; g<data.semesterGroupBeans.length; g++) { // groups loop
		for (var o=0; o<data.semesterGroupBeans[g].groupOptions.length; o++) { // options in group
            for (var s=0; s<data.semesterGroupBeans[g].groupOptions[o].semestersInOption.length; s++) { // semesters in option

                semester = data.semesterGroupBeans[g].groupOptions[o].semestersInOption[s];
				collections = semester.collections;
				semesterId = [g,o,s].join('');

                // first, we'll work out which academic year we are in
                // this code is based on academic-calendar.js from the
                // Portal Degree Programme Tables.
                if ("PG" == StirUniModules.getCourseType()) {
                    /**
                     * Use this logic for PG courses
                     */
                    if (g === 0 && o === 0 && s === 0) { //first group, first option, first semester
                        year++;
                        semesterCache.push(semester.semesterName);
                    } else if (semesterCache.indexOf(semester.semesterName) === -1 && o === 0) { //new semester and option 1
                        semesterCache.push(semester.semesterName);
                    } else if (o === 0) { //else if repeated semester and still option 1 - only increment year on option 1
                        semesterCache = []; //reset array of semesters
                        semesterCache.push(semester.semesterName);
                        year++;
                    }
                } else {
                    /**
                     * Use this for UG courses
                     */
                    year = StirUniModules.semester.getYear(parseInt(semester.semesterCode));
                }

                // next, we'll put the modules in the correct order
                // i.e. the same order in which they appear in
                // the calendar
                collections.sort(StirUniModules.moduleSort);

                // now we have all the info we need to render the HTML:
				
				semesterNameText = 'Year ' + year + ', ' + (semester.semesterName ? semester.semesterName + ' semester' : 'Semester ' + StirUniModules.semester.getSemesterYearIndex(semester.semesterCode));
				//multi-option year
				if(multi) {
					semesterOptionIdText = ' (Option ' + (o+1) + ')'; // use numeric `o` instead of alphabetical `optionId` for consistency with DPT
					yearsWithOptions.push({year: year, options: data.semesterGroupBeans[g].groupOptions.length});
				} else {
					semesterOptionIdText = '';
				}
				
				// build the accordion HTML:
				html.push('<div class="stir-accordion ' + ((autoExpandFirstAccordion) ? ' stir-accordion--active' : '') + ' ">');
                html.push('<h3><a href="#" class="stir-accordion--btn" aria-expanded="' + ((autoExpandFirstAccordion) ? 'true' : 'false') + '" aria-controls="panel_modules_' + semesterId + '" id="accord_modules_' + semesterId + '">' + semesterNameText + semesterOptionIdText + '</a></h3>');
                html.push('<div class="c-wysiwyg-content c-course-modules__collection '+StirUniModules.css.truncateModuleCollection+'" id="panel_modules_' + semesterId + '" role="region" aria-labelledby="accord_modules_' + semesterId + '">');

                // reset this to ensure on the next semester block title is output
                collectionHeaderChecksum = null;

                // insert accordion content
                for (var c = 0; c < collections.length; c++) { // collections in semester (e.g. COMP)

                    collection = collections[c];
					collectionlist_html = [];
					collectionId = [g,o,s,c].join('');

                    collectionlist_html.push('<table class="text-left c-course-modules__table" id="course-modules__table_'+collectionId+'">');
                    collectionlist_html.push('<tr class="show-for-sr">');
                    collectionlist_html.push('    <th>Module</th>');
                    collectionlist_html.push('    <th>Credits</th>');
                    collectionlist_html.push('</tr>');

					collectionNotEmpty = false;

                    for (var m = 0; m < collection.mods.length; m++) {

                        module = collection.mods[m];

                        // hide the module if it's unavailable. (This condition was taken from calendar js).
                        if (StirUniModules.getOption('hide_modules_if_not_available') && (module.mavSemSemester === null || module.mavSemSemester.length === 0 || module.mavSemSemester === "[n]" || module.mavSemSemester === "Not Available")) {
                            showModule = false;
                        } else {
                            showModule = true;
                            collectionNotEmpty = true;
						}

                        if (showModule || debug) {
                            collectionlist_html.push('<tr' + (showModule?'':' data-availability="false" style="border: 2px dashed tomato"') + '>');
                            collectionlist_html.push('    <td><a href="' + StirUniModules.getDPTModuleLink(module.modCode) + '" data-modalopen="course__description" data-module-code="' + module.modCode + '" data-semester-code="' + module.mavSemCode + '" data-occurrence="' + module.mavOccurrence + '" data-year-session="' + module.mavSemSession + '">' + module.modName + '</a> <span class="c-course-modules__module-code">(' + module.modCode + ')</span></td>');
                            collectionlist_html.push('    <td>' + module.modCredit + ' credits</td>');
                            collectionlist_html.push('</tr>');
                        }

                    } // end of module loop

                    collectionlist_html.push('    </table>');

                    if (collectionNotEmpty || debug) {

                        // in accordance with calendar js, we only show notes on this condition
                        showCollectionNotes = (collection.collectionType == "LIST" || collection.collectionType == "CHOICE");

                        // we'll show the header if there are collection notes, if header text has changed,
                        // and if collapse_collection_headers option says to do so
                        collectionHeaderTextChanged = (getCollectionHeaderChecksum(collection.collectionStatusCode, collection.collectionNotes) !== collectionHeaderChecksum);
                        if (!StirUniModules.getOptions().collapse_collection_headers || showCollectionNotes || collectionHeaderTextChanged)
                            html.push('<p class="c-course-modules__collection-header">' + getCollectionHeaderText(collection.collectionStatusCode, collection.collectionNotes) + '</p>');
                        if (showCollectionNotes) {
                            html.push('<p class="c-course-modules__collection-notes">' + collection.collectionNotes + '</p>');
                        }

                        // update the checksum so we can compare with next collection
                        // of this semester
                        collectionHeaderChecksum = getCollectionHeaderChecksum(collection.collectionStatusCode, collection.collectionNotes);

                        // now output the table we created earlier
                        html.push(collectionlist_html.join(""));

                        if (collection.mods.length > viewMoreModulesThreshold) {
                            html.push('<p class="text-center c-course-modules__view-more-link">');
							html.push('<a href="#" data-choices="' + collection.mods.length + '" aria-expanded="false" aria-controls="course-modules__table_' + collectionId + '">');
                            html.push(viewMoreLinkText.replace("_X_", collection.mods.length));
                            html.push('</a></p>');
                        }

                        if (collection.collectionFootnote) {
                            html.push('<p class="c-course-modules__pdm-note">' + collection.collectionFootnote + '</p>');
                        }

                    }

                } // end of collection loop

                // close accordion item
                html.push('  </div><!-- end .accordion-content -->');
				html.push('</div>');

				
                autoExpandFirstAccordion = false;
				
            } // end of semester loop
			
        } // end of options in group loop
    } // end of group loop
	
	if(initialText) {
		var done = [];
		var paths_html = [];
		if(yearsWithOptions.length>0) {
			yearsWithOptions.forEach(function(item) {
				if(item.options>1 && (done.indexOf(item.year)===-1)){
					done.push(item.year);
					paths_html.push( stir.cardinal(item.options) + " alternative paths in year " + stir.cardinal(item.year) );
				}
			});
			initialText.insertAdjacentHTML("afterbegin", "<p class=\"c-callout info\"><strong><span class=\"uos-shuffle\"></span> There are "+ stir.Array.oxfordComma(paths_html, true) + ".  Please review all options carefully.</strong></p>")
		}
	}

    accordion.insertAdjacentHTML('beforeEnd', html.join("\n"));

    // initialise any new accords just added to DOM
	Array.prototype.forEach.call(accordion.querySelectorAll('.stir-accordion'), function(accordion) { new stir.accord(accordion, true) });

	
	function resetModuleModal() {
		var header  = document.getElementById('course-modules-description__header');
		var body    = document.getElementById('course-modules-description__body');
		var loading = document.getElementById('course-modules-description__loading');
		var content = document.getElementById('course-modules-description__content');

		header && (header.innerHTML = '');
		body   && (body.innerHTML = '');

        // show loading, hide content
        $(loading).show();
        $(content).hide();
	}

	/**
	 * fetch data from api then show to modal
	 * @param {*} el the modal-opener element that was clicked
	 */
    function insertModuleData(el) {

		resetModuleModal()
		StirUniModules.loadModule(	el.getAttribute('data-module-code'), 
									el.getAttribute('data-semester-code'), 
									el.getAttribute('data-occurrence'), 
									el.getAttribute('data-year-session')	);
	}

	//view more behaviour
	function viewMore(e) {
		if(!this.classList) return;
		
        if (this.classList.toggle(StirUniModules.css.truncateModuleCollection)) {
			stir.scrollToElement(this, 60); // return the user to the top of list
			e.target.innerText = viewMoreLinkText.replace("_X_", e.target.getAttribute('data-choices'));
        } else {
			e.target.innerText = viewLessLinkText;
        }
		e.preventDefault();
    }

	// attach behaviour to `view more` links and bind them to the respective table element
	Array.prototype.forEach.call(container.querySelectorAll('.c-course-modules__collection'), function(el) {
		var a = el.querySelector('.c-course-modules__view-more-link a');
		a && a.addEventListener('click', viewMore.bind(el))
	});


	function modClickHandler(event) {
		insertModuleData(this);
		StirUniModules.getOptions()['modal'].open();
		event.preventDefault();
	}

	// assign click-handlers to all the new module links:
	Array.prototype.forEach.call(document.querySelectorAll('[data-modalopen="course__description"]'), function(el) {
		el.addEventListener("click", modClickHandler);
	});

});

StirUniModules.setShowModuleRenderer(function (data) {

	var options = StirUniModules.getOptions();
    /**
     * will extract a detail by name safely without error;
     * */
    function getDetail(name) {
        return data && data[0] && data[0].details && data[0].details[name]; // return last item, or first to fail
    }

    function detailsButton() {
        if (!options["data_modules_show_details_link"]) return '';
        var modCode = getDetail("Module Code");
        var link = modCode ? StirUniModules.getDPTModuleLink(modCode) : '';
        return link ? '<a href="' + link + '" class="button tiny" target="_blank">View full details of module ' + modCode + '</a>' : '';
    }

    var name = getDetail("Module Name");
    var desc = getDetail("Brief (marketing) description") || getDetail("Summary of Module"); // set desc as marketing description, otherwise fall back to summary

    if (desc) {
        desc = desc.replace(/<[font|u][^><]*>|<.[font|u][^><]*>/g, '').replace(/ style="([^"]+)"/gi, ''); // remove inline styles
        $("#course-modules-description__header").html('<h3 class="c-section-heading">' + name + '</h3>').show();
        $("#course-modules-description__body").html(desc + detailsButton()).show();
    } else {
        $("#course-modules-description__header").hide();
        $("#course-modules-description__body").html("Module information coming soon").show();
    }

    // show content
    $("#course-modules-description__loading").hide();
	$("#course-modules-description__content").show();

});

StirUniModules.setShowModuleErrorRenderer(function (data) {
    $("#course-modules-description__header").html('<h3 class="c-section-heading">Error</h3>');
    $("#course-modules-description__body").html("Module information not found");

    // show content
    $("#course-modules-description__loading").hide();
    $("#course-modules-description__content").show();
});

StirUniModules.setShowOptionsErrorRenderer(function (data) {
    // $("#course-modules-container__loading").hide();
    // $("#course-modules-container__error").html( "Modules list not available at this time" );
    //$("#course-modules-container").hide();
    $("#course-modules-container").append('<p><a href="'+StirUniModules.getDPTCourseLink(data.rouCode)+'" class=c-link>View module information for this course</a></p>');
});

StirUniModules.setShowRoutesErrorRenderer(function(data) {
	if(data.routeCodes && data.routeCodes.length) {
		data.routeCodes.forEach(function(route) {
			$("#course-modules-container").append('<p><a href="'+StirUniModules.getDPTCourseLink(route)+'" class=c-link>'+route+'</a></p>');
		});
	}
});

StirUniModules.setShowLoadingRenderer(function (label) {
    StirUniModules.loading.queue++;
    StirUniModules.loading.el.style.display = "block";
});

StirUniModules.setHideLoadingRenderer(function (label) {
    if (StirUniModules.loading.queue > 0) {
        StirUniModules.loading.queue--;
    }
    if (0 === StirUniModules.loading.queue) {
        StirUniModules.loading.el.style.display = "none";
    }
});

StirUniModules.initialisationRoutine = (function(){

	var isModulesLoaded = false; // flag to prevent loading modules with every click

	return function(event) {

		if (isModulesLoaded) { return; }
		var courseType, rouCode, data_modules_show_details_link;
		var el = document.querySelector("[data-modules-route-code][data-modules-course-type]");
        if (!el) return;
        rouCode = el.getAttribute("data-modules-route-code"); // i.e. "UHX11-ACCFIN";
        courseType = el.getAttribute("data-modules-course-type"); // i.e. "UG";
        data_modules_show_details_link = null === el.getAttribute("data-modules-show-details-link") ? false : true;
        if (!rouCode || !courseType) {
            //return;
		}

		/* Initialise the Modal popup for displaying detailed module information */
		var html = [];
		var modal = new stir.Modal();
		html.push('<div id="course-modules-description__loading"><div class="loader"></div></div>');
		html.push('<div id="course-modules-description__content">');
		html.push('<div id="course-modules-description__header"></div>');
		html.push('<div id="course-modules-description__body"></div>');
		html.push('</div>');	
		modal.render('course__description', 'Module summary');
		modal.setContent(html.join("\n"));

        StirUniModules.init({
            container: "#course-modules-container",
            autoload_first_route: true,
            autoload_first_option: true,
            use_cache: true,
            collapse_collection_headers: false,
            hide_modules_if_not_available: true,
			data_modules_show_details_link: data_modules_show_details_link,
			modal: modal
		});

		/**
		 * Use DPT versioning? (Needed for Dev/QA)
		 * If yes, call getVersions() then callback to loadCourseRoutes().
		 * If no, just call loadCourseRoutes().
		 */
        //StirUniModules.getVersions( function() {
		//	StirUniModules.loadCourseRoutes(rouCode, courseType)
		//} );
		StirUniModules.loadCourseRoutes(rouCode, courseType)

        // flag to suppress loading modules again
        isModulesLoaded = true;
	}

})();

(function () {

	var courseDetailsTabEl = document.getElementById("course-tabs__course-details-label");
	if(courseDetailsTabEl) courseDetailsTabEl = courseDetailsTabEl.parentElement;

	// if the tab is open load the modules by performing a click
    var url = window.location.href;
    if (url.indexOf("#") && (url.split('#')[1] === 'course-tabs__course-details')) {
        StirUniModules.initialisationRoutine()
	}

    courseDetailsTabEl && courseDetailsTabEl.addEventListener("click", StirUniModules.initialisationRoutine);

})();

/*
 * Personalisation for course pages
 */

//(function () {

//    UoS_locationService.do(function (data) {
//        var objSchols = stir.t4Globals.scholarships;
//
//        for (var index in objSchols) {
//
//            if (data.country_code === objSchols[index].country && objSchols[index].show) {
//                var el = document.querySelectorAll("#ug-course-tabs__overview div.c-wysiwyg-content p")[0];
//                var newNode = document.createElement("p");
//
//                newNode.innerHTML = 'Test';
//                el.parentNode.insertBefore(newNode, el);
//
//            }
//        }
//    });

//})();
/**
 * Related courses buttons
 * Ajax in based on subjects
 * Make the related courses buttons fully clickable
 */

(function () {
    var relatedEl = document.querySelector('[data-course-related]');
    var relatedWrapperEl = document.querySelector('.c-course-related__wrapper');
    var jsonUrl = '/data/courses/all-courses/index.json'; // prod
    var pageUrl = window.location.href;

    pageUrl = pageUrl.split('?')[0];
    pageUrl = pageUrl.split('#')[0];

    /**
     * Function: Reconfig env vars so works in testing etc
     */
    function configEnv() {
        if (UoS_env.name === 'dev') {
            jsonUrl = '../data/courses-all.json';
            pageUrl = 'https://t4cms.stir.ac.uk/terminalfour/preview/1/en/857';
        }

        if (UoS_env.name === 'preview' || window.location.hostname==="t4appdev.stir.ac.uk")
            jsonUrl = '/terminalfour/preview/1/en/20892';

        if (UoS_env.name === 'prod')
            pageUrl = pageUrl.replace("https://www.stir.ac.uk", "");
    }

    /**
     * Function: handle the click event
     */
    var relBtnClick = function (mybtn, mylink) {
        mybtn.onclick = function (e) {
            window.location = mylink;
        };
    };

    /**
     * Function: Config the data returned and then output it
     **/
    function renderLinkHTML(obj) {
        var ucascode = ''; // Only needed by UG
        if (obj.code.trim() !== '')
            ucascode = ' <strong>UCAS Code: ' + obj.code.trim() + '</strong>';

        return '<li><a href="' + obj.url + '">' + obj.prefix + ' ' + obj.title + '</a>' + ucascode + '</li>'
    }

    /**
     * Function: Config the data returned and then output it
     **/
    var parseData = function (data) {
        var html = [];

        var subjects = document.querySelector('[data-subjects]').dataset.subjects;
        var level = document.querySelector('[data-modules-course-type]').dataset.modulesCourseType;

        if (subjects.trim() === '') {
            relatedWrapperEl.parentNode.removeChild(relatedWrapperEl);
            return;
        }

        if (level === 'UG')
            level = 'Undergraduate';

        if (level === 'PG')
            level = 'Postgraduate';

        var arrSubject = subjects.split(',');
        var mycourses = data.courses;
        data = '';
        var courses = mycourses.sort(function (a, b) { return (a.title <  b.title) ? -1 : (a.title >  b.title) ? 1 : 0; }); 

        // find courses that match the subject list
        for (var i = 0; i < courses.length; i++) {
            for (var c = 0; c < arrSubject.length; c++) {
                if (courses[i].subject && level) {
                    // does it belong to one of the subjects
                    if ((courses[i].subject.trim().indexOf(arrSubject[c].trim()) > -1) && (courses[i].level.trim() === level)) {
                        // dont output the current course
                        if (pageUrl !== courses[i].url) {
                            html.push(renderLinkHTML(courses[i]));
                            break; // to avoid dups
                        }
                    }
                }
            }
        }

        if (html.length > 0) {
            html.unshift('<ul>');
            html.push('</ul>');
            relatedEl.innerHTML = html.join("\n");
        }

        if (html.length < 1) {
            relatedWrapperEl.parentNode.removeChild(relatedWrapperEl);
            return;
        }

        /**
         * Now make the related courses buttons fully clickable
         */
        var relBtns = document.querySelectorAll('.c-course-related__buttons ul li');
        var link = '';

        /**
         * Register the appropriate click events
         */
        if (relBtns.length > 0) {
            for (var i = 0; i < relBtns.length; i++) {
                if (relBtns[i].children[0] && relBtns[i].children[0].hasAttribute("href")) {
                    link = relBtns[i].children[0].attributes.href.value;
                    relBtnClick(relBtns[i], link);
                }
            }
        }
    };

    /**
     * On Load
     **/
    if (relatedEl) {
        configEnv();
        stir.getJSON(jsonUrl, parseData);
    }

})();
/*
 * Find a content item then animate scroll to it 
 * opening any tabs / accords along the way
 * @param ID of content {string}
 * TODO: move to stir.slideToContent ???
 */

(function () {

    var altApplyBtn = document.querySelector("[data-applyslidelink]");
    var skipLinks = document.querySelectorAll(".skip-link");

    var errorMsg = [
        'WARNING!! Missing apply now button anchor location ID',
        'Please inform a dev!!'
    ];

    // Away we go
    init();

    /*
     * Function: do some checks and if everything is ok get stuff ready 
     */
    function init() {
        // Apply button actions
        if (altApplyBtn) {
            var contentId = altApplyBtn.getAttribute('href').split("#")[1];
            if (!document.getElementById(contentId)) {
                // output an error message for the content team
                if (UoS_env.name !== 'prod') {
                    var btnNode = document.querySelector('.c-course-title__buttons');
                    if (btnNode) {
                        var errorNode = document.createElement('p');
                        errorNode.classList.add('alert');
                        errorNode.classList.add('callout');
                        errorNode.textContent = errorMsg[0] + ' "' + contentId + '". ' + errorMsg[1];
                        btnNode.insertAdjacentElement('beforeend', errorNode);
                    }
                }
                // hide the button for live
                if (UoS_env.name === 'prod')
                    altApplyBtn.classList.add('hide');
            }
            initClickEvent(altApplyBtn);
        }

        // Skiplink actions 
        if (skipLinks) {
            for (var i = 0; i < skipLinks.length; i++)
                initClickEvent(skipLinks[i]);
        }
    }

    /*
     * Function: Listen for click events
     */
    function initClickEvent(btn) {
        btn.addEventListener("click", doClick);
    }

    /*
     * Function: Handle click events
     */
    function doClick(e) {
        var contentId = this.href.split("#")[1];
        if (document.getElementById(contentId) && contentId !== undefined) {
            // Set the offset for any sticky navs etc
            var offset = 100;
            var browsersize = stir.MediaQuery.current;

            if (browsersize === 'medium')
                offset = 150;

            if (browsersize === 'small')
                offset = 15;

            slideToContent(contentId, offset);
            e.preventDefault();
            //return false;
        }
    }

    /*
     * Function: Find the content item then smooth scroll to it  
     */
    function slideToContent(contentItemId, offset) {
        var myTabBtn, myAccordBtn, myContentItem = document.getElementById(contentItemId);

        // is the content in a tab?
        var found = false,
            tempNode = myContentItem;

        while (!found && tempNode !== null) {
            if (tempNode.classList && tempNode.classList.contains('stir-tabs__content')) {
                myTabBtn = tempNode.previousElementSibling;
                found = true;
            }
            tempNode = tempNode.parentNode;
        }

        // open the required tab if found and closed
        if (myTabBtn)
            if (!myTabBtn.classList.contains('stir-tabs__tab--active'))
                myTabBtn.click();

        // is the content in an accord?
        var found2 = false,
            tempNode2 = myContentItem;

        while (!found2 && tempNode2 !== null) {
            if (tempNode2.classList && tempNode2.classList.contains('stir-accordion')) {
                myAccordBtn = tempNode2.children[0].children[0];
                found2 = true;
            }
            tempNode2 = tempNode2.parentNode;
        }

        // open the required accord if found and closed
        if (myAccordBtn)
            if (!myAccordBtn.hasAttribute('aria-expanded') || myAccordBtn.getAttribute('aria-expanded') === "false")
                myAccordBtn.click();

        // Smooth-scroll to the item
        if (myContentItem)
            stir.scrollToElement(myContentItem, offset);
    }

})();
/**
 * Sticky menu show/hide
 */
(function () {

    var stickyMenu = document.querySelector('.c-course-title-sticky-menu');
    var stickyCloseBtn = document.querySelector('#course-sticky-close-btn');
    var buttons = document.querySelector(".c-course-title__buttons");
    var allowSticky = true;
    var showTopPosition;

    init();

    /*
     * Away we go. Set everything up
     */
    function init() {
        if (stir.MediaQuery.current !== 'small') {
            if (stickyMenu) {
                stickyMenu.classList.add('stir__slideup');
                stickyMenu.style.display = 'block';
            }

            if (buttons && stickyMenu) {
                showTopPosition = buttons.offsetTop + buttons.offsetHeight;
                window.addEventListener('scroll', scrollPositionChecker); // listen for scrolling
            }

            if (stickyCloseBtn) {
                stickyCloseBtn.onclick = function (e) {
                    allowSticky = false;
                    window.removeEventListener('scroll', scrollPositionChecker); // stop listening for scrolling
                    stickyMenu.parentNode.removeChild(stickyMenu);
                    e.preventDefault();
                };
            }
        }
    }

    /*
     * Decides whether to how or hide the sticky based on scroll position
     */
    function showHideSticky() {
        var scrollPos = window.scrollY;
        if (allowSticky && stickyMenu) {
            if (scrollPos > showTopPosition)
                stickyMenu.classList.add('stir__slidedown');
            if (scrollPos < showTopPosition)
                stickyMenu.classList.remove('stir__slidedown');
        }
    }

    /*
     * Changed this to a named function so we can easily "removeEventListener" when
     * we no longer need it. (Anonymous functions can be added but not removed). [rwm2]
     */
    function scrollPositionChecker() {
        window.requestAnimationFrame(showHideSticky);
    }

})();