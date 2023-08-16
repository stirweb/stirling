/* ------------------------------------------------
   @author: Ryan Kaye
   @version: 4
   @date: Sep 2021
   @description: Output required webinars based on set of T4 supplied parametres
 * ------------------------------------------------ */

(function (scope) {
  if (!scope) return;

  /*
      V A R S
   */

  const webinarAreas = scope;
  const dataWebinars = stir.t4Globals.webinars || [];
  const dataSeries = stir.t4Globals.webinarSectionData || {};

  const disclaimer = stir.t4Globals.webinarsdisclaimer || "";
  const disclaimerArea = stir.node("[data-webinardisclaimer]");
  /*
     safeList: ensure we only use params we definitely
     want to compare against eg data-series="" and nothing else
   */

  const CONSTANTS = {
    safeList: ["countries", "series", "subjects", "studylevels", "faculties"],
    macros:
      stir.filter((item) => {
        if (item.tag) return item;
      }, stir.t4Globals.regionmacros) || [],
  };

  Object.freeze(CONSTANTS);

  /*
      C O N T R O L L E R
   */

  /* Initialise curry functions then run the data through them using composition */
  const main = (consts, node, webinars, filters) => {
    const cleanCurry = stir.filter((el) => el.title);
    const filterCurry = stir.filter(filterer(consts, filters.params));

    const sortCurry = stir.sort((a, b) => (parseInt(a.datetime) > parseInt(b.datetime) ? 1 : parseInt(b.datetime) > parseInt(a.datetime) ? -1 : 0));

    const setDOMResults = setDOMContent(node);
    const renderCurry = renderAllItems(filters);

    return stir.compose(setDOMResults, renderCurry, sortCurry, filterCurry, cleanCurry)(webinars);
  };

  /*
     D A T A   P R O C E S S I N G
   */

  /*  Filter an item (webinar) based on params (filters) supplied */
  const filterer = stir.curry((consts, filters, webinar) => {
    const keys = stir.filter((x) => consts.safeList.includes(x), Object.keys(filters));

    const tempMatches = stir.map((key) => {
      if (webinar[key]) {
        const params = webinar[key].split(", ");

        const matchCurry = matcher(consts, filters[key], key);
        const matches = stir.map(matchCurry, params);

        return stir.any((x) => x === true, matches);
      }
      return true;
    }, keys);

    return stir.all((x) => x === true, tempMatches);
  });

  /*  Check if match for param to filter - 1 to 1 direct + All foo  */
  const matcher = stir.curry((consts, filter, type, webinarParam) => {
    if (filter.includes(webinarParam.trim())) return true;
    if (webinarParam.trim().includes(filter.trim())) return true;

    if (type && type === "faculties") {
      if (matchTag(filter, webinarParam, "All Faculties")) return true;
    }

    if (type && type === "countries") {
      if (matchTag(filter, webinarParam, "All nationalities")) return true;

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

  /*
      R E N D E R E R S
   */

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
                </div>
              </div>
        </div> `;
  };

  /*
     EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* Output html content to the page */
  const setDOMContent = stir.curry((elem, html) => {
    stir.setHTML(elem, html);
    return elem;
  });

  /*
     ON LOAD EVENT: INPUT (!!SIDE EFFECTS!!)
   */

  webinarAreas.forEach((element) => {
    main(CONSTANTS, element, dataWebinars, dataSeries[element.dataset.webinar]);
  });

  /*
    Chek we have content somewhere - if not ouput a disclaimer
  */
  if (disclaimerArea) {
    const contentLength = webinarAreas
      .map((element) => element.innerText)
      .join("")
      .trim().length;

    if (contentLength < 1) setDOMContent(disclaimerArea, disclaimer);
  }
})(stir.nodes("[data-webinar]"));
