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

  var webinarAreas = scope;
  var dataWebinars = stir.t4Globals.webinars || [];
  var dataSeries = stir.t4Globals.webinarSectionData || {};
  var disclaimer = stir.t4Globals.webinarsdisclaimer || "";
  var disclaimerArea = stir.node("[data-webinardisclaimer]");
  /*
     safeList: ensure we only use params we definitely
     want to compare against eg data-series="" and nothing else
   */

  var CONSTANTS = {
    safeList: ["countries", "series", "subjects", "studylevels", "faculties"],
    macros: stir.filter(function (item) {
      if (item.tag) return item;
    }, stir.t4Globals.regionmacros) || []
  };
  Object.freeze(CONSTANTS);
  /*
      C O N T R O L L E R
   */

  /* Initialise curry functions then run the data through them using composition */

  var main = function main(consts, node, webinars, filters) {
    var cleanCurry = stir.filter(function (el) {
      return el.title;
    });
    var filterCurry = stir.filter(filterer(consts, filters.params));
    var sortCurry = stir.sort(function (a, b) {
      return parseInt(a.datetime) > parseInt(b.datetime) ? 1 : parseInt(b.datetime) > parseInt(a.datetime) ? -1 : 0;
    });
    var setDOMResults = setDOMContent(node);
    var renderCurry = renderAllItems(filters);
    return stir.compose(setDOMResults, renderCurry, sortCurry, filterCurry, cleanCurry)(webinars);
  };
  /*
     D A T A   P R O C E S S I N G
   */

  /*  Filter an item (webinar) based on params (filters) supplied */


  var filterer = stir.curry(function (consts, filters, webinar) {
    var keys = stir.filter(function (x) {
      return consts.safeList.includes(x);
    }, Object.keys(filters));
    var tempMatches = stir.map(function (key) {
      if (webinar[key]) {
        var params = webinar[key].split(", ");
        var matchCurry = matcher(consts, filters[key], key);
        var matches = stir.map(matchCurry, params);
        return stir.any(function (x) {
          return x === true;
        }, matches);
      }

      return true;
    }, keys);
    return stir.all(function (x) {
      return x === true;
    }, tempMatches);
  });
  /*  Check if match for param to filter - 1 to 1 direct + All foo  */

  var matcher = stir.curry(function (consts, filter, type, webinarParam) {
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

  var matchTag = function matchTag(filter, param, tag) {
    if (filter.includes(tag)) return true;
    if (param.trim().includes(tag)) return true;
    return false;
  };
  /* Matcher Helper - Convert and return region countries array to String */


  var getRegionString = function getRegionString(macros, tag) {
    return macros.filter(function (item) {
      return item.tag === tag;
    }).map(function (el) {
      return el.data;
    }).join(", ");
  };
  /*
      R E N D E R E R S
   */

  /* Form the HTML to wrap all items   */


  var renderAllItems = stir.curry(function (section, items) {
    if (!items.length && !section.noItems) return;
    return "\n      <div class=\"grid-x grid-padding-x\" >\n        ".concat(renderHeader(section.head, section.intro), "\n        ").concat(!items.length ? renderNoItemsMessage(section.noItems) : stir.map(renderItem, items).join(""), "\n        ").concat(section.divider && section.divider === "no" ? "" : renderDivider(), "\n      </div>");
  });

  var renderDivider = function renderDivider() {
    return "<div class=\"cell\"><hr /></div>";
  };
  /* Form the HTML if there is a no items message   */


  var renderNoItemsMessage = function renderNoItemsMessage(msg) {
    return "<div class=\"cell\">" + msg + "</div>";
  };
  /* Form the HTML for the section header   */


  var renderHeader = function renderHeader(header, intro) {
    if (!header && !intro) return "";
    return "\n        <div class=\"cell u-mt-2\">\n          ".concat(header ? "<h2>" + header + "</h2>" : "", "\n          ").concat(intro, "\n        </div>");
  };
  /* Form the HTML for an individual item   */


  var renderItem = function renderItem(item) {
    return "\n        <div class=\"cell small-12 c-promo-box large-4 medium-6 u-padding-bottom\" >\n          <div>\n            <div class=\"c-promo-box__layout-container\">\n              <div class=\"c-promo-box__content\">\n                <div>\n                  <h3 class=\"c-promo-box__header header-stripped\"><a href=\"".concat(item.link, "\" class=\"c-link\" >").concat(item.title, "</a></h3>\n                  ").concat(item.countries ? "<p>For students from: ".concat(item.countries, "</p>") : "", "\n                  <p><strong>").concat(item.date, ", ").concat(item.time, " (").concat(item.zone, ")</strong></p>\n                  ").concat(item.faculties ? "<p>".concat(item.faculties, "</p>") : "", "\n                  ").concat(item.description, "\n                </div>\n              </div>\n            </div>\n          </div>\n        </div> ");
  };
  /*
     EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* Output html content to the page */


  var setDOMContent = stir.curry(function (elem, html) {
    stir.setHTML(elem, html);
    return elem;
  });
  /*
     ON LOAD EVENT: INPUT (!!SIDE EFFECTS!!)
   */

  webinarAreas.forEach(function (element) {
    main(CONSTANTS, element, dataWebinars, dataSeries[element.dataset.webinar]);
  });
  /*
    Chek we have content somewhere - if not ouput a disclaimer
  */

  if (disclaimerArea) {
    var contentLength = webinarAreas.map(function (element) {
      return element.innerText;
    }).join("").trim().length;
    if (contentLength < 1) setDOMContent(disclaimerArea, disclaimer);
  }
})(stir.nodes("[data-webinar]"));