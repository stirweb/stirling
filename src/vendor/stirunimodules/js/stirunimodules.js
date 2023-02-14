
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

	var _option = {
		getYearFromMonth: function(month) {
			if(!month) return;
			switch (month) {
				case "Autumn":
				case "Winter":
				case "September":
				case "October":
				case "November":
				case "December":
					return '2021';//new Date().getFullYear(); // return current year
				case "Spring":
				case "Summer":
				case "January":
				case "February":
				case "March":
				case "April":
				case "May":
				case "June":
				case "July":
				case "August":
					return '2022'; //new Date().getFullYear() + 1; // return next year
				default: return '';
			}
		}
	};

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
		option: _option,
		css: _cssClasses
	};
}());
