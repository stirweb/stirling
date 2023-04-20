/**
 * Just a temp file to add new (or update) functionality of Stir.js etc.
 */


/**
 * JSON handling
 */

//var stir = stir||{};






  
var stir = stir || {};

stir.templates = stir.templates || {};
stir.const = stir.const || {};

stir.templates.search = (() => {
	/**
	 * Some private memebers to help with data processing.
	 * They can also be referred to locally, instead of
	 * invoking the absolute object stir.templates.blah.blah.blah
	 * */
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const FB_BASE = () => "https://" + stir.funnelback.getHostname();
	const notice = (text) => `<p class="u-heritage-berry u-border-solid u-p-1"><span class="uos-lightbulb"></span> ${text}</p>`;
	const summary = (text) => `<p class=c-search-result__summary>${text}</p>`;

	// STAFF / STUDENT status checking
	const groups = {
		staff: "University of Stirling staff",
		students: "current students and staff",
	};
	const entitlements = {
		staff: ["staff", "students"],
		student: ["students"],
	};
	const afce4eafce490574e288574b384ecd87 = window[["s", "e", "i", "k", "o", "o", "C"].reverse().join("")]; // Just a bit of mild fun to stop anyone text-searching for "Cookies"!
	const isUser = afce4eafce490574e288574b384ecd87.get("psessv0") ? true : false; // Cookie could be spoofed, but we'll trust it. The Portal will enforce authenticattion anyway.
	const userType = isUser ? afce4eafce490574e288574b384ecd87.get("psessv0").split("|")[0] : "EXTERNAL";
	const userAuth = (group) => entitlements[userType.toLowerCase()]?.indexOf(group.toLowerCase()) > -1;
	const authClass = (group) => (userAuth(group) ? " c-internal-search-result" : " c-internal-locked-search-result");
	const authMessage = (group) => notice(`This page is only available to ${groups[group]}. You will be asked to log in before you can view it, but once you are logged in results will be shown automatically.`);
	const internalSummary = (text, group) => (userAuth(group) ? summary(text) : authMessage(group));

	// Special handling for documents (PDF, DOC; as opposed to native web results)
	const isDocUrl = (url) => {
		const docUrlSlashDotSplit = url.toUpperCase().split("/").slice(-1).toString().split(".");
		return docUrlSlashDotSplit.length > 1 && docUrlSlashDotSplit[1].match(/PDF|DOCX?/); // Other types can be added to this list if necessary
	};

	const makeBreadcrumbs = (trail, liveUrl, fileSize) => {
		if (trail && trail.length > 0) {
			return stir.templates.search.breadcrumb(stir.templates.search.trailstring(trail));
		}
		if (isDocUrl(liveUrl)) {
			return `Document: ${isDocUrl(liveUrl)} <small>${stir.Math.fileSize(fileSize || 0, 0)}</small>`;
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
  const metaParamElement = (name, value) => document.querySelector(`input[name="${name}"][value="${value}"],select[name="${name}"] option[value="${value}"]`);

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
        // does the name and value match a DOM element?
        const el = metaParamElement(key, tokens[key]);
        if (el) return tag(el.innerText || el.parentElement.innerText, key, tokens[key]);

        // if not, we might have a multi-select filter (e.g. checkbox)
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

	const tag = (tag, name, value) => `<span class=c-tag data-name="${name}" data-value="${value}">✖️ ${tag}</span>`;

	const courseLabel = (input) => {
		switch (input) {
		case "module":
			return "CPD and short courses";
		case "Postgraduate (taught)":
			return "Postgraduate";
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

  const renderFavsButton = (courseid) => {
    return `<div class="flex-container u-gap u-mb-1 text-xsm">
              <div data-nodeid="coursefavsbtn" class="flex-container u-gap" data-id="${courseid}"></div>
              <a href="/courses/favourites/">View favourites</a>
          </div>`;
  };

	const facetDisplayTypes = {
		SINGLE_DRILL_DOWN: undefined,
		CHECKBOX: 'checkbox',
		RADIO_BUTTON: 'radio',
		TAB: undefined,
		UNKNOWN: undefined
	};

	const months = {
		"01":"January",
		"02":"February",
		"05":"May",
		"08":"August",
		"09":"September",
		"10":"October",
	};

	const readableDate = date => months[date.split('-').pop()] + ' ' + date.split('-').shift();

	const facetCategoryLabel = label => label.indexOf('ay')===7?readableDate(label.split('ay').shift()):label;

	/**
	 * PUBLIC members that can be called externally.
	 * Principally for `stir.search` but could be reused elsewhere.
	 * I've used the `stir.templates.search` namespace so we can have
	 * other types of templates in future, potentially.
	 */
	return {
		tag: tag,
		stag: (tag) => (tag ? `<span class="c-search-tag">${tag}</span>` : ""),
		tagGroup: (tagGroup) => {
			const gData = tagGroup.split("=");
			const list = gData[1] && gData[1].replace(/,([^\s])/gi, "__SPLIT__$&").split("__SPLIT__,");
			return list ? list.map(stir.templates.search.stag).join("") : "";
		},
		breadcrumb: (crumbs) => `<p class="u-m-0">${crumbs}</p>`,
		trailstring: (trail) => (trail.length ? trail.map(anchor).join(" > ") : ""),

    summary: (data) => {
      const { currEnd, totalMatching, currStart } = data.response.resultPacket.resultsSummary;
      const querySanitised = stir.String.htmlEntities(data.question.originalQuery)
        .replace(/^!padrenullquery$/, "")
        .trim();
      const queryEcho = querySanitised.length > 1 ? ` for <em>${querySanitised}</em>` : "";
      const message = totalMatching > 0 ? `	<p class="text-sm">There are <strong>${totalMatching.toLocaleString("en")} results</strong>${queryEcho}.</p>` : `<p id="search_summary_noresults"><strong>There are no results${queryEcho}</strong>.</p>`;
      const tokens = metaParamTokens(data.question.rawInputParameters);
      const spelling = querySanitised ? checkSpelling(data.response.resultPacket.spell) : "";
      return `<div class="u-py-2"> ${message} ${tokens} ${spelling} </div>`;
    },
    pagination: (summary) => {
      const { currEnd, totalMatching, progress } = summary;
      return totalMatching === 0
        ? ""
        : `
			<div class="cell text-center u-margin-y">
				<progress value="${progress}" max="100"></progress><br />
				You have viewed ${totalMatching === currEnd ? "all" : currEnd + " of " + totalMatching} results
			</div>`;
    },

		suppressed: (reason) => `<!-- Suppressed search result: ${reason} -->`,

    auto: (item) => {
      if (item.liveUrl === "https://www.stir.ac.uk/") return stir.templates.search.suppressed("homepage");
      if (item.metaData.type == "scholarship") return stir.templates.search.scholarship(item);
      if (item.metaData.type == "Course" || item.metaData.level) return stir.templates.search.course(item);
      if (item.metaData.type == "News") return stir.templates.search.news(item);
      if (item.metaData.type == "Gallery") return stir.templates.search.gallery(item);
      if (item.metaData.type == "Event") return stir.templates.search.event(item);
      if (item.collection == "stir-events") return stir.templates.search.event(item);
      if (item.metaData.access) return stir.templates.search.internal(item);
      if (item.metaData.type && item.metaData.type.indexOf("output") > -1) return stir.templates.search.research(item);
      if (item.metaData.type && item.metaData.type.indexOf("contract") > -1) return stir.templates.search.research(item);
      if (item.metaData.type && item.metaData.type.indexOf("profile") > -1) return stir.templates.search.person(item);
      if (item.liveUrl.indexOf("https://www.stir.ac.uk/news") === 0) return stir.templates.search.news(item);

		const crumbs = {
			text: item.metaData?.breadcrumbs?.split(" > ").slice(1, -1) || [],
			href: new URL(item.liveUrl).pathname.split("/").slice(1, -1),
		};

		const trail = crumbs.text.map((text, index) => ({ text: text, href: "/" + crumbs.href.slice(0, index + 1).join("/") + "/" }));

		const label = item.liveUrl.indexOf("policyblog.stir") > -1 ? `<div class=" c-search-result__tags"><span class="c-search-tag">Public Policy Blog</span></div>` : "";

		if (item.metaData.type && item.metaData.type.indexOf("studentstory") > -1) return stir.templates.search.studentstory(item, trail);

		return `
				<div class="c-search-result" data-rank=${item.rank}${item.metaData.type || isDocUrl(item.liveUrl) ? ' data-result-type="' + (item.metaData.type || (isDocUrl(item.liveUrl) ? "document" : "")).toLowerCase() + '"' : ""}${item.metaData.access ? ' data-access="' + item.metaData.access + '"' : ""}>
					<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
						${label}
						${makeBreadcrumbs(trail, item.liveUrl, item.fileSize)}
						<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl}">${item.title.split("|")[0].trim().replace(/\xA0/g, " ")}</a></strong></p>
						<p >${item.summary.replace(/\xA0/g, " ")}</p>
					</div>
				</div>`;
		},
		internal: (item) => {
		const crumbs = {
			text: item.metaData?.breadcrumbs?.split(" > ") || [],
			href: new URL(item.liveUrl).pathname.split("/").filter((n) => n),
		};

		const trail = userAuth(item.metaData.group) ? stir.templates.search.trailstring(crumbs.text.map((text, index) => ({ text: text, href: "/" + crumbs.href.slice(0, index + 1).join("/") + "/" })).slice(0, -1)) : `<a href="https://www.stir.ac.uk/${crumbs.href[0]}/">${crumbs.text[0]}</a>`;

      return `
      <div class="c-search-result${authClass(item.metaData.group)}" data-rank=${item.rank}${item.metaData.type ? ' data-result-type="' + item.metaData.type.toLowerCase() + '"' : ""} data-access="${item.metaData.access}">
			  <div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
			    <p class="c-search-result__breadcrumb">${trail}</p>
			    <p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl}">${item.title.split(" | ")[0]}</a></strong></p>
			    ${internalSummary(item.summary, item.metaData.group)}
			  </div>
			</div>`;
		},

		combo: (item) => {
		return `<li title="${item.prefix} ${item.title}">${item.courses.map(stir.templates.search.comboCourse).join(" and ")}${item?.codes?.ucas ? " <small>&hyphen; " + item.codes.ucas + "</small>" : ""}${clearingTest(item) ? ' <sup class="c-search-result__seasonal">*</sup>' : ""}</li>`;
		},

		comboCourse: (item) => `<a href="${item.url}">${item.text.replace(/(BAcc \(Hons\))|(BA \(Hons\))|(BSc \(Hons\))|(\/\s)/gi, "")}</a>`,

		clearing: (item) => {
		if (Object.keys && item.metaData && Object.keys(item.metaData).join().indexOf("clearing") >= 0) {
			return `<p class="u-m-0"><strong class="u-heritage-berry">Clearing 2022: places may be available on this course.</strong></p>`;
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
		if (!item.metaData.pathways) return "";
		const paths = item.metaData.pathways.split("|");
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

    courseFact: (head, body, sentenceCase) => (head && body ? `<div class="cell medium-4"><strong class="u-heritage-green">${head}</strong><p${sentenceCase ? " class=u-text-sentence-case" : ""}>${body.replace('|',', ')}</p></div>` : ""),

    course: (item) => {
      const preview = UoS_env.name === "preview" || UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;

      const subject = item.metaData.subject ? item.metaData.subject.split(/,\s?/).slice(0, 1) : "";
      const subjectLink = stir.String.slug(subject);
      const isOnline = item.metaData.delivery && item.metaData.delivery.toLowerCase().indexOf("online") > -1 ? true : false;
      const link = UoS_env.name.indexOf("preview") > -1 ? t4preview(item.metaData.sid) : FB_BASE() + item.clickTrackingUrl; //preview or appdev
      item.combos = stir.courses.showCombosFor(UoS_env.name == "preview" ? item.metaData.sid : item.liveUrl);
      //item.combos = stir.courses.showCombosFor(item.metaData.sid); // this is for debugging t4 preview mode
      return `
			<div class="c-search-result" data-rank=${item.rank} data-sid=${item.metaData.sid} data-result-type=course${isOnline ? " data-delivery=online" : ""}>
				<div class=" c-search-result__tags">
					<span class="c-search-tag">${courseLabel(item.metaData.level || item.metaData.type || "")}</span>
				</div>

        <div class="flex-container flex-dir-column u-gap u-mt-1">
          <p class="u-text-regular u-m-0">
            <strong><a href="${link}" title="${item.liveUrl}">
            ${item.metaData.award || ""} ${item.title}
            ${item.metaData.ucas ? " - " + item.metaData.ucas : ""}
            ${item.metaData.code ? " - " + item.metaData.code : ""}
            </a></strong>
          </p>
          <p class="u-m-0">${item.summary}</p>
          ${stir.templates.search.clearing(item) || ""}
          <div class="c-search-result__meta grid-x">
            ${stir.templates.search.courseFact("Start dates", item.metaData.start, false)}
            ${stir.templates.search.courseFact("Study modes", item.metaData.modes, true)}
            ${stir.templates.search.courseFact("Delivery", item.metaData.delivery, true)}
          </div>
          
          ${preview ? renderFavsButton(item.metaData.sid) : ""}
          
          ${stir.templates.search.combos(item)}
          ${stir.templates.search.pathways(item)}
        </div>
			</div>`;
    },

		coursemini: (item) => `
			<div>
				<p><strong><a href="${FB_BASE() + item.clickTrackingUrl}" title="${item.liveUrl}" class="u-border-none">
					${item.metaData.award || ""} ${item.title} ${item.metaData.ucas ? " - " + item.metaData.ucas : ""} ${item.metaData.code ? " - " + item.metaData.code : ""}
				</a></strong></p>
				<p>${item.summary}</p>
			</div>`,

    person: (item) => {
      return `
			<div class=c-search-result data-result-type=person>
				<div class=c-search-result__tags>
					${stir.templates.search.stag(item.metaData.faculty ? stir.research.hub.getFacultyFromOrgUnitName(item.metaData.faculty) : "")}
				</div>
				<div class="flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0"><strong>
						<a href="${FB_BASE() + item.clickTrackingUrl}">${item.title.split(" | ")[0].trim()}</a>
					</strong></p>
					<div>${item.metaData.role || "<!-- Job title -->"}<br>${item.metaData.faculty || ""}</div>
					<!-- <p>${item.metaData.c ? (item.metaData.c + ".").replace(" at the University of Stirling", "") : ""}</p> -->
				</div>
				${image(item.metaData.image, item.title.split(" | ")[0].trim(), 400, 400)}
				<div class=c-search-result__footer>
					${stir.funnelback.getTags(item.metaData.category) ? "<p><strong>Research interests</strong></p>" : ""}
					<p>${stir.funnelback.getTags(item.metaData.category) || ""}</p>
				</div>
			</div>`;
    },
	scholarship: (item) => {
		return `
		<div class="c-search-result" data-result-type=scholarship data-rank=${item.rank}>
			<div class=c-search-result__tags>
				${stir.templates.search.stag(item.metaData.level ? item.metaData.level : "")}
			</div>
			<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl}">${item.title.split("|")[0].trim().replace(/\xA0/g, " ")}</a></strong></p>
				<p>${item.summary.replace(/\xA0/g, " ")}</p>
				<div class="c-search-result__meta grid-x">
					${stir.templates.search.courseFact("Value", item.metaData.value, false)}
					${stir.templates.search.courseFact("Number of awards", item.metaData.number, false)}
					${stir.templates.search.courseFact("Fee status", item.metaData.status, false)}
				</div>
			</div>
		</div>`;
	},

		studentstory: (item, trail) => {
			return `
				<div class=c-search-result data-result-type=studentstory>
					<div><a href="${trail[0].href}">${trail[0].text}</a></div>
					<div class="c-search-result__body flex-container flex-dir-column u-gap ">
						<p class="u-text-regular u-m-0"><strong>
							<a href="${FB_BASE() + item.clickTrackingUrl}">${item.title.split(" | ")[0].trim()}</a>
						</strong></p>
						<p class="u-m-0">${item.metaData.profileCourse1}<br />
						${item.metaData.profileCountry}</p>
						<p>${item.metaData.c}</p>
					</div>
					${image("https://www.stir.ac.uk" + item.metaData.profileImage, item.title.split(" | ")[0].trim(), 400, 400)}
				</div>`;
		},

		news: (item) => {
			return `
				<div class="c-search-result${item.metaData.image ? " c-search-result__with-thumbnail" : ""}" data-rank=${item.rank} data-result-type=news>
					<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0">
							<strong>
								<a href="${FB_BASE() + item.clickTrackingUrl}">${item.metaData.h1 || item.title.split(" | ")[0].trim()}</a>
							</strong>
						</p>
						<div>${item.metaData.d ? stir.Date.newsDate(new Date(item.metaData.d)) : ""}</div>
						<p class="text-sm">${item.summary}</p>
					</div>
					${image(item.metaData.image, item.title.split(" | ")[0].trim())}
				</div>`;
		},

		gallery: (item) => {
		return `
				<div class="c-search-result c-search-result__with-thumbnail" data-rank=${item.rank} data-result-type=news>
					
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>
							<a href="${FB_BASE() + item.clickTrackingUrl}">${item.metaData.h1 || item.title.split(" | ")[0].trim()}</a>
						</strong></p>
						<p class="c-search-result__secondary">${stir.Date.newsDate(new Date(item.metaData.d))}</p>
						<p >${item.summary}</p>	
					</div>
					<div class=c-search-result__image>
						${stir.funnelback.getCroppedImageElement({
				url: flickrUrl(JSON.parse(item.metaData.custom)),
				alt: `Image of ${item.title.split(" | ")[0].trim()}`,
				width: 550,
				height: 550,
			})}
					</div>
				</div>`;
		},

    event: (item) => {
      const hasThumbnail = item.metaData?.image || item.metaData?.tags?.indexOf("Webinar") > -1;
      const title = item.title.split(" | ")[0];

      //if (item.indexUrl === "http://163695") return "";

      const urls = item.metaData.image.split("|");
      const hacklink = urls[1] ? urls[1] : "/events/";

      //if (urls[1]) console.log(urls[1]);

      // ${item.metaData.register ? anchor({ text: title, href: item.metaData.register }) : title}

      return `
			<div class="c-search-result${hasThumbnail ? " c-search-result__with-thumbnail" : ""}" data-rank=${item.rank} data-result-type=event>
				<div class="c-search-result__tags">
					${item.metaData?.tags ? item.metaData.tags.split(",").map(stir.templates.search.stag).join("") : ""}
				</div>
				<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0">
            <strong>
              ${item.metaData.register ? anchor({ text: title, href: item.metaData.register }) : anchor({ text: title, href: hacklink })}
					  </strong>
          </p>
					<div class="flex-container flex-dir-column u-gap-8">
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-calendar"></span>
							<span>${datespan(item.metaData.startDate, item.metaData.d)}</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="uos-clock u-icon h5"></span>
							<span>${timespan(item.metaData.startDate, item.metaData.d)}</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-${item.metaData.online ? "web" : "location"}"></span>
							<span>${item.metaData.online ? "Online" : item.metaData.venue ? item.metaData.venue : ""}</span>
						</div>
					</div>
					<p class="text-sm">${item.summary}</p>
				</div>
				${image(urls[0], item.title.split(" | ")[0])}
				${item.metaData?.tags?.indexOf("Webinar") > -1 ? '<div class=c-search-result__image><div class="c-icon-image"><span class="uos-web"></span></div></div>' : ""}
			</div>`;
    },

		research: (item) => `
			<div class="c-search-result" data-rank=${item.rank}${item.metaData.type ? ' data-result-type="' + item.metaData.type.toLowerCase() + '"' : ""}>
				<div>
					<div class="c-search-result__tags"><span class="c-search-tag">${item.title.split(" | ").slice(0, 1).toString()}</span></div>
					<div class="flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0"><strong>
							<a href="${stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl}">
								${item.title.indexOf("|") > -1 ? item.title.split(" | ")[1] : item.title}
							</a>
						</strong></p>
						${stir.String.stripHtml(item.metaData.c || "") ? `<div class="text-sm">` + stir.String.stripHtml(item.metaData.c || "") + `</div>` : ""}
						${stir.funnelback.getTags(item.metaData.category) ? `<div class=c-search-result__footer>` + stir.funnelback.getTags(item.metaData.category) + `</div>` : ""}
					</div>
				</div>
			</div>`,

		cura: (item) =>
			!item.messageHtml
			? `<div class="c-search-result" data-result-type=curated>
					<div class=c-search-result__body>
						<p class="c-search-result__breadcrumb">${item.displayUrl}</p>
						<p class="u-text-regular u-m-0"><strong>
							<a href="${FB_BASE() + item.linkUrl}" title="${item.displayUrl}">${item.titleHtml}</a>
						</strong></p>
						<p >${item.descriptionHtml}</p>
						<!-- <pre>${JSON.stringify(item, null, "\t")}</pre> -->
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
						<ul>${item.allValues.map(batman=>`<li><label><input type=${facetDisplayTypes[item.guessedDisplayType]||'text'} name="${batman.queryStringParamName}" value="${batman.queryStringParamValue}" ${batman.selected?'checked':''}>${facetCategoryLabel(batman.label)} <span>${batman.count?batman.count:'0'}</span></label></li>`).join('')}</ul>
					</div>
				</div>
			</fieldset>`
	};
})();

(function () {
  //const debug   = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
  //const preview = UoS_env.name === "preview" ? true : false;
  //if(!(debug||preview)) return;

  const date_elements = Array.prototype.slice.call(document.querySelectorAll("[name=meta_startval]"));
  if (!date_elements.length) return;

  const months = [, "January", , , , , , , , "September", , ,];

  const regex = new RegExp(/\d\d\d\d/);
  const ay = new RegExp(/AY\d\d\d\d\D\d\d/i);
  const delim = new RegExp(/ay/i);
  const dates = date_elements.map((date) => {
    return {
      data: date.value,
      date: date.value.replace(ay, ""),
      month: date.value.indexOf("-") > -1 ? months[parseInt(date.value.split("-")[1])] || "" : "",
      year: date.value.match(regex) ? date.value.match(regex).shift() : "",
      acyear: date.value.match(ay) ? date.value.match(ay).shift().replace(delim, "") : "",
    };
  });
  const years = dates.map((date) => date.acyear.replace(delim, "")).filter((value, index, self) => self.indexOf(value) === index && value);

  const root = date_elements[0].parentElement.parentElement.parentElement;

  // remove checkboxes only if the years array is populated
  if (!years.length) return;
  date_elements.forEach((el) => {
    el.parentElement.parentElement.remove();
  });

  const DateInput = (type, name, value) => {
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.value = value;
    return input;
  };

  const DateLabel = (name, value) => {
    const input = DateInput("radio", "meta_startval", `[1st ${value}]`);
    const label = document.createElement("label");
    label.appendChild(input);
    label.appendChild(document.createTextNode(name));
    return label;
  };

  const picker = document.createElement("li");

  years.forEach((acyear) => {
    // Array: get all dates relevant to this academic year
    const thisyear = dates.filter((date) => date.acyear === acyear);

    // String: create a meta-search parameter of 'other' dates (i.e. neither Sept nor Jan)
    const other = thisyear
      .filter((date) => date.date.indexOf("-01") === -1 && date.date.indexOf("-09") === -1)
      .map((date) => date.data)
      .join(" ");

    // DOM: show heading
    const set = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.classList.add("u-my-1", "text-xsm");

    set.appendChild(legend);
    set.setAttribute("class", "c-search-filters-subgroup");
    legend.innerText = `Academic year ${acyear}`;
    picker.appendChild(set);

    // DOM: show conventional start dates (Sept, Jan)
    thisyear
      .filter((date) => date.acyear === acyear && (date.date.indexOf("-01") > -1 || date.date.indexOf("-09") > -1))
      .map((date) => {
        set.appendChild(DateLabel(`${date.month} ${date.year}`, date.data));
      });

    // DOM: lastly show 'other' dates
    if (other.length) set.appendChild(DateLabel(`Other ${acyear}`, `${other}`));
  });

  root.appendChild(picker);
})();

stir = stir || {};
stir.searchUI = stir.searchUI || {};

/*
  Aside Accordion Transform Helper
  @author: ryankaye
  @version: 1.0
  @description: Transform an aside to an accordion (mobile folding)
*/
stir.searchUI.asideAccordion = (filterNode, index) => {
  console.log("hello");
  const header = filterNode.querySelector("p.c-search-filters-header");
  const body = filterNode.querySelector("div");

  if (header && body) {
    filterNode.setAttribute("data-behaviour", "accordion");

    const button = document.createElement("button");
    button.innerHTML = header.innerHTML;
    button.setAttribute("id", "filteraccordbtn_" + index);
    button.setAttribute("aria-controls", "filteraccordpanel_" + index);
    button.setAttribute("aria-expanded", "false");

    header.innerHTML = "";
    header.appendChild(button);

    body.setAttribute("id", "filteraccordpanel_" + index);
    body.setAttribute("aria-labelledby", "filteraccordbtn_" + index);
    body.setAttribute("role", "region");
    body.classList.add("hide");

    button.addEventListener("click", (e) => {
      body.classList.toggle("hide");
      body.classList.contains("hide") ? button.setAttribute("aria-expanded", "false") : button.setAttribute("aria-expanded", "true");
    });
  }
};

/* 
    Vertical Slider Component
    @author: ryankaye
    @version: 1.0
*/
stir.searchUI.verticalSlider = (item, target) => {
  /* buildNavDiv */
  const buildNavDiv = () => {
    const div = document.createElement("div");

    div.classList.add("tns-controls");
    div.setAttribute("aria-label", "Carousel Navigation");
    div.setAttribute("tabindex", "0");

    return div;
  };

  /* buildNavButton */
  const buildNavButton = (id, text, icon) => {
    const btn = document.createElement("button");

    btn.innerHTML = '<span class="uos-' + icon + ' icon--medium "></span>';
    btn.setAttribute("data-controls", text);
    btn.setAttribute("aria-label", text);
    btn.setAttribute("type", "button");
    btn.setAttribute("tabindex", "-1");
    btn.setAttribute("aria-controls", id);

    return btn;
  };

  /* Build the full Button + wrapper + listener */
  const buildNavElement = (containerId, text, icon) => {
    const div = buildNavDiv();
    const btn = buildNavButton(containerId, text, icon);

    div.insertAdjacentElement("beforeend", btn);

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      verticalSlider.goTo(text);
    });

    return div;
  };

  /* initSlider */
  const initSlider = (container) => {
    if (!container) return;

    const divPrev = buildNavElement(container.id, "prev", "chevron-up");
    const divNext = buildNavElement(container.id, "next", "chevron-down");

    container.parentElement.parentElement.insertAdjacentElement("afterend", divNext);
    container.parentElement.parentElement.insertAdjacentElement("beforebegin", divPrev);

    target.parentElement.setAttribute("data-inittns", "");
  };

  /* Config */
  const verticalSlider = tns({
    container: item,
    controls: false,
    loop: false,
    slideBy: 7,
    items: 7,
    axis: "vertical",
    autoHeight: false,
    touch: true,
    swipeAngle: 30,
    speed: 400,
  });

  verticalSlider && initSlider(verticalSlider.getInfo().container);
};

/* 
  Slider Aria Helper
  @author: ryankaye
  @version: 1.0
  @description: Add Aria Labels to a slider after its initialised 
*/
stir.searchUI.sliderArias = (node) => {
  if (!node) return;

  setTimeout(() => {
    const controlsPrevious = node.querySelector('[data-controls="prev"]');
    const controlsNext = node.querySelector('[data-controls="next"]');

    controlsPrevious && controlsPrevious.setAttribute("aria-label", "Previous");
    controlsNext && controlsNext.setAttribute("aria-label", "Next");

    return true;
  }, 100);
};

/*
   Slide Tab Component
   @author: ryankaye
   @version: 1.0
 */
stir.searchUI.slideTab = (scope) => {
  if (!scope) return;

  const nodes = {
    slideBox: scope,
    slideNavBox: scope.querySelector("[data-searchbtnstns]"),
    slideNavBtns: Array.prototype.slice.call(scope.querySelectorAll("[data-searchbtnstns] h2 button")),
    slideResultTabs: Array.prototype.slice.call(scope.querySelectorAll("#mySlider1 > div")),
    accordions: Array.prototype.slice.call(scope.querySelectorAll("[data-behaviour=accordion]")),
  };

  if (!nodes.slideNavBox || !nodes.slideNavBtns || !nodes.slideResultTabs) return;

  /* initTabs */
  const initTabs = (nodes) => {
    const sliderNav = tns({
      container: "#" + nodes.slideNavBox.id,
      items: calcItemsToShow(stir.MediaQuery.current),
      loop: false,
      slideBy: "page",
      controls: true,
      controlsText: ['<span class="uos-chevron-left icon--medium "></span>', '<span class="uos-chevron-right icon--medium "></span>'],
      touch: true,
      swipeAngle: 30,
      navPosition: "top",
      autoHeight: true,
      autoplay: false,
    });

    nodes.slideNavBox.setAttribute("role", "tablist");
    stir.searchUI.sliderArias(nodes.slideBox);

    nodes.slideNavBtns.forEach((item) => {
      item.closest("h2").style.width = "90px"; // item.offsetWidth + "px";
      //item.setAttribute("role", "tab");
      item.closest("div.tns-item").setAttribute("role", "tab");
      item.setAttribute("tabindex", "-1");
      item.setAttribute("type", "button");
      item.setAttribute("aria-controls", "search_results_panel_" + item.getAttribute("data-open"));
      item.setAttribute("id", "searchtab_" + item.getAttribute("data-open"));
    });

    nodes.slideResultTabs.forEach((item) => {
      item.setAttribute("role", "tabpanel");
      item.setAttribute("tabindex", "0");
      item.setAttribute("id", "search_results_panel_" + item.getAttribute("data-panel"));
      item.setAttribute("aria-labelledby", "searchtab_" + item.getAttribute("data-panel"));
    });

    const open = QueryParams.get("tab") ? QueryParams.get("tab") : "all";
    const btnActive = scope.querySelector("button[data-open=" + open + "]");

    if (nodes.slideNavBox && nodes.slideNavBox.classList.contains("hide-no-js")) nodes.slideNavBox.classList.remove("hide-no-js");

    if (btnActive) {
      btnActive.click();
      if (nodes.slideNavBtns.indexOf(btnActive) >= calcItemsToShow(stir.MediaQuery.current)) sliderNav.goTo(nodes.slideNavBtns.indexOf(btnActive));
    }
  };

  /* calcItemsToShow */
  const calcItemsToShow = (size) => {
    if (size === "small") return 3;
    if (size === "medium") return 4;

    return nodes.slideNavBtns.length;
  };

  /* controlSticky */
  const controlSticky = () => {
    const top = nodes.slideBox.getBoundingClientRect().top;

    top < 0.01 && nodes.slideBox.classList.add("stuck");
    top > 0 && nodes.slideBox.classList.remove("stuck");
  };

  /* handleTabClick */
  const handleTabClick = (e) => {
    const btn = e.target.closest("button[data-open]");

    if (!btn) return;

    const open = btn.getAttribute("data-open") || "null";
    const panel = stir.node('[data-panel="' + open + '"]');

    nodes.slideNavBtns.forEach((item) => {
      item.parentElement.classList.remove("slide-tab--active");
    });

    btn.closest("h2").classList.add("slide-tab--active");

    nodes.slideResultTabs.forEach((el) => {
      el.classList.add("hide");
      el.setAttribute("aria-hidden", "true");

      if (el.getAttribute("data-panel") === open) {
        el.classList.remove("hide");
        el.removeAttribute("aria-hidden");
      }
    });

    panel.classList.remove("hide");
    panel.removeAttribute("aria-hidden");
    stir.scrollToElement && stir.scrollToElement(nodes.slideBox, 0);

    // only set tab on user-clicks, not scripted ones
    if (e.isTrusted) QueryParams.set("tab", open);
  };

  /* throttle */
  function throttle(callback, limit) {
    var wait = false;
    return function () {
      if (!wait) {
        callback.call();
        wait = true;
        setTimeout(function () {
          wait = false;
        }, limit);
      }
    };
  }

  /*
    Event Listeners
  */
  document.addEventListener("scroll", throttle(controlSticky, 200));
  nodes.slideNavBox.addEventListener("click", handleTabClick);
  window.addEventListener("popstate", (ev) => initTabs(nodes)); // reinit tabs on history navigation (back/forward)

  initTabs(nodes);
};

/*
    O N   L O A D   E V E N T S
 */

(function () {
  /* 
    IE Guard Clause 
  */
  if ("undefined" === typeof window.URLSearchParams) return;

  /*
    Find all vertical sliders 
    and initialte them
   */
  const handleAccordionClick = (e) => {
    if (e.target.parentElement.dataset.containtns === "" && e.target.parentElement.dataset.inittns !== "") {
      const item = e.target.parentElement.nextElementSibling.children[0];
      if (item) stir.searchUI.verticalSlider(item, e.target);
    }
  };

  stir.nodes('[data-containtns=""]').forEach((item) => {
    item.children[0].addEventListener("click", handleAccordionClick);
  });

  /*
    Find all Slide Tabs Components 
    and initialise them
   */
  const slideTabs = stir.nodes(".c-search-results-area");

  if (slideTabs.length) slideTabs.forEach((item) => stir.searchUI.slideTab(item));

  /*
    Find all mobile filter accordions 
    and initialise them 
   */
  const filterNodes = stir.nodes(".c-search-results-filters");

  if (stir.MediaQuery.current === "small" || stir.MediaQuery.current === "medium") {
    if (filterNodes.length) {
      filterNodes.forEach((element, index) => stir.searchUI.asideAccordion(element, index));
    }
  }
})();

var stir = stir || {};

/* ------------------------------------------------
 * @author: Ryan Kaye
 * @version: 2 (Non jQuery. Non Searchbox. Non broken)
 * ------------------------------------------------ */

stir.funnelback = (() => {
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;

  //const hostname = 'stage-shared-15-24-search.clients.uk.funnelback.com';
  //const hostname = 'shared-15-24-search.clients.uk.funnelback.com';
  const hostname = debug || UoS_env.name === "preview" ? "stage-shared-15-24-search.clients.uk.funnelback.com" : "search.stir.ac.uk";
  //const hostname = "search.stir.ac.uk";
  const url = `https://${hostname}/s/`;

	const getJsonEndpoint = () => new URL("search.json", url);
	const getScaleEndpoint = () => new URL("scale", url);
	const getHostname = () => hostname;

	const renderImgTag = (image) => `<img src="${image.src}" alt="${image.alt}" height="${image.height}" width="${image.width}" loading=lazy data-original=${image.original}>`;

	const resolveHref = (url, parameters) => {
		url.search = new URLSearchParams(parameters);
		return url;
	};
	//const resolveHref = stir.curry((url, parameters) => {url.search = new URLSearchParams(parameters); return url});
	//const resolveImgHref = resolveHref(getScaleEndpoint)

	const getCroppedImageElement = (parameters) => {
		if (!parameters.url) return "<!-- no image -->";
		const url = resolveHref(getScaleEndpoint(), stir.Object.extend({}, parameters, { type: "crop_center", format: "jpeg" }));
		return renderImgTag({ src: url, alt: parameters.alt, width: Math.floor(parameters.width / 2), height: Math.floor(parameters.height / 2), original: parameters.url });
	};

	const getTags = (tagMeta) => {
		const tagGroups = tagMeta && tagMeta.split(";");
		return tagGroups && tagGroups.map(stir.templates.search.tagGroup).join("");
	};

	const imgError = (error) => {
		//debug && console.error('[Search] There was an error loading a thumbnail image.', error.target.src);
		if (error.target.getAttribute("data-original") && error.target.getAttribute("src") != error.target.getAttribute("data-original")) {
			//debug && console.error('[Search] …reverting to original image: ', error.target.getAttribute('data-original'));
			error.target.src = error.target.getAttribute("data-original");
		} else {
			//debug && console.error('[Search] …no alternative image available. It will be removed.');
			error.target.parentElement.parentElement?.classList?.remove("c-search-result__with-thumbnail");
			error.target.parentElement.parentElement.removeChild(error.target.parentElement);
		}
	};

	return {
		getHostname: getHostname,
		getJsonEndpoint: getJsonEndpoint,
		getScaleEndpoint: getScaleEndpoint,
		getCroppedImageElement: getCroppedImageElement,
		getTags: getTags,
		imgError: imgError,
	};
})();

stir.courses = (() => {
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;

	/**
	 * C L E A R I N G
	 */
	const CLEARING = false; // set TRUE if Clearing is OPEN; otherwise FALSE
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
	};
})();

stir.search = () => {
	// abandon before anything breaks in IE
	if ("undefined" === typeof window.URLSearchParams) {
		const el = document.querySelector(".c-search-results-area");
		el && el.parentElement.removeChild(el);
		return;
	}
	const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
	const NUMRANKS = "small" === stir.MediaQuery.current ? 5 : 10;
	const MAXQUERY = 256;
	const CLEARING = stir.courses.clearing; // Clearing is open?

	debug && console.info("[Search] initialising…");

	const buildUrl = stir.curry((url, parameters) => {
		url.search = new URLSearchParams(parameters);
		return url;
	});

	/* this is really the default parameters for a given search type */
	const getParameters = stir.curry((fixed, state) => stir.Object.extend({}, fixed, state));

	/* this is for adding in the filters (e.g. courses, sorting) */
	const addMoreParameters = (url, formData) => {
		let a = new URLSearchParams(formData);
		for (let [key, value] of new URLSearchParams(url.search)) {
			a.set(key, value);
		}
		url.search = a;
		return url;
	};

	const LoaderButton = () => {
		const button = document.createElement("button");
		button.innerText = "Load more results";
		button.setAttribute("class", "button hollow tiny");
		return button;
	};

  const meta = {
    main: ["c", "d", "access", "award", "biogrgaphy", "breadcrumbs", "category", "custom", "delivery", "faculty", "group", "h1", "image", "imagealt", "level", "modes", "online", "pathways", "role", "register", "sid", "start", "startDate", "subject", "tags", "type", "ucas", "venue", "profileCountry", "profileCourse1", "profileImage"],
    courses: ["c", "award", "code", "delivery", "faculty", "image", "level", "modes", "pathways", "sid", "start", "subject", "ucas"],
    clearing: CLEARING ? ["clearingEU", "clearingInternational", "clearingRUK", "clearingScotland", "clearingSIMD"] : [],
	scholarships: ["value","status","number"]
  };

	//console.info("Clearing is " + (CLEARING ? "open" : "closed"));
	//console.info(meta.clearing);

  const constants = {
    url: stir.funnelback.getJsonEndpoint(),
    form: document.querySelector("form.x-search-redevelopment"),
    input: document.querySelector('form.x-search-redevelopment input[name="query"]'),
    parameters: {
      any: {
        collection: "stir-main",
        SF: `[${meta.main.concat(meta.clearing,meta.scholarships).join(",")}]`,
        num_ranks: NUMRANKS,
        query: "",
        spelling: true,
        explain: true,
        sortall: true,
        sort: "score_ignoring_tiers",
        "cool.21": 0.9,
      },
      news: {
        collection: "stir-www",
        meta_type: "News",
        meta_v_not: "faculty-news",
        sort: "date",
        fmo: "true",
        SF: "[c,d,h1,image,imagealt,tags]",
        num_ranks: NUMRANKS,
        SBL: 450,
      },
      event: {
        collection: "stir-events",
        /* meta_type: 'Event', */
        /* sort: 'metastartDate', */
        /* meta_d1: stir.Date.funnelbackDate(new Date()), */
        fmo: true,
        SF: "[c,d,image,imagealt,startDate,venue,online,tags,type,register]",
        query: "!padrenullquery",
        num_ranks: NUMRANKS,
      },
      gallery: {
        collection: "stir-www",
        meta_type: "Gallery",
        sort: "date",
        fmo: "true",
        SF: "[c,d,image]",
        num_ranks: NUMRANKS,
      },
      course: {
        collection: "stir-courses",
        SF: `[${meta.courses.concat(meta.clearing).join(",")}]`,
        fmo: "true",
        num_ranks: NUMRANKS,
        explain: true,
        query: "!padrenullquery",
        timestamp: +new Date(),
      },
      coursemini: {
        collection: "stir-courses",
        SF: "[c,award,code,delivery,faculty,image,level,modes,sid,start,subject,teaser,ucas]",
        num_ranks: 3,
        curator: "off",
        query: "!padrenullquery",
      },
      person: {
        collection: "stir-research",
        meta_type: "profile",
        fmo: "true",
        /* sort: "metalastname", */
        SF: "[c,d,biogrgaphy,category,faculty,groups,image,imagealt,programme,role,themes]",
        SM: "meta",
        MBL: 350, // metadata buffer length
        num_ranks: NUMRANKS,
      },
      research: {
        collection: "stir-research",
        SM: "meta",
        SF: "[c,d,category,groups,output,programme,themes,type]",
        MBL: 450, // metadata buffer length
        num_ranks: NUMRANKS,
      },
    },
    // extra parameters for no-query searches
    noquery: {
      course: {
        sort: "title", // if no keywords supplied, sort courses
        // by title instead of "relevance"
        //		},
        //		person: {
        //			sort: "meta_surname"	//sort people by surname
        //		},
        //		event: {
        //			sort: "adate"	// sort events by date descending
      },
    },
  };

	if (!constants.form || !constants.form.query) return;
	debug && console.info("[Search] initialised.");

  const getQuery = (type) => constants.form.query.value || QueryParams.get("query") || constants.parameters[type].query || "University of Stirling";

  const getNoQuery = (type) => (constants.form.query.value ? {} : constants.noquery[type]);

	const setQuery = () => (constants.form.query.value ? QueryParams.set("query", constants.form.query.value) : QueryParams.remove("query"));

  const getPage = (type) => parseInt(QueryParams.get(type) || 1);

  const getType = (element) => element.getAttribute("data-type") || element.parentElement.getAttribute("data-type");

  const nextPage = (type) => QueryParams.set(type, parseInt(QueryParams.get(type) || 1) + 1);

	const calcStart = (page, numRanks) => (page - 1) * numRanks + 1;

	const calcPage = (currStart, numRanks) => Math.floor(currStart / numRanks + 1);

	const calcProgress = (currEnd, fullyMatching) => (currEnd / fullyMatching) * 100;

  const getStartRank = (type) => calcStart(getPage(type), constants.parameters[type].num_ranks || 20);

	const resetPagination = () => Object.keys(constants.parameters).forEach((key) => QueryParams.remove(key));

	//	const getFormElementValues = type => {
	//		const form = document.querySelector('.c-search-results-area form[data-filters='+type+']');
	//		const filters = [];
	//		const values = [];
	//
	//		if(form) {
	//			Array.prototype.slice.call(form.elements).filter(element=>element.name).forEach(el=>{
	//				console.info(el.name, el.type);
	//			});
	//			const elements = Array.prototype.slice.call(form.elements).filter(element=>element.name);
	//			elements.forEach(
	//				element => {
	//					if((element.type==='checkbox'||element.type==='radio')&&element.checked)
	//					if(filters.indexOf(element.name)===-1) {
	//						filters.push(element.name);
	//						values.push([element.value]);
	//					} else {
	//						values[filters.indexOf(element.name)].push(element.value);
	//					}
	//				}
	//			);
	//		}
	//
	//		return {filters: filters, values:values};
	//
	//	};
	/* if(filters.length>0){
	  filters.forEach((filter,i)=>{
		  a.append(filter,values[i].length===1?values[i]:`[${values[i].join(' ')}]`);
	  })
  } */

	const getFormData = (type) => {
		const form = document.querySelector(".c-search-results-area form[data-filters=" + type + "]");
		let a = form ? new FormData(form) : new FormData();

		for (var key of a.keys()) {
			if (key.indexOf('f.')===0) continue;
			a.getAll(key).length > 1 && a.set(key, "[" + a.getAll(key).join(" ") + "]");
		}

		return a;
	};

	const getInboundQuery = () => {
		if (undefined !== QueryParams.get("query")) constants.form.query.value = QueryParams.get("query").substring(0, MAXQUERY);

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
		if (data.response.resultPacket.resultsSummary.totalMatching > 0) button.removeAttribute("disabled");
		if (data.response.resultPacket.resultsSummary.currEnd === data.response.resultPacket.resultsSummary.totalMatching) button.setAttribute("disabled", true);
		return data;
	});

	const newAccordion = accordion => new stir.accord(accordion, false);
	const imageErrorHandler = image => image.addEventListener("error", stir.funnelback.imgError);

	// "reflow" events and handlers for dynamically added DOM elements
	const flow = stir.curry((_element, data) => {
		if(!_element.closest) return;
		const root = _element.closest('[data-panel]');
		const cords = root.querySelectorAll('[data-behaviour="accordion"]:not(.stir-accordion)');
		const pics = root.querySelectorAll("img");
		Array.prototype.forEach.call(cords, newAccordion);
		Array.prototype.forEach.call(pics, imageErrorHandler);
	});

	const updateStatus = stir.curry((element, data) => {
		const start = data.response.resultPacket.resultsSummary.currStart;
		const ranks = data.response.resultPacket.resultsSummary.numRanks;
		const summary = element.parentElement.parentElement.querySelector(".c-search-results-summary");
		element.setAttribute("data-page", calcPage(start, ranks));
		summary && (summary.innerHTML = stir.templates.search.summary(data));
		return data; // data pass-thru so we can compose() this function
	});

	const updateFacets = stir.curry((type, data) => {
		const form = document.querySelector(`form[data-filters="${type}"]`);
		if(form) {
			//Array.prototype.slice.call(form.querySelectorAll('fieldset')).forEach(fieldset=>fieldset.parentElement.removeChild(fieldset));
			data.response.facets.forEach(
				(facet) => {
					const active = 'stir-accordion--active';
					const metaFilter = form.querySelector(`[data-facet="${facet.name}"]`);
					const metaAccordion = metaFilter && metaFilter.querySelector('[data-behaviour=accordion]');
					const open = metaAccordion && metaAccordion.getAttribute('class').indexOf(active)>-1;
					const facetFilter = stir.DOM.frag(stir.String.domify(stir.templates.search.facet(facet)));
					const facetAccordion = facetFilter.querySelector('[data-behaviour=accordion]');
					open && facetAccordion && facetAccordion.setAttribute('class',active);
					if(metaFilter) {
						metaFilter.insertAdjacentElement("afterend", facetFilter.firstChild);
						metaFilter.parentElement.removeChild(metaFilter);
					} else {
						form.insertAdjacentElement("afterbegin", facetFilter.firstChild);
					}
				}
			);
		}
		return data; // data pass-thru so we can compose() this function
	});

	const renderResultsWithPagination = stir.curry(
		(type, data) =>
			/*       (debug
					? `<details class=debug>
						<summary>query debug data</summary>
						<pre class=debug data-label="user query">${stir.String.htmlEntities(JSON.stringify(data.response.resultPacket.queryCleaned, null, "  "))}</pre>
						<pre class=debug data-label="queryAsProcessed by FB">${JSON.stringify(data.response.resultPacket.queryAsProcessed, null, "  ")}</pre>
						<pre class=debug data-label=curator>${JSON.stringify(data?.response?.curator, null, "  ")}</pre>
						<pre class=debug data-label=metaParameters>${JSON.stringify(data.question.metaParameters, null, "  ")}</pre>
					</details></div>
					`
					: "") + */
			renderers["cura"](data.response.curator.exhibits) +
			renderers[type](data.response.resultPacket.results) +
			stir.templates.search.pagination({
				currEnd: data.response.resultPacket.resultsSummary.currEnd,
				totalMatching: data.response.resultPacket.resultsSummary.totalMatching,
				progress: calcProgress(data.response.resultPacket.resultsSummary.currEnd, data.response.resultPacket.resultsSummary.totalMatching),
			}) +
			(footers[type] ? footers[type]() : "")
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

	const setFBParameters = buildUrl(constants.url);

	// This is the core search function that talks to Funnelback
	const callSearchApi = stir.curry((type, callback) => {
		const getFBParameters = getParameters(constants.parameters[type]); // curry-in fixed params
		const parameters = getFBParameters(
			stir.Object.extend({},
				{// session params:
					start_rank: getStartRank(type),
					query: getQuery(type),							// get actual query, or fallback, etc
					curator: getStartRank(type) > 1 ? false : true	// only show curator for initial searches
				},
				getNoQuery(type)									// get special "no query" parameters (sorting, etc.)
			)
		);
		//TODO if type==course and query=='!padrenullquery' then sort=title
		const url = addMoreParameters(setFBParameters(parameters), getFormData(type));
		debug && console.info('[Search] URL:', url);
		debug ? stir.getJSONAuthenticated(url, callback) : stir.getJSON(url, callback);
	});

	// A "Meta" version of search() i.e. a search without
	// a querysting, but with some metadata fields set:
	// used for the "Looking for…?" sidebar.
	const callSearchApiMeta = stir.curry((type, callback) => {
		const query = getQuery(type).trim();
		const getFBParameters = getParameters(constants.parameters[type]); // curry-in fixed params
		// TODO: consider passing in the meta fields?
		const parameters = getFBParameters({
			start_rank: getStartRank(type),
			query: `[t:${query} c:${query} subject:${query}]`,
		});
		const url = addMoreParameters(setFBParameters(parameters), getFormData(type));
		debug ? stir.getJSONAuthenticated(url, callback) : stir.getJSON(url, callback);
	});

	const search = (element) => {
		element.innerHTML = "";
		if (element.hasAttribute("data-infinite")) {
			const resultsWrapper = document.createElement("div");
			const buttonWrapper = document.createElement("div");
			const button = LoaderButton();
			button.setAttribute('disabled', true);
			button.addEventListener("click", (event) => getMoreResults(resultsWrapper, button));
			element.appendChild(resultsWrapper);
			element.appendChild(buttonWrapper);
			buttonWrapper.appendChild(button);
			buttonWrapper.setAttribute("class", "c-search-results__loadmore flex-container align-center u-mb-2");
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
		coursemini: callSearchApiMeta("coursemini"),
		person: callSearchApi("person"),
		research: callSearchApi("research"),
	};

	// group the renderer functions so we can get them easily by `type`
	const renderers = {
		any: (data) => data.map(stir.templates.search.auto).join(""),
		news: (data) => data.map(stir.templates.search.news).join(""),
		event: (data) => data.map(stir.templates.search.event).join(""),
		gallery: (data) => data.map(stir.templates.search.gallery).join(""),
		course: (data) => data.map(stir.templates.search.course).join(""),
		coursemini: (data) => data.map(stir.templates.search.coursemini).join(""),
		person: (data) => data.map(stir.templates.search.person).join(""),
		research: (data) => data.map(stir.templates.search.research).join(""),
		cura: (data) => data.map(stir.templates.search.cura).join(""),
	};

	const footers = {
		coursemini: () => `<p class="text-center"><a href="?tab=courses&query=${getQuery("any")}">View all course results</a></p>`,
	};

	const prefetch = {
		course: (callback) => {
			let xmlHttpRequest = stir.courses.getCombos();
			if (xmlHttpRequest) {
				xmlHttpRequest.addEventListener("loadend", callback); // loadend should fire after load OR error
			} else {
				callback.call();
			}
		},
	};

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
		const callback = (data) => {
			if (!element || !element.parentElement) {
				return debug && console.error("[Search] late callback, element no longer on DOM");
			}
			//TODO intercept no-results and spelling suggestion here. Automatically display alternative results?
			if (!data || data.error || !data.response || !data.response.resultPacket) return;
			if (0 === data.response.resultPacket.resultsSummary.totalMatching && fallback(element)) return;

			const comp = composition(data);
			new stir.Favs();
			return comp;
		};
		resetPagination();

		// if necessary do a prefetch and then call-back to the search function.
		// E.g. Courses needs to prefetch the combinations data
		if (prefetch[type]) return prefetch[type]((event) => searchers[type](callback));
		// if no prefetch, just call the search function now:
		searchers[type](callback);
	};

	// triggered by the 'load more' buttons. Fetches new results and APPENDS them.
	const getMoreResults = (element, button) => {
		const type = getType(element);
		if (!searchers[type]) return;
		const status = updateStatus(element);
		const append = appendHtml(element);
		const render = renderResultsWithPagination(type);
		const reflow = flow(element);
		const composition = stir.compose(reflow, append, render, enableLoadMore(button), status);

		const doData = (data) => {
			composition(data);
			new stir.Favs();
		};

		const callback = (data) => (data && !data.error ? doData(data) : new Function());
		nextPage(type);
		searchers[type](callback);
	};

	// initialise all search types on the page (e.g. when the query keywords are changed byt the user):
	const initialSearch = () => searches.forEach(search);

	// CHANGE event handler for search filters.
	// Also handles the RESET event.
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

	// Click-delegate for status panel (e.g. misspellings, dismiss filters, etc.)
	Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-summary"), (statusPanel) => {
		statusPanel.addEventListener("click", (event) => {
			if (event.target.hasAttribute("data-suggest")) {
				event.preventDefault();
				constants.input.value = event.target.innerText;
				setQuery();
				initialSearch();
			} else if (event.target.hasAttribute("data-value")) {
				const selector = `input[name="${event.target.getAttribute("data-name")}"][value="${event.target.getAttribute("data-value")}"]`;
				const input = document.querySelector(selector);
				if (input) {
					input.checked = !input.checked;
					event.target.parentElement.removeChild(event.target);
					initialSearch();
				} else {
					const sel2 = `select[name="${event.target.getAttribute("data-name")}"]`;
					const select = document.querySelector(sel2);
					if (select) {
						select.selectedIndex = 0
						event.target.parentElement.removeChild(event.target);
						initialSearch();
					}
				}
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

	init();

	window.addEventListener("popstate", init);
};

stir.search();
