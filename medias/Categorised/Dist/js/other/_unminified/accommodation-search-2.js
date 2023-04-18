/*
 * @author: Ryan Kaye
 * @version: 2
 */

(function (scope) {
  if (!scope) return;

  /*
    DOM elements
   */
  const resultsArea = scope;
  const filtersMenu = stir.node("#filters-menu");
  const filterPanelType = stir.node("#filters_panel__type");
  const filterPanelRoom = stir.node("#filters_panel__room");
  const inputFilters = stir.nodes(".c-search-filters-panel__filter input");

  /*
      CONTROLLER
   */

  /*
      Control data flow
   */
  const main = (_resultsArea, _params, _initialData) => {
    // Set the context with a few currys
    const cleanDataCurry = stir.filter(cleanData);
    const filterDataCurry = stir.filter(filterData(_params));
    const renderCurry = renderResults(_params);
    const setDOMResults = setDOMContent(_resultsArea);

    // Run the data through the currys
    const results = stir.compose(setDOMResults, renderCurry, filterDataCurry, cleanDataCurry, stir.clone)(_initialData);
  };

  /*
      STATE HELPERS
   */

  /*
      Decide whether to show an accommodation object based on selected filters
   */
  const filterData = stir.curry((_params, element) => {
    if (element.hidefromlist === "Yes") return false;

    /* Helper function: are all values in the array true? */
    const allTrue = stir.all((el) => el === true);

    /* Helper function: Do all items match */
    const matcher = stir.curry((_el, _filter) => {
      const matches = stir.map((f) => {
        if (!_el[_filter.name].trim().includes(f)) return false;
        return true;
      }, _filter.value.split(","));
      return allTrue(matches);
    });

    // Helper Curry
    const matcherCurry = stir.map(matcher(element));

    // Run the data through the currys
    return stir.compose(allTrue, matcherCurry)(_params);
  });

  /*
      Removes item if empty. Adds accessible tag to room data
   */
  const cleanData = stir.curry((element) => {
    if (element.title) {
      element.room = Object.keys(element.prices).join(", ");
      element.accessible && (element.room = element.room.concat(", ", element.accessible));

      return element;
    }
  });

  /*
      Get the filter vals from the form
   */
  const getFormVals = (_inputFilters) => {
    const params = {};

    stir.each((item) => {
      if (item.checked === true) {
        if (!params[item.parentNode.dataset.filterName]) params[item.parentNode.dataset.filterName] = item.labels[0].dataset.filterValue;
        else {
          params[item.parentNode.dataset.filterName] = params[item.parentNode.dataset.filterName] + "," + item.labels[0].dataset.filterValue;
        }
      }
    }, _inputFilters);

    return params;
  };

  /*
      Returns lowest float value in an object eg { price1: "55.55", price2: "45.7" }
   */
  const getLowestFloat = (obj) => {
    // Context currys
    const getLowestCurry = stir.reduce((a, b) => (b < a ? b : a), Infinity);
    const filterZerosCurry = stir.filter((element) => element > 0);
    const mapToFloatCurry = stir.map((element) => parseFloat(element));

    // Run the data through the currys
    return stir.compose(getLowestCurry, filterZerosCurry, mapToFloatCurry)(Object.values(obj));
  };

  /*
      RENDERERS
   */

  /*
      Render results / filters
   */
  const renderResults = stir.curry((_params, _data) => {
    return `
        <div class="cell c-search-ordered-filters u-margin-bottom" id="search-ordered-filters">
          ${renderAllFilterBtns(_params)}
        </div>
        <div class="cell small-12">
            <p>${_data.length} results found</p>
        </div>
        ${stir.map((el) => renderItem(el), _data).join("")}`;
  });

  /*
     Render html for an individual result item
     <li class="flex-container align-middle u-gap-16">
                          <span class="uos-money h3 u-icon"></span>
                          From ${renderPrice(getLowestFloat(item.prices))} per week</li>
   */
  const renderItem = (item) => {
    return `
        <div class="cell small-12 medium-6 large-4 u-mb-2">
          <div class="u-bg-grey flex-container flex-dir-column u-h-full">
              <img src="${item.image}" loading="lazy" width="578" height="358" alt="${item.title}" />
              <div class="u-p-3">  
                  <p class="u-heritage-green text-lg u-margin-bottom u-header-line u-relative">
                      <strong><a href="${item.url}" class="u-border-none">${item.title}</a></strong>
                  </p>
                  <ul class="no-bullet flex-container flex-dir-column u-gap-8">
                      <li class="flex-container align-middle u-gap-16">
                          <span class="uos-home h3 u-icon"></span>${item.location} </li>

                  </ul>
              </div>
            </div>
        </div>`;
  };

  /*
      Render all filter buttons
   */
  const renderAllFilterBtns = (_params) => {
    /* Helper function */
    const mapItem = (el) => {
      const items = el.value.split(",");
      const index = el.name;

      return stir.map((el) => renderFilterBtn(el, index), items).join(" ");
    };

    return stir.map(mapItem, _params).join("");
  };

  /*
      Render an individual filter button
   */
  const renderFilterBtn = (value, name) => {
    if (!value || !name) return ``;

    return `<button class="is-active" data-filter-name="${name}" data-filter-value="${value}">${value} ×</button>`;
  };

  /*
      Render a price string from a float value eg £45.70 from 45.7
   */
  const renderPrice = (float) => {
    return `£${String(float.toFixed(2)).replace(".00", "")}`;
  };

  /*
      EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /*
      Update the browser query params based on form inputs
   */
  const setQueryParams = (_params, _inputFilters) => {
    // Reset the query params
    stir.each((item) => {
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
  const setFiltersVals = (params) => {
    /* Helper function */
    const selector = (item) => {
      const boundParams = item.value.split(","); // eg  { name: "room", value: "Single,Single ensuite" }
      const index = item.name;

      stir.each((item) => {
        const el = stir.node('[data-filter-name="' + index + '"][data-filter-value="' + item + '"]');
        el && (el.childNodes[0].checked = true);
      }, boundParams);
    };

    stir.each(selector, params);
  };

  /*
       Output html content to the page
   */
  const setDOMContent = stir.curry((_node, html) => {
    _node.innerHTML = html;
    return _node;
  });

  /*
      EVENTS: INPUT (!!SIDE EFFECTS!!)
   */

  /*
      Show the correct filter panel
   */
  const showFilterPanel = (target) => {
    const filterPanels = stir.nodes(".c-search-filters-panel");
    const openPanel = stir.node("#" + target.dataset.menuId);
    const filterPanelsLinks = stir.nodes(".c-search-filters-menu li a");

    stir.each((element) => {
      element.classList.add("hide");
    }, filterPanels);

    openPanel.classList.remove("hide");

    stir.each((element) => {
      element.classList.remove("is-active");
    }, filterPanelsLinks);

    target.classList.add("is-active");
  };

  /*
      Filter tag click event
   */
  const doTagClick = (element, _inputFilters) => {
    const name = element.dataset.filterName;
    const value = element.dataset.filterValue;

    const checkbox = stir.node('[data-filter-name="' + name + '"][data-filter-value="' + value + '"]');

    checkbox && (checkbox.childNodes[0].checked = false);
    element && element.remove();

    const filterVals = getFormVals(_inputFilters);
    const paramsArray = setQueryParams(filterVals, _inputFilters);

    setFiltersVals(paramsArray);
    main(resultsArea, paramsArray, initialData);
  };

  /*
      Tag filter click event
   */

  resultsArea.addEventListener(
    "click",
    (e) => {
      if (!e.target.matches(".is-active")) return;

      doTagClick(e.target, inputFilters);
      e.preventDefault();
    },
    false
  );

  /*
      Filter tab menu click events
   */
  if (filtersMenu) {
    filtersMenu.onclick = (e) => {
      e.target.nodeName === "A" && showFilterPanel(e.target);
      e.preventDefault();
      return false;
    };
  }

  /*
      Form filter click event
   */
  const filterListener = (element, _inputFilters) => {
    element.onclick = (e) => {
      const filterVals = getFormVals(_inputFilters);
      const paramsArray = setQueryParams(filterVals, _inputFilters);

      main(resultsArea, paramsArray, initialData);
    };
  };

  /*
      Form filter click event
   */

  inputFilters &&
    inputFilters.forEach((element) => {
      filterListener(element, inputFilters);
    });

  /*
     On load
   */

  const initialData = stir.accom.accoms;
  const params = QueryParams.getAllArray();

  if (!initialData.length) return;

  // Hide filter panels
  filterPanelType.classList.add("hide");
  filterPanelRoom.classList.add("hide");

  setFiltersVals(params);

  main(resultsArea, params, initialData);
})(stir.node("#accommodation-search__results"));
