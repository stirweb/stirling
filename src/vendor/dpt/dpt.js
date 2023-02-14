var stir = stir || {};

stir.dpt = (function(){

	const labels = {
		ug: "undergraduate",
		pg: "postgraduate"
	};
	const stdout = document.getElementById("console");
	const routeBrowser = document.getElementById('routeBrowser');
	const optionBrowser = document.getElementById('optionBrowser');
	const moduleBrowser = document.getElementById('moduleBrowser');
	const user = {};

	const modulesEndpointParams = {
		UG: "opt=runcode&ct=UG",
		PG: "opt=runpgcode&ct=PG"
	}

	const urls = {
		calendar: "https://portal.stir.ac.uk/servlet/CalendarServlet",
		route: {
			UG: "?opt=menu&callback=stir.dpt.show.routes", //+ (ver?ver:'')
			PG: "?opt=pgmenu&ct=PG&callback=stir.dpt.show.routes" //+ (ver?ver:'')
		},
		option: (type, roucode) => `?opt=${type}-opts&rouCode=${roucode}&ct=${type.toUpperCase()}&callback=stir.dpt.show.options`,
		modules: (type, roucode, moa, occ) => `?${modulesEndpointParams[type.toUpperCase()]}&moa=${moa}&occ=${occ}&rouCode=${roucode}&callback=stir.dpt.show.modules`,
		module: (mod,year,sem) => stir.akari.get.module([mod,year,sem].join('/'))
	}

	const getRoutes = type => {
		stir.getJSONp(`${urls.calendar}${urls.route[type.toUpperCase()]}`);
		user.type=type
	};

	const getOptions = (type,roucode) => stir.getJSONp(`${urls.calendar}${urls.option(type.toLowerCase(),roucode)}`);
	
	const getModules = (type, roucode, moa, occ) => stir.getJSONp(`${urls.calendar}${urls.modules(type.toLowerCase(),roucode,moa,occ)}`);

//	const debug = data => {
//		console.info('[DPT] debug', data);
//		stdout.textContent = JSON.stringify(data,null,'\t');
//	};

	const makeSelector = (data,name) => {

		const label = document.createElement('label');
		label.appendChild(document.createTextNode('Select a course'));
		label.setAttribute('for',name);
		const select = document.createElement('select')
		select.name = name;
		select.id = name;
		select.innerHTML = `<option value selected disabled> ~ ${labels[user.type]} courses ~ </option>` + data.map(makeOption).join('');

		label.appendChild(select);
		routeBrowser.appendChild(label);
		select.addEventListener('change',event=>{
			if(event.target.name==='rouCode') {
				routeBrowser.innerHTML ='';
				optionBrowser.innerHTML ='';
				moduleBrowser.innerHTML ='';
				routeBrowser.appendChild(label);
				//stdout.textContent = select[select.selectedIndex].outerHTML;
				user.rouCode = select[select.selectedIndex].value;
				getOptions(user.type,user.rouCode);
			}
			
			if(event.target.name==='option') {
				//stdout.textContent = event.target[event.target.selectedIndex].outerHTML;
				moduleBrowser.innerHTML ='';
				let opt = event.target[event.target.selectedIndex].value.split('|');
				getModules(user.type, user.rouCode, opt[0], opt[2]);
			}
			
		});
	};
	
	const moduleView = data => !data.modName?"<p>------- no data</p>":`<p>${data.modCode} <a href="module-viewer.html?code=${data.modCode}&semester=${data.mavSemCode}&session=${data.mavSemSession}" target="_blank">${data.modName}</a> <small>${data.mavSemSession}/${data.mavSemCode}</small></p>`;
	
	const optionView = data => {
		const a = document.createElement('button');
		a.classList.add('button');
		a.classList.add('hollow');
		a.classList.add('tiny');
		a.setAttribute('data-options',data.join('|'));
		a.textContent = [data[1],data[3]].join(', ') + ` (${data[4]})`;
		
		a.addEventListener("click", event => {
			let opt = event.target.getAttribute('data-options').split('|');
			let callout = document.createElement('div');
			callout.classList.add('callout');
			callout.classList.add('u-bg-grey');
			moduleBrowser.innerHTML ='';

			callout.appendChild(renderp(`All modules associated with <strong>${user.rouCode}</strong> (${opt[1]}, ${opt[3]}) are listed below.`));
			callout.appendChild(renderp(`This list is generated from data in the current Degree Programme Tables.`));
			callout.appendChild(renderp(`<strong>ℹ️ Select a module below to view the available Akari API data, or choose a different course from the selector above</strong>.`));
			callout.appendChild(renderp(`Now loading module list for ${user.rouCode}`,'u-loading'));
			moduleBrowser.appendChild(callout);
			getModules(user.type, user.rouCode, opt[0], opt[2]);
			event.preventDefault();
		});

		return a;
	};

	const renderp = (html, css) => {
		const p = document.createElement('p');
		p.innerHTML = html;
		 css && p.classList.add(css);
		return p;
	};

	const renderOptions = data => {
		data.map(optionView).forEach(element => optionBrowser.appendChild(element));
	};
	const renderModules = data => {
		moduleBrowser.querySelector('.u-loading').remove();
		const div = document.createElement('div');
		div.innerHTML = data.map(moduleView).join("\n");
		moduleBrowser.appendChild(div);
	};

	const makeOption = data => {
		const option = document.createElement('option');
		if(data.rouName && data.rouCode) {
			option.textContent = data.rouName;
			option.value = data.rouCode
			return option.outerHTML;
		}
		if(data[0] && data[2]) {
			option.textContent = data.join('|');
			option.value = data.join('|');
		}
		
		option.textContent = JSON.stringify(data,null,"\t");
		return option.outerHTML;
	};

	const extractModules = data => {

		var output = [];

		for (var g = 0; g < data.semesterGroupBeans.length; g++) {
			// groups loop
			for (var o = 0; o < data.semesterGroupBeans[g].groupOptions.length; o++) {
				// options in group
				for (var s = 0; s < data.semesterGroupBeans[g].groupOptions[o].semestersInOption.length; s++) {
					var semester = data.semesterGroupBeans[g].groupOptions[o].semestersInOption[s];
					var collections = semester.collections;

					for (var c = 0; c < collections.length; c++) {
						var collection = collections[c];

						for (var m = 0; m < collection.mods.length; m++) {
							var module = collection.mods[m];

							output.push({
								modName: module.modName,
								modCode: module.modCode,
								mavSemCode: module.mavSemCode,
								mavOccurrence: module.mavOccurrence,
								mavSemSession: module.mavSemSession
							})

						}
					}

				}
			}
		}

		return output;

	};

	
	return {
		getRoutes: getRoutes,
		show: {
			routes: data => makeSelector(data, 'rouCode'),
			options: data => renderOptions(data),
			modules: data => renderModules(extractModules(data)),
			lookup: data => {
				const frag = document.createElement('div');
				const el = document.querySelector("#course-modules-container");
				frag.innerHTML = data;
				el && el.appendChild(frag);
			}
		}
	};




})();