var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};
stir.fees = stir.fees || {};

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
	const info = {};
	const feeapi = "dev"===UoS_env.name?'../fees.json':'<t4 type="media" id="182818" formatter="path/*" />'
	// Media #182818 is "fees.json" which contains a T4 Web Object that fetches live data via the live site.
	// (in preview it will make an API call, in production it will be "t4-cached").

	// const labels = {
	// 	UG: {
	// 		"H": "Scotland",
	// 		"R": "England, Wales, NI, Republic of Ireland",
	// 		"O": "International (including EU)",
	// 	},
	// 	PG: {
	// 		"H": "UK and Republic of Ireland",
	// 		"O": "International (including EU)",
	// 	}
	// };

	// const statuses = {
	// 	UG: {
	// 		"H": "Scottish students",
	// 		"R": "Students from England, Wales, Northern Ireland and Republic of Ireland",
	// 		"O": "International students (including EU)",
	// 	},
	// 	PG: {
	// 		"H": "Students from the UK and Republic of Ireland",
	// 		"O": "International (including EU) students",
	// 	}
	// };
	
// 	const modes = {
// 		"FT":"full time",
// 		"PTO":"part time",
// 		"SW":"sandwich"
// 	}

	const formatter = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0	  
		// These options are needed to round to whole numbers if that's what you want.
		//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	  });

	const onlyUnique = (value, index, self)  => self.indexOf(value) === index;

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
	const level = el && el.getAttribute('data-modules-course-type');
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


	
	stir.fees.auto = () => {
		if(initialised) return;
		//////////////////////////
		initialised = true;
		
		routes && stir.getJSON(feeapi, data=>{
			if(data.feeData) {
				debug && console.info('[Fees] data loaded',data);
				const route = routes.shift();
				routedata = data.feeData.filter(item=>item.rouCode===route);
				feedata = routedata.length && routedata[0].feeData
				debug && console.info('[Fees] route',route,routedata);
				debug && console.info('[Fees] feedata',feedata);
		
				info.theyears = feedata && feedata.map(data=>data.academicYear).filter(onlyUnique);
				info.stata = feedata && feedata.map(data=>data.feeStatus).filter(onlyUnique);
				info.moda = feedata && feedata.map(data=>data.modeOfAttendance).filter(onlyUnique);

				debug && console.info('[Fees] info',info);
				
				if(!routedata.length) {
					debug && console.error(`[Fee API] ${route}: no match for this route code found in the fees data`);	
				} else {
					debug && console.info(`${route}: API fee data ${feedata.length>0?'available':'not available'}`);
					if(feedata.length) {
						scope.querySelectorAll("table").forEach(table => {
							const tr = table.querySelector("thead tr");
							info.theyears.forEach(year => tr.insertAdjacentHTML("beforeend",th_year(year)));
							table.querySelectorAll("tbody tr[data-status][data-mode]").forEach(row => {
								const status = row.getAttribute("data-status");
								const mode   = row.getAttribute("data-mode");
								info.theyears.forEach(year => {
									const fee = feedata.filter(a=>a.feeStatus===status&&a.modeOfAttendance===mode&&a.academicYear===year);
									row.insertAdjacentHTML("beforeend",fee.map(td_amount).join(''));
								});
							});
						});
					} else { }
				}
			}
		});
		//////////////////////////
	}

	if(stir.callback && stir.callback.queue && stir.callback.queue.indexOf("stir.fees.auto")>-1) stir.fees.auto();

})(document.getElementById("course-fees-information"));