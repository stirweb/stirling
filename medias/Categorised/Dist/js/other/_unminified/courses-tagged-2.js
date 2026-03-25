/*
   @author: Ryan Kaye
   @version: 1
   @description: Outputs all courses that match the tags provided
 */

(function (scope) {
  if (!scope) return;

  const resultAreas = scope;
  const debug = window.location.hostname == "localhost" || window.location.hostname == "mediadev.stir.ac.uk" ? true : false;

  /**
   * Function: processData: No return value (SIDE EFFECT)
   * Process the data and pass to render functions
   * @param {HTMLElement} node - The container node
   * @param {HTMLElement} resultNode - The node to output results to
   * @param {HTMLElement} filterSelect - The subject filter select element
   * @param {Array} initialData - The initial course data
   * @param {String} subjectFilterValue - The currently selected subject filter value
   * @returns {undefined} No return value (SIDE EFFECT)
   */
  const processData = (node, resultNode, filterSelect, initialData, subjectFilterValue) => {
    // Filters
    const filtersAttributes = Object.entries(resultNode.dataset);
    const filtersSubject = [{ name: "subject", value: subjectFilterValue }];

    const filtersAll1 = getDomFilters(filtersAttributes);
    const filtersAll = stir.filter((el) => el.value !== "", filtersAll1); // remove empties
    const filtersAllSubject1 = [...filtersAll, ...filtersSubject];
    const filtersAllSubject = stir.filter((el) => el.value !== "", filtersAllSubject1); // remove empties

    // Course data
    const filteredData1 = stir.filter((el) => el.title, initialData); // remove empties
    const filteredData = stir.filter(filterData(filtersAll), filteredData1);
    const filteredDataSubject = stir.filter(filterData(filtersAllSubject), filteredData);

    // Subject select list
    const subjectFilters1 = filteredData
      .map((el) => el.subject)
      .join(", ")
      .split(", ");

    const subjectFilters = stir.removeDuplicates(subjectFilters1).sort();
    setDOMContent(filterSelect, renderFilterOptions(subjectFilters, subjectFilterValue));

    // How the data should be displayed
    const view = node.dataset["render"] ? node.dataset["render"] : "";

    // Curry helper functions
    const sortDataCurry = stir.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
    const renderData = render(view);
    const setDOMResults = setDOMContent(resultNode);

    // Pass the raw data through the curry functions till it reaches the page
    stir.compose(setDOMResults, renderData, sortDataCurry)(filteredDataSubject);
  };

  /**
   * Function: filterData: Returns a Boolean
   * Checks to see if an element matches all the filters provided
   * @param {Array} filters - Array of filter objects with name and  value properties
   * @param {Object} element - The course object to check against the filters
   * @returns {Boolean} true if all filters match, false if not
   */
  const filterData = stir.curry((filters, course) => {
    const isTrue = (x) => x;

    // Helper function to check if a course matches a single filter
    const matchMapper = (filterItem) => {
      const tempMatches = course[filterItem.name].split(",").map((el) => {
        if (el.trim() === "") return false;
        return filterItem.value.indexOf(el.trim()) !== -1;
      });
      return stir.any(isTrue, tempMatches);
    };

    return stir.all(isTrue, stir.map(matchMapper, filters));
  });

  /**
   * Function: @render: Returns a String (HTML)
   * Renders the course data based on the view type
   * @param {String} view - The view type (compact or default)
   * @param {Array} items - The course data to render
   * @returns {String} The HTML string of rendered courses
   */
  const render = stir.curry((view, items) => {
    if (view === "compact") return stir.map(renderItemsCompact, items).join("");

    return stir.map(renderItems, items).join("");
  });

  /**
   * Function: @renderFilterOptions: Returns a String (HTML)
   * Renders the filter options for the subject select element
   * @param {Array} filters - The array of filter options
   * @param {String} selected - The currently selected filter option
   * @returns {String} The HTML string of rendered filter options
   */
  const renderFilterOptions = (filters, selected) => {
    return `<option value="">Filter by subject...</option>
			${filters.map((item) => `<option value="${item}" ${item === selected ? "selected" : ""}>${item}</option>`).join("")}`;
  };

  /**
   * Function: @renderEmptyFilter: Returns a String (HTML)
   * Renders an empty filter select element when no data is available
   * @returns {String} The HTML string of an empty filter select element
   */
  const renderEmptyFilter = () => {
    return `
          <label class="show-for-sr" for="subjectsfilter">Filter by subject</label>
          <select id="subjectsfilter">
			        <option value="">Filter by subject...</option>
			    </select>`;
  };

  /**
   * Function: @renderItemsCompact: Returns a String (HTML)
   * Renders a course item in compact view
   * @param {Object} item - The course object to render
   * @returns {String} The HTML string of the rendered course item
   */
  const renderItemsCompact = (item) => {
    return `
			<div class="cell small-12 medium-4 u-pt-2">
			  <div class="u-green-line-top">
				  <h3 class="header-stripped u-my-1 "><a href="${item.url}" class="c-link">${item.prefix} ${item.title}</a></h3>
				  <p class="u-my-1 text-sm"><strong>Start dates: </strong><br />${item.starts}</p>
				  <p class="text-sm"><strong>Duration: </strong><br />${item.duration}, ${item.mode}</p> 
			  </div>
			</div>`;
  };

  /**
   * Function: @renderItems: Returns a String (HTML)
   * Renders a course item in default view
   * @param {Object} item - The course object to render
   * @returns {String} The HTML string of the rendered course item
   */
  const renderItems = (item) => {
    return `
			<div class="cell small-12 medium-4  u-pt-2">
        <div class="u-green-line-top">
          <h3 class="header-stripped u-my-1"><a href="${item.url}" class="c-link" >${item.prefix} ${item.title}</a></h3>
          <p class="text-sm"><strong>${item.starts} </strong></p>
          <p class="text-sm">${item.description}</p>
        </div>
			</div>`;
  };

  /**
   * Function: @setDOMContent: Returns a Boolean
   * Sets the inner HTML of a given element
   * @param {HTMLElement} elem - The element to set the HTML for
   * @param {String} html - The HTML string to set as the inner content
   * @returns {Boolean} true after setting the HTML
   */
  const setDOMContent = stir.curry((elem, html) => {
    stir.setHTML(elem, html);
    return true;
  });

  /**
   *  getDomFilters: Convert DOM dataset to array of objects
   *  @param {Array} domData - The dataset from the result node
   *  @returns {Array} Array of filter objects with name and value properties
   */
  const getDomFilters = (domData) =>
    stir.map((el) => {
      return { name: el[0], value: el[1].trim() };
    }, domData);

  /**
   * Main controller function
   * @param {HTMLElement} node - The container node
   * @param {Array} initialData - The initial course data
   * @returns {undefined} No return value (SIDE EFFECT)
   */
  const main = (node, initialData) => {
    const filtersNode = node.querySelector(".filtersbox");
    const resultNode = node.querySelector(".resultbox");

    setDOMContent(filtersNode, renderEmptyFilter());
    const filterSelect = filtersNode.querySelector("select");

    filterSelect &&
      filterSelect.addEventListener("change", (event) => {
        event.preventDefault();
        const val = event.target.options[event.target.selectedIndex].value;
        return processData(node, resultNode, filterSelect, initialData, val);
      });

    return processData(node, resultNode, filterSelect, initialData, "");
  };

  /**
   * Initialization
   */

  const initialData = stir.courses || [];

  if (!initialData.length) return;

  resultAreas.forEach((element) => main(element, initialData));

  /*
	  End
	 */
})(stir.nodes(".courselisting"));
