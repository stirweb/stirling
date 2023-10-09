var stir = stir || {};
stir.templates = stir.templates || {};


stir.templates.course = {
	offline: `<p class="text-center c-callout">Module information is temporarily unavailable (last updated: Monday 25th October 2021)</p>`,
	link: (text,href) => `<a href="${href}">${text}</a>`,
	para: content => `<p>${content}</p>`,
	option: option => `Starting ${option[3]}, ${option[1].toLowerCase()} (${option[4]})`,
	div: (id,onclick) => {
		const div = document.createElement('div');
		div.id = id; div.onclick = onclick;
		console.info(div.id = id);
		return div;
	}
};


stir.course = (function() {
	if(!stir.dpt) return;

	const container = document.getElementById('course-modules-container');
	if(!container) return
	const optionChooser = stir.templates.course.div('optionBrowser');
	const moduleBrowser = stir.templates.course.div('moduleBrowser');

	let initialised = false;

	const parameter = {
		route: container.getAttribute('data-modules-route-code'), // i.e. "UHX11-ACCFIN";
		level: container.getAttribute('data-modules-course-type'), // i.e. "UG";
		auto: true
	};

	const handle = {
		options: frag => optionChooser.append(frag),
		modules: frag => moduleBrowser.append(frag),
	};

	const reset = {
		modules: ()=>moduleBrowser.innerHTML=''
	};
	
	// Set up the DOM
	container.append( optionChooser, moduleBrowser );
	
	// Set up data callback/handlers
	stir.dpt.set.show.options( handle.options );
	stir.dpt.set.show.modules( handle.modules );
	stir.dpt.set.reset.modules( reset.modules );

	const _auto = () => {
		if(!initialised) {
			initialised = true;
			stir.dpt.get.options(parameter.level, parameter.route, parameter.auto);
		}
	};

	// STIR TABS AWARE
	const panel = container.closest && container.closest('.stir-tabs__content');
	if(panel && window.location.hash.indexOf(panel.id)===1) _auto();

	return {
		auto: _auto
	};

})();