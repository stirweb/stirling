/**
 * 
 * This file will replace JS-COURSE/MODULES.JS
 * 
 */

var stir = stir || {};

stir.course = (function() {

	const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
	const na = {auto: new Function()};

	if(!stir.dpt) return na;
	if(!stir.akari) return na;
	if(!stir.templates.course) return na;

	const container = document.getElementById('course-modules-container');
	const el = document.querySelector("[data-modules-route-code][data-modules-course-type]");
	if(!container || !el) return na;
	
	const routeChooser  = stir.templates.course.div('routeBrowser');
	const optionChooser = stir.templates.course.div('optionBrowser');
	const moduleBrowser = stir.templates.course.div('moduleBrowser');
	const moduleViewer  = stir.templates.course.dialogue('moduleViewer');
	const moduleInfo    = stir.templates.course.div('moduleInfo');
	const version = document.querySelector('time[data-sits]');
	const spinner = new stir.Spinner(moduleViewer);
	const status = {
		steps: 1
	}; // used to track modal/url changes

	let initialised = false;

	const parameter = {
		route: el.getAttribute('data-modules-route-code'), // i.e. "UHX11-ACCFIN";
		level: el.getAttribute('data-modules-course-type'), // i.e. "UG";
		auto: true
	};

	// initialise any new accords just added to DOM
	const reflow = () => {
		Array.prototype.forEach.call(container.querySelectorAll(".stir-accordion"), function (accordion) {
			new stir.accord(accordion, true);
		});
	};

	const render = data => {
		if(!boilerplates) return console.error('Boilerplate text not loaded!');
		spinner.hide();
		
		// Render module information HTML:
		moduleInfo.innerHTML = stir.templates.course.module(boilerplates, data);
		
		// Find and activate animated bar graphs:
		stir.templates.course.barcharts( moduleInfo.querySelectorAll(".barchart") )
		
	};

	const reset = {
		modules: ()=>moduleBrowser.innerHTML='',
		module: ()=>moduleInfo.innerHTML='',
		options: ()=>optionChooser.innerHTML=''
	};

	const handle = {
		routes: frag => routeChooser.append(frag),
		options: frag => optionChooser.append(frag),
		modules: frag => {moduleBrowser.append(frag);reflow();},
		module: (id,url) => {
			reset.module();
			spinner.show();
			stir.akari.get.module( id, render );
			moduleViewer.showModal();
			//status.moduleViewer = true;
			if(url) {
				history.pushState(null,"",url);
				status.history = true;
			}
		},
		version: frag => version && frag && (version.textContent = frag)
	};
	
	
	// Set up the DOM
	container.insertAdjacentHTML("beforeend",stir.templates.course.disclaimer);
	container.append( routeChooser, optionChooser, moduleBrowser );
	document.body.append(moduleViewer);
	moduleViewer.append(moduleInfo);
	
	// Set up data callback/handlers
	stir.dpt.set.show.routes  ( handle.routes  );
	stir.dpt.set.show.options ( handle.options );
	stir.dpt.set.show.modules ( handle.modules );
	stir.dpt.set.show.module  ( handle.module  );
	stir.dpt.set.show.version ( handle.version );
	stir.dpt.set.reset.modules( reset.modules  );
	stir.dpt.set.reset.module ( reset.module   );
	stir.dpt.set.reset.options( reset.options  );

	window.addEventListener("popstate",e=>{
		let params = new URLSearchParams(document.location.search);
		let modurl = params.has("code") && params.has("session") && params.has("semester") && params.has("occurrence");

		if(modurl) {
			handle.module(`${params.get("code")}/${params.get("session")}/${params.get("semester")}`,null);
		} else {
			if (moduleViewer.open) {
				moduleViewer.close();
				status.history = false;
			}
		}

		if(status.steps>1) {
			status.steps--;
		}
	});
	
	moduleViewer.addEventListener("close", e=>{
		if(status.history) history.go(0-status.steps);
		status.steps=1;
	});

	function _auto() {
		if(!initialised) {
			initialised = true;
			version && stir.dpt.get.version(parameter.level);
			if(parameter.route.indexOf(',')>=0) {
				stir.dpt.get.routes(parameter.level, parameter.route, parameter.auto);
			} else {
				stir.dpt.get.options(parameter.level, parameter.route, parameter.auto);
			}
		}
	}

	function _init(data) {
		boilerplates = data;
	}

	function _step() {
		status.steps++;
	}

	// STIR TABS AWARE
	//const panel = container.closest && container.closest('[role=tabpanel]');
	//if(panel && window.location.hash.indexOf(panel.id)===1) _auto();

	// STIR ACCORDION
	//const accordion = container.closest && container.closest('[role=dave]');
	//if(accordion && !accordion.hidden) _auto();

	// CALLBACK QUEUE - replaces the DOM checking above
	if(stir.callback && stir.callback.queue && stir.callback.queue.indexOf("stir.course.auto")>-1) _auto();
	// todo: empty the queue?

	return {
		init: _init,	// get module boilerplate text
		auto: _auto,	// initialise and begin
		step: _step		// prev/next stepping
	};

})();

// Get boilerplate text first, then initialise the course page scripts:
stir.getJSON('https://www.stir.ac.uk/data/modules/boilerplate/', data=>stir.course.init(data));

// TEMPORARY ONLY UNTIL T4 REPUBLISHES THE COURSE PAGES
// 2024-02-07 r.w.morrison@stir.ac.uk
 
var StirUniModules = StirUniModules || {};
StirUniModules.initialisationRoutine = stir.course.auto;