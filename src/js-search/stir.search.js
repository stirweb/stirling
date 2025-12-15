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
<<<<<<< HEAD
 * Course-specific search results helper
 */
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

/**
=======
>>>>>>> AddSearch
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

  const error = (el,data) => {
	const summary = el.parentElement.parentElement.querySelector(".c-search-results-summary");
	const button = el.parentElement.querySelector("button[disabled]");
	el.innerHTML = `<p>${data.response.resultPacket.error.userMsg}</p>`;
	summary.innerHTML = "<strong>Errror</strong>";
	button.parentElement.removeChild(button);
  };

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
	  if (data.response.returnCode !== 0) return error(element,data);
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
