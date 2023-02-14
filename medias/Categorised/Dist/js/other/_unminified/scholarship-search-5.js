/*
 * @author: Ryan Kaye
 * @version: 5
 * NOTE: This version does NOT use FunnelBack
 */
(function () {
  /*
   * Vars
   */
  var debug = window.location.hostname == "localhost" ? true : false;
  var euRegion = stir.t4Globals.eu || [];
  var cwRegion = stir.t4Globals.commonwealth || [];
  var ssAfricaRegion = stir.t4Globals.ssAfrica || [];
  var feeSpanders = [{
    id: "RUK",
    short: "RUK",
    long: "England, Wales, NI, Republic of Ireland"
  }, {
    Id: "EU",
    short: "European",
    long: "European Union"
  }];
  /*
   * DOM elements FORM version (found on the main scholarship page)
   */

  var inputNation = stir.node("#scholarship-search__nationality");
  var inputSubject = stir.node("#scholarship-search__subject");
  var inputLevel = stir.node("#scholarship-search__level");
  var inputFeeStatus = stir.node("#scholarship-search__feestatus");
  var searchForm = stir.node("#scholarship-search__form");
  var resultsArea = stir.node("#scholarship-search__results");
  var searchClearBtn = stir.node("#scholarship-search__clear");
  /*
   * DOM elements HARD CODED nation based version found on eg Country Specific pages
   */

  var nationListing = stir.nodes("[data-scholcountrylisting]");
  /*
   * Initial States
   */

  var initialMeta = {
    postsPerPage: 30,
    noPageLinks: 9 // odd number only as doesnt include the current page

  };
  /*
   * STATE
   */

  /* ------------------------------------------------
   * Find the results that match the filters and reorder
   * ------------------------------------------------ */

  var filterData = stir.curry(function (_filters, item) {
    if (item.title) {
      // Copy to avoid matating data and make easier to work with
      var itemFilters = {
        studyLevel: item.studyLevel ? item.studyLevel : "",
        feeStatus: item.feeStatus ? item.feeStatus : "",
        faculty: item.faculty ? item.faculty : "",
        nationality: item.nationality ? item.nationality : "",
        promotedSubject: item.promotedSubject ? item.promotedSubject.toLowerCase() : "",
        otherSubject: item.otherSubject ? item.otherSubject.toLowerCase() : ""
      };
      /*
       * Country processes. Find scholarships that are avail to
       * 1) the specific nation
       * 2) EU (if applicable)
       * 3) Commonwealth (if applicable)
       * 4) Sub Saharin (if applicable)
       * 5) All nationalities
       */
      // Define as findable or unfindable strings

      var regionStrings = {
        cw: cwRegion.includes(_filters.nation) ? "All Commonwealth" : "!nofindyme",
        eu: euRegion.includes(_filters.nation) ? "All EU" : "!nofindyme",
        ssa: ssAfricaRegion.includes(_filters.nation) ? "All Sub-Saharan Africa" : "!nofindyme"
      };

      if (isMatch(itemFilters, _filters, regionStrings)) {
        item.pos = getRank(_filters, itemFilters, item, regionStrings);
        return item;
      }
    }
  });
  /* ------------------------------------------------
   * Determine if a scholarship matches the filters
   * ------------------------------------------------ */

  var isMatch = function isMatch(item, filters, regions) {
    var matchStudyLevel = function matchStudyLevel() {
      return item.studyLevel.includes(filters.studyLevel);
    };

    var matchFeeStatus = function matchFeeStatus() {
      return item.feeStatus.includes(filters.feeStatus);
    };

    var matchSubject = function matchSubject() {
      return item.otherSubject.includes(filters.subject.toLowerCase()) || item.promotedSubject.includes(filters.subject.toLowerCase());
    };

    var matchFaculty = function matchFaculty() {
      return item.faculty.includes(filters.faculty) || item.faculty.includes("All Faculties");
    };

    var matchRegion = function matchRegion() {
      return item.nationality.includes(filters.nation) || item.nationality.includes("All nationalities") || item.nationality.includes(regions.cw) || item.nationality.includes(regions.eu) || item.nationality.includes(regions.ssa);
    };

    var matchStatus = [matchStudyLevel(), matchFeeStatus(), matchSubject(), matchFaculty(), matchRegion()];
    return stir.all(function (b) {
      return b;
    }, matchStatus);
  };
  /* ------------------------------------------------
   * Works out the sort value
   * ------------------------------------------------ */


  var getRank = function getRank(filters, objFilters, obj, regions) {
    var isNation = function isNation() {
      return filters.nation !== "" && objFilters.nationality.includes(filters.nation);
    };

    var isRegion = function isRegion() {
      return objFilters.nationality === regions.cw || objFilters.nationality === regions.ssa || objFilters.nationality === regions.eu;
    };

    var isSubject = function isSubject() {
      return filters.subject !== "" && objFilters.promotedSubject.includes(filters.subject.toLowerCase());
    };

    var isFaculty = function isFaculty() {
      return filters.faculty !== "" && objFilters.faculty.includes(filters.faculty);
    }; // Get a value for sort


    var sort = "1000";

    if (filters.sortBy === "") {
      obj.ugOrder !== "" && (sort = obj.ugOrder);
      obj.pgOrder !== "" && (sort = obj.pgOrder);
    }

    if (filters.sortBy === "ugOrder") sort = obj.ugOrder;
    if (filters.sortBy === "pgOrder") sort = obj.pgOrder;
    if (filters.sortBy === "ugOrderFaculty") sort = obj.ugOrderFaculty;
    if (filters.sortBy === "pgOrderFaculty") sort = obj.pgOrderFaculty;
    if (!sort) sort = "1000";
    if (isNation()) sort = calcRank(sort, -10000, objFilters.nationality.indexOf(filters.nation));
    if (isRegion()) sort = calcRank(sort, -100, 0);
    if (isSubject()) sort = calcRank(sort, -20000, 0);
    if (isFaculty()) sort = calcRank(sort, -20000, 0);
    return sort;
  };
  /* ------------------------------------------------
   * Determine the final weighting (position)
   * ------------------------------------------------ */


  var calcRank = function calcRank(sortVal, baseVal, stringPos) {
    return String(baseVal + parseInt(sortVal) + stringPos);
  };
  /* ------------------------------------------------
   * Sorts a comma separated string
   * ------------------------------------------------ */


  var getReorderString = function getReorderString(str, direction) {
    if (direction != "desc") return str.split(", ").sort().join(", ");
    if (direction == "desc") return str.split(", ").sort().reverse().join(", ");
  };
  /*
   * RENDERERS
   */

  /* ------------------------------------------------
   * Build the HTML for all results
   * ------------------------------------------------ */


  var renderFormResults = stir.curry(function (_meta, _data) {
    return "\n        <p class=\"u-margin-bottom\"> Displaying  ".concat(_meta.start + 1, " - ").concat(_meta.last, "  of  \n            <strong>").concat(_meta.totalPosts, " results</strong> that match your criteria.</p>\n        ").concat(stir.map(function (e) {
      return renderItem(e);
    }, _data).join(""), " \n        <div class=\"grid-x grid-padding-x u-padding-top\" id=\"pagination-box\">\n            ").concat(renderPagination(_meta), "\n        </div> ");
  });
  /* ------------------------------------------------
   * Form the html for the pagination
   * ------------------------------------------------ */

  var renderPagination = function renderPagination(_meta) {
    if (_meta.postsPerPage > _meta.totalPosts) return ""; // Helper that renders the pagination html

    return StirSearchHelpers.formPaginationHTML(_meta.totalPosts, _meta.postsPerPage, _meta.currentPage, _meta.noPageLinks);
  };
  /* ------------------------------------------------
   * Build the HTML for an individual result (NOT Pure)
   * ------------------------------------------------ */


  var renderItem = function renderItem(item) {
    var fs = item.feeStatus ? item.feeStatus : ""; //let sl = item.studyLevel ? item.studyLevel : "";

    stir.each(function (el) {
      fs = fs.replace(el.short, el.long);
    }, feeSpanders);
    return "\n        <div class=\"c-scholarship-search-result\">\n            <div class=\"grid-x grid-padding-x\">\n                <div class=\"cell small-12 medium-12 large-10\">\n                <h3 class=\"c-section-heading u-heritage-green c-scholarship-search-result__title\">\n                    <a href=\"".concat(item.url, "\">").concat(item.title, "</a></h3>\n                    <p>").concat(item.teaser, "</p> \n                </div>\n            </div>\n            <div class=\"grid-x grid-padding-x c-scholarship-search-result__details\">\n            ").concat(renderDetail(fs, "Fee status"), " \n            ").concat(renderDetail(getReorderString(item.studyLevel, "desc"), "Level"), "\n            </div>\n            <div class=\"grid-x grid-padding-x\">\n                <div class=\"cell small-12\">\n                <a href=\"").concat(item.url, "\" class=\"c-link\" aria-label=\"View ").concat(item.title, "\" >").concat(item.title, "</a>\n                ").concat(debug && item ? renderDebug(item) : "", "\n                </div>\n            </div>\n        </div>");
  };
  /* ------------------------------------------------
   *  Build the HTML for the details snippet
   * ------------------------------------------------ */


  var renderDetail = function renderDetail(content, header) {
    if (!content) return "";
    return "\n        <div class=\"cell small-12 medium-5 large-5\">\n          <div class=\"c-scholarship-search-result__detail\">\n            <p class=\"u-font-bold\">".concat(header, "</p>\n            <p>").concat(content, "</p>\n          </div>\n        </div> ");
  };
  /* ------------------------------------------------
   *  Build the HTML for debugging info
   * ------------------------------------------------ */


  var renderDebug = function renderDebug(item) {
    return "\n        <div class=\"debug\">\n          <h3>Debug</h3>\n          <b>Weighting: </b> ".concat(item.pos, "\n          <br><b>Nationalities (M):</b> ").concat(item.nationality, "\n          <br><b>Promoted (R):</b> ").concat(item.promotedSubject, "\n          <br><b>Other (Q):</b> ").concat(item.otherSubject, "\n          <br><b>Order (UG, PG):</b> ").concat(item.ugOrder, ", ").concat(item.pgOrder, "\n          <br><b>Faculty:</b> ").concat(item.faculty, "\n          <br><b>Faculty Order (UG, PG):</b> ").concat(item.ugOrderFaculty, " , ").concat(item.pgOrderFaculty, "</p>\n        </div>");
  };
  /*
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * Output the html content to the page
   * ------------------------------------------------ */


  var setDOMContent = stir.curry(function (elem, html) {
    elem.innerHTML = html;
    return elem;
  });
  /* ------------------------------------------------
   * Populate selects with query params from url string e.g. ?level=ug (NOT Pure)
   * ------------------------------------------------ */

  var setFormValues = function setFormValues() {
    inputNation.value = QueryParams.get("nationality") || "";
    inputSubject.value = QueryParams.get("subject") || "!padrenullquery";
    inputLevel.value = QueryParams.get("level") || "";
    inputFeeStatus.value = QueryParams.get("feestatus") || "";
    return true;
  };
  /*
   * EVENTS: INPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * Extract filter vars from the form and reconfig them if nec (NOT Pure)
   * ------------------------------------------------ */


  var getFilterVars = function getFilterVars() {
    /* Helper function */
    var getInputVal = function getInputVal(input) {
      return input.options[input.selectedIndex].value;
    };

    var filters = {
      subjectType: inputSubject.options[inputSubject.selectedIndex].parentNode.label,
      subject: getInputVal(inputSubject),
      nation: getInputVal(inputNation),
      studyLevel: getInputVal(inputLevel),
      feeStatus: getInputVal(inputFeeStatus),
      faculty: "",
      sortBy: getInputVal(inputLevel).includes("Undergraduate") ? "ugOrder" : ""
    }; // Reconfigure if level is PG

    if (getInputVal(inputLevel).includes("Postgraduate")) filters.sortBy = "pgOrder"; // Reconfigure if its a faculty search rather than subject

    if (filters.subjectType === "Faculty") {
      filters.faculty = filters.subject;
      filters.subject = "";
      filters.sortBy = "ugOrderFaculty";
      if (getInputVal(inputLevel).includes("Postgraduate")) filters.sortBy = "pgOrderFaculty";
    } // Reconfigure Study Level and Subject strings


    if (filters.studyLevel === "Postgraduate Taught") filters.studyLevel = "Postgraduate (taught)";
    if (filters.studyLevel === "Postgraduate Research") filters.studyLevel = "Postgraduate (research)";
    if (filters.subject === "!padrenullquery") filters.subject = "";
    filters.subject = filters.subject.toLowerCase(); // Make sure we have values for everything

    if (!filters.subjectType) filters.subjectType = "";
    return filters;
  };
  /*
   * On load data comsumption
   */


  var initialData = stir.jsonscholarships.scholarships || [];
  if (!initialData.length) return;
  /*
   * Form based version ie scholarship finder
   */

  if (searchForm && resultsArea) {
    /*
     * Main controller function
     */
    var loadData = function loadData(setFilters, page) {
      var setDOMResults = setDOMContent(resultsArea); // Update the form filters if required

      if (setFilters) setFormValues(); // Set the context with helper currys

      var filterDataCurry = stir.filter(filterData(getFilterVars()));
      var sortDataFn = stir.sort(function (a, b) {
        return parseInt(a.pos) < parseInt(b.pos) ? -1 : parseInt(a.pos) > parseInt(b.pos) ? 1 : 0;
      }); // First pass of running the data through the curries

      var data = stir.compose(sortDataFn, filterDataCurry, stir.clone)(initialData); // Metadata

      var newMeta = {
        currentPage: page,
        totalPosts: data.length,
        start: (page - 1) * initialMeta.postsPerPage,
        end: (page - 1) * initialMeta.postsPerPage + initialMeta.postsPerPage
      };
      var last = newMeta.end > newMeta.totalPosts ? newMeta.totalPosts : newMeta.end;
      var meta = stir.Object.extend({}, initialMeta, newMeta, {
        last: last
      }); // New currys to set final context

      var pageFilter = stir.filter(function (e, i) {
        return i >= meta.start && i < last;
      });
      var renderer = renderFormResults(meta); // Final pass of running the data to the screen

      return stir.compose(setDOMResults, renderer, pageFilter)(data);
    };
    /*
     * Submit event (Filtering form)
     */


    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var page = 1;
      loadData(false, page);
      stir.scrollToElement && stir.scrollToElement(resultsArea, 20); // set query params as an object so that it writes to the browser history

      var params = {
        page: page,
        nationality: inputNation.options[inputNation.selectedIndex].value,
        subject: inputSubject.options[inputSubject.selectedIndex].value,
        level: inputLevel.options[inputLevel.selectedIndex].value,
        feestatus: inputFeeStatus.options[inputFeeStatus.selectedIndex].value
      };
      QueryParams.set(params);
      return;
    });
    /*
     * Pagination click processes
     */

    var doPageClick = function doPageClick(page) {
      var params = {
        page: page
      };
      QueryParams.set(params);
      loadData(false, page);
      stir.scrollToElement(searchForm, -40);
      return;
    };
    /*
     * Event: Pagination click events
     */


    resultsArea.addEventListener("click", function (e) {
      if (e.target.matches("#pagination-box a")) {
        var loadPage = e.target.getAttribute("data-page");
        doPageClick(loadPage);
        e.preventDefault();
      }

      if (e.target.matches("#pagination-box a span")) {
        var _loadPage = e.target.parentNode.getAttribute("data-page");

        doPageClick(_loadPage);
        e.preventDefault();
      }
    }, false);
    /*
     * Event: Reset filters button click
     */

    if (searchClearBtn) {
      searchClearBtn.onclick = function (e) {
        // set query params as an object so that it writes to the browser history
        var params = {
          page: 1,
          nationality: "",
          subject: "!padrenullquery",
          level: "",
          feestatus: ""
        };
        QueryParams.set(params);
        loadData(true, 1);
        stir.scrollToElement(searchForm, -40);
        e.preventDefault();
        return false;
      };
    }
    /*
     * On load
     */


    var page = stir.isNumeric(QueryParams.get("page")) ? QueryParams.get("page") : 1;
    loadData(true, page);
  }
  /*
   *
   *
   *
   *
   *
   * Hard coded version eg on Country Specific Pages
   */


  if (nationListing) {
    /* ------------------------------------------------
     * Extract the vars from the html element
     * ------------------------------------------------ */
    var getHardFilterVars = function getHardFilterVars(el) {
      return {
        subject: "",
        subjectType: "",
        nation: el.dataset.country,
        studyLevel: el.dataset.studylevel,
        feeStatus: "",
        faculty: "",
        sortBy: el.dataset.studylevel.includes("Postgraduate") ? "pgOrder" : "ugOrder"
      };
    };
    /* ------------------------------------------------
     * Output the results from the dataset attributes.
     * Only items with a weight less than 1000
     * ------------------------------------------------ */


    var renderHardResults = stir.curry(function (_data) {
      return "\n        <ul> \n        ".concat(stir.map(function (el) {
        return "<li><a href=\"".concat(el.url, "\">").concat(el.title, "</a> ").concat(debug ? el.pos : "", "</li>");
      }, _data).join(""), " </ul>");
    });
    /*
     * On load
     */

    nationListing.forEach(function (element) {
      // Set the context with a few helper currys
      var setDOMResults = setDOMContent(element);
      var filterDataCurry = stir.filter(filterData(getHardFilterVars(element)));
      var limitData = stir.filter(function (el) {
        return parseInt(el.pos) < 1000;
      });
      var sortData = stir.sort(function (a, b) {
        return parseInt(a.pos) < parseInt(b.pos) ? -1 : parseInt(a.pos) > parseInt(b.pos) ? 1 : 0;
      }); // Run the data through the curries till it hits the screen

      return stir.compose(setDOMResults, renderHardResults, limitData, sortData, filterDataCurry, stir.clone)(initialData);
    });
  }
})();