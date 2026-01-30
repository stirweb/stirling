var stir = stir || {};

stir.templates = stir.templates || {};
stir.const = stir.const || {};

stir.templates.search = (() => {
	/**
	 * Some private members to help with data processing.
	 * They can also be referred to locally, instead of
	 * invoking the absolute object stir.templates.blah.blah.blah
	 * */
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const notice = (text) => `<p class="u-heritage-berry u-border-solid u-p-1"><span class="uos-lightbulb"></span> ${text}</p>`;
	const summary = (text) => `<p class=c-search-result__summary>${text}</p>`;

	// STAFF / STUDENT status checking
	const groups = {
		staff: "University of Stirling staff",
		student: "current students and staff",
	};
	const entitlements = {
		staff: ["staff", "student"],
		student: ["student"],
	};
	const afce4eafce490574e288574b384ecd87 = window[["s", "e", "i", "k", "o", "o", "C"].reverse().join("")]; // Just a bit of mild fun to stop anyone text-searching for "Cookies"!
	const isUser = afce4eafce490574e288574b384ecd87.get("psessv0") ? true : false; // Cookie could be spoofed, but we'll trust it. The Portal will enforce authentication anyway.
	const userType = isUser ? afce4eafce490574e288574b384ecd87.get("psessv0").split("|")[0] : "EXTERNAL";
	const userAuth = (group) => entitlements[userType.toLowerCase()]?.indexOf(group.toLowerCase()) > -1;
	const authClass = (group) => (userAuth(group) ? " c-internal-search-result" : " c-internal-locked-search-result");
	const authMessage = (group) => notice(`This page is only available to ${groups[group]||group}. You will be asked to log in before you can view it, but once you are logged in results will be shown automatically.`);
	const internalSummary = (text, group) => (userAuth(group) ? summary(text) : authMessage(group));

	// Special handling for documents (PDF, DOC; as opposed to native web results)
	const isDocUrl = (url) => {
		const docUrlSlashDotSplit = url.toUpperCase().split("/").slice(-1).toString().split(".");
		return docUrlSlashDotSplit.length > 1 && docUrlSlashDotSplit[1].match(/PDF|DOCX?/); // Other types can be added to this list if necessary
	};

	const makeBreadcrumbs = (item) => {
		const crumbs = {
			text: item.custom_fields.breadcrumb ? item.custom_fields.breadcrumb.split(" > ").slice(1, -1) : item.categories.slice?item.categories.slice(1,-1).map(crumb=>crumb.split("x")[1]):[''],
			href: new URL(item.url).pathname.split("/").slice(1, -1),
		};
		
		const trail = crumbs.text.map((text, index) => ({ text: text, href: "/" + crumbs.href.slice(0, index + 1).join("/") + "/" }));

		if (trail && trail.length > 0) {
			return stir.templates.search.breadcrumb(stir.templates.search.trailstring(trail));
		}
		if (isDocUrl(item.url)) {
			return `Document: ${isDocUrl(item.url)} <small>${stir.Math.fileSize(fileSize || 0, 0)}</small>`;
		}
		return "";
	};

	const checkSpelling = (suggestion) => (suggestion ? `<p>Did you mean <a href="#" data-suggest>${suggestion.text.split(" ")[0]}</a>?</p>` : "");
	
	/**
	 *
	 * @param {String} name
	 * @param {String} value
	 * @returns Element
	 *
	 * For a given name and value, return the first matching HTML <input> or <option> element.
	 */
	const metaParamElement = (name, value) => {
		const selector = `form[data-filters] input[name="${name}"][value="${value}"]`; //,select[name="${name}"] option[value="${value}"]
		try {
			return document.querySelector(selector);
		} catch(e) { }
	};

	//	const metaParamToken = (name, values) => {
	//		if (name === "meta_type") return; // ignore `type`
	//		if (name === "meta_faculty") return; // ignore `faculty`
	//		if (values.charAt(0) == "-") return; // ignore negative parameters
	//		if (values.charAt(1) == ">") return; // ignore date-range parameters
	//		if (values.indexOf(" ") >= 1) {
	//			const tokenArr = values.split(" ");
	//			const el = metaParamElement(name, tokenArr[1]);
	//			if (el) {
	//				return tag(el.parentElement.innerText, tokenArr[0], tokenArr[1]);
	//			}
	//		}
	//		return;
	//	};

	/**
	 *
	 * @param {Object} tokens
	 * @returns String (HTML)
	 *
	 * Create clickable text elements (i.e. "tokens") that represent the active search filters, to give the user the
	 * option to dismiss each filter quickly (and a visual reminder of which filters are active).
	 *
	 * Becuase the search result data only contains the raw names/values of the filters, we need to derive the correct
	 * text labels from the form inputs on the page. We also need to unbundle checkbox (multi-select) filters and deal
	 * with any other unusual filters (such as Faculty and course Start Date).
	 *
	 */
	const metaParamTokens = (tokens) => {
		const metas = Object.keys(tokens).filter((key) => key.indexOf("meta_") === 0 && tokens[key][0]);
		return metas
			.map((key) => {
				// does the name and value exactly match a DOM element?
				// i.e. an <input> element from which we can grab the text label
				if ((el = metaParamElement(key, tokens[key]))) {
					if ("hidden" === el.type) return; // ignore hidden inputs (as they have no text!)
					return tag(el.innerText || el.parentElement.innerText, key, tokens[key]);
				}

				// if not an exact match, we might have a multi-select filter (e.g. checkbox)
				// we'll check the constituent values to find matching elements
				const tokenex = new RegExp(/\[([^\[^\]]+)\]/); // regex for Funnelback dysjunction operator e.g. [apples oranges]
				const values = tokens[key].toString().replace(tokenex, `$1`).split(/\s/); // values are space-separated
				return values
					.map((value) => {
						const el = metaParamElement(key, value);
						// The innerText of the <input> element‘s <label> has the text we need
						if (el) {
							return tag(el.parentElement.innerText, key, value);
						}
						// We will just default to empty string if there is no matching element.
						return "";
					})
					.join(" ");
			})
			.join(" ");
	};
	
	const searchParamTokens = parameters => Array.from(parameters.entries()).map( item=> item[1] && item[1].indexOf('"')>=0 ? '' : (paramToken(item[0],item[1])||'') ).join(' ');

	/**
	 *
	 * @param {Array} facets
	 * @returns {String} HTML click-to-dismiss "tokens"
	 */
	const facetTokens = (facets) => facets.map((facet) => facet.selectedValues.map((value) => paramToken(value.queryStringParamName, value.queryStringParamValue)).join(" ")).join(" ");

	const paramToken = (name, value) => {
		const el = metaParamElement(name, value);
		if (el)
			return tag(
				Array.prototype.slice
					.call(el.parentElement.childNodes)
					.map((node) => (node.nodeType === 3 ? node.textContent : "")) // Type 3 is Node.TEXT_NODE
					.join(""),
				name,
				value
			);
	};

	const tag = (tag, name, value) => `<span class=c-tag data-name="${name}" data-value="${value}">✖️ ${tag}</span>`;

	const label = (input) => {
		if("undefined"===typeof input) return;
		const labels = {
			contract: "Research project",
			publication: "Research output",
			centre: "Research centre/group",
			area: "Research programme",
			scholarship: "Scholarship",
			blog: "Blog",
			policyblog: "Policy blog"
		};
		switch (input) {
			case "staff":
				return "Staff";
			case "student":
				return "Student";
			case "module":
				return "CPD and short courses";
			case "postgraduate (taught)":
			case "postgraduate (research)":
				return "Postgraduate";
			case "undergraduate":
				return "Undergraduate"
			default:
				return labels[input]||input;
		}
	};

	const image = (image, alt, width, height) => {
		if (!image) return " <!-- no image --> ";
		const url = image.indexOf("|") > -1 ? image.split("|")[1] || image.split("|")[0] : image;
		const data = {url: url.trim(),alt: alt || "",width: width || 550,height: height || 550};
		const cropped = getCroppedImageElement(data);
		return `<div class=c-search-result__image>${cropped}</div>`; 
	};

	const flickrUrl = (flickr) => (flickr.id ? `https://farm${flickr.farm}.staticflickr.com/${flickr.server}/${flickr.id}_${flickr.secret}_c.jpg` : "");

	const datespan = (start, end) => {
		if (!start) return '<abbr title="To be confirmed">TBC</abbr>';
		const s = new Date(start);
		const startdate = stir.Date.newsDate(s);
		const dts = stir.Date.timeElementDatetime(s);

		if (!end) return `<time datetime="${dts}">${startdate}</time>`;
		const e = end && new Date(end);
		const enddate = e && stir.Date.newsDate(e);
		const dte = e && stir.Date.timeElementDatetime(e);

		if (startdate == enddate) return `<time datetime="${dts}">${startdate}</time>`;
		// TODO: do we need to collapse short ranges e.g. "1–8 August 1986"?
		return `<time datetime="${dts}">${startdate}</time>–<time datetime="${dte}">${enddate}</time>`;
	};

	const timespan = (start, end) => (start ? `<time>${stir.Date.time24(new Date(start))}</time>` : "") + (end ? `–<time>${stir.Date.time24(new Date(end))}</time>` : "");
	const anchor = (crumb) => `<a href="${crumb.href}">${crumb.text}</a>`;
	const t4preview = (sid) => (sid ? `/terminalfour/preview/1/en/${sid}` : "#");
	const clearingTest = (item) => stir.courses && stir.courses.clearing && Object.values && item.clearing && Object.values(item.clearing).join().indexOf("Yes") >= 0;
	
	const unpackData = data => {
		if("undefined"===typeof data)	return {};
		if(String===data.constructor)	return JSON.parse(decodeURIComponent(data));
		if(Array===data.constructor)	return Object.assign({},...data.map(datum=>JSON.parse(decodeURIComponent(datum))));
		if(Object===data.constructor)	return data;
		return	{};
	};
	
	const facetDisplayTypes = {
		SINGLE_DRILL_DOWN: undefined,
		CHECKBOX: "checkbox",
		RADIO_BUTTON: "radio",
		TAB: undefined,
		UNKNOWN: undefined,
	};


	const correctCase = (function () {
		if (!stir.t4Globals || !stir.t4Globals.search || !stir.t4Globals.search.facets) {
			return (facet, label) => label;
		}
		const facets = stir.t4Globals.search.facets;
		return (facet, label) => {
			if (!facets[facet]) return label;
			const labels = facets[facet];
			if (labels.findIndex) {
				return labels[labels.findIndex((val) => label === val.toLowerCase())] || label;
			} else if (labels[label]) return labels[label];
			return label;
		};
	})();

	const facetCategoryLabel = (facet, label) => correctCase(facet, label);
	const startDateFormatter = date => correctCase("Start date", date);
	

	const serpTitle = item => item.title.split("|")[0].trim().replace(/\xA0/g, " ");
	
	const serplink = item => `<a href="${item.url}" data-docid="${item.id}" data-position="${item.position||''}">${serpTitle(item)}</a>`;

	const nameLink = item => `<a href="${item.url}" data-docid="${item.id}" data-position="${item.position||''}">${item.custom_fields.name||serpTitle(item)}</a>`;
	
	const renderImgTag = (image) => `<img src="${image.src}" alt="${image.alt}" height="${image.height}" width="${image.width}" loading=lazy data-original=${image.original}>`;
	
	const getCroppedImageElement = (parameters) => {
		if (!parameters.url) return "<!-- no image -->";
		return renderImgTag({ src: parameters.url, alt: parameters.alt, width: Math.floor(parameters.width / 2), height: Math.floor(parameters.height / 2), original: parameters.url });
	};
	
	const getTags = (tags) => {
		const html = (Object.values(tags||{})).map(i=>i.map(j=>j.desc?stir.templates.search.stag(j.desc):'').join(' ')).join(' ').trim();
		return html ? `<p class=c-search-taggroup>${html}</p>` : '';
	}
	
	const getResearchCategories = (raw) => {
		return Object.keys(raw)
		  .filter(key => ['ResearchProgrammes','ResearchGroups','ResearchThemes'].includes(key))
		  .reduce((obj, key) => {
			obj[key] = raw[key];
			return obj;
		  }, {})
	};


	/**
	 * PUBLIC members that can be called externally.
	 * Principally for `stir.search` but could be reused elsewhere.
	 * I've used the `stir.templates.search` namespace so we can have
	 * other types of templates in future, potentially.
	 */
	return {
		strings: {
			buttons: {
				more: "Load more results"
			}
		},
		classes: {
			buttons: {
				more: "button hollow tiny",
				wrapper: "c-search-results__loadmore flex-container align-center u-mb-2"
			},
		},
		selector: {
			form: "form.x-search-redevelopment",
			query: 'form.x-search-redevelopment input[name="term"]',
			results: ".c-search-results-area",
			summary: ".c-search-results-summary"
		},
		tag: tag,
		stag: (tag) => (tag ? `<span class=c-search-tag>${label(tag)}</span>` : ""),
		stags: tags => tags ? `<div class=c-search-result__tags>${tags.map(stir.templates.search.stag).join('')}</div>` : '',
		breadcrumb: (crumbs) => `<p class=c-search-result__trail>${crumbs}</p>`,
		trailstring: (trail) => (trail.length ? trail.map(anchor).join("<small> &gt; </small> ") : ""),

		message: (totalMatching, queried) => {
			const p = document.createElement("p");
			const hit = totalMatching > 0;
			const pl = hit && totalMatching > 1;
			const count = totalMatching.toLocaleString("en");
			p.classList.add(hit ? "text-sm" : "search_summary_noresults");
			p.innerHTML = hit ? (pl ? `There are <strong>${count} results</strong>` : `There is <strong>${count} result</strong>`) : "<strong>There are no results</strong>";
			if (queried) p.insertAdjacentText("beforeend", " for ");
			return p;
		},

		summary: data => {
			const currEnd = 1 + (data.page * data.hits);
			const currStart = currEnd - data.hits;
			const totalMatching = data.total_hits;
			const summary = document.createElement("div");
			const querySanitised = data.question && stir.String.htmlEntities(data.question.get("term"))
									.replace(/^!padrenullquery$/, "")	//funnelback
									.replace(/^\*$/, "")				//addsearch
									.trim() || "";
			const queryEcho = document.createElement("em");
			const message = stir.templates.search.message(totalMatching, querySanitised.length > 1);
			//const tokens = [metaParamTokens(data.question.rawInputParameters), facetTokens(data.response.facets || [])].join(" ");
			const tokens = searchParamTokens(data.question);
			const spelling = '';//querySanitised ? checkSpelling(data.response.resultPacket.spell) : "";
			//const hostinfo = debug ? `<small>${data.question.additionalParameters.HTTP_HOST}</small>` : "";

			summary.classList.add("u-py-2");

			queryEcho.textContent = querySanitised;
			if (querySanitised.length > 1) message.append(queryEcho);
			
			/*
			$$$$$$$\   $$$$$$\        $$\   $$\  $$$$$$\ $$$$$$$$\       $$\   $$\  $$$$$$\  $$$$$$$$\     
			$$  __$$\ $$  __$$\       $$$\  $$ |$$  __$$\\__$$  __|      $$ |  $$ |$$  __$$\ $$  _____|    
			$$ |  $$ |$$ /  $$ |      $$$$\ $$ |$$ /  $$ |  $$ |         $$ |  $$ |$$ /  \__|$$ |          
			$$ |  $$ |$$ |  $$ |      $$ $$\$$ |$$ |  $$ |  $$ |         $$ |  $$ |\$$$$$$\  $$$$$\        
			$$ |  $$ |$$ |  $$ |      $$ \$$$$ |$$ |  $$ |  $$ |         $$ |  $$ | \____$$\ $$  __|       
			$$ |  $$ |$$ |  $$ |      $$ |\$$$ |$$ |  $$ |  $$ |         $$ |  $$ |$$\   $$ |$$ |          
			$$$$$$$  | $$$$$$  |      $$ | \$$ | $$$$$$  |  $$ |         \$$$$$$  |\$$$$$$  |$$$$$$$$\     
			\_______/  \______/       \__|  \__| \______/   \__|          \______/  \______/ \________|    
																										   
																										   
																										   
			$$$$$$\ $$\   $$\ $$\   $$\ $$$$$$$$\ $$$$$$$\  $$\   $$\ $$$$$$$$\ $$\      $$\ $$\       $$\ 
			\_$$  _|$$$\  $$ |$$$\  $$ |$$  _____|$$  __$$\ $$ |  $$ |\__$$  __|$$$\    $$$ |$$ |      $$ |
			  $$ |  $$$$\ $$ |$$$$\ $$ |$$ |      $$ |  $$ |$$ |  $$ |   $$ |   $$$$\  $$$$ |$$ |      $$ |
			  $$ |  $$ $$\$$ |$$ $$\$$ |$$$$$\    $$$$$$$  |$$$$$$$$ |   $$ |   $$\$$\$$ $$ |$$ |      $$ |
			  $$ |  $$ \$$$$ |$$ \$$$$ |$$  __|   $$  __$$< $$  __$$ |   $$ |   $$ \$$$  $$ |$$ |      \__|
			  $$ |  $$ |\$$$ |$$ |\$$$ |$$ |      $$ |  $$ |$$ |  $$ |   $$ |   $$ |\$  /$$ |$$ |          
			$$$$$$\ $$ | \$$ |$$ | \$$ |$$$$$$$$\ $$ |  $$ |$$ |  $$ |   $$ |   $$ | \_/ $$ |$$$$$$$$\ $$\ 
			\______|\__|  \__|\__|  \__|\________|\__|  \__|\__|  \__|   \__|   \__|     \__|\________|\__|
			*/
			
			/*   ==> Avoid XSS attacks by not using innerHTML for user query! <==   */
			/*   ==> Avoid XSS attacks by not using innerHTML for user query! <==   */
			/*   ==> Avoid XSS attacks by not using innerHTML for user query! <==   */

			//summary.insertAdjacentHTML("afterbegin", `${hostinfo}`);
			summary.append(message);
			summary.insertAdjacentHTML("beforeend", `${tokens} ${spelling}`);
			
			return summary;
		},
		pagination: (summary) => {
			const { currEnd, totalMatching, progress } = summary;
			return totalMatching === 0
				? "<!-- no results to show -->"
				: `
			<div class="cell text-center u-my-2">
				<progress value="${progress}" max="100"></progress><br />
				You have viewed ${totalMatching === currEnd ? "all "+(totalMatching>1?totalMatching:'') : currEnd + " of " + totalMatching} results
			</div>`;
		},

		suppressed: (reason) => `<!-- Suppressed search result: ${reason} -->`,

		auto: (item, index, context) => {
			
			const tags = [];

			if(item.type && item.type==="PROMOTED") return stir.templates.search.cura(item);
			if(item.custom_fields.access) return stir.templates.search.internal(item);
			// if (item.url === "https://www.stir.ac.uk/") return stir.templates.search.suppressed("homepage");
			// type = isDocUrl(item.url) ? "document" : ""

			if(item.custom_fields.type) {
				if(String === item.custom_fields.type.constructor) {
					switch (item.custom_fields.type) {
						case "course":		 return stir.templates.search.course(item);
						case "news":		 return stir.templates.search.news(item);
						case "event":		 return stir.templates.search.event(item);
						case "webinar":		 return stir.templates.search.event(item);
						case "contract":
						case "area":
						case "centre":		 return stir.templates.search.research(item);
						case "profile":		 return stir.templates.search.person(item);
						case "studentstory": return stir.templates.search.studentstory(item);
						case "scholarship": return stir.templates.search.scholarship(item);
						//case "publication": // not in use
						//case "gallery": // not in use
					}
					tags.push(item.custom_fields.type);
				}
				if(Array === item.custom_fields.type.constructor) {
					if (item.custom_fields.type.includes("news")) return stir.templates.search.news(item);
					tags.push(item.custom_fields.type.slice(1).pop());
				}
			} else {
				const url = new URL(item.url);
				if ("blog.stir.ac.uk"===url.hostname || "policyblog.stir.ac.uk"===url.hostname) {
					tags.push(url.hostname.split('.').shift());
					item.custom_fields.type = 'blog';
				}
			}
			
			const blurb = item.meta_description && item.meta_description.trim().length > 5 ? item.meta_description : `…${item.highlight}`;
			const attrs = [
				`data-rank=${item.score||''}`,
				`data-as-type="${item.type||''}"`,
				`data-result-type="${item.custom_fields.type||''}"`
			];
			return `<div class="u-border-width-5 u-heritage-line-left c-search-result" ${attrs.join(' ')}>
				<div class="c-search-result__body flex-container flex-dir-column u-gap">
					${stir.templates.search.stags(tags)}
					<p class=u-text-regular><strong>${nameLink(item)}</strong></p>
					<p>${blurb||''}</p>
					${makeBreadcrumbs(item)}
				</div>
			</div>`;

		},
		internal: (item) => {
			// const crumbs = {
			// 	text: item.categories.slice(1),
			// 	href: new URL(item.url).pathname.split("/").slice(1, -1),
			// };
			// const trail = userAuth(item.custom_fields.access) ? stir.templates.search.trailstring(crumbs.text.map((text, index) => ({ text: text, href: "/" + crumbs.href.slice(0, index + 1).join("/") + "/" })).slice(0, -1)) : `<a href="https://www.stir.ac.uk/${crumbs.href[0]}/">${crumbs.text[0]}</a>`;

			return `
	  <div class="u-border-width-5 u-heritage-line-left c-search-result${authClass(item.custom_fields.access)}" data-rank=${item.score}${item.custom_fields.type ? ' data-result-type="' + item.custom_fields.type.toLowerCase() + '"' : ""} data-access="${item.custom_fields.access}">
			  <div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<div class=" c-search-result__tags">
					<span class="c-search-tag">${label(item.custom_fields.access)||""}</span>
				</div>
				<p class="u-text-regular u-m-0"><strong><a href="${item.url}">${item.title
					.replace(/Current S\S+ ?\| ?/, "")
					.split(" | ")[0]
					.trim()}</a></strong></p>
				${internalSummary(item.meta_description, item.custom_fields.access)}
			  </div>
			</div>`;
		}, //<details><summary>JSON data</summary><pre>${JSON.stringify(item.custom_fields,null,"\t")}</pre></details>

		combo: (item) => {
			return `<li title="${item.prefix} ${item.title}">${item.courses.map(stir.templates.search.comboCourse).join(" and ")}${item?.codes?.ucas ? " <small>&hyphen; " + item.codes.ucas + "</small>" : ""}${clearingTest(item) ? ' <sup class="c-search-result__seasonal">*</sup>' : ""}</li>`;
		},

		comboCourse: (item) => `<a href="${item.url}">${item.text.replace(/(BAcc \(Hons\))|(BA \(Hons\))|(BSc \(Hons\))|(\/\s)/gi, "")}</a>`,

		clearing: (item) => {
			if (Object.keys && item.custom_fields && Object.keys(item.custom_fields).join().indexOf("clearing") >= 0) {
				return `<p class="u-m-0"><strong class="u-energy-purple">Clearing 2025: places may be available on this course.</strong></p>`;
			}
		},
		combos: (item) => {
			return item.combos.length === 0
				? ""
				: `
				<div class="combo-accordion" data-behaviour=accordion>
					<accordion-summary>Course combinations</accordion-summary>
					<div>
						<p>${item.title} can be combined with:</p>
						<ul class="u-columns-2">
							${item.combos.map(stir.templates.search.combo).join("")}
						</ul>
						${item.combos.map(clearingTest).indexOf(true) >= 0 ? '<p class="u-footnote">Combinations marked with <sup class=c-search-result__seasonal>*</sup> may have Clearing places available.</p>' : ""}
					</div>
				</div>`;
		},

		pathways: (item) => {
			if (!item.custom_fields.pathways) return "";
			const paths = item.custom_fields.pathways.split("|");
			return paths === 0
				? ""
				: `
				<div class="combo-accordion" data-behaviour=accordion>
					<accordion-summary>Course pathways</accordion-summary>
					<div>
						<p>${item.title} has the following optional pathways:</p>
						<ul class="u-columns-2">
							${paths.map((path) => `<li>${path}</li>`).join("\n\t")}
						</ul>
					</div>
				</div>`;
		},
		
		facts: (item) => {
			let facthtml = [];
			if(item.custom_fields.start) {
				if (item.custom_fields.start.map) {
					facthtml.push(stir.templates.search.courseFact("Start dates", item.custom_fields.start.map(startDateFormatter).join(", "), false));
				} else {
					facthtml.push(stir.templates.search.courseFact("Start dates", startDateFormatter(item.custom_fields.start), false));
				}
			}
			if(item.custom_fields.mode) {
				if(item.custom_fields.mode.join) {
					facthtml.push(stir.templates.search.courseFact("Study modes", item.custom_fields.mode.join(", "), true));
				} else {
					facthtml.push(stir.templates.search.courseFact("Study modes", item.custom_fields.mode, true));
				}
			}

			if(item.custom_fields.delivery) {
				if(item.custom_fields.delivery.join) {
					facthtml.push(stir.templates.search.courseFact("Delivery", item.custom_fields.delivery.join(", "), true));
				} else {
					facthtml.push(stir.templates.search.courseFact("Delivery", item.custom_fields.delivery, true));
				}
			}
						
			return `<div class="c-search-result__meta grid-x">${facthtml.join("")}</div>`;
		},

		courseFact: (head, body, sentenceCase) => (head && body ? `<div class="cell medium-4"><strong class="u-heritage-green">${head}</strong><p${sentenceCase ? " class=u-text-sentence-case" : ""}>${body}</p></div>` : ""), //.replace(/\|/g, ", ")

		course: (item) => {
			if(item.type && item.type==="PROMOTED") return stir.templates.search.cura(item);
			//		const subject = typeof item.custom_fields.subject;
			//      const subjectLink = stir.String.slug(subject);
			const data = unpackData(item.custom_fields.data);
			const preview = UoS_env.name === "preview" || UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
			const isOnline = item.custom_fields.delivery && item.custom_fields.delivery.indexOf("online") > -1 ? true : false;
			const link = UoS_env.name.indexOf("preview") > -1 ? t4preview(item.custom_fields.sid) : item.url; //preview or appdev
			const title = item.custom_fields.name ? `${data["Award"]||''} ${item.custom_fields.name}${data["UCAS Code"]?' - '+data["UCAS Code"]:''}` : item.title.split("|")[0];
			item.combos = stir.courses.showCombosFor(UoS_env.name == "preview" ? item.custom_fields.sid : item.url);
			return `
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-rank=${item.score} data-sid=${item.custom_fields.sid} data-result-type=course${isOnline ? " data-delivery=online" : ""}>
				<div class=" c-search-result__tags">
					<span class="c-search-tag">${label(item.custom_fields.level || item.custom_fields.type || "")}</span>
				</div>

		<div class="flex-container flex-dir-column u-gap u-mt-1 ">
		  <p class="u-text-regular u-m-0">
			<strong><a href="${link}" title="${item.url}" data-docid="${item.id||''}" data-position="${item.position||''}">${title}</a></strong>
		  </p>
		  <p class="u-m-0 c-course-summary">${item.meta_description}</p>
		  ${stir.templates.search.clearing(item) || ""}
		  ${stir.templates.search.facts(item) || ""}
		  <div class="flex-container u-gap u-mb-1 text-xsm flex-dir-column medium-flex-dir-row">
			<div data-nodeid="coursefavsbtn" data-favsurl="/courses/favourites/" class="flex-container u-gap-8" >
			  ${stir.coursefavs && stir.coursefavs.createCourseBtnHTML(item.custom_fields.sid, "/courses/favourites/")}
			</div>
		  </div>
		  
		  ${stir.templates.search.combos(item)}
		  ${stir.templates.search.pathways(item)}
		</div>
			</div>`;
		},

		coursemini: (item) => {
			if(!item.custom_fields) return '';
			return "\t\t\t" + `<div>
				<p><strong><a href="${item.url}" title="${item.url}" data-docid="${item.id||''}" data-position="${item.position||''}" class="u-border-none">
					${item.custom_fields.award || ""} ${item.title.split(" | ")[0]} ${item.custom_fields.ucas ? " - " + item.custom_fields.ucas : ""} ${item.custom_fields.code ? " - " + item.custom_fields.code : ""}
				</a></strong></p>
				<p>${item.meta_description}</p>
			</div>`
		},

		courseminiFooter: (query) 
			=> `<p class="u-mb-2 flex-container u-align-items-center u-gap-8">
				<svg class="u-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
					<title>cap</title>
					<g fill="currentColor">
						<path d="M32 37.888c-0.128 0-0.384 0-0.512-0.128l-28.16-11.264c-0.512-0.128-0.768-0.64-0.768-1.152s0.256-1.024 0.768-1.152l28.16-11.264c0.256-0.128 0.64-0.128 0.896 0l28.16 11.264c0.512 0.256 0.768 0.64 0.768 1.152s-0.256 1.024-0.768 1.152l-28.16 11.264c0 0.128-0.256 0.128-0.384 0.128zM7.296 25.344l24.704 9.856 24.704-9.856-24.704-9.856-24.704 9.856z"></path>
						<path d="M32 49.152c-5.888 0-11.776-1.92-17.664-5.888-0.384-0.256-0.512-0.64-0.512-1.024v-11.264c0-0.768 0.512-1.28 1.28-1.28s1.28 0.512 1.28 1.28v10.624c10.496 6.784 20.736 6.784 31.232 0v-10.624c0-0.768 0.512-1.28 1.28-1.28s1.28 0.512 1.28 1.28v11.264c0 0.384-0.256 0.768-0.512 1.024-5.888 3.968-11.776 5.888-17.664 5.888z"></path>
						<path d="M54.528 40.704c-0.64 0-1.152-0.512-1.28-1.152-0.128-1.408-1.28-8.704-7.936-13.184-5.376-3.584-11.008-3.072-13.184-2.56-0.64 0.128-1.408-0.384-1.536-1.024s0.384-1.408 1.024-1.536c2.432-0.512 8.832-1.024 14.976 2.944 7.552 4.992 8.832 13.44 8.96 14.976 0.128 0.64-0.384 1.28-1.152 1.408 0.256 0.128 0.128 0.128 0.128 0.128z"></path>
						<path d="M55.936 47.232c-0.896 0-1.792-0.256-2.56-0.896-0.896-0.64-1.408-1.664-1.536-2.688s0.128-2.176 0.896-3.072c1.408-1.792 3.968-2.048 5.76-0.768 1.792 1.408 2.048 3.968 0.768 5.76v0c-0.64 0.896-1.664 1.408-2.688 1.536-0.384 0.128-0.512 0.128-0.64 0.128zM58.112 43.776v0 0zM55.936 41.6c-0.512 0-0.896 0.256-1.28 0.64-0.256 0.384-0.384 0.768-0.256 1.152 0 0.384 0.256 0.768 0.64 1.024 0.64 0.512 1.664 0.384 2.176-0.256s0.384-1.664-0.256-2.176c-0.384-0.256-0.768-0.384-1.024-0.384z"></path>
					</g>
				</svg>
				<a href="?tab=courses&query=${query}">View all course results</a>
			</p>
			<p class="flex-container u-align-items-center u-gap-8">
				<svg class="u-icon" data-stiricon="heart-active" fill="currentColor" viewBox="0 0 50 50">
					<title>heart</title>
					<path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2c0,0-0.1,0-0.1,0c-3,0-5.8,1.2-7.9,3.4 c-4.3,4.5-4.2,11.7,0.2,16l18.1,18.1c0.5,0.5,1.6,0.5,2.1,0l17.9-17.9c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9 C47.5,15,46.3,12.2,44.1,10.1z M42,24.2l-17,17l-17-17c-3.3-3.3-3.3-8.6,0-11.8c1.6-1.6,3.7-2.4,5.9-2.4c2.2-0.1,4.4,0.8,6,2.5 l4.1,4.1c0.6,0.6,1.5,0.6,2.1,0l4.2-4.2c3.4-3.2,8.5-3.2,11.8,0C45.3,15.6,45.3,20.9,42,24.2z" />
				</svg>
				<a href="${stir.courses.favsUrl}">My favourite courses</a>
			</p>`, //:`<p class="text-center"><a href="?tab=courses&query=${query}">View all course results</a></p>`,

		person: (item) => {
			if(item.type && item.type==="PROMOTED") return stir.templates.search.cura(item);
			const id = item.url.split("/").slice(-1);
			const data = unpackData(item.custom_fields.data);
			return `
			<div class="c-search-result u-border-width-5 u-heritage-line-left c-search-result__with-thumbnail" data-result-type=person>
				<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0"><strong>
						${serplink(item)}
					</strong></p>
					<div>${data.JobTitle || "<!-- Job title -->"}<br>${data.OrgUnitName || "<!-- Department -->"}</div>
					<!-- <p>${item?.custom_fields?.c ? (item?.custom_fields?.c + ".").replace(" at the University of Stirling", "") : ""}</p> -->
				</div>
				${image(`https://www.stir.ac.uk/research/hub/image/${id}`, item.title.split(" | ")[0].trim(), 400, 400)}
				<div class=c-search-result__footer> ${getTags(data.Categories)} </div>
			</div>`;
		},
		scholarship: (item) => {
			const data = unpackData(item.custom_fields.data);
			return `
		<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=scholarship data-rank=${item.score}>
			${stir.templates.search.stags([item.custom_fields.level])}
			<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="u-text-regular u-m-0"><strong><a href="${item.url}">${item.title.split("|")[0].trim().replace(/\xA0/g, " ")}</a></strong></p>
				<p>${(item.meta_description||'').replace(/\xA0/g, " ")}</p>
				<div class="c-search-result__meta grid-x">
					${stir.templates.search.courseFact("Value", data.value, false)}
					${stir.templates.search.courseFact("Number of awards", data.number, false)}
					${stir.templates.search.courseFact("Fee status", data.status, false)}
				</div>
			</div>
		</div>`;
		},

		studentstory: (item) => {
			const data = unpackData(item.custom_fields.data);
			return `
				<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=studentstory>
					<div class="c-search-result__body flex-container flex-dir-column u-gap">
						<div class=c-search-result__tags>${stir.templates.search.stag(["Student stories"])}</div>
						<p class="u-text-regular u-m-0"><strong>
							${serplink(item)}
						</strong></p>
						<p class="u-m-0">
						${data.degree ? data.degree + "<br />" : ""}
						${item.custom_fields.country ? item.custom_fields.country : ""}
						</p>
						<p>${item.custom_fields.snippet ? "<q>" + item.custom_fields.snippet + "</q>" : "<!-- 28d3702e2064f72d5dfcba865e3cc5d5 -->"}</p>
					</div>
					${item.custom_fields.image ? image("https://www.stir.ac.uk" + item.custom_fields.image, item.title.split(" | ")[0].trim(), 400, 400) : ""}
				</div>`;
		},

		news: (item) => {
			if(item.type && item.type==="PROMOTED") return stir.templates.search.cura(item);
			const data = unpackData(item.custom_fields.data);
			const hasThumb = data.thumbnail || (item.images&&item.images.main) ? true : false;
			const thumb = data.thumbnail ? `data-original="${data.thumbnail}"` : '';
			return `
				<div class="u-border-width-5 u-heritage-line-left c-search-result${hasThumb ? " c-search-result__with-thumbnail" : ""}" data-rank=${item.score} data-result-type=news>
					<div class="c-search-result__body flex-container flex-dir-column u-gap">
						<p class="u-text-regular u-m-0">
							<strong>
								${serplink(item)}
							</strong>
						</p>
						<div>${stir.Date.newsDate(new Date( item.custom_fields.d ? item.custom_fields.d.split("|")[0] : item.ts ))}</div>
						<p class="text-sm">${item.meta_description}</p>
					</div>
					<div class=c-search-result__image>
						<img src="${item.images.main}" alt="${item.title.split(" | ")[0].trim()}" ${thumb} height=275 width=275 loading=lazy>
					</div>
				</div>`;
				/* <!-- <p>
							${item.listcustom_fields && item.listcustom_fields.tag ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px;height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"></path></svg>` : ""}
							${(item.listcustom_fields && item.listcustom_fields.tag && item.listcustom_fields.tag.map((tag) => `<span>${tag}</span>`).join(", ")) || ""}
						</p> --> */
		},

		gallery: (item) => {
			return `
				<div class="u-border-width-5 u-heritage-line-left c-search-result c-search-result__with-thumbnail" data-rank=${item.score} data-result-type=news>
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>${serplink(item)}</strong></p>
						<p class="c-search-result__secondary">${stir.Date.newsDate(new Date(item.custom_fields.d))}</p>
						<p>${item.meta_description||''}</p>	
					</div>
					<div class=c-search-result__image>
						${getCroppedImageElement({
							url: flickrUrl(JSON.parse(item.custom_fields.custom)),
							alt: `Image of ${item.title.split(" | ")[0].trim()}`,
							width: 550,
							height: 550,
						})}
					</div>
				</div>`;
		},

		event: (item) => {
			if(item.type && item.type==="PROMOTED") return stir.templates.search.cura(item);
			const data = unpackData(item.custom_fields.data);
			const isWebinar = (data.tags && data.tags.indexOf("Webinar") > -1) || "webinar" === item.custom_fields.type;
			const isOnline = isWebinar || item.custom_fields.online;
			const hasThumbnail = item.custom_fields?.image || isWebinar;
			const hasEnded = item.custom_fields.e ? (new Date(item.custom_fields.e) < new Date() ? true:false) : undefined;
			const title = item.custom_fields.name || item.title.split("|")[0].trim();
			const url = item.url //item.collection == "stir-events" ? (item.custom_fields.page ? item.custom_fields.page : item.custom_fields.register ? item.custom_fields.register : "#") : item.url;
			return `
			<div class="u-border-width-5 u-heritage-line-left c-search-result${hasThumbnail ? " c-search-result__with-thumbnail" : ""}" data-rank=${item.score} data-result-type=event>
				<div class=c-search-result__tags>
					${data.isSeriesChild ? stir.templates.search.stag(data.isSeriesChild) : ""}
					${isWebinar ? stir.templates.search.stag("Webinar") : ""}
				</div>
				<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0">
						<strong>${serplink(item)}</strong>
					</p>
					<div class="flex-container flex-dir-column u-gap-8">
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-calendar"></span>
							<span>${datespan(item.custom_fields.d, item.custom_fields.e)}</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="uos-clock u-icon h5"></span>
							<span>
							${hasEnded ? 'This event has ended.' : timespan(item.custom_fields.d, item.custom_fields.e)}
							</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-${isOnline ? "web" : "location"}"></span>
							<span>${isOnline ? "Online" : data.location ? data.location : ""}</span>
						</div>
					</div>
					<p class=text-sm>${item.custom_fields.snippet||item.meta_description}</p>
					${data.register ? `<p class="u-m-0 text-sm"><a href="${data.register}" class="u-m-0 button hollow tiny">Register now</a></p>` : ""}
				</div>
				${image(item.custom_fields.image && item.custom_fields.image.split("|")[0], item.title.split(" | ")[0])}
				${isWebinar ? '<div class=c-search-result__image><div class="c-icon-image"><span class="uos-web"></span></div></div>' : ""}
			</div>`;
		},

		research: (item) => {
			if(item.type && item.type==="PROMOTED") return stir.templates.search.cura(item);
			const data = unpackData(item.custom_fields.data);
			const desc = item.meta_description ? `<p class=text-sm>${stir.String.stripHtml(item.meta_description)}</p>` : '';
			const type = (item.custom_fields.type||'').toLowerCase();
			return	`<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${item.score} data-result-type="${type}" data-result-group=research>
				<div>
					<div class="c-search-result__tags">${stir.templates.search.stag(item.custom_fields.type)}</div>
					<div class="c-search-result__body flex-container flex-dir-column u-gap">
						<p class=u-text-regular><strong>${nameLink(item)}</strong></p>
						${desc}
						<div class=c-search-result__footer>
							${makeBreadcrumbs(item)}
							${getTags(getResearchCategories(data))}
						</div>
						<!-- <pre>${JSON.stringify(item.categories,null,"\t")}</pre> -->
					</div>
				</div>
			</div>`
		},

		cura: (item) =>
			`<div class="c-search-result-curated" data-result-type=curated>` + 
				((item.images&&item.images.main) ? `<a href="${item.url}" data-docid=${item.id} data-position=${item.position}><img src="${item.images.main}" alt="${item.title}"></a>` : 
				`<div class="c-search-result c-popout-result u-heritage-berry">
					<a href="${item.url}">
						<div>
							<span class="uos-computer"></span>
						</div>
						<div>
							<p>${item.title}</p>
							<p>${item.highlight}</p>
						</div>
						<div>
							<span class="uos-chevron-right"></span>
						</div>
					</a>
				</div>`) +
			`</div>`,

		facet: (item) =>
			`<fieldset data-facet="${item.name}">
				<legend class="show-for-sr">Filter by ${item.name}</legend>
				<div data-behaviour=accordion>
					<accordion-summary>${item.name}</accordion-summary>
					<div>
						<ul>${item.allValues
				.filter((facetValue) => facetCategoryLabel(item.name, facetValue.label))
				.map(stir.templates.search.labelledFacetItems(item))
				.join("")}</ul>
					</div>
				</div>
			</fieldset>`,

		labelledFacetItems: stir.curry(
			(facet, facetValue) =>
				`<li>
					<label>
						<input type=${facetDisplayTypes[facet.guessedDisplayType] || "text"} name="${facetValue.queryStringParamName}" value="${facetValue.queryStringParamValue}" ${facetValue.selected ? "checked" : ""}>
						${facetCategoryLabel(facet.name, facetValue.label)}
						<!-- <span>${facetValue.count ? facetValue.count : "0"}</span> -->
					</label>
				</li>`
		),
	};
})();

/*
  onscrollend Pollyfill for Safari
*/

if ("undefined" != typeof window && !("onscrollend" in window)) {
  const i = new Event("scrollend"),
    s = new Set();
  document.addEventListener(
    "touchstart",
    (e) => {
      for (let t of e.changedTouches) s.add(t.identifier);
    },
    { passive: !0 }
  ),
    document.addEventListener(
      "touchend",
      (e) => {
        for (let t of e.changedTouches) s.delete(t.identifier);
      },
      { passive: !0 }
    ),
    document.addEventListener(
      "touchcancel",
      (e) => {
        for (let t of e.changedTouches) s.delete(t.identifier);
      },
      { passive: !0 }
    );
  let l = new WeakMap();
  function e(e, t, n) {
    let o = e[t];
    e[t] = function () {
      let e = Array.prototype.slice.apply(arguments, [0]);
      o.apply(this, e), e.unshift(o), n.apply(this, e);
    };
  }
  function t(e, t, n, o) {
    if ("scroll" != t && "scrollend" != t) return;
    let r = this,
      d = l.get(r);
    if (void 0 === d) {
      let t = 0;
      (d = {
        scrollListener: (e) => {
          clearTimeout(t),
            (t = setTimeout(() => {
              s.size ? setTimeout(d.scrollListener, 100) : (r && r.dispatchEvent(i), (t = 0));
            }, 100));
        },
        listeners: 0,
      }),
        e.apply(r, ["scroll", d.scrollListener]),
        l.set(r, d);
    }
    d.listeners++;
  }
  function n(e, t, n) {
    if ("scroll" != t && "scrollend" != t) return;
    let o = this,
      i = l.get(o);
    void 0 !== i && (--i.listeners > 0 || (e.apply(o, ["scroll", i.scrollListener]), l.delete(o)));
  }
  e(Element.prototype, "addEventListener", t), e(window, "addEventListener", t), e(document, "addEventListener", t), e(Element.prototype, "removeEventListener", n), e(window, "removeEventListener", n), e(document, "removeEventListener", n);
}
var scrollend = { __proto__: null };

/*
      
  Search Tabs Component

*/
(function () {
  /*
        Debounce
  */
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  /*
        Carousel Tab Btns initialisation and events
    */
  const initCarousel = (carousel) => {
    /*
      Nodes
    */
    const slidesContainer = carousel.querySelector(".carousel-slides");
    const slideFirst = carousel.querySelector(".carousel-slides h2:first-of-type button");
    const slideLast = carousel.querySelector(".carousel-slides h2:last-of-type button");
    const prevButton = carousel.querySelector(".slide-arrow-prev");
    const nextButton = carousel.querySelector(".slide-arrow-next");

    /*
      Helpers
    */
    const calculateSlideDist = () => slidesContainer.clientWidth + 10;

    const disableBtnState = (btnContainer) => {
      btnContainer.setAttribute("disabled", "disabled");
      btnContainer.querySelector("span")?.classList.add("u-opacity-0");
    };

    const enableBtnState = (btnContainer) => {
      btnContainer.removeAttribute("disabled");
      btnContainer.querySelector("span")?.classList.remove("u-opacity-0");
    };

    const toogleFull = (state) => {
      state ? slidesContainer.classList.add("align-center") : slidesContainer.classList.remove("align-center");
      state ? prevButton.classList.remove("u-border-right-solid") : prevButton.classList.add("u-border-right-solid");
      state ? nextButton.classList.remove("u-border-left-solid") : nextButton.classList.add("u-border-left-solid");
    };

    const updateControlsVisibility = () => {
      let firstInView = false;
      let lastInView = false;

      enableBtnState(prevButton);
      enableBtnState(nextButton);

      const firstSlideRect = slideFirst.getBoundingClientRect();
      const containerRect = slidesContainer.getBoundingClientRect();

      if (firstSlideRect.left >= containerRect.left) {
        disableBtnState(prevButton);
        firstInView = true;
      }

      const lastSlideRect = slideLast.getBoundingClientRect();
      if (lastSlideRect.right <= containerRect.right) {
        disableBtnState(nextButton);
        lastInView = true;
      }

      firstInView && lastInView ? toogleFull(true) : toogleFull(false);
    };

    // Debounce
    const debouncedUpdateControls = debounce(updateControlsVisibility, 250);

    const scrollCarousel = (direction) => {
      const slideDist = calculateSlideDist();
      slidesContainer.scrollLeft += direction === "prev" ? -slideDist : slideDist;
      slidesContainer.addEventListener("scrollend", debouncedUpdateControls);
    };

    /*
      Initialisation
    */

    updateControlsVisibility();

    const scrollEvents = ["wheel", "touchend"];
    scrollEvents.forEach((event) => {
      slidesContainer.addEventListener(event, debouncedUpdateControls);
    });

    prevButton.addEventListener("click", () => scrollCarousel("prev"));
    nextButton.addEventListener("click", () => scrollCarousel("next"));

    // Debounced resize listener
    window.addEventListener("resize", debouncedUpdateControls);
  };

  /*
        
      Search Tabs 
  
  */
  const doSearchTabs = (tabsScope) => {
    // Early return if no tabsScope provided
    if (!tabsScope) return;

    // Show the tabs container
    tabsScope.classList.remove("hide");
    
    // Select buttons and tab panels
    const nav = tabsScope.querySelector('nav#nav-slider');
    const buttons = nav && nav.querySelectorAll("button");
    const tabs = tabsScope.querySelectorAll("#mySlider1 > div");

    /*
     * Open a specific tab and update UI accordingly
     * @param {string} openTabId - The ID of the tab to open
     * @param {NodeList} tabs - All tab panels
     * @param {NodeList} buttons - All tab buttons
     * @param {Element} tabsScope - The container element
     */
    const openTab = (openTabId, tabs, buttons, tabsScope) => {
      // Hide all tabs and remove active states
      tabs.forEach((tab) => {
        tab.setAttribute("aria-hidden", "true");
        tab.classList.add("hide");
      });

      // Remove active states from all buttons
      buttons && buttons.forEach((button) => {
        if (button) {
          button.classList.remove("u-white", "u-bg-heritage-green");
        }
      });

      // Find and show the selected tab
      const tabToOpen = tabsScope.querySelector(`[data-panel="${openTabId}"]`);
      if (tabToOpen) {
        tabToOpen.classList.remove("hide");
        tabToOpen.removeAttribute("aria-hidden");
      }

      // Activate the corresponding button
      const buttonToActivate = tabsScope.querySelector(`[data-open="${openTabId}"]`);
      if (buttonToActivate) {
        buttonToActivate.classList.add("u-white", "u-bg-heritage-green");
      }
    };

    // Add click event listeners to tab buttons
    buttons && buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const btn = event.target.closest("button[data-open]");
        if (!btn) return;

        const openTabId = btn.getAttribute("data-open") || "all";
        openTab(openTabId, tabs, buttons, tabsScope);

        // Update URL query parameter if event is user-initiated
        if (event.isTrusted) {
          QueryParams.set("tab", openTabId);
          btn.hasAttribute("data-tab-callback") && stir.callback.enqueue(btn.getAttribute("data-tab-callback"));
        }
      });
    });

    // Initialise tab panel attributes for accessibility
    // (only if there is more than one tab)
    if(tabs && tabs.length > 1) {
      tabs.forEach((tab) => {
        const panelId = tab.getAttribute("data-panel");
        tab.setAttribute("role", "tabpanel");
        tab.setAttribute("tabindex", "0");
        tab.setAttribute("id", `search_results_panel_${panelId}`);
        tab.setAttribute("aria-labelledby", `searchtab_${panelId}`);
      });
      // Determine initial open tab from URL or default to 'all'
      const initialTabId = QueryParams.get("tab") || "all";
      const initialButton = tabsScope.querySelector(`[data-open="${initialTabId}"]`);
      
      // Open and scroll to the initial tab
      if (initialButton) {
        initialButton.click();
        initialButton.scrollIntoView({ block: "end" });
      }
    }
  };

  /*
  
      ON LOAD
      
    */

  // IE Guard Clause
  if ("undefined" === typeof window.URLSearchParams) return;

  const searchTabs = stir.nodes(".c-search-results-area");
  searchTabs.forEach((element) => doSearchTabs(element));

  const carousels = stir.nodes(".carousel");
  carousels.forEach((element) => initCarousel(element));
})();


//var stir = stir || {};


/**
 * Course-specific search results helper
 */
stir.courses = (() => {
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;

	/**
	 * C L E A R I N G
	 */
	const CLEARING = false; // set TRUE if Clearing is OPEN; otherwise FALSE
	debug && console.info("[Search] Clearing is " + (CLEARING ? "open" : "closed"));
	/*
	 **/

	return {
		clearing: CLEARING,
		getCombos: () => {
			if (stir.courses.combos) return;

			const urls = {
				dev: "combo.json",
				qa: "combo.json",
				preview: stir?.t4Globals?.search?.combos || "",
				prod: "https://www.stir.ac.uk/media/stirling/feeds/combo.json",
			};

			debug && console.info(`[Search] Getting combo data for ${UoS_env.name} environment (${urls[UoS_env.name]})`);
			return stir.getJSON(urls[UoS_env.name], (data) => (stir.courses.combos = data && !data.error ? data.slice(0, -1) : []));
		},
		showCombosFor: (url) => {
			if (!url || !stir.courses.combos) return [];

			let pathname = isNaN(url) && new URL(url).pathname;
			let combos = [];

			for (var i = 0; i < stir.courses.combos.length; i++) {
				for (var j = 0; j < stir.courses.combos[i].courses.length; j++) {
					if ((pathname && pathname === stir.courses.combos[i].courses[j].url) || stir.courses.combos[i].courses[j].url.split("/").slice(-1) == url) {
						let combo = stir.clone(stir.courses.combos[i]);
						combo.courses.splice(j, 1); // remove matching entry
						combo.courses = combo.courses.filter((item) => item.text); // filter out empties
						combos.push(combo);
						break;
					}
				}
			}

			return combos;
		},
		favsUrl: (function () {
			switch (UoS_env.name) {
				case "dev": //local
					return "/pages/search/course-favs/index.html";
				case "qa": //repo
					return "/stirling/pages/search/course-favs/";
				default: //cms
					return '<t4 type="navigation" name="Helper: Path to Courses Favourites" id="5195" />';
			}
		})(),
	};
})();


stir.courses.startdates = function () {

	const date_elements = Array.prototype.slice.call(document.querySelectorAll('[name="f.Start date|startval"]'));
	if (!date_elements || 0 === date_elements.length) return;

	const months = [, "January","February","March","April","May","June","July","August","September","October","November","December"];
	const strings = {
		'other': "Other",
		'1st-every-month': "First day of any month"
	};

	const match = new RegExp(/\d{4}-\d{2}ay\d{4}\D\d{2}/i)
	const regex = new RegExp(/\d{4}/);
	const ay = new RegExp(/ay\d{4}\D\d{2}/i);
	const delim = new RegExp(/ay/i);
	const dates = date_elements
		.filter(date => date.value.match(match))
		.map((date) => {
			return {
				data: date.value,
				date: date.value.replace(ay, ""),
				month: date.value.indexOf("-") > -1 ? months[parseInt(date.value.split("-")[1])] || "" : "",
				year: date.value.match(regex) ? date.value.match(regex).shift() : "",
				acyear: date.value.match(ay) ? date.value.match(ay).shift().replace(delim, "") : "",
				checked: date.checked
			};
		});
	const other = date_elements
		.filter(date => !date.value.match(match))
		.map(date => {
			return {
				label: strings[date.value]||date.value,
				value: date.value,
				checked: date.checked
			};
		});
	const years = dates.map((date) => date.acyear.replace(delim, "")).filter((value, index, self) => self.indexOf(value) === index && value);

	const root = date_elements[0].parentElement.parentElement.parentElement;

	// remove checkboxes only if the years (or "other") array is populated
	if (0===years.length+other.length) return;
	date_elements.forEach((el) => {
		el.parentElement.parentElement.remove();
	});

	const DateInput = (type, name, value, checked) => {
		const input = document.createElement("input");
		input.type = type;
		input.name = name;
		input.value = value;
		input.checked = checked
		return input;
	};

	const DateLabel = (name, value, checked) => {
		const input = DateInput("radio", "f.Start date|startval", `${value}`, checked);
		const label = document.createElement("label");
		label.appendChild(input);
		label.appendChild(document.createTextNode(name));
		return label;
		//e.g. <input type="radio" name="f.Start date|startval" value="2026-01ay2025-26">
	};

	const searchFilterSubgroup = (title,values=[]) => {
		const set = document.createElement("fieldset");
		const legend = document.createElement("legend");
		legend.classList.add("u-mb-tiny","text-xsm");
		set.appendChild(legend);
		set.classList.add("u-mb-1","c-search-filters-subgroup");
		legend.innerText = title;
		set.append(...values);
		return set;
	};

	const picker = document.createElement("li");

	// DOM: show start dates grouped into academic years
	years.forEach((acyear) => {
		const thisyear = dates.filter((date) => date.acyear === acyear);
		const values = thisyear
			.filter((date) => date.acyear === acyear)
			.map((date) => DateLabel(`${date.month} ${date.year}`, date.data, date.checked));
		picker.append( searchFilterSubgroup(`Academic year ${acyear}`,values) );
	});

	// DOM: lastly show 'other' dates
	if (other.length) picker.append(searchFilterSubgroup("Other", other.map(item => DateLabel(item.label,item.value,item.checked))));

	root.appendChild(picker);
};

var stir = stir || {};

/* ------------------------------------------------
 * @author: Ryan Kaye, Robert Morrison
 * @version: 4 - Migrate to AddSearch
 * ------------------------------------------------ */

/**
 * Stir Search
 * Created for the Search Revamp project 2022/23
 * Migrated to AddSearch October 2025
 * @returns Object
 */
stir.search = (() => {
		// abandon before anything breaks in IE
		if (("undefined" === typeof window.URLSearchParams)||!stir.addSearch) {
			const el = document.querySelector( stir.templates.search.selector.results );
			el && el.parentElement.removeChild(el);
			return { init: new Function };
		}
	
		const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
		debug && console.info("[Search] initialising…");
	
		const NUMRANKS = "small" === stir.MediaQuery.current ? 5 : 10;
		const MAXQUERY = 256;
		const CLEARING = stir.courses.clearing; // Clearing is open?
		
		let clickReporting = true; // temporary flag. see REPORTING to enable/disable reporting
	
		const buildUrl = stir.curry((url, parameters) => {
			const newUrl = new URL(url);
			newUrl.search = new URLSearchParams(parameters);
			return newUrl;
		});
	
		const LoaderButton = () => {
			const button = document.createElement("button");
			button.innerText = stir.templates.search.strings.buttons.more;
			button.setAttribute("class", stir.templates.search.classes.buttons.more);
			button.setAttribute("disabled", true);
			return button;
		};
	
		const constants = {
			url: stir.addSearch.getJsonEndpoint(),
			form: document.querySelector( stir.templates.search.selector.form ),
			input: document.querySelector( stir.templates.search.selector.query ),
			parameters: {
				all: {
					term: "University of Stirling",
					limit: NUMRANKS,
					collectAnalytics: false
				},
				news: {
					customField: "type=news",
					sort: "custom_fields.d",
					collectAnalytics: false,
					resultType: "organic"
				},
				event: {
					collectAnalytics: false,
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
					customField: "type=gallery",
					collectAnalytics: false
				},
				course: {
					customField: "type=course",
					collectAnalytics: false
				},
				coursemini: {
					customField: "type=course",
					limit: 5,
					collectAnalytics: false,
					resultType: "organic"
				},
				person: {
					customField: "type=profile",
					collectAnalytics: false,
					resultType: "organic"
				},
				research: {
					categories: "2xhub",
					collectAnalytics: false
				},
				internal: {
					collectAnalytics: false,
					resultType: "organic",
					filter: JSON.stringify({
						or: [
							{ "custom_fields.access": "staff"   },
							{ "custom_fields.access": "student" }
						]
					}),
				},
				clearing: {
					collectAnalytics: false,
					limit: NUMRANKS,
					term: "*",
	//				sort: "custom_fields.name",
	//				filter: something something clearing only...?
	//				timestamp: +new Date()
				},
			},
	
			// +++ Extra/override parameters for no-query searches +++
			// E.g. if no keywords supplied; sort by title instead of relevance
			noquery: {
				all: {
					dateFrom: stir.Date.timeElementDatetime( (d => new Date(d.setFullYear(d.getFullYear()-1)))(new Date) )
				},
				course: {
					sort: "custom_fields.name",
					order: "asc"
				},
				person: {
					sort: "custom_fields.sort",
					order: "asc"
				},
				event: {
					sort: "custom_fields.e",	// sort events by date descending
					order: "asc"
				}
			},
		};
	
		if (!constants.form || !constants.form.term) return;
		debug && console.info("[Search] initialised with host:", new URL(constants.url).hostname);
	
		/* Add the filter parameters (e.g. courses, sorting) */
		const addFilterParameters = (url, formData) => {
			let a = new URLSearchParams(url.search);
			let b = new URLSearchParams(formData);
			for (let [key, value] of b) { "sort"===key? a.set(key, value) : a.append(key, value); }
			url.search = a;
			return url;
		};
		
		const getDefaultQueryForType = type => type && constants.parameters[type] ? constants.parameters[type].term : undefined;
	
		const getQuery = (type) => constants.form.term.value || QueryParams.get("term") || QueryParams.get("query") || getDefaultQueryForType(type) || "*";
	
		const getNoQuery = (type) => (constants.form.term.value ? {} : constants.noquery[type]);
	
		const setQuery = () => { QueryParams.remove("query"); constants.form.term.value ? QueryParams.set("term", constants.form.term.value) : QueryParams.remove("term") };
	
		const getPage = (type) => parseInt(QueryParams.get(type) || 1);
	
		const getType = (element) => element.getAttribute("data-type") || element.parentElement.getAttribute("data-type");
	
		const nextPage = (type) => QueryParams.set(type, parseInt(QueryParams.get(type) || 1) + 1);
	
		const calcStart = (pageNo, perPage) => (pageNo - 1) * perPage + 1;
	
		const calcEnd = (pageNo, perPage, numRanks) => calcStart(pageNo, perPage) + numRanks - 1;
	
		const calcPage = (currStart, numRanks) => Math.floor(currStart / numRanks + 1);
	
		const calcProgress = (currEnd, fullyMatching) => Math.round((currEnd / fullyMatching) * 100);
	
		//const getStartRank = (type) => calcStart(getPage(type), constants.parameters[type].num_ranks || 20);
	
		const resetPagination = () => Object.keys(constants.parameters).forEach((key) => QueryParams.remove(key));
	
		const getQueryParameters = () => {
			let parameters = QueryParams.getAll();
			let facetParameters = Object.keys(parameters)
				.filter((key) => key.indexOf("f.") === 0)
				.reduce((obj, key) => {
					return { ...obj, [key]: rwm2.string.urlDecode(parameters[key]).toLowerCase() };
				}, {});
			return facetParameters;
		};
	
		const getFormData = (type) => {
			const form = document.querySelector(`${stir.templates.search.selector.results} form[data-filters="${type}"]`);
			return form ? new FormData(form) : new FormData();
		};
	
		const getInboundQuery = () => {
			const term = QueryParams.get("term") || QueryParams.get("query");
			if (undefined !== term) constants.form.term.value = term.substring(0, MAXQUERY);
			const parameters = QueryParams.getAll();
			for (const name in parameters) {
				if(name.indexOf("|")>0) {
					const selector = `input[name="customField"][value="${name.split('|')[1]}=${(parameters[name])}"i]`;
					const el = document.querySelector(selector);
					if (el) el.checked = true;
				}
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
			const perPage = (data.question && data.question.limit) ? data.question.limit : 10;
			const pages = Math.ceil(data.total_hits / perPage);
			if (data.page >= pages) button.setAttribute("disabled", true);
			debug && console.info(`[AddSearch] page ${data.page} of ${pages}. [${perPage}]`);
			return data;
		});
	
		const newAccordion = (accordion) => new stir.accord(accordion, false);
		const attachImageErrorHandler = (image) => image.addEventListener("error", imgError);
	
		// "reflow" events and handlers for dynamically added DOM elements
		const flow = stir.curry((_element, data) => {
			if (!_element.closest) return;
			const root  = _element.closest("[data-panel]");
			const cords = root.querySelectorAll('[data-behaviour="accordion"]:not(.stir-accordion)');
			const pics  = root.querySelectorAll("img");
			cords && Array.prototype.forEach.call(cords, newAccordion);
			pics  && Array.prototype.forEach.call(pics, attachImageErrorHandler);
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
				const perPage = constants.parameters[type].limit || 10;
				const currEnd = calcEnd(data.page, perPage, data.hits.length);
				return (data ? renderers[type](data.hits.map(addResultItemPosition(type))).join("") : 'NO DATA') +
				stir.templates.search.pagination({
					currEnd: currEnd,
					totalMatching: data.total_hits,
					progress: calcProgress(currEnd, data.total_hits),
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
			const query = getQuery(type);
			const parameters = 
				stir.Object.extend(
					{ },
					constants.parameters[type],
					{ page: getPage(type), term: query },
					getNoQuery(type), // get special "no query" parameters (sorting, etc.)
					getQueryParameters(), // get facet parameters
				);
			const url = addFilterParameters( buildUrl(constants.url,parameters), getFormData(type) );
			const reportAndCallback = data => {
				debug && console.info("[Search] reportAndCallback",type,constants.url.href);
				searchReporter(query, data.total_hits);
				callback(url.searchParams,data);
			};

			stir.getJSON(url, reportAndCallback);

		});
		
		// triggered automatically, and when the search results need re-initialised (filter change, query change etc).
		const getInitialResults = (element, button) => {
			debug && console.info('[Search] getInitialResults', getType(element),element);
			const type = getType(element);
			if (!searchers[type]) return;
			const facets = updateFacets(type);
			const status = updateStatus(element);
			const more = enableLoadMore(button);
			const replace = replaceHtml(element);
			const render = renderResultsWithPagination(type);
			const reflow = flow(element);
			const composition = stir.compose(reflow, replace, render, more, status, facets);
			const callback = (parameters,data) => {
				
				debug && console.info("[Search] API called-back with:",data,parameters);
				
				if (!element || !element.parentElement) {
					return debug && console.error("[Search] late callback, element no longer on DOM");
				}
				//TODO intercept no-results and spelling suggestion here. Automatically display alternative results?
				if (!data || data.error) return;
				if (0 === data.total_hits && fallback(element)) return;
				
				// Append AddSearch data with `question` object (à la Funnelback)
				return composition( stir.Object.extend({}, data, {question:parameters}) );
			};
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
		
		const reset = element => element.innerHTML = "";
		const deInitialise = panel => panel.init = false;

		const notHidden = panel => !panel.el.hasAttribute("aria-hidden");
		const notInitialised = panel => !panel.init;
		
		// reset() and search() a given panel
		const research = panel => {
			panel.init = true;
			panel.results.forEach(reset);
			panel.results.forEach(search);
		};
		
		// initialise all search types on the page (e.g. when the query keywords are changed by the user):
		const initialSearch = () => panels.filter( notHidden ).forEach( research );
		
		const lazySearch = () => panels.filter( notHidden ).filter( notInitialised ).forEach( research );

		const search = (element, index, context) => {
			if (element.hasAttribute("data-infinite")) {
				const resultsWrapper = document.createElement("div");
				const buttonWrapper = document.createElement("div");
				const button = LoaderButton();
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
		
		const panels = Array.prototype.map.call(document.querySelectorAll("[data-panel]"),el=>{return {
			el: el,
			type: el.getAttribute('data-panel'),
			results: Array.prototype.slice.call(el.querySelectorAll(".c-search-results[data-type],[data-type=coursemini]")),
			summary: el.querySelector(".c-search-results-summary"),
			init: false
		}});
	
		//const searches = Array.prototype.slice.call(document.querySelectorAll(".c-search-results[data-type],[data-type=coursemini]"));
	
		// group the curried search functions so we can easily refer to them by `type`
		const searchers = {
			all: callSearchApi("all"),
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
			all: data => data.map(stir.templates.search.auto),
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
			coursemini: () => stir.templates.search.courseminiFooter(getQuery("all")),
		};
	
		const prefetch = {
			course: (callback) => {
				stir.coursefavs && stir.coursefavs.attachEventHandlers(); // listen for Favs events
				let xmlHttpRequest = stir.courses.getCombos();
				if (xmlHttpRequest) {
					xmlHttpRequest.addEventListener("loadend", callback); // load-end should fire after load OR error
				} else {
					callback.call();
				}
			},
		};
	
		// CLICK delegate for link tracking
		const clickReporter = async event => {
			if (!clickReporting) return true;
			if (!event || !event.target) return;
			
			// get the main result links for click-tracking:
			// (somewhat complicated due to "promoted" item image links)
			const el = event.target.hasAttribute("data-docid") ? event.target : (event.target.parentElement && event.target.parentElement.hasAttribute("data-docid") ? event.target.parentElement : null);
			
			if(!el) return;
			
			const results  = el.closest('.c-search-results');
			const type     = results && results.getAttribute("data-type");
			const href     = el.getAttribute("href");
			const docid    = el.getAttribute('data-docid');
			const position = el.getAttribute('data-position');
			const query    = type && getQuery(type);
			const payload  = {
				action: "click",
				session: stir.session.id,
				keyword: query,
				docid: docid,
				position: position
			};

			if(href && query && position && docid) {
				event.preventDefault();
				stir.addSearch.putReport(payload)
					.then((response)=>{
						let go = true;
						if(debug) go = confirm('Check console for click reporting.');
						// we're going to re-dispatch the event, so this flag 
						// stops it being reported and re-dispatched again!
						clickReporting = false; 
						// now re-dispatch the event using the same key
						// presses (in case user is opening in a new tab etc.)
						// better than doing a location.href, for example.
						go && el.dispatchEvent(new MouseEvent('click', {
							bubbles: true,
							shiftKey: event.shiftKey,
							altKey: event.altKey,
							ctrlKey: event.ctrlKey,
							metaKey: event.metaKey
						}));
						// re-enable click reporting in case the 
						// page is still alive
						clickReporting = true; 
					})
					.catch(error => console.error("[AddSearch] fetch error",error));
			} else {
				debug && console.error("Error tracking click:", event, payload);
			}

		};

		const searchReporter = async (query, total) => {
			const payload  = {
			  action: "search",
			  session: stir.session.id,
			  keyword: query,
			  numberOfResults: total
			};

			stir.addSearch.putReport(payload)
				.catch(error => console.error(error));
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
				initialSearch();
			});
			form.addEventListener("change", (event) => {
				setUrlToFilters(type);
				initialSearch();
			});
			// Just in case, we'll also catch any
			// SUBMIT events that might be triggered:
			form.addEventListener("submit", (event) => {
				initialSearch();
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
			 * 			(Noticed this because `faculty` is common to courses and news)
			 * input	the input element we want to toggle
			 */
			const selector = `input[name="${event.target.getAttribute("data-name")}"][value="${event.target.getAttribute("data-value")}"]`;
			const panel = event.target.closest("[data-panel]");
			const root = panel || document;
			const input = root.querySelector(selector);
			const type = panel && panel.getAttribute("data-panel");
			const panelManager = type && panels.filter(p=>p.type===type).shift();
	
			if (input) {
				input.checked = !input.checked; // toggle it
				event.target.parentElement.removeChild(event.target); // remove the token
				initialSearch(); // resubmit the search for fresh results
			} 
			/** Not needed as we have no dropdown filters now */
			// else {
			// 	const sel2 = `select[name="${event.target.getAttribute("data-name")}"]`;
			// 	const select = document.querySelector(sel2);
			// 	if (select) {
			// 		select.selectedIndex = 0;
			// 		event.target.parentElement.removeChild(event.target);
			// 		initialSearch();
			// 	}
			// }
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
	
		/**
		 * Running order for search:
		 * get url
		 *  - host
		 *  - fixed parameters (from form)
		 *  - variable parameters (from page query string)
		 * prefetch (e.g. course combo data)
		 * fetch results from search engine
		 * process and filter data
		 * render results via templates
		 * send out to the page DOM
		 * load more results on-demand
		 */
	
		const submit = (event) => {
			setQuery();
			panels.forEach(deInitialise);
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
			getPage: getPage,
			lazy: lazySearch,
			initialSearch: initialSearch
		};
	})();

stir.search && stir.search.init && stir.search.init();