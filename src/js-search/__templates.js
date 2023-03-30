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
    if (isDocUrl(liveUrl)) return `Document: ${isDocUrl(liveUrl)} <small>${stir.Math.fileSize(fileSize || 0, 0)}</small>`;

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
	const metaParamElement = (name, value) => document.querySelector( `input[name="${name}"][value="${value}"],select[name="${name}"] option[value="${value}"]` );

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
		const metas = Object.keys(tokens).filter(key=>key.indexOf('meta_')===0 && tokens[key][0]);

		return metas.map(key=>{

			// does the name and value match a DOM element?
			const el = metaParamElement(key,tokens[key]);
			if(el) return tag(el.innerText||el.parentElement.innerText,key,tokens[key]);
			
			// if not, we might have a multi-select filter (e.g. checkbox)
			const tokenex = new RegExp(/\[([^\[^\]]+)\]/); // regex for Funnelback dysjunction operator e.g. [apples oranges]
			const values = tokens[key].toString().replace(tokenex,`$1`).split(/\s/); // values are space-separated
			return values.map(value=>{
				const el = metaParamElement(key,value);
				// The innerText of the <input> element‘s <label> has the text we need
				if(el) { return tag(el.parentElement.innerText,key,value); }
				// We will just default to empty string if there is no matching element.
				return '';
			}).join(" ");
		}).join(" ");
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
      const querySanitised = stir.String.stripHtml(data.question.originalQuery).replace(/^!padrenullquery$/, "").trim();
      const queryEcho = querySanitised.length > 1 ? ` for <em>${querySanitised}</em>` : "";
	  const message = (totalMatching > 0 ? `	<p class="text-sm">There are <strong>${totalMatching.toLocaleString("en")} results</strong>${queryEcho}.</p>` : `<p id="search_summary_noresults"><strong>There are no results${queryEcho}</strong>.</p>`);
	  const tokens = metaParamTokens(data.question.rawInputParameters);
	  const spelling = querySanitised ? checkSpelling(data.response.resultPacket.spell) : '';
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

    courseFact: (head, body, sentenceCase) => (head && body ? `<div class="cell medium-4"><strong class="u-heritage-green">${head}</strong><p${sentenceCase ? " class=u-text-sentence-case" : ""}>${body}</p></div>` : ""),

    course: (item) => {
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

    studentstory: (item, trail) => {
      return `
	  	<div class=c-search-result data-result-type=studentstory>
	  		<div ><a href="${trail[0].href}">${trail[0].text}</a></div>
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
          <div >
							${item.metaData.d ? stir.Date.newsDate(new Date(item.metaData.d)) : ""}
					</div>
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
      return `
			<div class="c-search-result${hasThumbnail ? " c-search-result__with-thumbnail" : ""}" data-rank=${item.rank} data-result-type=event>
				<div class="c-search-result__tags">
					${item.metaData?.tags ? item.metaData.tags.split(",").map(stir.templates.search.stag).join("") : ""}
				</div>
				<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0">
            <strong>
						  ${item.metaData.register ? anchor({ text: title, href: item.metaData.register }) : title}
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
				${image(item.metaData.image, item.title.split(" | ")[0])}
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
				<!-- p>12344</ -->
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
  };
})();
