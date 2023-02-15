/*
 * @author: Ryan Kaye
 * @version: 2
 */

(function (scope) {
  if (!scope) return;

  /*
    DOM elements
   */
  var resultsArea = scope;
  var filtersMenu = stir.node("#filters-menu");
  var filterPanelType = stir.node("#filters_panel__type");
  var filterPanelRoom = stir.node("#filters_panel__room");
  var inputFilters = stir.nodes(".c-search-filters-panel__filter input");

  /*
      CONTROLLER
   */

  /*
      Control data flow
   */
  var main = function main(_resultsArea, _params, _initialData) {
    // Set the context with a few currys
    var cleanDataCurry = stir.filter(cleanData);
    var filterDataCurry = stir.filter(filterData(_params));
    var renderCurry = renderResults(_params);
    var setDOMResults = setDOMContent(_resultsArea);

    // Run the data through the currys
    var results = stir.compose(setDOMResults, renderCurry, filterDataCurry, cleanDataCurry, stir.clone)(_initialData);
  };

  /*
      STATE HELPERS
   */

  /*
      Decide whether to show an accommodation object based on selected filters
   */
  var filterData = stir.curry(function (_params, element) {
    if (element.hidefromlist === "Yes") return false;

    /* Helper function: are all values in the array true? */
    var allTrue = stir.all(function (el) {
      return el === true;
    });

    /* Helper function: Do all items match */
    var matcher = stir.curry(function (_el, _filter) {
      var matches = stir.map(function (f) {
        if (!_el[_filter.name].trim().includes(f)) return false;
        return true;
      }, _filter.value.split(","));
      return allTrue(matches);
    });

    // Helper Curry
    var matcherCurry = stir.map(matcher(element));

    // Run the data through the currys
    return stir.compose(allTrue, matcherCurry)(_params);
  });

  /*
      Removes item if empty. Adds accessible tag to room data
   */
  var cleanData = stir.curry(function (element) {
    if (element.title) {
      element.room = Object.keys(element.prices).join(", ");
      element.accessible && (element.room = element.room.concat(", ", element.accessible));
      return element;
    }
  });

  /*
      Get the filter vals from the form
   */
  var getFormVals = function getFormVals(_inputFilters) {
    var params = {};
    stir.each(function (item) {
      if (item.checked === true) {
        if (!params[item.parentNode.dataset.filterName]) params[item.parentNode.dataset.filterName] = item.labels[0].dataset.filterValue;else {
          params[item.parentNode.dataset.filterName] = params[item.parentNode.dataset.filterName] + "," + item.labels[0].dataset.filterValue;
        }
      }
    }, _inputFilters);
    return params;
  };

  /*
      Returns lowest float value in an object eg { price1: "55.55", price2: "45.7" }
   */
  var getLowestFloat = function getLowestFloat(obj) {
    // Context currys
    var getLowestCurry = stir.reduce(function (a, b) {
      return b < a ? b : a;
    }, Infinity);
    var filterZerosCurry = stir.filter(function (element) {
      return element > 0;
    });
    var mapToFloatCurry = stir.map(function (element) {
      return parseFloat(element);
    });

    // Run the data through the currys
    return stir.compose(getLowestCurry, filterZerosCurry, mapToFloatCurry)(Object.values(obj));
  };

  /*
      RENDERERS
   */

  /*
      Render results / filters
   */
  var renderResults = stir.curry(function (_params, _data) {
    return "\n        <div class=\"cell c-search-ordered-filters u-margin-bottom\" id=\"search-ordered-filters\">\n          ".concat(renderAllFilterBtns(_params), "\n        </div>\n        <div class=\"cell small-12\">\n            <p>").concat(_data.length, " results found</p>\n        </div>\n        ").concat(stir.map(function (el) {
      return renderItem(el);
    }, _data).join(""));
  });

  /*
     Render html for an individual result item
   */
  var renderItem = function renderItem(item) {
    return "\n        <div class=\"cell small-12 medium-6 large-4 u-mb-2\">\n          <div class=\"u-bg-grey flex-container flex-dir-column u-h-full\">\n              <img src=\"".concat(item.image, "\" loading=\"lazy\" width=\"578\" height=\"358\" alt=\"").concat(item.title, "\" />\n              <div class=\"u-p-3\">  \n                  <p class=\"u-heritage-green text-lg u-margin-bottom u-header-line u-relative\">\n                      <strong><a href=\"").concat(item.url, "\" class=\"u-border-none\">").concat(item.title, "</a></strong>\n                  </p>\n                  <ul class=\"no-bullet flex-container flex-dir-column u-gap-8\">\n                      <li class=\"flex-container align-middle u-gap-16\">\n                          <span class=\"uos-home h3 u-icon\"></span>").concat(item.location, " </li>\n                      <li class=\"flex-container align-middle u-gap-16\">\n                          <span class=\"uos-money h3 u-icon\"></span>\n                          From ").concat(renderPrice(getLowestFloat(item.prices)), " per week</li>\n                  </ul>\n              </div>\n            </div>\n        </div>");
  };

  /*
      Render all filter buttons
   */
  var renderAllFilterBtns = function renderAllFilterBtns(_params) {
    /* Helper function */
    var mapItem = function mapItem(el) {
      var items = el.value.split(",");
      var index = el.name;
      return stir.map(function (el) {
        return renderFilterBtn(el, index);
      }, items).join(" ");
    };
    return stir.map(mapItem, _params).join("");
  };

  /*
      Render an individual filter button
   */
  var renderFilterBtn = function renderFilterBtn(value, name) {
    if (!value || !name) return "";
    return "<button class=\"is-active\" data-filter-name=\"".concat(name, "\" data-filter-value=\"").concat(value, "\">").concat(value, " \xD7</button>");
  };

  /*
      Render a price string from a float value eg £45.70 from 45.7
   */
  var renderPrice = function renderPrice(float) {
    return "\xA3".concat(String(float.toFixed(2)).replace(".00", ""));
  };

  /*
      EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /*
      Update the browser query params based on form inputs
   */
  var setQueryParams = function setQueryParams(_params, _inputFilters) {
    // Reset the query params
    stir.each(function (item) {
      QueryParams.remove(item.parentNode.dataset.filterName);
    }, _inputFilters);

    // Set new query params with form values
    for (var index in _params) {
      QueryParams.set(index, _params[index]);
    }

    // return the QueryParams as an array
    return QueryParams.getAllArray();
  };

  /*
      Select form input filters based on query params
   */
  var setFiltersVals = function setFiltersVals(params) {
    /* Helper function */
    var selector = function selector(item) {
      var boundParams = item.value.split(","); // eg  { name: "room", value: "Single,Single ensuite" }
      var index = item.name;
      stir.each(function (item) {
        var el = stir.node('[data-filter-name="' + index + '"][data-filter-value="' + item + '"]');
        el && (el.childNodes[0].checked = true);
      }, boundParams);
    };
    stir.each(selector, params);
  };

  /*
       Output html content to the page
   */
  var setDOMContent = stir.curry(function (_node, html) {
    _node.innerHTML = html;
    return _node;
  });

  /*
      EVENTS: INPUT (!!SIDE EFFECTS!!)
   */

  /*
      Show the correct filter panel
   */
  var showFilterPanel = function showFilterPanel(target) {
    var filterPanels = stir.nodes(".c-search-filters-panel");
    var openPanel = stir.node("#" + target.dataset.menuId);
    var filterPanelsLinks = stir.nodes(".c-search-filters-menu li a");
    stir.each(function (element) {
      element.classList.add("hide");
    }, filterPanels);
    openPanel.classList.remove("hide");
    stir.each(function (element) {
      element.classList.remove("is-active");
    }, filterPanelsLinks);
    target.classList.add("is-active");
  };

  /*
      Filter tag click event
   */
  var doTagClick = function doTagClick(element, _inputFilters) {
    var name = element.dataset.filterName;
    var value = element.dataset.filterValue;
    var checkbox = stir.node('[data-filter-name="' + name + '"][data-filter-value="' + value + '"]');
    checkbox && (checkbox.childNodes[0].checked = false);
    element && element.remove();
    var filterVals = getFormVals(_inputFilters);
    var paramsArray = setQueryParams(filterVals, _inputFilters);
    setFiltersVals(paramsArray);
    main(resultsArea, paramsArray, initialData);
  };

  /*
      Tag filter click event
   */

  resultsArea.addEventListener("click", function (e) {
    if (!e.target.matches(".is-active")) return;
    doTagClick(e.target, inputFilters);
    e.preventDefault();
  }, false);

  /*
      Filter tab menu click events
   */
  if (filtersMenu) {
    filtersMenu.onclick = function (e) {
      e.target.nodeName === "A" && showFilterPanel(e.target);
      e.preventDefault();
      return false;
    };
  }

  /*
      Form filter click event
   */
  var filterListener = function filterListener(element, _inputFilters) {
    element.onclick = function (e) {
      var filterVals = getFormVals(_inputFilters);
      var paramsArray = setQueryParams(filterVals, _inputFilters);
      main(resultsArea, paramsArray, initialData);
    };
  };

  /*
      Form filter click event
   */

  inputFilters && inputFilters.forEach(function (element) {
    filterListener(element, inputFilters);
  });

  /*
     On load
   */

  var initialData = stir.accom.accoms;
  var params = QueryParams.getAllArray();
  if (!initialData.length) return;

  // Hide filter panels
  filterPanelType.classList.add("hide");
  filterPanelRoom.classList.add("hide");
  setFiltersVals(params);
  main(resultsArea, params, initialData);
})(stir.node("#accommodation-search__results"));