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

  const webinarSections = stir.nodes("[data-webinarSects]");
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

  /*  Filter an item (webinar) based on params (filters) supplied */
  const filterer = stir.curry((consts, filters, webinar) => {
    //console.log(webinar.title);
    //console.log(filters);
    //console.log(webinar);

    const keys = stir.filter((x) => consts.safeList.includes(x), Object.keys(filters));
    //console.log(keys);

    const tempMatches = stir.map((key) => {
      if (webinar[key]) {
        const params = webinar[key].split(", ");

        const matchCurry = matcher(consts, filters[key], key);
        const matches = stir.map(matchCurry, params);

        return stir.any((x) => x === true, matches);
      }
      if (filters[key] !== "") {
        //console.log("NOT defaulting " + key);
        return false;
      }
      //console.log("Defaulting " + key);
      return true;
    }, keys);

    // if (stir.all((x) => x === true, tempMatches)) {
    //   console.log(tempMatches);
    // }
    // console.log("----");
    return stir.all((x) => x === true, tempMatches);
  });

  /*  Check if match for param to filter - 1 to 1 direct + All foo  */
  const matcher = stir.curry((consts, filter, type, webinarParam) => {
    // general
    if (filter.includes(webinarParam.trim())) return true;
    if (webinarParam.trim().includes(filter.trim())) return true;

    // faculties
    if (type && type === "faculties") {
      if (matchTag(filter, webinarParam, "All Faculties")) return true;
    }

    // countries
    if (type && type === "countries") {
      //if (matchTag(filter, webinarParam, "All nationalities")) return true;
      if (filter.includes("All nationalities")) return true;

      if (filter.includes("All international")) {
        if (!getRegionString(consts.macros, "United Kingdom").includes(webinarParam.trim())) return true;
      }

      if (webinarParam.trim().includes("All international")) {
        if (!getRegionString(consts.macros, "United Kingdom").includes(filter)) return true;
      }
    }

    return false;
  });

  /* Matcher Helper */
  const matchTag = (filter, param, tag) => {
    if (filter.includes(tag)) return true;
    if (param.trim().includes(tag)) return true;

    return false;
  };

  /* Matcher Helper - Convert and return region countries array to String */
  const getRegionString = (macros, tag) => {
    return macros
      .filter((item) => item.tag === tag)
      .map((el) => el.data)
      .join(", ");
  };

  /* Helper:    */
  const isUpcoming = (itemdatetime) => {
    const isoDateString = new Date().toISOString();
    const now = Number(isoDateString.split(".")[0].replaceAll(":", "").replaceAll("-", "").replaceAll("T", ""));

    return Number(itemdatetime) > now;
  };

  /* Helper:   */
  const filterOld = stir.curry((item) => {
    if (item.ondemand === "Yes") return true;
    return isUpcoming(item.datetime);
  });

  /*

        RENDERERS
   */

  const renderDivider = () => `<div class="cell"><hr /></div>`;

  /* Form the HTML if there is a no items message   */
  const renderNoItemsMessage = (msg) => `<div class="cell">` + msg + `</div>`;

  /* Form the HTML for the section header   */
  const renderHeader = (header, intro) => {
    if (!header && !intro) return ``;

    return `
          <div class="cell u-mt-2">
            ${header ? `<h2>` + header + `</h2>` : ""}
            ${intro}
          </div>`;
  };

  /* Form the HTML for an individual item   */
  const renderItem = (item) => {
    //console.log(item);
    return `
          <div class="cell small-12 large-4 medium-6 u-my-2" >
              <div class="u-energy-line-top">
                    <h3 class="-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-1">
                    <a href="${item.link}" class="c-link" >${item.title}</a></h3>
                    ${item.countries ? `<p>For students from: ${item.countries}</p>` : ``}
                    <div class="text-sm">
                      <p><strong>${item.date}, ${item.time} (${item.zone})</strong></p>
                      ${item.faculties ? `<p>${item.faculties}</p>` : ``}
                      ${item.description}

                      ${item.ondemand ? `<span class="u-bg-heritage-purple u-inline-block u-white u-p-tiny text-xxsm  ">Watch on-demand</span>` : ""}
                      ${isUpcoming(item.datetime) ? `<span class="u-bg-heritage-green u-inline-block u-white u-p-tiny text-xxsm  ">Live event</span>` : ""}
                  </div>
                </div>
          </div> `;
  };

  /* Form the HTML to wrap all items   */
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

  /* Output html content to the page */
  const setDOMContent = stir.curry((elem, html) => {
    stir.setHTML(elem, html);
    return elem;
  });

  /*

        CONTROLLERS
    */

  /* Initialise curry functions then run the data through them using composition */
  const main = (consts, node, webinars, filters) => {
    const cleanCurry = stir.filter((el) => el.title);
    const filterCurry = stir.filter(filterer(consts, filters.params));
    const filterOldCurry = stir.filter(filterOld);
    const sortCurry = stir.sort((a, b) => (parseInt(a.datetime) > parseInt(b.datetime) ? 1 : parseInt(b.datetime) > parseInt(a.datetime) ? -1 : 0));

    const setDOMResults = setDOMContent(node);
    const renderCurry = renderAllItems(filters);

    return stir.compose(setDOMResults, renderCurry, sortCurry, filterCurry, filterOldCurry, cleanCurry)(webinars);
  };

  /* 
  
    ON LOAD 
  */

  /* Main form with filters */
  const webinarResultsArea = stir.node("#webinarresults");

  if (webinarResultsArea) {
    const filters = { params: { series: "", countries: "", subjects: "", studylevels: "", faculties: "", categories: "" } };
    main(CONSTS, webinarResultsArea, dataWebinars, filters);

    const formfilters = stir.nodes("#webinarfilters select");

    formfilters.forEach((el) => {
      el.addEventListener("change", (e) => {
        const studentTypeValue = stir.node("#search-student-type").value;
        const studentRegionValue = stir.node("#search-region").value;
        const studentCategoryValue = stir.node("#search-category").value;

        const filters = { params: { series: "", countries: studentRegionValue, subjects: "", studylevels: studentTypeValue, faculties: "", categories: studentCategoryValue } };
        main(CONSTS, webinarResultsArea, dataWebinars, filters);
      });
    });
  }

  /* Dynamic Sections */
  webinarSections.forEach((element) => {
    main(CONSTS, element, dataWebinars, dataWebinarFilters[element.dataset.webinarsects]);
  });

  /* Check we have content somewhere - if not ouput a disclaimer */
  if (disclaimerArea) {
    const contentLength = webinarSections
      .map((element) => element.innerText)
      .join("")
      .trim().length;

    if (contentLength < 1) setDOMContent(disclaimerArea, disclaimer);
  }
})(stir.nodes("[data-webinar]"));
