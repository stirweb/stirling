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
    itemsPerPage: 6,
    safeList: ["countries", "series", "subjects", "studylevels", "faculties", "categories"],
    macros:
      stir.filter((item) => {
        if (item.tag) return item;
      }, stir.t4Globals.regionmacros) || [],
  };

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
             <div class="u-border-width-4  ${item.ondemand && !item.isupcoming ? "u-heritage-berry-line-left" : "u-heritage-line-left"} u-p-2 u-relative u-bg-white u-h-full ">
                   <div class="u-absolute u-top--16">
                      ${item.ondemand && !item.isupcoming ? `<span class="u-bg-heritage-berry u-white  u-px-tiny u-py-xtiny text-xxsm">Watch on-demand</span>` : ``}
                      ${item.isupcoming ? `<span class="u-bg-heritage-green u-white u-px-tiny u-py-xtiny text-xxsm">Live event</span>` : ``}
                   </div>

                   <h3 class="u-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-2">
                     <a href="${item.link}" class="u-border-bottom-hover u-border-width-2" >${item.title}</a>
                   </h3>
                   ${item.isupcoming ? renderDateTime(item) : ``}
                  
                   <div class="text-sm">
                     ${item.description}
                   </div>
                   <p class="text-sm">Audience: ${item.studylevels} students. ${item.countries} </p>
             </div>
         </div> `;
  };

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

  const renderSummary = (num) => `<p class="u-pb-2 text-sm">Results based on filters - <strong>${num} webinars</strong></p>`;

  const renderPaginationSummary = (start, end, total) => `<p class="u-pb-2 text-sm text-center"><strong>Displaying ${start + 1} to ${end} of ${total} results</strong></p>`;

  const renderLoadMoreButon = () => `<div class="text-center"><button class="button hollow tiny u-bg-white" data-loadmore>Load more results</button></div>`;

  const renderNoData = (text) => `<p class="text-center text-sm">${text}</p>`;

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
    Helper: returns current date time formatted for to make it easy to compare against
  */
  const getISONow = () => {
    const isoDateString = new Date().toISOString();
    return Number(isoDateString.split(".")[0].replaceAll(":", "").replaceAll("-", "").replaceAll("T", ""));
  };

  /* 
    Helper: Webinar isPast  
  */
  const isPast = stir.curry((item) => {
    return !item.isupcoming;
  });

  /* 
    Helper: Webinar isUpcoming comparing by actual dat 
  */
  const isUpcomingByDate = stir.curry((compareDate, item) => {
    return Number(item.datetime) > compareDate;
  });

  /* 
    Helper: Webinar isUpcoming  
  */
  const isUpcoming = stir.curry((item) => {
    return item.isupcoming;
  });

  /* 
    Helper: Webinar isOnDemand  
  */
  const isOnDemand = stir.curry((item) => {
    return item.ondemand;
  });

  /* 
    Helper: Webinar isOnDemandOrUpcoming 
  */
  // const isOnDemandOrUpcoming = stir.curry((item) => {
  //   return isOnDemand(item) || isUpcoming(item);
  // });

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

  const appendDOMContent = stir.curry((elem, html) => {
    elem.insertAdjacentHTML("beforeend", html);
    return elem;
  });

  const cleanse = (string) => string.replaceAll("script>", "").replaceAll("script%3E", "").replaceAll("<", "");

  /*
    Radio Tabs Scrolling
  */
  const handleTabScroll = (el, container, event) => {
    const itemWidth = el.closest("div").offsetWidth;
    const containerBounds = container.parentElement.getBoundingClientRect();
    const pos = el.closest("div").getBoundingClientRect();

    if (pos.right > containerBounds.width) {
      container.scrollBy({ left: itemWidth, behavior: "smooth" });

      if (event === "onload") {
        setTimeout(() => {
          const newRight = el.closest("div").getBoundingClientRect().right;
          const maxRight = container.parentElement.getBoundingClientRect().right;
          const offsetRight = window.screen.width - maxRight;
          const diff = newRight - maxRight + offsetRight * 2;

          newRight < maxRight && container.scrollBy({ left: diff, behavior: "smooth" });
        }, 500);
      }
    }
    if (pos.left < containerBounds.left) {
      container.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  };

  /*

        CONTROLLERS

    */

  /* 
    Main: Initialise curry functions then run the data through them using composition 
  */
  const main = (consts, node, webinarsData, filters, event) => {
    const now = getISONow();

    // Make life easier
    const webinars = webinarsData
      .filter((item) => item.title)
      .map((item) => {
        return { ...item, ...{ isupcoming: isUpcomingByDate(now, item) } };
      });

    const filterCurry = stir.filter(filterer(consts, filters.params));

    //const isAllCurry = stir.filter(isOnDemandOrUpcoming);
    const isUpcomingCurry = stir.filter(isUpcoming);
    const isPastCurry = stir.filter(isPast);
    const isOnDemandCurry = stir.filter(isOnDemand);

    const sortCurryAsc = stir.sort((a, b) => (parseInt(a.datetime) > parseInt(b.datetime) ? 1 : parseInt(b.datetime) > parseInt(a.datetime) ? -1 : 0));
    const sortCurryDesc = stir.sort((a, b) => (parseInt(a.datetime) < parseInt(b.datetime) ? 1 : parseInt(b.datetime) < parseInt(a.datetime) ? -1 : 0));

    const setDOMResults = event === "new" ? setDOMContent(node) : appendDOMContent(node);
    const renderCurry = renderAllItems(filters);

    // Compose the data
    const upcoming = stir.compose(sortCurryAsc, filterCurry, isUpcomingCurry)(webinars);
    const onDemand = stir.compose(sortCurryDesc, filterCurry, isOnDemandCurry, isPastCurry)(webinars);
    //const all = stir.compose(sortCurryAsc, filterCurry, isAllCurry)(webinars);
    const all = [...upcoming, ...onDemand];

    const page = filters.page;
    const start = consts.itemsPerPage * (page - 1);
    const end = start + consts.itemsPerPage;

    if (filters.params.view === "live") {
      const endHtml = upcoming.length > end ? renderLoadMoreButon() : renderNoData(`No more items to load`);
      const summaryHtml = start === 0 ? renderSummary(upcoming.length) : renderPaginationSummary(start, end, upcoming.length);
      return setDOMResults(summaryHtml + renderCurry(upcoming.slice(start, end)) + endHtml);
    }

    if (filters.params.view === "ondemand") {
      const endHtml = onDemand.length > end ? renderLoadMoreButon() : renderNoData(`No more items to load`);
      const summaryHtml = start === 0 ? renderSummary(onDemand.length) : renderPaginationSummary(start, end, onDemand.length);

      return setDOMResults(summaryHtml + renderCurry(onDemand.slice(start, end)) + endHtml);
    }

    if (all.slice(start, end).length) {
      const endHtml = all.length > end ? renderLoadMoreButon() : renderNoData(`No more items to load`);
      const summaryHtml = start === 0 ? renderSummary(all.length) : renderPaginationSummary(start, end, all.length);
      return setDOMResults(summaryHtml + renderCurry(all.slice(start, end)) + endHtml);
    }
  };

  /* 
    Form Controller 
  */
  const doForm = (conts, node, data, event, form) => {
    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());

    for (let key in formDataObject) QueryParams.set(key, formDataObject[key]);
    const filters = { page: QueryParams.get("page"), params: { series: "", countries: formDataObject.region, subjects: "", studylevels: formDataObject.studylevel, faculties: "", categories: formDataObject.category, view: formDataObject.view }, divider: "no" };

    main(conts, node, data, filters, event);
    node.innerHTML === "" && setDOMContent(node, "<p>No webinars found</p>");
  };

  /* 
  
    ON LOAD 

  */

  /* 

    Main form with filters 

  */
  const webinarResultsArea = stir.node("#webinarresults");

  if (webinarResultsArea) {
    // On load
    QueryParams.set("page", 1);

    const params = {
      category: QueryParams.get("category") ? cleanse(QueryParams.get("category")) : ``,
      studylevel: QueryParams.get("studylevel") ? cleanse(QueryParams.get("studylevel")) : ``,
      region: QueryParams.get("region") ? cleanse(QueryParams.get("region")) : ``,
      view: QueryParams.get("view") ? cleanse(QueryParams.get("view")) : ``,
      page: 1,
    };

    const filters = { page: params.page, params: { series: "", countries: params.region, subjects: "", studylevels: params.studylevel, faculties: "", categories: params.category, view: params.view }, divider: "no" };
    main(CONSTS, webinarResultsArea, dataWebinars, filters, "new");
    webinarResultsArea.innerHTML === "" && setDOMContent(webinarResultsArea, "<p>No webinars found</p>");

    // Form changes
    stir.nodes("#webinarfilters select").forEach((select) => {
      select.value = params[select.name];
      select.addEventListener("change", (e) => doForm(CONSTS, webinarResultsArea, dataWebinars, "new", stir.node("#webinarfilters")));
    });

    // Radio tabs
    stir.nodes("#webinarfilters input").forEach((radio) => {
      let clicks = 0;
      radio.addEventListener("click", (e) => {
        QueryParams.set("page", 1);

        const event = clicks === 0 ? "onload" : "click";
        if (e.target.value === QueryParams.get("view") && clicks > 0) return;
        clicks++;

        doForm(CONSTS, webinarResultsArea, dataWebinars, "new", stir.node("#webinarfilters"));
        stir.nodes("#webinarfilters input").forEach((r) => r.closest("div").classList.remove("u-bg-grey", "u-energy-line-top"));
        e.target.closest("div").classList.add("u-bg-grey", "u-energy-line-top");
        handleTabScroll(e.target, stir.node("#radioTabs"), event);
      });

      // Radio tabs on Load
      radio.value === params[radio.name] ? (radio.checked = true) : false;
      radio.value === params[radio.name] ? radio.closest("div").classList.add("u-bg-grey", "u-energy-line-top") : radio.closest("div").classList.remove("u-bg-grey", "u-energy-line-top");
      radio.value === params[radio.name] && radio.click();
    });

    // Pagination clicks
    webinarResultsArea.addEventListener("click", (e) => {
      if (e.target.nodeName === "BUTTON") {
        const page = Number(QueryParams.get("page")) || 1;
        QueryParams.set("page", page + 1);
        doForm(CONSTS, webinarResultsArea, dataWebinars, "append", stir.node("#webinarfilters"));
        e.target.scrollIntoView({ behavior: "smooth" });
        e.target.classList.add("hide");
      }
    });
  }

  /* 
    Dynamic Sections 
  */
  const webinarSections = stir.nodes("[data-webinarSects]");

  // On load
  webinarSections.forEach((element) => {
    main(CONSTS, element, dataWebinars, dataWebinarFilters[element.dataset.webinarsects], "onload");
  });

  // Check we have content somewhere - if not output a disclaimer
  if (disclaimerArea) {
    const contentLength = webinarSections
      .map((element) => element.innerText)
      .join("")
      .trim().length;

    contentLength < 1 && setDOMContent(disclaimerArea, disclaimer);
  }
})(stir.nodes("[data-webinar]"));
