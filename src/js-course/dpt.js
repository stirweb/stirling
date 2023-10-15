var stir = stir || {};

stir.dpt = (function(){

	const labels = {
		ug: "undergraduate",
		pg: "postgraduate"
	};
	const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
	let user = {};
	let year = 1;

	const modulesEndpointParams = {
		UG: "opt=runcode&ct=UG",
		PG: "opt=runpgcode&ct=PG"
	};

	const urls = {
		viewer: 'https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/33273',
		calendar: "https://portal.stir.ac.uk/servlet/CalendarServlet",
		route: {
			UG: "?opt=menu&callback=stir.dpt.show.routes", //+ (ver?ver:'')
			PG: "?opt=pgmenu&ct=PG&callback=stir.dpt.show.routes" //+ (ver?ver:'')
		},
		option: (type, roucode) => `?opt=${type.toLowerCase()}-opts&rouCode=${roucode}&ct=${type.toUpperCase()}&callback=stir.dpt.show.options`,
		fees: (type, roucode) => `?opt=${type}-opts&rouCode=${roucode}&ct=${type.toUpperCase()}&callback=stir.dpt.show.fees`,
		modules: (type, roucode, moa, occ) => `?${modulesEndpointParams[type.toUpperCase()]}&moa=${moa}&occ=${occ}&rouCode=${roucode}&callback=stir.dpt.show.modules`,
		module: (mod,year,sem) => stir.akari.get.module([mod,year,sem].join('/'))
	};

	const getRoutes = type => {
		stir.getJSONp(`${urls.calendar}${urls.route[type.toUpperCase()]}`);
		user.type=type;
	};
	
	const getOptions = (type,roucode,auto) => {
		user.type=type;
		user.rouCode=roucode;
		user.auto=auto;
		stir.getJSONp(`${urls.calendar}${urls.option(type,roucode)}`);
	};
	
	const getModules = (type, roucode, moa, occ) => stir.getJSONp(`${urls.calendar}${urls.modules(type.toLowerCase(),roucode,moa,occ)}`);

	/* const makeSelector = (data,name) => {

		const label = document.createElement('label');
		label.appendChild(document.createTextNode('Select a course'));
		label.setAttribute('for',name);
		const select = document.createElement('select')
		select.name = name;
		select.id = name;
		select.innerHTML = `<option value selected disabled> ~ ${labels[user.type]} courses ~ </option>` + data.sort(routeSort).map(makeOption).join('');

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
				user.rouName = select[select.selectedIndex].textContent;
				optionBrowser.insertAdjacentHTML("afterbegin", `<p>↳ <strong>${user.rouCode}</strong> selected</p>`);
				getOptions(user.type,user.rouCode);
			}
			
			if(event.target.name==='option') {
				//stdout.textContent = event.target[event.target.selectedIndex].outerHTML;
				moduleBrowser.innerHTML ='';
				let opt = event.target[event.target.selectedIndex].value.split('|');
				getModules(user.type, user.rouCode, opt[0], opt[2]);
			}
			
		});
	}; */

	//////////////////////////////////////////////

	const moduleLink = data => {
		const sid = document.querySelector('meta[name="sid"]') ? document.querySelector('meta[name="sid"]').getAttribute('content') : 'error_sid-not-found';
		return `${urls.viewer}?code=${data.modCode}&session=${data.mavSemSession}&semester=${data.mavSemCode}&occurrence=${data.mavOccurrence}&course=${sid}`;
	}; 

	const moduleTemplate = data => 
		`<tr>
			<td>
				<a href="${moduleLink(data)}">${data.modName}</a> <span class=c-course-modules__module-code>(${data.modCode})</span>
			</td>
			<td>${data.modCredit} credits</td>
		</tr>`;
	
	const template = {
		collection: data => `<table class=c-course-modules__table>${data}</table>`
	};
	
	const moduleView = data => data.modName ? moduleTemplate(data) : "<tr><td colspan=2>------- no data</td></tr>";

	const groupView = data => data.groupOptions.map(optionView).join('');

	const optionView = (data,index,array) => '<p>' + (array.length>1?`(Option ${index+1}) `:'') + `${data.semestersInOption.map(semesterView).join('')}`;

	const semesterView = data => `Year ${stir.cardinal(year)}: semester <b>${stir.cardinal(data.semesterCode)}</b></p> ${data.collections.map(collectionView).join('')}`; //Group: <b>${data.overarchPdtCode}</b>

	const collectionView = data => `<p><b>${data.collectionNotes}</b></p>${ template.collection( data.mods.map(moduleView).join('') )}`;

	const modulesOverview = data => {
		console.info('[DPT] modulesOverview',data); //data.semesterGroupBeans
		let frag = document.createElement('div');
		frag.insertAdjacentHTML("afterbegin",data.semesterGroupBeans.map(groupView).join(''));
		return frag;
	};

	///////////////////////////////////////
	
	const routeOptionView = data => `<option value="${data.join('|')}">Starting ${data[3]}, ${data[1].toLowerCase()} (${data[4]})</option>`;

	const selectView = data => {
		const selector = document.createElement("select");
		selector.id = "course-modules-container__routes-select";
		selector.insertAdjacentHTML("afterbegin",data.map(routeOptionView).join(''));
  
//		rouList.insertAdjacentHTML("afterbegin", "<p>Please choose a course:</p>");
//		rouList.appendChild(selector);
//		optList.innerHTML = "<p>There are " + stir.cardinal(optionsData.length) + " options for this course:</p>";
//		optList.appendChild(selector);

		// set behaviour of each select
		selector.addEventListener("change", function (e) {
			var value = this.options[this.selectedIndex].value.split("|");
			var moa = value[0];
			var occ = value[2];

			stir.dpt.reset.modules();
			getModules(user.type, user.rouCode, moa, occ);
			// this will load and display the modules
		});

		return selector;
	};

//	const renderp = (html, css) => {
//		const p = document.createElement('p');
//		p.innerHTML = html;
//		 css && p.classList.add(css);
//		return p;
//	};

//	const renderOptions = (element, data) => {
//		data.map(optionView).forEach(option => element.appendChild(option));
//	};

/* 	const renderModules = data => {
		moduleBrowser.querySelector('.u-loading').remove();
		const div = document.createElement('div');
		div.innerHTML = data.map(moduleView).join("\n");
		moduleBrowser.appendChild(div);
	}; */
	
/* 	const compare = (a, b) => {
		if (a < b) return -1;
		if (a > b) return 1;
		return 0; // a must be equal to b
	}; */

	/* const routeSort = (a, b) => compare(a.rouName, b.rouName); */

	/* const makeOption = data => {
		const option = document.createElement('option');
		if(data.rouName && data.rouCode) {
			option.textContent = `${data.rouName}`;
			option.value = data.rouCode
			return option.outerHTML;
		}
		if(data[0] && data[2]) {
			option.textContent = data.join('|');
			option.value = data.join('|');
		}
		
		option.textContent = JSON.stringify(data,null,"\t");
		return option.outerHTML;
	}; */

//	const extractModules = data => {
//		var output = [];
//		for (var g = 0; g < data.semesterGroupBeans.length; g++) {
//			// groups loop
//			for (var o = 0; o < data.semesterGroupBeans[g].groupOptions.length; o++) {
//				// options in group
//				for (var s = 0; s < data.semesterGroupBeans[g].groupOptions[o].semestersInOption.length; s++) {
//					var semester = data.semesterGroupBeans[g].groupOptions[o].semestersInOption[s];
//					var collections = semester.collections;
//					for (var c = 0; c < collections.length; c++) {
//						var collection = collections[c];
//						for (var m = 0; m < collection.mods.length; m++) {
//							var module = collection.mods[m];
//							output.push(module);
//						}
//					}
//				}
//			}
//		}
//		return output;
//	};
	
	return {
		show: {
			fees: data => console.info(data),
			options: new Function(),
			modules: new Function(), //data => renderModules(extractModules(data)),
			/* routes: data => makeSelector(data, 'rouCode'), */
			/* lookup: data => {
				const frag = document.createElement('div');
				const el = document.querySelector("#course-modules-container");
				frag.innerHTML = data;
				el && el.appendChild(frag);
			} */
		},
		get: {
			options: getOptions,
			routes: getRoutes,
			viewer: ()=>urls.viewer
		},
		reset: {
			modules: new Function()
		},
		set: {
			viewer: path => urls.viewer = path,
			show: {
				options: callback => stir.dpt.show.options = data => {
					callback(selectView(data));
					if(user.auto && user.type && user.rouCode) {
						getModules(user.type, user.rouCode, data[0][0], data[0][2]);
					}
				},
				modules: callback => stir.dpt.show.modules = data => callback(modulesOverview(data)),
			},
			reset: {
				modules: callback => stir.dpt.reset.modules = callback
			}
		},


	};




})();