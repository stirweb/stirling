/* ------------------------------------------------
 * @author: Ryan Kaye
 * @version: 2 (Non jQuery. Non Searchbox. Non broken)
 * ------------------------------------------------ */

(function (scope) {
  if (!scope) return;

  /*
   * CONFIG
   */

  const POSTS_PER_PAGE = 20;
  const NO_PAGE_LINKS = 9;

  /*
   * CONSTANTS
   */

  const CONSTS = {
    // DOM: Main elements
    resultsArea: scope,
    searchForm: stir.node("#staff-search__form"),
    searchInput: stir.node("#staff-search__query"),
    searchLoading: stir.node(".c-search-loading-fixed"),
    // Search config
    postsPerPage: POSTS_PER_PAGE,
    noPageLinks: NO_PAGE_LINKS,
    searchUrl: `https://www.stir.ac.uk/s/search.json?collection=stir-research-hub&meta_T_and=profile&fmo=true&SF=[c,I,faculty,role,firstname,lastname]&num_ranks=${POSTS_PER_PAGE}`,
  };

  Object.freeze(CONSTS);

  /*
   *
   * CONTROLLER
   *
   */

  /* ------------------------------------------------
   *  Control data flow
   * ------------------------------------------------ */
  const main = (facets, consts, initData) => {
    // Helper curry function
    const setDOMResults = setDOMContent(consts);

    // Helper function
    const gotFBData = (data) => data.response.resultPacket && data.response.resultPacket.results.length;

    if (initData.error) {
      return setDOMResults(stir.getMaintenanceMsg());
    }

    if (!gotFBData(initData)) {
      return setDOMResults(renderNoResults(facets.query));
    }

    if (gotFBData(initData)) {
      // Create a helper renderer then run the data through the functions
      const renderer = renderResults(facets);
      return stir.compose(setDOMResults, renderer, stir.clone)(initData.response.resultPacket);
    }
  };

  /*
   *
   * HELPERS (PURE IMMUTABLE)
   *
   */

  /* ------------------------------------------------
   * Returns the FB search string
   * ------------------------------------------------ */
  const formSearchUrl = (consts, facets) =>
    consts.searchUrl + "&start_rank=" + facets.start + "&query=" + encodeURIComponent(facets.query);

  /*
   *
   * RENDERERS (PURE IMMUTABLE)
   *
   */

  /* ------------------------------------------------
   * Form the html for all results
   * ------------------------------------------------ */
  const renderResults = stir.curry((facets, data) => {
    return `
          ${renderSummary(data.resultsSummary)}
          ${stir.join("", stir.map(renderProfile, data.results))}
          ${renderPagination(data.resultsSummary, facets)}`;
  });

  /* ------------------------------------------------
   * Form the html for an individual results
   * ------------------------------------------------ */
  const renderProfile = (profile) => {
    return `
          <div class="cell medium-10 c-search-result u-small-margin-top ">
            <p class="c-search-result__link">
              <a href="${profile.clickTrackingUrl}">${profile.title.split(" | ")[0]}</a>
            </p>
            <p class="c-search-result__summary">${profile.summary}</p>
          </div>`;
  };

  /* ------------------------------------------------
   * Form the html for the pagination
   * ------------------------------------------------ */
  const renderPagination = (summary, facets) => {
    return `
          <div class="cell ">
            <div class="grid-container u-margin-y">
              <div class="grid-x grid-padding-x" id="pagination-box">
                ${StirSearchHelpers.formPaginationHTML(
                  summary.fullyMatching,
                  summary.numRanks,
                  Math.floor(summary.currStart / summary.numRanks + 1), // Current page
                  facets.noPageLinks
                )}
              </div>
            </div>
          </div>`;
  };

  /* ------------------------------------------------
   * Form the html for the search summary
   * ------------------------------------------------ */
  const renderSummary = (summary) => {
    return `
          <div class="cell medium-10">
            <p>Showing ${summary.currStart}-${summary.currEnd} of <strong>${summary.fullyMatching} results</strong></p>
          </div>`;
  };

  /* ------------------------------------------------
   * Form the html for the search summary
   * ------------------------------------------------ */
  const renderNoResults = (query) => {
    return `
          <div class="cell medium-10">
            <p>No results found for search "${query}".</p>
          </div>`;
  };

  /*
   *
   * EVENTS OUTPUT (!!SIDE EFFECTS!!)
   *
   */

  /* ------------------------------------------------
   * Output html content to the page
   * ------------------------------------------------ */
  const setDOMContent = stir.curry((consts, html) => {
    consts.searchLoading && (consts.searchLoading.style.display = "none");
    consts.resultsArea.innerHTML = html;
    stir.scrollToElement(consts.resultsArea, 30);

    return consts.resultsArea;
  });

  /*
   *
   * EVENTS INPUT (!!SIDE EFFECTS!!)
   *
   */

  /* ------------------------------------------------
   *  Perform the search
   * ------------------------------------------------ */
  const doSearch = (page, query, consts) => {
    consts.searchLoading && (consts.searchLoading.style.display = "flex");

    QueryParams.set("page", page); // Already been type checked
    QueryParams.set("query", query);

    consts.searchInput.value = query;

    const searchFacets = {
      page: page,
      query: query,
      noPageLinks: consts.noPageLinks,
      postsPerPage: consts.postsPerPage,
      start: (page - 1) * consts.postsPerPage + 1,
    };

    stir.getJSON(formSearchUrl(consts, searchFacets), (initialData) =>
      main(searchFacets, consts, initialData)
    );
  };

  /* ------------------------------------------------
   * Pagination click events
   * ------------------------------------------------ */
  CONSTS.resultsArea.addEventListener(
    "click",
    (e) => {
      const query = QueryParams.get("query") || "";

      if (e.target.matches("#pagination-box a")) {
        doSearch(e.target.getAttribute("data-page"), query, CONSTS);
        e.preventDefault();
      }

      if (e.target.matches("#pagination-box a span")) {
        doSearch(e.target.parentNode.getAttribute("data-page"), query, CONSTS);
        e.preventDefault();
      }

      return;
    },
    false
  );

  /* ------------------------------------------------
   *  Search Form submitted
   * ------------------------------------------------ */
  CONSTS.searchForm &&
    CONSTS.searchForm.addEventListener(
      "submit",
      (e) => {
        e.preventDefault();
        const query = CONSTS.searchInput.value || "";
        const page = 1;
        doSearch(page, query, CONSTS);
        return;
      },
      false
    );

  /*
   * On load
   */

  const QUERY = QueryParams.get("query") || "";
  const PAGE = stir.isNumeric(QueryParams.get("page")) ? parseInt(QueryParams.get("page")) : 1;

  doSearch(PAGE, QUERY, CONSTS);
})(stir.node("#staff-search__results"));
