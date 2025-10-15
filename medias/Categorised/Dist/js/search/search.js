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
  const authMessage = (group) =>
    notice(`This page is only available to ${groups[group]}. You will be asked to log in before you can view it, but once you are logged in results will be shown automatically.`);
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
  const facetTokens = (facets) =>
    facets.map((facet) => facet.selectedValues.map((value) => paramToken(value.queryStringParamName, value.queryStringParamValue)).join(" ")).join(" ");

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

  const facetDisplayTypes = {
    SINGLE_DRILL_DOWN: undefined,
    CHECKBOX: "checkbox",
    RADIO_BUTTON: "radio",
    TAB: undefined,
    UNKNOWN: undefined,
  };

  //	const months = {
  //		"01": "January",
  //		"02": "February",
  //		"05": "May",
  //		"08": "August",
  //		"09": "September",
  //		"10": "October",
  //	};

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
  // date labels are handled by `src/js-search/course-start-date.js`

  //	{ return (label.indexOf("ay") === 7 ? readableDate(label.split("ay").shift()) : correctCase(facet, label)); };
  //	const readableDate = (date) => months[date.split("-").pop()] + " " + date.split("-").shift();

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

    message: (hit, count, queried) => {
      const p = document.createElement("p");
      p.classList.add(hit ? "text-sm" : "search_summary_noresults");
      p.innerHTML = hit ? `There are <strong>${count} results</strong>` : "<strong>There are no results</strong>";
      if (queried) p.insertAdjacentText("beforeend", " for ");
      return p;
    },

    summary: (data) => {
      const summary = document.createElement("div");
      const { currEnd, totalMatching, currStart } = data.response.resultPacket.resultsSummary;
      const querySanitised =
        stir.String.htmlEntities(data.question.originalQuery)
          .replace(/^!padrenullquery$/, "")
          .trim() || "";
      const queryEcho = document.createElement("em");
      const message = stir.templates.search.message(totalMatching > 0, totalMatching&&totalMatching.toLocaleString("en"), querySanitised.length > 1);
      const tokens = [metaParamTokens(data.question.rawInputParameters), facetTokens(data.response.facets || [])].join(" ");
      const spelling = querySanitised ? checkSpelling(data.response.resultPacket.spell) : "";
      const hostinfo = debug ? `<small>${data.question.additionalParameters.HTTP_HOST}</small>` : "";

      queryEcho.textContent = querySanitised;
      if (querySanitised.length > 1) message.append(queryEcho);
      summary.classList.add("u-py-2");
      summary.insertAdjacentHTML("afterbegin", `${hostinfo}`);
      summary.append(message);
      summary.insertAdjacentHTML("beforeend", `${tokens} ${spelling}`);
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
				<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${item.rank}${
        item.metaData.type || isDocUrl(item.liveUrl) ? ' data-result-type="' + (item.metaData.type || (isDocUrl(item.liveUrl) ? "document" : "")).toLowerCase() + '"' : ""
      }${item.metaData.access ? ' data-access="' + item.metaData.access + '"' : ""}>
					<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
						${label}
						${makeBreadcrumbs(trail, item.liveUrl, item.fileSize)}
						<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl}">${item.title
        .split("|")[0]
        .trim()
        .replace(/\xA0/g, " ")}</a></strong></p>
						<p >${item.summary.replace(/\xA0/g, " ")}</p>
					</div>
				</div>`;
    },
    internal: (item) => {
      const crumbs = {
        text: item.metaData?.breadcrumbs?.split(" > ") || [],
        href: new URL(item.liveUrl).pathname.split("/").filter((n) => n),
      };

      const trail = userAuth(item.metaData.group)
        ? stir.templates.search.trailstring(crumbs.text.map((text, index) => ({ text: text, href: "/" + crumbs.href.slice(0, index + 1).join("/") + "/" })).slice(0, -1))
        : `<a href="https://www.stir.ac.uk/${crumbs.href[0]}/">${crumbs.text[0]}</a>`;

      return `
	  <div class="u-border-width-5 u-heritage-line-left c-search-result${authClass(item.metaData.group)}" data-rank=${item.rank}${
        item.metaData.type ? ' data-result-type="' + item.metaData.type.toLowerCase() + '"' : ""
      } data-access="${item.metaData.access}">
			  <div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="c-search-result__breadcrumb">${trail}</p>
				<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl}">${item.title
        .replace(/Current S\S+ ?\| ?/, "")
        .split(" | ")[0]
        .trim()}</a></strong></p>
				${internalSummary(item.summary, item.metaData.group)}
			  </div>
			</div>`;
    },

    combo: (item) => {
      return `<li title="${item.prefix} ${item.title}">${item.courses.map(stir.templates.search.comboCourse).join(" and ")}${
        item?.codes?.ucas ? " <small>&hyphen; " + item.codes.ucas + "</small>" : ""
      }${clearingTest(item) ? ' <sup class="c-search-result__seasonal">*</sup>' : ""}</li>`;
    },

    comboCourse: (item) => `<a href="${item.url}">${item.text.replace(/(BAcc \(Hons\))|(BA \(Hons\))|(BSc \(Hons\))|(\/\s)/gi, "")}</a>`,

    clearing: (item) => {
      if (Object.keys && item.metaData && Object.keys(item.metaData).join().indexOf("clearing") >= 0) {
        return `<!-- <p class="u-m-0"><strong class="u-energy-purple">Clearing 2025: places may be available on this course.</strong></p> -->`;
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
						${
              item.combos.map(clearingTest).indexOf(true) >= 0
                ? '<p class="u-footnote">Combinations marked with <sup class=c-search-result__seasonal>*</sup> may have Clearing places available.</p>'
                : ""
            }
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

    courseFact: (head, body, sentenceCase) =>
      head && body
        ? `<div class="cell medium-4"><strong class="u-heritage-green">${head}</strong><p${sentenceCase ? " class=u-text-sentence-case" : ""}>${body.replace(
            /\|/g,
            ", "
          )}</p></div>`
        : "",

    course: (item) => {
      //      const preview = UoS_env.name === "preview" || UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
      //      const subjectLink = stir.String.slug(subject);
      const subject = item.metaData.subject ? item.metaData.subject.split(/,\s?/).slice(0, 1) : "";
      const isOnline = item.metaData.delivery && item.metaData.delivery.toLowerCase().indexOf("online") > -1 ? true : false;
      const link = UoS_env.name.indexOf("preview") > -1 ? t4preview(item.metaData.sid) : FB_BASE() + item.clickTrackingUrl; //preview or appdev
      item.combos = stir.courses.showCombosFor(UoS_env.name == "preview" ? item.metaData.sid : item.liveUrl);
      //item.combos = stir.courses.showCombosFor(item.metaData.sid); // this is for debugging t4 preview mode
      return `
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-rank=${item.rank} data-sid=${item.metaData.sid} data-result-type=course${
        isOnline ? " data-delivery=online" : ""
      }>
				<div class=" c-search-result__tags">
					<span class="c-search-tag">${courseLabel(item.metaData.level || item.metaData.type || "")}</span>
				</div>

		<div class="flex-container flex-dir-column u-gap u-mt-1 ">
		  <p class="u-text-regular u-m-0">
			<strong><a href="${link}" title="${item.liveUrl}">
			${item.metaData.award || ""} ${item.title}
			${item.metaData.ucas ? " - " + item.metaData.ucas : ""}
			${item.metaData.code ? " - " + item.metaData.code : ""}
			</a></strong>
		  </p>
		  <p class="u-m-0 c-course-summary">${item.summary}</p>
		  ${stir.templates.search.clearing(item) || ""}
		  <div class="c-search-result__meta grid-x">
			${stir.templates.search.courseFact("Start dates", item.metaData.start, false)}
			${stir.templates.search.courseFact("Study modes", item.metaData.modes, true)}
			${stir.templates.search.courseFact("Delivery", item.metaData.delivery, true)}
		  </div>
		  
		  <div class="flex-container u-gap u-mb-1 text-xsm flex-dir-column medium-flex-dir-row">
			<div data-nodeid="coursefavsbtn" data-favsurl="/courses/favourites/" class="flex-container u-gap-8" >
			  ${stir.coursefavs && stir.coursefavs.createCourseBtnHTML(item.metaData.sid, "/courses/favourites/")}
			</div>
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

    courseminiFooter: (
      query //debug?`
    ) =>
      `<p class="u-mb-2 flex-container u-align-items-center u-gap-8">
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
      return `
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=person>
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
		<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=scholarship data-rank=${item.rank}>
			<div class=c-search-result__tags>
				${stir.templates.search.stag(item.metaData.level ? `Scholarship: ${item.metaData.level.toLowerCase()}` : "")}
			</div>
			<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin + item.clickTrackingUrl}">${item.title
        .split("|")[0]
        .trim()
        .replace(/\xA0/g, " ")}</a></strong></p>
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
				<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=studentstory>
					<div><a href="${trail[0].href}">${trail[0].text}</a></div>
					<div class="c-search-result__body flex-container flex-dir-column u-gap ">
						<p class="u-text-regular u-m-0"><strong>
							<a href="${FB_BASE() + item.clickTrackingUrl}">${item.title.split(" | ")[0].trim()}</a>
						</strong></p>
						<p class="u-m-0">
						${item.metaData.profileCourse1 ? item.metaData.profileCourse1 + "<br />" : ""}
						${item.metaData.profileCountry ? item.metaData.profileCountry : ""}
						</p>
						<p>${item.metaData.profileSnippet ? "<q>" + item.metaData.profileSnippet + "</q>" : "<!-- 28d3702e2064f72d5dfcba865e3cc5d5 -->"}</p>
					</div>
					${item.metaData.profileImage ? image("https://www.stir.ac.uk" + item.metaData.profileImage, item.title.split(" | ")[0].trim(), 400, 400) : ""}
				</div>`;
    },

    news: (item) => {
      return `
				<div class="u-border-width-5 u-heritage-line-left c-search-result${item.metaData.thumbnail ? " c-search-result__with-thumbnail" : ""}" data-rank=${item.rank} data-result-type=news>
					<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0">
							<strong>
								<a href="${FB_BASE() + item.clickTrackingUrl}">${item.metaData.h1 || item.title.split(" | ")[0].trim()}</a>
							</strong>
						</p>
						<div>${item.metaData.d ? stir.Date.newsDate(new Date(item.metaData.d.split("|")[0])) : ""}</div>
						<p class="text-sm">${item.metaData.abstract || item.summary}</p>
						<!-- <p>
							${
                item.listMetadata && item.listMetadata.tag
                  ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px;height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"></path></svg>`
                  : ""
              }
							${(item.listMetadata && item.listMetadata.tag && item.listMetadata.tag.map((tag) => `<span>${tag}</span>`).join(", ")) || ""}
						</p> -->
					</div>
					<div class=c-search-result__image>
						<img src="${item.metaData.thumbnail}" alt="${item.title.split(" | ")[0].trim()}" height="275" width="275" loading="lazy">
					</div>
				</div>`;
    },

    gallery: (item) => {
      return `
				<div class="u-border-width-5 u-heritage-line-left c-search-result c-search-result__with-thumbnail" data-rank=${item.rank} data-result-type=news>
					
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
      const isWebinar = item.metaData?.tags?.indexOf("Webinar") > -1;
      const hasThumbnail = item.metaData?.image || isWebinar;
      const title = item.title.split(" | ")[0];
      const url =
        item.collection == "stir-events" ? (item.metaData.page ? item.metaData.page : item.metaData.register ? item.metaData.register : "#") : FB_BASE() + item.clickTrackingUrl;

      return `
			<div class="u-border-width-5 u-heritage-line-left c-search-result${hasThumbnail ? " c-search-result__with-thumbnail" : ""}" data-rank=${item.rank} data-result-type=event>
				<div class=c-search-result__tags>
					${item.metaData?.tags ? item.metaData.tags.split(",").map(stir.templates.search.stag).join("") : ""}
				</div>
				<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0">
						<strong>${anchor({ text: title, href: url })}</strong>
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
					<p class=text-sm>${item.summary}</p>
					${item.metaData.register ? `<p class="u-m-0 text-sm"><a href="${item.metaData.register}" class="u-m-0 button hollow tiny">Register now</a></p>` : ""}
				</div>
				${image(item.metaData.image && item.metaData.image.split("|")[0], item.title.split(" | ")[0])}
				${item.metaData?.tags?.indexOf("Webinar") > -1 ? '<div class=c-search-result__image><div class="c-icon-image"><span class="uos-web"></span></div></div>' : ""}
			</div>`;
    },

    research: (item) => `
			<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${item.rank}${
      item.metaData.type ? ' data-result-type="' + item.metaData.type.toLowerCase() + '"' : ""
    }>
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
						<p class="u-text-regular u-m-0"><strong>
							<a href="${FB_BASE() + item.linkUrl}" title="${item.displayUrl}">${item.titleHtml}</a><br>
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
      (facet, facetValue) => `
	<li>
		<label>
			<input type=${facetDisplayTypes[facet.guessedDisplayType] || "text"} name="${facetValue.queryStringParamName}" value="${facetValue.queryStringParamValue}" ${
        facetValue.selected ? "checked" : ""
      }>
			${facetCategoryLabel(facet.name, facetValue.label)}
			<!-- <span>${facetValue.count ? facetValue.count : "0"}</span> -->
		</label>
	</li>`
    ),
  };
})();

/** 410 GONE -- moved 2025-08-22 by rwm2 */
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
        }
      });
    });

    // Initialize tab panel attributes for accessibility
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
	const CLEARING = true; // set TRUE if Clearing is OPEN; otherwise FALSE
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
			console.info("OTHER!",date,strings[date.value]||date.value);
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
 * @version: 3
 * ------------------------------------------------ */

/**
 * Search API helper
 */
stir.funnelback = (() => {
  const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
  const hostname = UoS_env.search;
  const url = `https://${hostname}/s/`;

  // alternative public hostname: `shared-15-24-search.clients.uk.funnelback.com`

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

/**
 * Stir Search
 * Created for the Search Revamp project 2022/23
 * @returns Object
 */
stir.search = () => {
  // abandon before anything breaks in IE
  if ("undefined" === typeof window.URLSearchParams) {
    const el = document.querySelector(".c-search-results-area");
    el && el.parentElement.removeChild(el);
    return;
  }
  const debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
  const preview = debug || UoS_env.name === "preview" ? true : false;
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
    main: ["c", "d", "access", "award", "biogrgaphy", "breadcrumbs", "category", "custom", "delivery", "faculty", "group", "h1", "image", "imagealt", "level", "modes", "online", "page", "pathways", "role", "register", "sid", "start", "startDate", "subject", "tag", "tags", "thumbnail", "type", "ucas", "venue", "profileCountry", "profileCourse1", "profileImage", "profileSnippet"],
    courses: ["c", "award", "code", "delivery", "faculty", "image", "level", "modes", "pathways", "sid", "start", "subject", "ucas"],
    clearing: CLEARING ? ["clearing"] : [],
    scholarships: ["value", "status", "number"],
    news: ["abstract", "c", "d", "h1", "image", "imagealt", "tags", "tag", "thumbnail"],
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
        SF: `[${meta.main.concat(meta.clearing, meta.scholarships).join(",")}]`,
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
        query: "!padrenullquery",
        meta_type: "News",
        meta_v_not: "faculty-news",
        sort: "date",
        fmo: "true",
        SF: `[${meta.news.join(",")}]`,
        num_ranks: NUMRANKS,
        SBL: 450,
      },
      event: {
        collection: "stir-events",
        /* meta_type: 'Event', */
        /* sort: 'metastartDate', */
        /* meta_d1: stir.Date.funnelbackDate(new Date()), */
        fmo: true,
        SF: "[c,d,image,imagealt,online,page,register,startDate,tags,type,venue]",
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
      internal: {
        collection: "stir-internal",
        SF: "[c,access,breadcrumbs,group]",
        query: "!padrenullquery",
      },
      clearing: {
        collection: "stir-courses-combos",
        query: "!padrenullquery",
        sort: "title",
        meta_clearing: "[scotland simd rukroi international eu]",
        SF: `[${meta.courses.concat(meta.clearing).join(",")}]`,
        fmo: "true",
        num_ranks: NUMRANKS,
        /* explain: true,
        query: "!padrenullquery",
        timestamp: +new Date(), */
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
  debug && console.info("[Search] initialised with host:", constants.url.hostname);

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
    const form = document.querySelector(".c-search-results-area form[data-filters=" + type + "]");
    let a = form ? new FormData(form) : new FormData();

    for (var key of a.keys()) {
      if (key.indexOf("f.") === 0) continue; //ignore any facets
      if (a.getAll(key).length > 1) {
        // merge values into one dysjunction operator
        // as used in the Research type filter's "Other" option:
        // "publication", "contract", "[tag theme programme group]"
        // will become "[publication contract tag theme programme group]"
        a.set(key, "[" + a.getAll(key).join(" ").replace(/\[|\]/g, "") + "]");
      }
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

  const newAccordion = (accordion) => new stir.accord(accordion, false);
  const imageErrorHandler = (image) => image.addEventListener("error", stir.funnelback.imgError);

  // "reflow" events and handlers for dynamically added DOM elements
  const flow = stir.curry((_element, data) => {
    if (!_element.closest) return;
    const root = _element.closest("[data-panel]");
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
    if (summary) {
      summary.innerHTML = "";
      summary.append(stir.templates.search.summary(data));
    }
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
    //if(!preview) return data;
    const form = document.querySelector(`form[data-filters="${type}"]`);
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
        if("Start date"===facet.name) {
          stir.courses.startdates();
        }
      });
    }
    return data; // data pass-thru so we can compose() this function
  });

  const renderResultsWithPagination = stir.curry(
    (type, data) =>
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
      stir.Object.extend(
        {},
        {
          // session params:
          start_rank: getStartRank(type),
          query: getQuery(type), // get actual query, or fallback, etc
          curator: getStartRank(type) > 1 ? false : true, // only show curator for initial searches
        },
        getNoQuery(type), // get special "no query" parameters (sorting, etc.)
        getQueryParameters(), // TEMP get facet parameters
        preview ? { profile: "_default_preview" } : {} // TEMP show unpublished facets
      )
    );

    //TODO if type==course and query=='!padrenullquery' then sort=title
    const url = addMoreParameters(setFBParameters(parameters), getFormData(type));
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
      button.setAttribute("disabled", true);
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
    internal: callSearchApi("internal"),
    clearing: callSearchApi("clearing"),
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
    internal: (data) => data.map(stir.templates.search.auto).join(""),
    clearing: (data) => data.map(stir.templates.search.auto).join(""),
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
      return composition(data);
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
    const callback = (data) => (data && !data.error ? composition(data) : new Function());
    nextPage(type);
    searchers[type](callback);
  };

  // initialise all search types on the page (e.g. when the query keywords are changed by the user):
  const initialSearch = () => searches.forEach(search);

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
  Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-summary"), (statusPanel) => {
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

  init();

  window.addEventListener("popstate", init);
};

stir.search();
