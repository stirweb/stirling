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

  const resultAreas = scope;

  /* ------------------------------------------------
   * Controls data flow
   * ------------------------------------------------ */
  const main = (_node, _initialData) => {
    console.log("main");
    /*
     * Helper Function
     * Maps and filters (empty vals) all data-** attributes of the node to an array of objects
     */
    const getDomFilters = (domData) => {
      return stir.filter(
        (el) => el.value !== "", // remove empties
        stir.map((el) => {
          return { name: el[0], value: el[1].trim() };
        }, domData)
      );
    };

    const filters = getDomFilters(Object.entries(_node.dataset));

    // Set context with a few Curry helper functions
    const setDOMResults = setDOMContent(_node);
    const filterDataCurry = stir.filter(filterData(filters));
    const sortDataCurry = stir.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
    const filterEmpties = stir.filter((el) => el.title);
    const renderData = stir.map(renderItems);
    const joinData = stir.join("");

    // Pass the raw data through the curry functions till it reaches the page
    return stir.compose(setDOMResults, joinData, renderData, sortDataCurry, filterDataCurry, filterEmpties, stir.clone)(_initialData);
  };

  /* ------------------------------------------------
   * Filter an item (_element) based on params (_filters) supplied
   * ------------------------------------------------ */
  const filterData = stir.curry((_filters, _element) => {
    const isTrue = (x) => x;

    /* Function: check to see if there is a match for each facet */
    const matchMapper = (f) => {
      // Map true or false for each split up (,) facet item - [use indexOf() for compat with IE]
      const tempMatches = stir.map((_el) => f.value.indexOf(_el.trim()) !== -1, _element[f.name].split(","));
      return stir.any(isTrue, tempMatches);
    };

    // Kick of the matching - return if all conditions are met (true)
    return stir.all(isTrue, stir.map(matchMapper, _filters));
  });

  /* ------------------------------------------------
   * Output the html content to the page
   * ------------------------------------------------ */
  const setDOMContent = stir.curry((elem, html) => {
    // !!SIDE EFFECTS!!
    elem.innerHTML = html;
    return elem;
  });

  /* ------------------------------------------------
   * Builds the html an individual course item
   * ------------------------------------------------ */
  const renderItems = (item) => {
    return `
        <div class="cell small-12 u-padding-top ">
          <h3 class="header-stripped"><a href="${item.url}">${item.prefix} ${item.title}</a></h3>
          <p><strong>${item.starts} </strong></p>
          <p>${item.description}</p>
          <!-- <p class="debug">Modes: ${item.mode}<br> 
          Awards: ${item.award}</p> -->
        </div>`;
  };

  /* ------------------------------------------------
   * On load
   * ------------------------------------------------ */

  const initialData = stir.courses || [];

  if (!initialData.length) return;

  resultAreas.forEach((element) => main(element, initialData));
})(stir.nodes(".courselisting"));
