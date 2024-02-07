/**
 * 
 * This file will replace JS-COURSE/MODULES.JS
 * 
 */

var stir = stir || {};
stir.templates = stir.templates || {};


stir.templates.course = {
	link: (text,href) => `<a href="${href}">${text}</a>`,
	para: content => `<p>${content}</p>`,
	option: option => `Starting ${option[3]}, ${option[1].toLowerCase()} (${option[4]})`,
	div: (id,onclick) => {
		const div = document.createElement('div');
		div.id = id; div.onclick = onclick;
		return div;
	},
	paths: (paths, year) => `<p class="c-callout info"><strong><span class="uos-shuffle"></span> There are ${paths} alternative paths in year ${year}.  Please review all options carefully.</strong></p>`,
	offline: `<p class="text-center c-callout">Module information is temporarily unavailable.</p>`,
};


stir.course = (function() {
	if(!stir.dpt) return;

	const container = document.getElementById('course-modules-container');
	const el = document.querySelector("[data-modules-route-code][data-modules-course-type]");
    if(!el) return;
	if(!container) return
	const routeChooser = stir.templates.course.div('optionBrowser');
	const optionChooser = stir.templates.course.div('optionBrowser');
	const moduleBrowser = stir.templates.course.div('moduleBrowser');

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

	const handle = {
		routes: frag => routeChooser.append(frag),
		options: frag => optionChooser.append(frag),
		modules: frag => {moduleBrowser.append(frag);reflow()},
	};

	const reset = {
		modules: ()=>moduleBrowser.innerHTML=''
	};
	
	// Set up the DOM
	container.append( routeChooser, optionChooser, moduleBrowser );
	
	// Set up data callback/handlers
	stir.dpt.set.show.routes( handle.routes );
	stir.dpt.set.show.options( handle.options );
	stir.dpt.set.show.modules( handle.modules );
	stir.dpt.set.reset.modules( reset.modules );

	const _auto = () => {
		if(!initialised) {
			initialised = true;
			if(parameter.route.indexOf(',')>=0) {
				stir.dpt.get.routes(parameter.level, parameter.route, parameter.auto);
			} else {
				stir.dpt.get.options(parameter.level, parameter.route, parameter.auto);
			}
		}
	};

	// STIR TABS AWARE
	const panel = container.closest && container.closest('.stir-tabs__content');
	if(panel && window.location.hash.indexOf(panel.id)===1) _auto();

	return {
		auto: _auto
	};

})();