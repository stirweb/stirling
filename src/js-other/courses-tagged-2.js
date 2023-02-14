/*
   @author: Ryan Kaye
   @version: 1
   @description: Outputs all courses that match the tags provided
 */

(function (scope) {
  if (!scope) return;

  const resultAreas = scope;
  const debug = window.location.hostname == "localhost" || window.location.hostname == "mediadev.stir.ac.uk" ? true : false;

  /*
	  @getDomFilters: Maps and filters (empty vals) all data-** attributes on the node. Returns an array of objects
	*/
  const getDomFilters = (domData) =>
    stir.map((el) => {
      return { name: el[0], value: el[1].trim() };
    }, domData);

  /* 
	  @main: Controller
	 */
  const main = (node_, initialData_) => {
    const filtersNode = node_.querySelector(".filtersbox");
    const resultNode = node_.querySelector(".resultbox");

    setDOMContent(filtersNode, renderEmptyFilter());
    const filterSelect = filtersNode.querySelector("select");

    filterSelect &&
      filterSelect.addEventListener("change", (event) => {
        event.preventDefault();
        const val = event.target.options[event.target.selectedIndex].value;
        return processData(node_, resultNode, filterSelect, initialData_, val);
      });

    return processData(node_, resultNode, filterSelect, initialData_, "");
  };

  /*
    @processData: Control data flow
	*/
  const processData = (node_, resultNode, filterSelect, initialData_, subjectFilterValue) => {
    // Filters
    const filtersAttributes = Object.entries(resultNode.dataset);
    const filtersSubject = [{ name: "subject", value: subjectFilterValue }];

    const filtersAll1 = getDomFilters(filtersAttributes);
    const filtersAll = stir.filter((el) => el.value !== "", filtersAll1); // remove empties
    const filtersAllSubject1 = [...filtersAll, ...filtersSubject];
    const filtersAllSubject = stir.filter((el) => el.value !== "", filtersAllSubject1); // remove empties

    // Course data
    const filteredData1 = stir.filter((el) => el.title, initialData_); // remove empties
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
    const view = node_.dataset["render"] ? node_.dataset["render"] : "";

    // Curry helper functions
    const sortDataCurry = stir.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
    const renderData = render(view);
    const setDOMResults = setDOMContent(resultNode);

    // Pass the raw data through the curry functions till it reaches the page
    stir.compose(setDOMResults, renderData, sortDataCurry)(filteredDataSubject);
  };

  /*
    @filterData: Filter an item (_element) based on params (_filters) supplied
	  Returns an Array of JSON Objects
	*/
  const filterData = stir.curry((_filters, _element) => {
    const isTrue = (x) => x;

    // Helper function: check to see if there is a match for each facet
    // Map true or false for each split up (,) facet item - [use indexOf() for compat with IE]
    const matchMapper = (f) => {
      const tempMatches = stir.map((el) => f.value.indexOf(el.trim()) !== -1, _element[f.name].split(","));
      return stir.any(isTrue, tempMatches);
    };

    return stir.all(isTrue, stir.map(matchMapper, _filters));
  });

  /*
	   @render: Returns a String (HTML)
	 */
  const render = stir.curry((view, items) => {
    if (view === "compact") return stir.map(renderItemsCompact, items).join("");

    return stir.map(renderItems, items).join("");
  });

  /*
	  @renderFilterOptions: Returns a String (HTML)
	 */
  const renderFilterOptions = (filters, selected) => {
    return `<option value="">Filter by subject...</option>
			${filters.map((item) => `<option value="${item}" ${item === selected ? "selected" : ""}>${item}</option>`).join("")}`;
  };

  /*
	   @renderEmptyFilter: Returns a String (HTML)
	 */
  const renderEmptyFilter = () => {
    return `
          <label class="show-for-sr" for="subjectsfilter">Filter by subject</label>
          <select id="subjectsfilter">
			        <option value="">Filter by subject...</option>
			      </select>`;
  };

  /*
	   @renderItemsCompact: Returns a String (HTML)
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

  /*
	   @renderItems: Returns a String (HTML)
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

  /*
	  @setDOMContent: Output the html content to the page (SIDE EFFECT)
	 */
  const setDOMContent = stir.curry((elem, html) => {
    stir.setHTML(elem, html);

    return true;
  });

  /*
	  On load
	 */

  const initialData = stir.courses || [];

  if (!initialData.length) return;

  resultAreas.forEach((element) => main(element, initialData));

  /*
	  End
	 */
})(stir.nodes(".courselisting"));
