var stir = stir || {};

/* ------------------------------------------------
 * @author: Ryan Kaye, Robert Morrison
 * @version: 4 - Migrate to AddSearch
 * ------------------------------------------------ */
 
 
 /***
  * TEMPORARY - move to impl/session.js
  ***/
 stir.session = (()=>{
	 
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const session = {};	
	
	function generateID() {
		const time = Date.now();
		const randomNumber = Math.floor(Math.random() * 1000000001);
		return time + "_" + randomNumber;
	}
	
	if (window.sessionStorage && sessionStorage.getItem("session")) {
		session.id = sessionStorage.getItem("session");
		debug && console.info("[Session] ongoing session:",session.id);
	} else {
		session.id = generateID();
		window.sessionStorage && sessionStorage.setItem("session",session.id);
		debug && console.info("[Session] new session:",session.id);
	}
	
	return session;
	 
 })();
 

/**
 * Search API helper
 */
stir.funnelback = (() => {
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const hostname = UoS_env.search;
	const url = `https://${hostname}/s/`;

	const getJsonEndpoint = () => new URL("search.json", url);
	const getScaleEndpoint = () => new URL("scale", url);
	const getHostname = () => hostname;
	const renderImgTag = (image) => `<img src="${image.src}" alt="${image.alt}" height="${image.height}" width="${image.width}" loading=lazy data-original=${image.original}>`;

	const getCroppedImageElement = (parameters) => {
		if (!parameters.url) return "<!-- no image -->";
		return renderImgTag({ src: parameters.url, alt: parameters.alt, width: Math.floor(parameters.width / 2), height: Math.floor(parameters.height / 2), original: parameters.url });
	};

	const getTags = (tagMeta) => {
		const tagGroups = tagMeta && tagMeta.split(";");
		return tagGroups && tagGroups.map(stir.templates.search.tagGroup).join("");
	};

	return {
		getHostname: getHostname,
		getJsonEndpoint: getJsonEndpoint,
		getScaleEndpoint: getScaleEndpoint,
		getCroppedImageElement: getCroppedImageElement,
		getTags: getTags
	};
})();

stir.addSearch = (() => {
	// e.g. https://api.addsearch.com/v1/search/cfa10522e4ae6987c390ab72e9393908?term=rest+api

	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const KEY = "dbe6bc5995c4296d93d74b99ab0ad7de"; //public site key
	const _server = "api.addsearch.com";
	const _url = `https://${_server}`;
	const REPORTING = false; //click tracking etc.

	const getJsonEndpoint = () => new URL(`/v1/search/${KEY}`, _url);
	const getSuggestionsEndpoint = () => new URL(`/v1/suggest/${KEY}`, _url);
	const getAutocompleteEndpoint = () => new URL(`/v1/autocomplete/document-field/${KEY}`, _url);
	const getRecommendationsEndpoint = (block) => new URL(`/v1/recommendations/index/${KEY}/block/${block}`, _url);
	const getReportingEndpoint = () => new URL(`/v1/stats/${KEY}`,_url);
	
	const getCompletions = (data,callback) => {
		if("function" !== typeof callback) return;
		const url = getAutocompleteEndpoint();
		const params = new URLSearchParams(data);
		url.search = params;
		stir.getJSON(url,data=>console.info("getCompletions",data));
	};
	
	const getSuggestions = (term,callback) => {
		if("function" !== typeof callback) return;
		const url = getSuggestionsEndpoint();
		url.search = `term=${term}`;
		stir.getJSON(url,callback);
	};
	
	/* Recommendations - AddSearch extra */
	const getRecommendations = (block,callback) => {
		if("function" !== typeof callback) return;
		stir.getJSON(getRecommendationsEndpoint(block),callback);
	};
	
	const putReport = (data,callback) => {
		
		if(!REPORTING) {
			debug && console.info("[AddSearch] reporting is disabled");
			if("function" === typeof callback) callback();
			return;
		}
		
		const req = new Request(getReportingEndpoint(),{
			method: "POST",
			body: JSON.stringify(data)
		});
		
		debug && console.info("[AddSearch] Report",data);
		
		fetch(req)
			.then((response) => {
				if(response.status !== 200) {
					throw new Error("Oops!");
				}
				return response;
			})
			.then((response) => {
				if("function" === typeof callback) callback.call(null,response);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return {
		getJsonEndpoint: getJsonEndpoint,
		getCompletions: getCompletions,
		getSuggestions: getSuggestions,
		getRecommendations: getRecommendations,
		putReport: putReport
	};
})();

/**
 * Stir Search
 * Created for the Search Revamp project 2022/23
 * Migrated to AddSearch October 2025
 * @returns Object
 */
stir.search = (() => {
		// abandon before anything breaks in IE
		if ("undefined" === typeof window.URLSearchParams) {
			const el = document.querySelector( stir.templates.search.selector.results );
			el && el.parentElement.removeChild(el);
			return;
		}
	
		const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
		debug && console.info("[Search] initialising…");
	
		const NUMRANKS = "small" === stir.MediaQuery.current ? 5 : 10;
		const MAXQUERY = 256;
		const CLEARING = stir.courses.clearing; // Clearing is open?
	
		const buildUrl = stir.curry((url, parameters) => {
			url.search = new URLSearchParams(parameters);
			return url;
		});
	
		const LoaderButton = () => {
			const button = document.createElement("button");
			button.innerText = stir.templates.search.strings.buttons.more;
			button.setAttribute("class", stir.templates.search.classes.buttons.more);
			return button;
		};
	
		const constants = {
			url: stir.addSearch.getJsonEndpoint(),
			form: document.querySelector( stir.templates.search.selector.form ),
			input: document.querySelector( stir.templates.search.selector.query ),
			parameters: {
				any: {
					term: "University of Stirling",
					limit: NUMRANKS
				},
				news: {
					customField: "type=news",
					sort: "custom_fields.d"
				},
				event: {
					filter: JSON.stringify({
						and: [
							{
								or: [
									{ "custom_fields.type": "event"   },
									{ "custom_fields.type": "webinar" }
								]
							},
							{
								range: {
									"custom_fields.e": {
										gt: stir.Date.timeElementDatetime( (d => new Date(d.setDate(d.getDate()-1)))(new Date) )
									}
								}
							}
						]
					})
				},
				gallery: {
					customField: "type=gallery"
				},
				course: {
					customField: "type=course"
				},
				coursemini: {
					customField: "type=course",
					limit: 5
				},
				person: {
					customField: "type=profile",
				},
				research: {
					categories: "2xhub",
				},
				internal: {
					filter: JSON.stringify({
						or: [
							{ "custom_fields.access": "staff"   },
							{ "custom_fields.access": "student" }
						]
					}),
				},
				clearing: {
					limit: NUMRANKS
	//				term: "!padrenullquery",
	//				sort: "custom_fields.name",
	//				meta_clearing: "[scotland simd rukroi international eu]",
	//				SF: `[${meta.courses.concat(meta.clearing).join(",")}]`,
	//				fmo: "true",
					/* explain: true,
					query: "!padrenullquery",
					timestamp: +new Date(), */
				},
			},
	
			// +++ Extra/override parameters for no-query searches +++
			// E.g. if no keywords supplied; sort by title instead of relevance
			noquery: {
				course: {
					sort: "custom_fields.name",
					order: "asc"
				},
				person: {
					sort: "custom_fields.sort",
					order: "desc"
				},
				event: {
					sort: "custom_fields.e",	// sort events by date descending
					order: "asc"
				}
			},
		};
	
		if (!constants.form || !constants.form.term) return;
		debug && console.info("[Search] initialised with host:", constants.url.hostname);
	
		/* Add the filter parameters (e.g. courses, sorting) */
		const addFilterParameters = (url, formData) => {
			let a = new URLSearchParams(url.search);
			let b = new URLSearchParams(formData);
			for (let [key, value] of b) { "sort"===key? a.set(key, value) : a.append(key, value); }
			url.search = a;
			return url;
		};
		
		const getDefaultQueryForType = type => type && constants.parameters[type] ? constants.parameters[type].term : undefined;
	
		const getQuery = (type) => constants.form.term.value || QueryParams.get("term") || getDefaultQueryForType(type) || "*";
	
		const getNoQuery = (type) => (constants.form.term.value ? {} : constants.noquery[type]);
	
		const setQuery = () => (constants.form.term.value ? QueryParams.set("term", constants.form.term.value) : QueryParams.remove("term"));
	
		const getPage = (type) => parseInt(QueryParams.get(type) || 1);
	
		const getType = (element) => element.getAttribute("data-type") || element.parentElement.getAttribute("data-type");
	
		const nextPage = (type) => QueryParams.set(type, parseInt(QueryParams.get(type) || 1) + 1);
	
		const calcStart = (page, numRanks) => (page - 1) * numRanks + 1;
	
		const calcEnd = (page, numRanks) => calcStart(page, numRanks) + numRanks - 1;
	
		const calcPage = (currStart, numRanks) => Math.floor(currStart / numRanks + 1);
	
		const calcProgress = (currEnd, fullyMatching) => (currEnd / fullyMatching) * 100;
	
		//const getStartRank = (type) => calcStart(getPage(type), constants.parameters[type].num_ranks || 20);
	
		const resetPagination = () => Object.keys(constants.parameters).forEach((key) => QueryParams.remove(key));
	
		const getQueryParameters = () => {
			let parameters = QueryParams.getAll();
			let facetParameters = Object.keys(parameters)
				.filter((key) => key.indexOf("f.") === 0)
				.reduce((obj, key) => {
					return { ...obj, [key]: rwm2.string.urlDecode(parameters[key]).toLowerCase() };
				}, {});
			//debug && Object.keys(facetParameters).length && console.info('[Search] facetParameters:',facetParameters);
			return facetParameters;
		};
	
		const getFormData = (type) => {
			const form = document.querySelector(`${stir.templates.search.selector.results} form[data-filters="${type}"]`);
			let a = form ? new FormData(form) : new FormData();
	
			// for (var key of a.keys()) {
			// 	if (key.indexOf("f.") === 0) continue; //ignore any facets
			// 	if (a.getAll(key).length > 1) {
			// 		// merge values into one dysjunction operator
			// 		// as used in the Research type filter's "Other" option:
			// 		// "publication", "contract", "[tag theme programme group]"
			// 		// will become "[publication contract tag theme programme group]"
			// 		//a.set(key, "[" + a.getAll(key).join(" ").replace(/\[|\]/g, "") + "]");
			// 	}
			// }
	
			return a;
		};
	
		const getInboundQuery = () => {
			if (undefined !== QueryParams.get("term")) constants.form.term.value = QueryParams.get("term").substring(0, MAXQUERY);
			const parameters = QueryParams.getAll();
			for (const name in parameters) {
				const el = document.querySelector(`input[name="${encodeURIComponent(name)}"][value="${encodeURIComponent(parameters[name])}"]`);
				if (el) el.checked = true;
			}
		};
	
		const setUrlToFilters = (type) => {
			//const {filters, values} = getFormElementValues(type);
			//debug && filters.forEach((filter,i)=>QueryParams.set(filter, values[i]));
			//TODO: un-set any URL params that have corresponding <input> elements that are NOT checked
			// (but ignore any params that aren't related to the filters)
		};
	
		// DOM modifiers:
		const appendHtml = stir.curry((_element, html) => _element.insertAdjacentHTML("beforeend", html));
		const replaceHtml = stir.curry((_element, html) => (_element.innerHTML = html));
	
		// enable the "load more" button if there are more results that can be shown
		const enableLoadMore = stir.curry((button, data) => {
			if (!button) return data;
			if (data && data.total_hits > 0) button.removeAttribute("disabled");
			//if (data.response.resultPacket.resultsSummary.currEnd === data.response.resultPacket.resultsSummary.totalMatching) button.setAttribute("disabled", true);
			return data;
		});
	
		const newAccordion = (accordion) => new stir.accord(accordion, false);
		const attachImageErrorHandler = (image) => image.addEventListener("error", imgError);
	
		// "reflow" events and handlers for dynamically added DOM elements
		const flow = stir.curry((_element, data) => {
			if (!_element.closest) return;
			const root = _element.closest("[data-panel]");
			const cords = root.querySelectorAll('[data-behaviour="accordion"]:not(.stir-accordion)');
			const pics = root.querySelectorAll("img");
			console.info("PICS +++ ",pics)
			Array.prototype.forEach.call(cords, newAccordion);
			Array.prototype.forEach.call(pics, attachImageErrorHandler);
		});
	
		const updateStatus = stir.curry((wrapper, data) => {
			const start = 1 + (data.page * data.hits.length) - data.hits.length;
			const ranks = data.total_hits;
			const el = wrapper.parentElement.parentElement.querySelector(stir.templates.search.selector.summary);
			if (el) {
				el.innerHTML = "";
				el.append(stir.templates.search.summary(data));
			}
			wrapper.setAttribute("data-page", calcPage(start, ranks));
			return data; // data pass-thru so we can compose() this function
		});
	
		// maintain compatibility with old meta_ search
		// parameters with their equivalent facet:
		const metaToFacet = {
			meta_level: "f.Level|level",
			meta_faculty: "f.Faculty|faculty",
			meta_subject: "f.Subject|subject",
			meta_delivery: "f.Delivery mode|delivery",
			meta_modes: "f.Study mode|modes",
		};
	
		// TEMP - please move to stir.String when convenient to do so!
		const rwm2 = {
			string: {
				urlDecode: (str) => decodeURIComponent(str.replace(/\+/g, " ")),
			},
		};
	
		const updateFacets = stir.curry((type, data) => {
			return data; 
			/* const form = document.querySelector(`form[data-filters="${type}"]`);
			if (form) {
				const parameters = QueryParams.getAll();
				const active = "stir-accordion--active";
	
				data.response.facets.forEach((facet) => {
					const metaFilter = form.querySelector(`[data-facet="${facet.name}"]`);
					const metaAccordion = metaFilter && metaFilter.querySelector("[data-behaviour=accordion]");
					const open = metaAccordion && metaAccordion.getAttribute("class").indexOf(active) > -1;
	
					const facetName = facet.categories && facet.categories[0] && facet.categories[0].queryStringParamName;
					const metaName = facetName && Object.keys(metaToFacet)[Object.values(metaToFacet).indexOf(facetName)];
					const metaValue = (metaName && parameters[metaName]) || (parameters[facetName] && rwm2.string.urlDecode(parameters[facetName]));
					const selector = facetName && metaValue && `input[name="${facetName}"][value="${metaValue.toLowerCase()}"]`;
					const facetFilter = stir.DOM.frag(stir.String.domify(stir.templates.search.facet(facet)));
					const facetFilterElements = selector && Array.prototype.slice.call(facetFilter.querySelectorAll(selector));
					facetFilterElements &&
						facetFilterElements.forEach((el) => {
							el.checked = true;
							metaName && QueryParams.remove(metaName, false, null, true); // don't reload window and use replaceState() instead of pushState()
							facetName && QueryParams.remove(facetName, false, null, true, false); // don't reload window and use replaceState() instead of pushState()
						});
	
					const facetAccordion = facetFilter.querySelector("[data-behaviour=accordion]");
					(open || facetFilterElements) && facetAccordion && facetAccordion.setAttribute("class", active);
					if (metaFilter) {
						metaFilter.insertAdjacentElement("afterend", facetFilter.firstChild);
						metaFilter.parentElement.removeChild(metaFilter);
					} else {
						form.insertAdjacentElement("afterbegin", facetFilter.firstChild);
					}
					if ("Start date" === facet.name) {
						stir.courses.startdates();
					}
				});
			}
			return data; // data pass-thru so we can compose() this function */
		});
		
		const addResultItemPosition = stir.curry((type,item,index,context) => {
			const page = getPage(type)-1;
			const per  = constants.parameters[type].limit || 10;
			const position = 1 + index + page * per;
			item.position = item.position || position;
			return item;
		});
	
		const renderResultsWithPagination = stir.curry(
			(type, data) => {
				
				// renderers["cura"](data.response.curator.exhibits) +
				return (data ? renderers[type](data.hits.map(addResultItemPosition(type))).join("") : 'NO DATA') +
				stir.templates.search.pagination({
					currEnd: calcEnd(data.page, data.hits.length),
					totalMatching: data.total_hits,
					progress: calcProgress(10, data.total_hits),
				}) + (footers[type] ? footers[type]() : "")
			}
		);
	
		/**
		 * Custom behaviour in the event of no results
		 **/
		const fallback = (element) => {
			if (!element || !element.hasAttribute("data-fallback")) return false;
			const template = document.getElementById(element.getAttribute("data-fallback"));
			const html = template && (template.innerHTML || "");
			element.innerHTML = html;
			return true;
		};
	
		// +++ COURSE - subject filter +++
		{
			let el = document.getElementById('courseSubjectFilters');
			if (el && stir.t4Globals.search.facets["Subject"]) {
				stir.t4Globals.search.facets["Subject"].forEach(subject => {
					const li = document.createElement('li');
					li.innerHTML = `<label><input name=customField type=checkbox value="subject=${subject}">${subject}</label>`;
					el.appendChild(li);
				});
			}
			
			el = document.querySelector('[data-facet="Faculty"] ul');
			if (el && stir.t4Globals.search.facets["Faculty"]) {
				el.innerHTML = '';
				let faculties = stir.t4Globals.search.facets["Faculty"]
				Object.keys(faculties).forEach(faculty => {
					const li = document.createElement('li');
					li.innerHTML = `<label><input name=customField type=checkbox value="faculty=${faculties[faculty]}">${faculties[faculty]}</label>`;
					el.appendChild(li);
				});
			}
	
			el = document.querySelector('[data-facet="Start date"] ul');
			if (el && stir.t4Globals.search.facets["Start date"]) {
				el.innerHTML = '';
				let dates = stir.t4Globals.search.facets["Start date"]
				Object.keys(dates).forEach(date => {
					const li = document.createElement('li');
					li.innerHTML = `<label><input name=customField type=checkbox value="start=${date}">${dates[date]}</label>`;
					el.appendChild(li);
				});
			}
	
			el = document.querySelector('[data-facet="Topic"] ul');
			if (el && stir.t4Globals.search.facets["Topic"]) {
				el.innerHTML = '';
				let dates = stir.t4Globals.search.facets["Topic"]
				Object.keys(dates).forEach(date => {
					const li = document.createElement('li');
					li.innerHTML = `<label><input name=customField type=checkbox value="tag=${date}">${dates[date]}</label>`;
					el.appendChild(li);
				});
			}
	
			el = document.querySelector('[data-facet="SDGs"] ul');
			if (el && stir.t4Globals.search.facets["SDGs"]) {
				el.innerHTML = '';
				let dates = stir.t4Globals.search.facets["SDGs"]
				Object.keys(dates).forEach(date => {
					const li = document.createElement('li');
					li.innerHTML = `<label><input name=customField type=checkbox value="sdg=${dates[date]}">${dates[date]}</label>`;
					el.appendChild(li);
				});
			}
		}
	
		// This is the core search function that talks to the search API
		const callSearchApi = stir.curry((type, callback) => {	
			const parameters = 
				stir.Object.extend(
					{ },
					constants.parameters[type],
					{ page: getPage(type), term: getQuery(type) },
					getNoQuery(type), // get special "no query" parameters (sorting, etc.)
					getQueryParameters(), // get facet parameters
				);
			stir.getJSON( addFilterParameters( buildUrl(constants.url,parameters), getFormData(type) ), callback(parameters));
		});
		
		// triggered automatically, and when the search results need re-initialised (filter change, query change etc).
		const getInitialResults = (element, button) => {
			const type = getType(element);
			if (!searchers[type]) return;
			const facets = updateFacets(type);
			const status = updateStatus(element);
			const more = enableLoadMore(button);
			const replace = replaceHtml(element);
			const render = renderResultsWithPagination(type);
			const reflow = flow(element);
			const composition = stir.compose(reflow, replace, render, more, status, facets);
			const callback = stir.curry((parameters,data) => {
				
				debug && console.info("[Search] API callback with parameters",parameters);
				
				if (!element || !element.parentElement) {
					return debug && console.error("[Search] late callback, element no longer on DOM");
				}
				//TODO intercept no-results and spelling suggestion here. Automatically display alternative results?
				if (!data || data.error) return;
				if (0 === data.total_hits && fallback(element)) return;
				
				// Append AddSearch data with `question` object (à la Funnelback)
				return composition( stir.Object.extend({}, data, {question:parameters}) );
				
			});
			resetPagination();
		
			// if necessary do a prefetch and then call-back to the search function.
			// E.g. Courses needs to prefetch the combinations data
			if (prefetch[type]) return prefetch[type]((event) => searchers[type](callback));
			// else (if no prefetch) just call the search function now:
			searchers[type](callback);
		};
		
		// triggered by the 'load more' buttons.
		// Similar to getResults but APPENDS (rather than replacing).
		const getMoreResults = (element, button) => {
			const type = getType(element);
			if (!searchers[type]) return;
			const status = updateStatus(element);
			const append = appendHtml(element);
			const render = renderResultsWithPagination(type);
			const reflow = flow(element);
			const composition = stir.compose(reflow, append, render, enableLoadMore(button), status);
			const callback = stir.curry((parameters,data) => (data && !data.error ? composition(stir.Object.extend({},data,{question:parameters})) : new Function()));
			nextPage(type);
			searchers[type](callback);
		};
		
		// initialise all search types on the page (e.g. when the query keywords are changed by the user):
		const initialSearch = () => searches.forEach(search);
	
		const search = (element) => {
			element.innerHTML = "";
			if (element.hasAttribute("data-infinite")) {
				const resultsWrapper = document.createElement("div");
				const buttonWrapper = document.createElement("div");
				const button = LoaderButton();
				button.setAttribute("disabled", true);
				button.addEventListener("click", (event) => getMoreResults(resultsWrapper, button));
				element.appendChild(resultsWrapper);
				element.appendChild(buttonWrapper);
				buttonWrapper.appendChild(button);
				buttonWrapper.setAttribute("class", stir.templates.search.classes.buttons.wrapper);
				getInitialResults(resultsWrapper, button);
			} else {
				getInitialResults(element);
			}
		};
	
		const searches = Array.prototype.slice.call(document.querySelectorAll(".c-search-results[data-type],[data-type=coursemini]"));
	
		// group the curried search functions so we can easily refer to them by `type`
		const searchers = {
			any: callSearchApi("any"),
			news: callSearchApi("news"),
			event: callSearchApi("event"),
			gallery: callSearchApi("gallery"),
			course: callSearchApi("course"),
			coursemini: callSearchApi("coursemini"),
			person: callSearchApi("person"),
			research: callSearchApi("research"),
			internal: callSearchApi("internal"),
			clearing: callSearchApi("clearing"),
		};
	
		// group the renderer functions so we can get them easily by `type`
		const renderers = {
			any: data => data.map(stir.templates.search.auto),
			news: data => data.map(stir.templates.search.news),
			event: data => data.map(stir.templates.search.event),
			gallery: data => data.map(stir.templates.search.gallery),
			course: data => data.map(stir.templates.search.course),
			coursemini: data => data.map(stir.templates.search.coursemini),
			person: data => data.map(stir.templates.search.person),
			research: data => data.map(stir.templates.search.research),
			cura: data => data.map(stir.templates.search.cura),
			internal: data => data.map(stir.templates.search.auto),
			clearing: data => data.map(stir.templates.search.auto),
		};
	
		const footers = {
			coursemini: () => stir.templates.search.courseminiFooter(getQuery("any")),
		};
	
		const prefetch = {
			course: (callback) => {
				stir.coursefavs && stir.coursefavs.attachEventHandlers(); // listen for Favs events
				let xmlHttpRequest = stir.courses.getCombos();
				if (xmlHttpRequest) {
					xmlHttpRequest.addEventListener("loadend", callback); // loadend should fire after load OR error
				} else {
					callback.call();
				}
			},
		};
	
	
		// CLICK delegate for link tracking
		const clickReporter = event => {
			if (!event || !event.target || !event.target.hasAttribute("href")) return;
			
			const href     = event.target.getAttribute("href");
			const docid    = event.target.getAttribute('data-docid');
			const position = event.target.getAttribute('data-position');
			const query    = getQuery();
			const payload  = {
				action: "click",
				session: stir.session.id,
				keyword: query,
				docid: docid,
				position: position
			};

			if(href && query && position && docid) {
				event.preventDefault();
				stir.addSearch.putReport(payload,(response)=> window.location=href );
			} else {
				debug && console.error("Error tracking click:", event, payload);
			}
	
		};
		
		document.querySelectorAll("[data-panel]").forEach(panel => panel.addEventListener("click",clickReporter) );
	
	
		// onCHANGE event handler for search filters.
		// Also handles the onRESET event.
		Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-area form[data-filters]"), (form) => {
			const type = form.getAttribute("data-filters");
			const element = document.querySelector(`.c-search-results[data-type="${type}"]`);
			form.addEventListener("reset", (event) => {
				// native RESET is async so we need to do it manually
				// to ensure it's done synchonosly instead…
				Array.prototype.forEach.call(form.querySelectorAll("input"), (input) => (input.checked = false));
				// Only *after* the form has been reset, we can re-run the
				// search function. (That's why native RESET is no good).
				search(element);
			});
			form.addEventListener("change", (event) => {
				setUrlToFilters(getType(element));
				search(element);
			});
			// Just in case, we'll also catch any
			// SUBMIT events that might be triggered:
			form.addEventListener("submit", (event) => {
				search(element);
				event.preventDefault();
			});
		});
		
		function imgError(error) {
			//debug && console.error('[Search] There was an error loading a thumbnail image:', error.target);
			if (error.target.getAttribute("data-original") && error.target.getAttribute("src") != error.target.getAttribute("data-original")) {
				 //debug && console.error('[+++] …reverting to original image: ', error.target.getAttribute('data-original'));
				 error.target.src = error.target.getAttribute("data-original");
			} else {
				//debug && console.error('[Search] …no alternative image available. It will be removed.');
				error.target.parentElement.parentElement?.classList?.remove("c-search-result__with-thumbnail");
				error.target.parentElement.parentElement.removeChild(error.target.parentElement);
			}
		}
	
		const tokenHandler = (event) => {
			if (!event || !event.target) return;
	
			/**
			 * selector	the CSS selector for the <input> element we want to toggle
			 * root: 	the "root" element to search within (the closest `data-panel`
			 * 			should contain the search tokens, results and filters) in
			 * 			other words only look among the filters for the current
			 * 			search panel, and don't toggle any filters in other panels!
			 * 			(Noticed this becuase `faculty` is common to courses and news)
			 * input	the input element we want to toggle
			 */
			const selector = `input[name="${event.target.getAttribute("data-name")}"][value="${event.target.getAttribute("data-value")}"]`;
			const root = event.target.closest("[data-panel]") || document;
			const input = root.querySelector(selector);
	
			if (input) {
				input.checked = !input.checked; // toggle it
				event.target.parentElement.removeChild(event.target); // remove the token
				initialSearch(); // resubmit the search for fresh results
			} else {
				const sel2 = `select[name="${event.target.getAttribute("data-name")}"]`;
				const select = document.querySelector(sel2);
				if (select) {
					select.selectedIndex = 0;
					event.target.parentElement.removeChild(event.target);
					initialSearch();
				}
			}
		};
	
		// Click-delegate for status panel (e.g. misspellings, dismiss filters, etc.)
		Array.prototype.forEach.call(document.querySelectorAll(stir.templates.search.selector.summary), (statusPanel) => {
			statusPanel.addEventListener("click", (event) => {
				if (event.target.hasAttribute("data-suggest")) {
					event.preventDefault();
					constants.input.value = event.target.innerText;
					setQuery();
					initialSearch();
				} else if (event.target.hasAttribute("data-value")) {
					tokenHandler(event);
				}
			});
		});
		Array.prototype.forEach.call(document.querySelectorAll(".c-search-results"), (resultsPanel) => {
			resultsPanel.addEventListener("click", (event) => {
				if (!event.target.hasAttribute("data-value")) return;
				tokenHandler(event);
			});
		});
	
		/**
		 * Running order for search:
		 * get url
		 *  - host
		 *  - fixed parameters (from form)
		 *  - variable parameters (from page query string)
		 * prefetch (e.g. course combo data)
		 * fetch results from funnelback
		 * process and filter data
		 * render results via templates
		 * send out to the page DOM
		 * load more results on-demand
		 */
	
		const submit = (event) => {
			setQuery();
			initialSearch();
			event.preventDefault();
		};
	
		const init = (event) => {
			getInboundQuery();
			constants.form.addEventListener("submit", submit);
			initialSearch();
		};
	
		window.addEventListener("popstate", init);
		
		return {
			init: init,
			constants: constants,
			getPage: getPage
		};
	})();

stir.search.init();