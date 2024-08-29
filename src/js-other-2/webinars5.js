/* ------------------------------------------------
   @author: Ryan Kaye
   @version: 4
   @date: Sep 2021
   @description: Output required webinars based on set of T4 supplied parametres
 * ------------------------------------------------ */

(function (scope) {
  if (!scope) return;

  /*

    VARS    
 */

  const dataWebinars = stir.t4Globals.webinars || [];
  const dataWebinarFilters = stir.t4Globals.webinarSectionData || {};

  const disclaimer = stir.t4Globals.webinarsdisclaimer || "";
  const disclaimerArea = stir.node("[data-webinardisclaimer]");

  /*
       safeList: ensure we only use params we definitely
       want to compare against eg data-faculties="" and nothing else
     */

  const CONSTS = {
    safeList: ["countries", "series", "subjects", "studylevels", "faculties", "categories"],
    macros:
      stir.filter((item) => {
        if (item.tag) return item;
      }, stir.t4Globals.regionmacros) || [],
  };

  Object.freeze(CONSTS);

  /*

    DATA PROCESSING

  */

  /*  
    Helper: convertToMacro
  */
  // const convertToMacro = (countries, consts) => {
  //   if (!countries.includes(",")) return countries;

  //   const countriesString = countries
  //     .split(",")
  //     .map((item) => item.trim())
  //     .sort()
  //     .join("_");

  //   const temp = consts.macros.filter((item) => {
  //     if (item.data.slice(0, -1).join("_") === countriesString) {
  //       return true;
  //     }

  //     return false;
  //   });

  //   return temp.length ? countries + ", " + temp[0].tag : countries;
  // };

  /*  
    Filter an item (webinar) based on params (filters) supplied 
  */
  const filterer = stir.curry((consts, filters, webinar) => {
    const keys = stir.filter((x) => consts.safeList.includes(x), Object.keys(filters));

    const tempMatches = stir.map((key) => {
      if (webinar[key]) {
        const params = webinar[key].split(", ");

        const matchCurry = matcher(consts, filters[key], key);
        const matches = stir.map(matchCurry, params);

        return stir.any((x) => x === true, matches);
      }
      if (filters[key] !== "") {
        return false;
      }
      return true;
    }, keys);

    return stir.all((x) => x === true, tempMatches);
  });

  /*  
    Check if match for param to filter - 1 to 1 direct + All foo  
  */
  const matcher = stir.curry((consts, filter, type, webinarParam) => {
    // general
    if (filter.includes(webinarParam.trim())) return true;
    if (webinarParam.trim().includes(filter.trim())) return true;

    /* Macros */
    // Faculties
    if (type && type === "faculties") {
      if (matchTag(filter, webinarParam, "All Faculties")) return true;
    }

    // Countries
    if (type && type === "countries") {
      if (matchTag(filter, webinarParam, "All nationalities")) return true;
      //if (filter.includes("All nationalities")) return true; // Less

      if (filter.includes("All international")) {
        // Webinar is not tagged RUK and not tagged UK or any of their countries
        if (!getRegionString(consts.macros, "United Kingdom").includes(webinarParam.trim()) && !getRegionString(consts.macros, "RUK").includes(webinarParam.trim()) && webinarParam.trim()) return true;
      }

      // if (webinarParam.trim().includes("All international")) {
      //   if (!getRegionString(consts.macros, "United Kingdom").includes(filter) && !getRegionString(consts.macros, "RUK").includes(filter)) return true;
      // }

      // Get all the Macros the country beloongs to eg Scotland => United Kingdom
      const inMaroTags = consts.macros
        .filter((item) => {
          if (item.data.includes(filter)) return true;
          return false;
        })
        .map((item) => item.tag);

      if (inMaroTags.includes(webinarParam)) return true;

      const isMacro = consts.macros.filter((item) => item.tag === filter);

      if (isMacro.length) {
        if (isMacro[0].data.includes(webinarParam)) return true;
      }
    }

    return false;
  });

  /* 
    Helper: matchTag  
  */
  const matchTag = (filter, param, tag) => {
    if (filter.includes(tag)) return true;
    if (param.trim().includes(tag)) return true;

    return false;
  };

  /* 
    Helper - Convert and return region countries array to String 
  */
  const getRegionString = (macros, tag) => {
    return macros
      .filter((item) => item.tag === tag)
      .map((el) => el.data)
      .join(", ");
  };

  /* 
    Helper: Webinar isPast  
  */
  const isPast = stir.curry((item) => {
    const isoDateString = new Date().toISOString();
    const now = Number(isoDateString.split(".")[0].replaceAll(":", "").replaceAll("-", "").replaceAll("T", ""));

    return Number(item.datetime) < now;
  });

  /* 
    Helper: Webinar isUpcoming  
  */
  const isUpcoming = stir.curry((item) => {
    const isoDateString = new Date().toISOString();
    const now = Number(isoDateString.split(".")[0].replaceAll(":", "").replaceAll("-", "").replaceAll("T", ""));

    return Number(item.datetime) > now;
  });

  /* 
    Helper: Webinar isOnDemand  
  */
  const isOnDemand = stir.curry((item) => {
    return item.ondemand === "Yes";
  });

  /*

        RENDERERS
   */

  const renderDivider = () => `<div class="cell"><hr /></div>`;

  /* 
    Build the HTML if there is a no items message   
  */
  const renderNoItemsMessage = (msg) => `<div class="cell">` + msg + `</div>`;

  /* 
    Build the HTML for the section header   
  */
  const renderHeader = (header, intro) => {
    if (!header && !intro) return ``;

    return `
          <div class="cell u-mt-2">
            ${header ? `<h2>` + header + `</h2>` : ""}
            ${intro}
          </div>`;
  };

  const renderDateTime = (item) => `<p class="text-sm u-m-0"><strong>${item.date}, ${item.time} ${!item.timeend ? `` : `to ` + item.timeend} (${item.zone})</strong></p>`;

  /* 
    Build the HTML for an individual item   
  */
  const renderItem = (item) => {
    //console.log(item);
    return `
          <div class="cell small-12 large-4 medium-6 u-mb-3 " >
              <div class="u-border-width-4  ${item.ondemand && !isUpcoming(item) ? "u-heritage-berry-line-left" : "u-heritage-line-left"} u-p-2 u-relative u-bg-white u-h-full ">
                    <div class="u-absolute u-top--16">
                        ${item.ondemand && !isUpcoming(item) ? `<span class="u-bg-heritage-berry u-white  u-px-tiny u-py-xtiny text-xxsm">Watch on-demand</span>` : ""}
                        ${isUpcoming(item) ? `<span class="u-bg-heritage-green u-white u-px-tiny u-py-xtiny text-xxsm">Live event</span>` : ""}
                    </div>

                    <h3 class="-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-2">
                      <a href="${item.link}" class="u-border-bottom-hover u-border-width-2" >${item.title}</a>
                    </h3>
                    ${isUpcoming(item) ? renderDateTime(item) : ``}
                   
                    <div class="text-sm">
                      ${item.description}
                    </div>
                    <p class="text-sm">Audience: ${item.studylevels} students. ${item.countries} </p>
              </div>
          </div> `;
  };

  const renderSummary = (num) => `<p class="u-pb-2 text-sm">Results based on filters - ${num} webinars</p>`;

  /* 
    Build the HTML to wrap all items   
  */
  const renderAllItems = stir.curry((section, items) => {
    if (!items.length && !section.noItems) return;
    return `
            <div class="grid-x grid-padding-x" >
              ${renderHeader(section.head, section.intro)}
              ${!items.length ? renderNoItemsMessage(section.noItems) : stir.map(renderItem, items).join("")}
              ${section.divider && section.divider === "no" ? `` : renderDivider()}
            </div>`;
  });

  /*

       EVENTS: OUTPUT (!!SIDE EFFECTS!!)

    */

  /* 
    Output html content to the page 
  */
  const setDOMContent = stir.curry((elem, html) => {
    stir.setHTML(elem, html);
    return elem;
  });

  const cleanse = (string) => string.replaceAll("script>", "").replaceAll("script%3E", "").replaceAll("<", "");

  /*

        CONTROLLERS

    */

  /* Initialise curry functions then run the data through them using composition */
  const main = (consts, node, webinars, filters) => {
    const cleanCurry = stir.filter((el) => el.title);
    const filterCurry = stir.filter(filterer(consts, filters.params));
    const isUpcomingCurry = stir.filter(isUpcoming);
    const isPastCurry = stir.filter(isPast);
    const isOnDemandCurry = stir.filter(isOnDemand);

    const sortCurryAsc = stir.sort((a, b) => (parseInt(a.datetime) > parseInt(b.datetime) ? 1 : parseInt(b.datetime) > parseInt(a.datetime) ? -1 : 0));
    const sortCurryDesc = stir.sort((a, b) => (parseInt(a.datetime) < parseInt(b.datetime) ? 1 : parseInt(b.datetime) < parseInt(a.datetime) ? -1 : 0));

    const setDOMResults = setDOMContent(node);
    const renderCurry = renderAllItems(filters);

    const upcoming = stir.compose(sortCurryAsc, filterCurry, isUpcomingCurry, cleanCurry)(webinars);
    const onDemand = stir.compose(sortCurryDesc, filterCurry, isOnDemandCurry, isPastCurry, cleanCurry)(webinars);

    if (filters.params.view === "ondemand") {
      return setDOMResults(renderSummary(onDemand.length) + renderCurry(onDemand));
    }

    if (filters.params.view === "live") {
      return setDOMResults(renderSummary(upcoming.length) + renderCurry(upcoming));
    }

    const summary = renderSummary([...upcoming, ...onDemand].length);
    const html = renderCurry([...upcoming, ...onDemand]);
    return setDOMResults(summary + html);
    //return stir.compose(setDOMResults, renderCurry)([...upcoming, ...onDemand]);
  };

  /* 
  
    ON LOAD 

  */

  /* 
    Main form with filters 
  */
  const webinarResultsArea = stir.node("#webinarresults");

  if (webinarResultsArea) {
    // Controller
    const doForm = () => {
      const formData = new FormData(stir.node("#webinarfilters"));
      const formDataObject = Object.fromEntries(formData.entries());

      for (let key in formDataObject) QueryParams.set(key, formDataObject[key]);

      const filters = { params: { series: "", countries: formDataObject.region, subjects: "", studylevels: formDataObject.studylevel, faculties: "", categories: formDataObject.category, view: formDataObject.view }, divider: "no" };
      main(CONSTS, webinarResultsArea, dataWebinars, filters);

      if (webinarResultsArea.innerHTML === "") setDOMContent(webinarResultsArea, "<p>No webinars found</p>");
    };

    // on load
    const params = {
      category: QueryParams.get("category") ? cleanse(QueryParams.get("category")) : ``,
      studylevel: QueryParams.get("studylevel") ? cleanse(QueryParams.get("studylevel")) : ``,
      region: QueryParams.get("region") ? cleanse(QueryParams.get("region")) : ``,
      view: QueryParams.get("view") ? cleanse(QueryParams.get("view")) : ``,
    };

    const filters = { params: { series: "", countries: params.region, subjects: "", studylevels: params.studylevel, faculties: "", categories: params.category, view: params.view }, divider: "no" };
    main(CONSTS, webinarResultsArea, dataWebinars, filters);

    if (webinarResultsArea.innerHTML === "") setDOMContent(webinarResultsArea, "<p>No webinars found</p>");

    // Form changes
    stir.nodes("#webinarfilters select").forEach((select) => {
      select.value = params[select.name];
      select.addEventListener("change", (e) => doForm());
    });

    // Form submits
    stir.nodes("#webinarfilters input").forEach((radio) => {
      radio.value === params[radio.name] ? (radio.checked = true) : false;
      radio.value === params[radio.name] ? radio.closest("div").classList.add("u-bg-grey", "u-energy-line-top") : radio.closest("div").classList.remove("u-bg-grey", "u-energy-line-top");

      //radio.value === params[radio.name] && radio.closest("div").scrollIntoView({ behavior: "smooth", block: "center" });

      radio.addEventListener("click", (e) => {
        console.log(e.target.closest("div"));
        // e.target.closest("div").scrollIntoView({ behavior: "smooth" });
        //e.target.closest("div").offsetTop;
        doForm();
        stir.nodes("#webinarfilters input").forEach((r) => r.closest("div").classList.remove("u-bg-grey", "u-energy-line-top"));
        //e.target.closest("div").classList.add("u-bg-grey", "u-energy-line-top");
      });
    });
  }

  /* 
    Dynamic Sections 
  */
  const webinarSections = stir.nodes("[data-webinarSects]");

  webinarSections.forEach((element) => {
    main(CONSTS, element, dataWebinars, dataWebinarFilters[element.dataset.webinarsects]);
  });

  /* 
    Check we have content somewhere - if not output a disclaimer 
  */

  if (disclaimerArea) {
    const contentLength = webinarSections
      .map((element) => element.innerText)
      .join("")
      .trim().length;

    // const contentLength2 = webinarResultsArea.innerText.length;
    // console.log(contentLength2);

    if (contentLength < 1) setDOMContent(disclaimerArea, disclaimer);
  }
})(stir.nodes("[data-webinar]"));
