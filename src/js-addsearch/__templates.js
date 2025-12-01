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
		staff: ["staff", "students"],
		student: ["students"],
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
			text: item.categories.slice(1),
			href: new URL(item.url).pathname.split("/").slice(1, -1),
		};
		const trail = crumbs.text.map((text, index) => ({ text: text.split("x")[1], href: "/" + crumbs.href.slice(0, index + 1).join("/") + "/" }));

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
	const metaParamElement = (name, value) => document.querySelector(`form[data-filters] input[name="${name}"][value="${value}"],select[name="${name}"] option[value="${value}"]`);

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
		switch (input) {
			case "staff":
				return "Staff";
			case "student":
				return "Student";
			case "module":
				return "CPD and short courses";
			case "Postgraduate (taught)":
			case "Postgraduate (research)":
				return "Postgraduate";
			case "undergraduate":
				return "Undergraduate"
			default:
				return input;
		}
	};

	const image = (image, alt, width, height) => {
		if (!image) return "";

		const url = image.indexOf("|") > -1 ? image.split("|")[1] || image.split("|")[0] : image;
		return `<div class=c-search-result__image>
			${stir.funnelback.getCroppedImageElement({
			url: url.trim(),
			alt: alt || "",
			width: width || 550,
			height: height || 550,
		})}
			</div>`;
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
	const unpackData = (data) => "object"===typeof data ? Object.assign({},...data.map(datum=>JSON.parse(decodeURIComponent(datum)))) : JSON.parse(decodeURIComponent(data));
	
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
	
	const serplink = item => `<a href="${item.url}" data-docid="${item.id}" data-position="${item.position||''}">${item.title.split("|")[0].trim().replace(/\xA0/g, " ")}</a>`;

	//
	//
	//
	//
	//
	//
	//
	//
	//


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
		stag: (tag) => (tag ? `<span class="c-search-tag">${tag}</span>` : ""),
		tagGroup: (tagGroup) => {
			const gData = tagGroup.split("=");
			const list = gData[1] && gData[1].replace(/,([^\s])/gi, "__SPLIT__$&").split("__SPLIT__,");
			return list ? list.map(stir.templates.search.stag).join("") : "";
		},
		breadcrumb: (crumbs) => `<p class="u-m-0">${crumbs}</p>`,
		trailstring: (trail) => (trail.length ? trail.map(anchor).join("<small> &gt; </small> ") : ""),

		message: (hit, count, queried) => {
			const p = document.createElement("p");
			p.classList.add(hit ? "text-sm" : "search_summary_noresults");
			p.innerHTML = hit ? `There are <strong>${count} results</strong>` : "<strong>There are no results</strong>";
			if (queried) p.insertAdjacentText("beforeend", " for ");
			return p;
		},

		summary: data => {
			const currEnd = 1 + (data.page * data.hits);
			const currStart = currEnd - data.hits;
			const totalMatching = data.total_hits;
			const summary = document.createElement("div");
			const querySanitised = stir.String.htmlEntities(data.question.term)
									.replace(/^!padrenullquery$/, "")	//funnelback
									.replace(/^\*$/, "")				//addsearch
									.trim() || "";
			const queryEcho = document.createElement("em");
			const message = stir.templates.search.message(totalMatching > 0, totalMatching.toLocaleString("en"), querySanitised.length > 1);
			//const tokens = [metaParamTokens(data.question.rawInputParameters), facetTokens(data.response.facets || [])].join(" ");
			//const spelling = querySanitised ? checkSpelling(data.response.resultPacket.spell) : "";
			//const hostinfo = debug ? `<small>${data.question.additionalParameters.HTTP_HOST}</small>` : "";

			summary.classList.add("u-py-2");

			queryEcho.textContent = querySanitised;
			if (querySanitised.length > 1) message.append(queryEcho);

			//summary.insertAdjacentHTML("afterbegin", `${hostinfo}`);
			//summary.insertAdjacentHTML("beforeend", `${tokens} ${spelling}`);
			
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

			//if (data) {summary.innerHTML = `<p>Page: ${data.page}, total_hits: ${data.total_hits}, hits: ${data.hits.length}</p>`;}
			summary.append(message);
			
			return summary;
		},
		pagination: (summary) => {
			const { currEnd, totalMatching, progress } = summary;
			return totalMatching === 0
				? ""
				: `
			<div class="cell text-center u-my-2">
				<progress value="${progress}" max="100"></progress><br />
				You have viewed ${totalMatching === currEnd ? "all" : currEnd + " of " + totalMatching} results
			</div>`;
		},

		suppressed: (reason) => `<!-- Suppressed search result: ${reason} -->`,

		auto: (item, index, context) => {


//			if (item.url === "https://www.stir.ac.uk/") return stir.templates.search.suppressed("homepage");
//			if (item.custom_fields.type == "scholarship") return stir.templates.search.scholarship(item);
			if (item.custom_fields.type == "course") return stir.templates.search.course(item);
			if (item.custom_fields.type === "news") return stir.templates.search.news(item);
//			if (item.custom_fields.type == "Gallery") return stir.templates.search.gallery(item);
			if (item.custom_fields.type == "event") return stir.templates.search.event(item);
			if (item.custom_fields.type == "webinar") return stir.templates.search.event(item);
//			if (item.collection == "stir-events") return stir.templates.search.event(item);
			if (item.custom_fields.access) return stir.templates.search.internal(item);
//			if (item.custom_fields.type && item.custom_fields.type.indexOf("output") > -1) return stir.templates.search.research(item);
			if (item.custom_fields.type && item.custom_fields.type.indexOf("contract") > -1) return stir.templates.search.research(item);
			if (item.custom_fields.type && item.custom_fields.type.indexOf("profile") > -1) return stir.templates.search.person(item);
//			if (item.url.indexOf("https://www.stir.ac.uk/news") === 0) return stir.templates.search.news(item);
//			const label = item.url.indexOf("policyblog.stir") > -1 ? `<div class=" c-search-result__tags"><span class="c-search-tag">Public Policy Blog</span></div>` : "";
//
			if (item.custom_fields.type && item.custom_fields.type.indexOf("studentstory") > -1) return stir.templates.search.studentstory(item);
			
			return `<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${item.score||''}>
				<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<div class=c-search-result__tags>
					${stir.templates.search.stag([item.custom_fields.type || "Page"])}
				</div>
					${makeBreadcrumbs(item)}
					<p class="u-text-regular u-m-0"><strong>${serplink(item)}</strong></p>
					<p>${item.meta_description||''}</p>
				</div>
			</div>`;

/* 				<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${item.score}${item.custom_fields.type || isDocUrl(item.url) ? ' data-result-type="' + (item.custom_fields.type || (isDocUrl(item.url) ? "document" : "")).toLowerCase() + '"' : ""}${item.custom_fields.access ? ' data-access="' + item.custom_fields.access + '"' : ""}>
					<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
						${label}
						${makeBreadcrumbs(trail, item.url, item.fileSize)}
						<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl}">${item.title.split("|")[0].trim().replace(/\xA0/g, " ")}</a></strong></p>
						<p>${item.meta_description.replace(/\xA0/g, " ")}</p>
					</div>
				</div>
				 */
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
			const preview = UoS_env.name === "preview" || UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
			//		const subject = typeof item.custom_fields.subject;
			//      const subjectLink = stir.String.slug(subject);
			const isOnline = item.custom_fields.delivery && item.custom_fields.delivery.indexOf("online") > -1 ? true : false;
			const link = UoS_env.name.indexOf("preview") > -1 ? t4preview(item.custom_fields.sid) : item.url; //preview or appdev
			item.combos = stir.courses.showCombosFor(UoS_env.name == "preview" ? item.custom_fields.sid : item.url);
			return `
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-rank=${item.score} data-sid=${item.custom_fields.sid} data-result-type=course${isOnline ? " data-delivery=online" : ""}>
				<div class=" c-search-result__tags">
					<span class="c-search-tag">${label(item.custom_fields.level || item.custom_fields.type || "")}</span>
				</div>

		<div class="flex-container flex-dir-column u-gap u-mt-1 ">
		  <p class="u-text-regular u-m-0">
			<strong><a href="${link}" title="${item.url}" data-docid="${item.id||''}" data-position="${item.position||''}">
			${item.custom_fields.award || ""} ${item.custom_fields.name || item.title.split("|")[0]}
			${item.custom_fields.ucas ? " - " + item.custom_fields.ucas : ""}
			${item.custom_fields.code ? " - " + item.custom_fields.code : ""}
			</a></strong>
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

		coursemini: (item) 
		=> "\t\t\t" + `<div>
				<p><strong><a href="${item.url}" title="${item.url}" data-docid="${item.id||''}" data-position="${item.position||''}" class="u-border-none">
					${item.custom_fields.award || ""} ${item.title.split(" | ")[0]} ${item.custom_fields.ucas ? " - " + item.custom_fields.ucas : ""} ${item.custom_fields.code ? " - " + item.custom_fields.code : ""}
				</a></strong></p>
				<p>${item.meta_description}</p>
			</div>`,

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
			const id = item.url.split("/").slice(-1);
			const data = "object"===typeof item.custom_fields.data ? Object.assign({},...item.custom_fields.data.map(datum=>JSON.parse(decodeURIComponent(datum)))) : JSON.parse(decodeURIComponent(item.custom_fields.data));
			return `
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=person>
				<div class=c-search-result__tags>
					${/*stir.templates.search.stag(item.custom_fields.faculty ? stir.research.hub.getFacultyFromOrgUnitName(item.custom_fields.faculty) : "")*/''}
				</div>
				<div class="flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0"><strong>
						${serplink(item)}
					</strong></p>
					<div>${data.JobTitle || "<!-- Job title -->"}<br>${data.OrgUnitName || "<!-- Department -->"}</div>
					<!-- <p>${item?.custom_fields?.c ? (item?.custom_fields?.c + ".").replace(" at the University of Stirling", "") : ""}</p> -->
				</div>
				${image((item.custom_fields.image?item.custom_fields.image:`https://www.stir.ac.uk/research/hub/image/${id}`), item.title.split(" | ")[0].trim(), 400, 400)}
				<div class=c-search-result__footer>
					${stir.funnelback.getTags(item?.custom_fields?.category) ? "<p><strong>Research interests</strong></p>" : ""}
					<p>${stir.funnelback.getTags(item?.custom_fields?.category) || ""}</p>
				</div>
			</div>`; //`data:image/jpeg;base64,${item.images.main_b64}`
		},
		scholarship: (item) => {
			return `
		<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=scholarship data-rank=${item.score}>
			<div class=c-search-result__tags>
				${stir.templates.search.stag(item.custom_fields.level ? `Scholarship: ${item.custom_fields.level.toLowerCase()}` : "")}
			</div>
			<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl}">${item.title.split("|")[0].trim().replace(/\xA0/g, " ")}</a></strong></p>
				<p>${item.meta_description.replace(/\xA0/g, " ")}</p>
				<div class="c-search-result__meta grid-x">
					${stir.templates.search.courseFact("Value", item.custom_fields.value, false)}
					${stir.templates.search.courseFact("Number of awards", item.custom_fields.number, false)}
					${stir.templates.search.courseFact("Fee status", item.custom_fields.status, false)}
				</div>
			</div>
		</div>`;
		},

		studentstory: (item) => {
			const data = item.custom_fields.data ? unpackData(item.custom_fields.data) : {};
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
			const data = item.custom_fields.data ? unpackData(item.custom_fields.data) : {};
			const hasThumb = data.thumbnail ? true : false;
			const thumb = data.thumbnail ? `data-original="${data.thumbnail}"` : '';
			return `
				<div class="u-border-width-5 u-heritage-line-left c-search-result${hasThumb ? " c-search-result__with-thumbnail" : ""}" data-rank=${item.score} data-result-type=news>
					<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
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
						${stir.funnelback.getCroppedImageElement({
							url: flickrUrl(JSON.parse(item.custom_fields.custom)),
							alt: `Image of ${item.title.split(" | ")[0].trim()}`,
							width: 550,
							height: 550,
						})}
					</div>
				</div>`;
		},


		event: (item) => {
			const data = "object"===typeof item.custom_fields.data ? Object.assign({},...item.custom_fields.data.map(datum=>JSON.parse(decodeURIComponent(datum)))) : JSON.parse(decodeURIComponent(item.custom_fields.data));
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
		},	//<details><summary>JSON data</summary><pre>${JSON.stringify(item.custom_fields,null,"\t")}</pre><hr><pre>${JSON.stringify(data,null,"\t")}</pre></details>


		research: (item) => 
			`<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${item.score}${item.custom_fields.type ? ' data-result-type="' + item.custom_fields.type.toLowerCase() + '"' : ""}>
				<div>
					<div class="c-search-result__tags"><span class="c-search-tag">${item.title.split(" | ").slice(0, 1).toString()}</span></div>
					<div class="flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0"><strong>${serplink(item)}</strong></p>
						${stir.String.stripHtml(item.meta_description) ? `<div class="text-sm">` + stir.String.stripHtml(item.meta_description) + `</div>` : ""}
						${stir.funnelback.getTags(item.custom_fields.category) ? `<div class=c-search-result__footer>` + stir.funnelback.getTags(item.custom_fields.category) + `</div>` : ""}
					</div>
				</div>
			</div>`,


		cura: (item) =>
			!item.messageHtml
				? `<div class="c-search-result" data-result-type=curated>
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>
							${serplink(item)}<br>
							<small class="c-search-result__breadcrumb">${item.displayUrl}</small>
						</strong></p>
						<p>${item.descriptionHtml}</p>
					</div>
				</div>`
				: `<div class="c-search-result-curated" data-result-type=curated-message>
					${item.messageHtml}
				</div>`,


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
