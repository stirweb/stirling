/*
 * @author: Ryan Kaye
 * @version: 1
 * @description: Outputs all courses that match the tags provided
 */
(function (scope) {
  if (!scope) return;
  /*
   * DOM elements
   */

  var resultAreas = scope;
  /* ------------------------------------------------
   * Controls data flow
   * ------------------------------------------------ */

  var main = function main(_node, _initialData) {
    console.log("main");
    /*
     * Helper Function
     * Maps and filters (empty vals) all data-** attributes of the node to an array of objects
     */

    var getDomFilters = function getDomFilters(domData) {
      return stir.filter(function (el) {
        return el.value !== "";
      }, // remove empties
      stir.map(function (el) {
        return {
          name: el[0],
          value: el[1].trim()
        };
      }, domData));
    };

    var filters = getDomFilters(Object.entries(_node.dataset)); // Set context with a few Curry helper functions

    var setDOMResults = setDOMContent(_node);
    var filterDataCurry = stir.filter(filterData(filters));
    var sortDataCurry = stir.sort(function (a, b) {
      return a.title > b.title ? 1 : b.title > a.title ? -1 : 0;
    });
    var filterEmpties = stir.filter(function (el) {
      return el.title;
    });
    var renderData = stir.map(renderItems);
    var joinData = stir.join(""); // Pass the raw data through the curry functions till it reaches the page

    return stir.compose(setDOMResults, joinData, renderData, sortDataCurry, filterDataCurry, filterEmpties, stir.clone)(_initialData);
  };
  /* ------------------------------------------------
   * Filter an item (_element) based on params (_filters) supplied
   * ------------------------------------------------ */


  var filterData = stir.curry(function (_filters, _element) {
    var isTrue = function isTrue(x) {
      return x;
    };
    /* Function: check to see if there is a match for each facet */


    var matchMapper = function matchMapper(f) {
      // Map true or false for each split up (,) facet item - [use indexOf() for compat with IE]
      var tempMatches = stir.map(function (_el) {
        return f.value.indexOf(_el.trim()) !== -1;
      }, _element[f.name].split(","));
      return stir.any(isTrue, tempMatches);
    }; // Kick of the matching - return if all conditions are met (true)


    return stir.all(isTrue, stir.map(matchMapper, _filters));
  });
  /* ------------------------------------------------
   * Output the html content to the page
   * ------------------------------------------------ */

  var setDOMContent = stir.curry(function (elem, html) {
    // !!SIDE EFFECTS!!
    elem.innerHTML = html;
    return elem;
  });
  /* ------------------------------------------------
   * Builds the html an individual course item
   * ------------------------------------------------ */

  var renderItems = function renderItems(item) {
    return "\n        <div class=\"cell small-12 u-padding-top \">\n          <h3 class=\"header-stripped\"><a href=\"".concat(item.url, "\">").concat(item.prefix, " ").concat(item.title, "</a></h3>\n          <p><strong>").concat(item.starts, " </strong></p>\n          <p>").concat(item.description, "</p>\n          <!-- <p class=\"debug\">Modes: ").concat(item.mode, "<br> \n          Awards: ").concat(item.award, "</p> -->\n        </div>");
  };
  /* ------------------------------------------------
   * On load
   * ------------------------------------------------ */


  var initialData = stir.courses || [];
  if (!initialData.length) return;
  resultAreas.forEach(function (element) {
    return main(element, initialData);
  });
})(stir.nodes(".courselisting"));