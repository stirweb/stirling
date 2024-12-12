var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};
stir.fees = stir.fees || {};

stir.fees.template = {

	"select": `<label>
					  <h4>Select your fee status to see the tuition fee for this course:</h4>
						<select>
							<option value="" disabled selected>Select fee status</option>
							<option value="home">Scotland</option>
							<option value="ruk">England, Wales, NI, Republic of Ireland</option>
							<option value="int-eu">International (including EU)</option>
						</select>
					</label>`,


};

stir.fees.doFeesTable = function doFeesTable (scope) {    
	if (!scope) return;
	console.info("[Fee API] tabulating fees");
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
			//console.info("region:",region)
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


	const stuff = {};

	if(!scope) {
		console.error("[Fee API] no scope");
		scope = document.createElement("div");
		scope.id = "course-fees-information";
		
		stuff.feestab = document.querySelector('[data-tab-callback="stir.fees.auto"] + div [data-behaviour="accordion"] div');
		console.info('[Fee API] fees tab',stuff.feestab);
		stuff.feestab.prepend(scope);
	} else {
		stir.fees.doFeesTable(scope);
	}
	const select  = scope.querySelector('select') || document.createElement('select');
//	if(!select || !select.hasAttribute('data-level')) return;

	//console.info('[Fee API] Study level:',select.getAttribute('data-level'));

	let initialised = false;

	const feeapi = "dev"===UoS_env.name?'../fees-31-10-2024.json':'<t4 type="media" id="182818" formatter="path/*" />'

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

	const info = {};

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
		info.theyears = data.feeData.map(data=>data.academicYear).filter(onlyUnique);
		info.stata = data.feeData.map(data=>data.feeStatus).filter(onlyUnique);
		info.moda = data.feeData.map(data=>data.modeOfAttendance).filter(onlyUnique);

		return feetable(
			info.stata.map(status=>
				info.moda.map(mode => 
					feetablerow(status,mode,
						data.feeData.filter(
							a=>a.feeStatus===status&&a.modeOfAttendance===mode
						)
					)
				).join('')
			).join(''));
	};

	const onlyUnique = (value, index, self)  => self.indexOf(value) === index;

	const feetable = (data, caption) => 
		`<table>`+
		(caption?`<caption>${caption}</caption>`:'')+
		`<thead><td>🚨 <small><pre style=display:inline>Using API Data [${routes}]</pre></small></td>`+
		info.theyears.map(th_year).join('')+
		`</thead><tbody>`+
		`${data}</tbody>`+
		`</table>`;

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
			return console.error('[Fee API] No routecode') && false;
		}
		if(el.getAttribute('data-modules-route-code').indexOf(',')!==-1) {
			console.info('[Fee API] ⚠️ Multiple route codes');
		}
		return el.getAttribute('data-modules-route-code').split(',').map(item=>item.trim());

	})();

	const updateOldTable = html => {
		const oldtable = scope.querySelector('table');
		oldtable && (oldtable.innerHTML = html);
	};


	const level = el && el.getAttribute('data-modules-course-type');

	console.info('[Fee API] Route', routes.join(", "));

	
	stir.fees.auto = () => {
		if(!initialised) {
			initialised = true;
			console.info('[Fee API] auto triggered');
			routes && stir.getJSON(feeapi, data=>{
				if(data.feeData) {
					routes.forEach(route=>{
						routedata = data.feeData.filter(item=>item.rouCode===route);
						feedata = routedata.length && routedata[0].feeData
						console.info('[Fee API]',scope,route,routedata.length?feedata.length:'x');
						!routedata.length && scope.insertAdjacentHTML("afterbegin",`<p><pre>💾 ${route}: no match for this route code found in the fees data</pre></p>`);
						routedata.length && scope.insertAdjacentHTML("afterbegin",`<p><pre>💾 ${route}: API fee data ${feedata.length>0?'available':'not available'}</pre></p>`);
						routedata.length && updateOldTable(data.feeData.filter(item=>item.rouCode===route).map(feetables).join(''));
					});
					//if(select.value) select.dispatchEvent(new Event("change"));
				}
			});
		}
	}

	console.info('[Fee API] stir.callback',stir.callback);

	stir.fees.auto();

	if(stir.callback && stir.callback.queue && stir.callback.queue.indexOf("stir.fees.auto")>-1) stir.fees.auto();

})(document.getElementById("course-fees-information"));