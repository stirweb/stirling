/* ------------------------------------------------
 * @author: Ryan Kaye
 * @version: 2 (Non jQuery. Non Searchbox. Non broken)
 * ------------------------------------------------ */
(function (scope) {
  if (!scope) return;
  /*
   * CONFIG
   */

  var POSTS_PER_PAGE = 20;
  var NO_PAGE_LINKS = 9;
  /*
   * CONSTANTS
   */

  var CONSTS = {
    // DOM: Main elements
    resultsArea: scope,
    searchForm: stir.node("#staff-search__form"),
    searchInput: stir.node("#staff-search__query"),
    searchLoading: stir.node(".c-search-loading-fixed"),
    // Search config
    postsPerPage: POSTS_PER_PAGE,
    noPageLinks: NO_PAGE_LINKS,
    searchUrl: "https://www.stir.ac.uk/s/search.json?collection=stir-research-hub&meta_T_and=profile&fmo=true&SF=[c,I,faculty,role,firstname,lastname]&num_ranks=".concat(POSTS_PER_PAGE)
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

  var main = function main(facets, consts, initData) {
    // Helper curry function
    var setDOMResults = setDOMContent(consts); // Helper function

    var gotFBData = function gotFBData(data) {
      return data.response.resultPacket && data.response.resultPacket.results.length;
    };

    if (initData.error) {
      return setDOMResults(stir.getMaintenanceMsg());
    }

    if (!gotFBData(initData)) {
      return setDOMResults(renderNoResults(facets.query));
    }

    if (gotFBData(initData)) {
      // Create a helper renderer then run the data through the functions
      var renderer = renderResults(facets);
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


  var formSearchUrl = function formSearchUrl(consts, facets) {
    return consts.searchUrl + "&start_rank=" + facets.start + "&query=" + encodeURIComponent(facets.query);
  };
  /*
   *
   * RENDERERS (PURE IMMUTABLE)
   *
   */

  /* ------------------------------------------------
   * Form the html for all results
   * ------------------------------------------------ */


  var renderResults = stir.curry(function (facets, data) {
    return "\n          ".concat(renderSummary(data.resultsSummary), "\n          ").concat(stir.join("", stir.map(renderProfile, data.results)), "\n          ").concat(renderPagination(data.resultsSummary, facets));
  });
  /* ------------------------------------------------
   * Form the html for an individual results
   * ------------------------------------------------ */

  var renderProfile = function renderProfile(profile) {
    return "\n          <div class=\"cell medium-10 c-search-result u-small-margin-top \">\n            <p class=\"c-search-result__link\">\n              <a href=\"".concat(profile.clickTrackingUrl, "\">").concat(profile.title.split(" | ")[0], "</a>\n            </p>\n            <p class=\"c-search-result__summary\">").concat(profile.summary, "</p>\n          </div>");
  };
  /* ------------------------------------------------
   * Form the html for the pagination
   * ------------------------------------------------ */


  var renderPagination = function renderPagination(summary, facets) {
    return "\n          <div class=\"cell \">\n            <div class=\"grid-container u-margin-y\">\n              <div class=\"grid-x grid-padding-x\" id=\"pagination-box\">\n                ".concat(StirSearchHelpers.formPaginationHTML(summary.fullyMatching, summary.numRanks, Math.floor(summary.currStart / summary.numRanks + 1), // Current page
    facets.noPageLinks), "\n              </div>\n            </div>\n          </div>");
  };
  /* ------------------------------------------------
   * Form the html for the search summary
   * ------------------------------------------------ */


  var renderSummary = function renderSummary(summary) {
    return "\n          <div class=\"cell medium-10\">\n            <p>Showing ".concat(summary.currStart, "-").concat(summary.currEnd, " of <strong>").concat(summary.fullyMatching, " results</strong></p>\n          </div>");
  };
  /* ------------------------------------------------
   * Form the html for the search summary
   * ------------------------------------------------ */


  var renderNoResults = function renderNoResults(query) {
    return "\n          <div class=\"cell medium-10\">\n            <p>No results found for search \"".concat(query, "\".</p>\n          </div>");
  };
  /*
   *
   * EVENTS OUTPUT (!!SIDE EFFECTS!!)
   *
   */

  /* ------------------------------------------------
   * Output html content to the page
   * ------------------------------------------------ */


  var setDOMContent = stir.curry(function (consts, html) {
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

  var doSearch = function doSearch(page, query, consts) {
    consts.searchLoading && (consts.searchLoading.style.display = "flex");
    QueryParams.set("page", page); // Already been type checked

    QueryParams.set("query", query);
    consts.searchInput.value = query;
    var searchFacets = {
      page: page,
      query: query,
      noPageLinks: consts.noPageLinks,
      postsPerPage: consts.postsPerPage,
      start: (page - 1) * consts.postsPerPage + 1
    };
    stir.getJSON(formSearchUrl(consts, searchFacets), function (initialData) {
      return main(searchFacets, consts, initialData);
    });
  };
  /* ------------------------------------------------
   * Pagination click events
   * ------------------------------------------------ */


  CONSTS.resultsArea.addEventListener("click", function (e) {
    var query = QueryParams.get("query") || "";

    if (e.target.matches("#pagination-box a")) {
      doSearch(e.target.getAttribute("data-page"), query, CONSTS);
      e.preventDefault();
    }

    if (e.target.matches("#pagination-box a span")) {
      doSearch(e.target.parentNode.getAttribute("data-page"), query, CONSTS);
      e.preventDefault();
    }

    return;
  }, false);
  /* ------------------------------------------------
   *  Search Form submitted
   * ------------------------------------------------ */

  CONSTS.searchForm && CONSTS.searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var query = CONSTS.searchInput.value || "";
    var page = 1;
    doSearch(page, query, CONSTS);
    return;
  }, false);
  /*
   * On load
   */

  var QUERY = QueryParams.get("query") || "";
  var PAGE = stir.isNumeric(QueryParams.get("page")) ? parseInt(QueryParams.get("page")) : 1;
  doSearch(PAGE, QUERY, CONSTS);
})(stir.node("#staff-search__results"));