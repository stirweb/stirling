var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};
stir.fees = stir.fees || {};

stir.fees.template = {
	chooser: `<h4>Select your fee status to see the tuition fee for this course:</h4>`,
	default: `<option value disabled selected>Select fee status</option>`
};

stir.fees.doFeesTable = function doFeesTable (scope) {    
	if (!scope) return;
	const label  = document.createElement('label');
	const select  = document.createElement('select');
	const table   = document.createElement('table');
	var remotes = Array.prototype.slice.call(scope.querySelectorAll('[data-action="change-region"]'));
	var region;

    label.innerHTML = stir.fees.template.chooser;
    select.innerHTML = stir.fees.template.default;
    label.append(select);
	scope.prepend(table);
	scope.prepend(label);

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
			showTheStuff(region);
		}
	}

	function showTheStuff(region) {
		show(table);
		getRegionals(region).forEach(show);
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
};

/**
 * Fees region (e.g. home/eu) selector
 * @param {*} scope DOM element that wraps the fees information (selector and table, etc).
 */
((scope)=>{

	const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
	
	if(!scope) {
		debug && console.error("[Fee API] no scope");
		return;
	}
	
	if(scope.hasAttribute('data-local')) {
		debug && console.info('[Fee API] API override is in place');
		return; // t4 editor has indicated that API data for this route is to be ignored
	}
	
	let initialised = false;
	const stuff = {};
	stuff.feestab = document.querySelector('[data-tab-callback="stir.fees.auto"] + div [data-behaviour="accordion"] div');
	const info = {};
	const feeapi = "dev"===UoS_env.name?'../fees.json':'<t4 type="media" id="182818" formatter="path/*" />'


	const labels = {
		UG: {
			"H": "Scotland",
			"R": "England, Wales, NI, Republic of Ireland",
			"O": "International (including EU)",
		},
		PG: {
			"H": "UK and Republic of Ireland",
			"O": "International (including EU)",
		}

	};

	const statuses = {
		UG: {
			"H": "Scottish students",
			"R": "Students from England, Wales, Northern Ireland and Republic of Ireland",
			"O": "International students (including EU)",
		},
		PG: {
			"H": "Students from the UK and Republic of Ireland",
			"O": "International (including EU) students",
		}
	};
	const regions = {
		UG: {
			"H": "home",
			"R": "ruk",
			"O": "int-eu",
		},
		PG: {
			"H": "home",
			"O": "overseas",
		}
	};
	const modes = {
		"FT":"full time",
		"PTO":"part time",
	}

	const formatter = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0	  
		// These options are needed to round to whole numbers if that's what you want.
		//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	  });

	const feetables = data => {
		
		return feetable(
			info.stata.map(status=>
				info.moda.map(mode => 
					feetablerow(status,mode,
						data.feeData.filter(
							a=>a.feeStatus===status&&a.modeOfAttendance===mode
						)
					)
				).join('')
			).join(''),"Annual fees");
	};

	const onlyUnique = (value, index, self)  => self.indexOf(value) === index;

	const feetable = (data, caption) => 
		//`<table>`+
		(caption?`<caption>${caption}</caption>`:'')+
		`<thead><td></td>`+
		info.theyears.map(th_year).join('')+
		`</thead><tbody>`+
		`${data}</tbody>`;
		//`</table>`;

	const th_year = year => `<th scope="col" style="width:20%;">${(year)}</th>`;
	const td_amount = data => `<td>${formatter.format(data.amount)}</td>`;

	function feetablerow (status,mode,data) {
		return `<tr class=hide data-region=${regions[level][status]}>`+
		`<th scope=row>${statuses[level][status]}`+
		`${info.moda.length>1?`<br>(${modes[mode]})`:''}`+
		`</th>`+
		info.theyears.map(year => data.filter(a=>a.academicYear===year).map(td_amount).join('')).join('')+
		`</tr>`;
	}

	const el = document.querySelector('[data-modules-route-code]');
	const routes = (()=>{

		if(!el) return false;
		if(!el.hasAttribute('data-modules-route-code')) {
			debug && console.error('[Fee API] No routecode');
			return false;
		}
		if(el.getAttribute('data-modules-route-code').indexOf(',')!==-1) {
			debug && console.info('[Fee API] Multiple route codes');
		}
		return el.getAttribute('data-modules-route-code').split(',').map(item=>item.trim());

	})();

	const updateOldTable = html => {
		const oldtable = scope.querySelector('table');
		oldtable && (oldtable.innerHTML = html);
	};

	const updateOldSelect = data => {
		info.stata.forEach(status => {
			const option = document.createElement('option');
			option.value = regions[level][status];
			option.textContent = labels[level][status];
			stuff.select.append(option);
		});
	};

	const level = el && el.getAttribute('data-modules-course-type');
	
	stir.fees.auto = () => {
		if(!initialised) {
			initialised = true;

			stir.fees.doFeesTable(scope);
			stuff.select  = scope.querySelector('select');

			routes && stir.getJSON(feeapi, data=>{
				if(data.feeData) {
					routes.forEach(route=>{
						routedata = data.feeData.filter(item=>item.rouCode===route);
						feedata = routedata.length && routedata[0].feeData

						info.theyears = feedata && feedata.map(data=>data.academicYear).filter(onlyUnique);
						info.stata = feedata && feedata.map(data=>data.feeStatus).filter(onlyUnique);
						info.moda = feedata && feedata.map(data=>data.modeOfAttendance).filter(onlyUnique);

						if(!routedata.length) {
							debug && console.error(`[Fee API] ${route}: no match for this route code found in the fees data`);
							stuff.select && stuff.select.remove();
						} else {
							debug && console.info(`${route}: API fee data ${feedata.length>0?'available':'not available'}`);
							if(feedata.length) {
								updateOldTable(routedata.map(feetables).join(''));
								stuff.select && updateOldSelect();
							} else {
								stuff.select && stuff.select.remove();
							}
						}
					});
				}
			});
		}
	}

	if(stir.callback && stir.callback.queue && stir.callback.queue.indexOf("stir.fees.auto")>-1) stir.fees.auto();

})(document.getElementById("course-fees-information"));