/*
 * @author: Ryan Kaye
 * @version: 5
 * NOTE: This version does NOT use FunnelBack
 */

(function () {
  /*
   * Vars
   */

  const debug = window.location.hostname == "localhost" ? true : false;

  const euRegion = stir.t4Globals.eu || [];
  const cwRegion = stir.t4Globals.commonwealth || [];
  const ssAfricaRegion = stir.t4Globals.ssAfrica || [];

  const feeSpanders = [
    { id: "RUK", short: "RUK", long: "England, Wales, NI, Republic of Ireland" },
    { Id: "EU", short: "European", long: "European Union" },
  ];

  /*
   * DOM elements FORM version (found on the main scholarship page)
   */

  const inputNation = stir.node("#scholarship-search__nationality");
  const inputSubject = stir.node("#scholarship-search__subject");
  const inputLevel = stir.node("#scholarship-search__level");
  const inputFeeStatus = stir.node("#scholarship-search__feestatus");

  const searchForm = stir.node("#scholarship-search__form");
  const resultsArea = stir.node("#scholarship-search__results");
  const searchClearBtn = stir.node("#scholarship-search__clear");

  /*
   * DOM elements HARD CODED nation based version found on eg Country Specific pages
   */

  const nationListing = stir.nodes("[data-scholcountrylisting]");

  /*
   * Initial States
   */

  const initialMeta = {
    postsPerPage: 30,
    noPageLinks: 9, // odd number only as doesnt include the current page
  };

  /*
   * STATE
   */

  /* ------------------------------------------------
   * Find the results that match the filters and reorder
   * ------------------------------------------------ */
  const filterData = stir.curry((_filters, item) => {
    if (item.title) {
      // Copy to avoid matating data and make easier to work with
      const itemFilters = {
        studyLevel: item.studyLevel ? item.studyLevel : "",
        feeStatus: item.feeStatus ? item.feeStatus : "",
        faculty: item.faculty ? item.faculty : "",
        nationality: item.nationality ? item.nationality : "",
        promotedSubject: item.promotedSubject ? item.promotedSubject.toLowerCase() : "",
        otherSubject: item.otherSubject ? item.otherSubject.toLowerCase() : "",
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
      const regionStrings = {
        cw: cwRegion.includes(_filters.nation) ? "All Commonwealth" : "!nofindyme",
        eu: euRegion.includes(_filters.nation) ? "All EU" : "!nofindyme",
        ssa: ssAfricaRegion.includes(_filters.nation) ? "All Sub-Saharan Africa" : "!nofindyme",
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
  const isMatch = (item, filters, regions) => {
    const matchStudyLevel = () => {
      return item.studyLevel.includes(filters.studyLevel);
    };

    const matchFeeStatus = () => {
      return item.feeStatus.includes(filters.feeStatus);
    };

    const matchSubject = () => {
      return (
        item.otherSubject.includes(filters.subject.toLowerCase()) ||
        item.promotedSubject.includes(filters.subject.toLowerCase())
      );
    };

    const matchFaculty = () => {
      return item.faculty.includes(filters.faculty) || item.faculty.includes("All Faculties");
    };

    const matchRegion = () => {
      return (
        item.nationality.includes(filters.nation) ||
        item.nationality.includes("All nationalities") ||
        item.nationality.includes(regions.cw) ||
        item.nationality.includes(regions.eu) ||
        item.nationality.includes(regions.ssa)
      );
    };

    const matchStatus = [matchStudyLevel(), matchFeeStatus(), matchSubject(), matchFaculty(), matchRegion()];

    return stir.all((b) => b, matchStatus);
  };

  /* ------------------------------------------------
   * Works out the sort value
   * ------------------------------------------------ */
  const getRank = (filters, objFilters, obj, regions) => {
    const isNation = () => {
      return filters.nation !== "" && objFilters.nationality.includes(filters.nation);
    };

    const isRegion = () => {
      return (
        objFilters.nationality === regions.cw ||
        objFilters.nationality === regions.ssa ||
        objFilters.nationality === regions.eu
      );
    };

    const isSubject = () => {
      return filters.subject !== "" && objFilters.promotedSubject.includes(filters.subject.toLowerCase());
    };

    const isFaculty = () => {
      return filters.faculty !== "" && objFilters.faculty.includes(filters.faculty);
    };

    // Get a value for sort
    let sort = "1000";

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
  const calcRank = (sortVal, baseVal, stringPos) => {
    return String(baseVal + parseInt(sortVal) + stringPos);
  };

  /* ------------------------------------------------
   * Sorts a comma separated string
   * ------------------------------------------------ */
  const getReorderString = (str, direction) => {
    if (direction != "desc") return str.split(", ").sort().join(", ");
    if (direction == "desc") return str.split(", ").sort().reverse().join(", ");
  };

  /*
   * RENDERERS
   */

  /* ------------------------------------------------
   * Build the HTML for all results
   * ------------------------------------------------ */
  const renderFormResults = stir.curry((_meta, _data) => {
    return `
        <p class="u-margin-bottom"> Displaying  ${_meta.start + 1} - ${_meta.last}  of  
            <strong>${_meta.totalPosts} results</strong> that match your criteria.</p>
        ${stir.map((e) => renderItem(e), _data).join("")} 
        <div class="grid-x grid-padding-x u-padding-top" id="pagination-box">
            ${renderPagination(_meta)}
        </div> `;
  });

  /* ------------------------------------------------
   * Form the html for the pagination
   * ------------------------------------------------ */
  const renderPagination = (_meta) => {
    if (_meta.postsPerPage > _meta.totalPosts) return ``;

    // Helper that renders the pagination html
    return StirSearchHelpers.formPaginationHTML(
      _meta.totalPosts,
      _meta.postsPerPage,
      _meta.currentPage,
      _meta.noPageLinks
    );
  };

  /* ------------------------------------------------
   * Build the HTML for an individual result (NOT Pure)
   * ------------------------------------------------ */
  const renderItem = (item) => {
    let fs = item.feeStatus ? item.feeStatus : "";
    //let sl = item.studyLevel ? item.studyLevel : "";

    stir.each((el) => {
      fs = fs.replace(el.short, el.long);
    }, feeSpanders);

    return `
        <div class="c-scholarship-search-result">
            <div class="grid-x grid-padding-x">
                <div class="cell small-12 medium-12 large-10">
                <h3 class="c-section-heading u-heritage-green c-scholarship-search-result__title">
                    <a href="${item.url}">${item.title}</a></h3>
                    <p>${item.teaser}</p> 
                </div>
            </div>
            <div class="grid-x grid-padding-x c-scholarship-search-result__details">
            ${renderDetail(fs, "Fee status")} 
            ${renderDetail(getReorderString(item.studyLevel, "desc"), "Level")}
            </div>
            <div class="grid-x grid-padding-x">
                <div class="cell small-12">
                <a href="${item.url}" class="c-link" aria-label="View ${item.title}" >${item.title}</a>
                ${debug && item ? renderDebug(item) : ""}
                </div>
            </div>
        </div>`;
  };

  /* ------------------------------------------------
   *  Build the HTML for the details snippet
   * ------------------------------------------------ */
  const renderDetail = (content, header) => {
    if (!content) return ``;

    return `
        <div class="cell small-12 medium-5 large-5">
          <div class="c-scholarship-search-result__detail">
            <p class="u-font-bold">${header}</p>
            <p>${content}</p>
          </div>
        </div> `;
  };

  /* ------------------------------------------------
   *  Build the HTML for debugging info
   * ------------------------------------------------ */
  const renderDebug = (item) => {
    return `
        <div class="debug">
          <h3>Debug</h3>
          <b>Weighting: </b> ${item.pos}
          <br><b>Nationalities (M):</b> ${item.nationality}
          <br><b>Promoted (R):</b> ${item.promotedSubject}
          <br><b>Other (Q):</b> ${item.otherSubject}
          <br><b>Order (UG, PG):</b> ${item.ugOrder}, ${item.pgOrder}
          <br><b>Faculty:</b> ${item.faculty}
          <br><b>Faculty Order (UG, PG):</b> ${item.ugOrderFaculty} , ${item.pgOrderFaculty}</p>
        </div>`;
  };

  /*
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * Output the html content to the page
   * ------------------------------------------------ */
  const setDOMContent = stir.curry((elem, html) => {
    elem.innerHTML = html;
    return elem;
  });

  /* ------------------------------------------------
   * Populate selects with query params from url string e.g. ?level=ug (NOT Pure)
   * ------------------------------------------------ */
  const setFormValues = () => {
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
  const getFilterVars = () => {
    /* Helper function */
    const getInputVal = (input) => input.options[input.selectedIndex].value;

    const filters = {
      subjectType: inputSubject.options[inputSubject.selectedIndex].parentNode.label,
      subject: getInputVal(inputSubject),
      nation: getInputVal(inputNation),
      studyLevel: getInputVal(inputLevel),
      feeStatus: getInputVal(inputFeeStatus),
      faculty: "",
      sortBy: getInputVal(inputLevel).includes("Undergraduate") ? "ugOrder" : "",
    };

    // Reconfigure if level is PG
    if (getInputVal(inputLevel).includes("Postgraduate")) filters.sortBy = "pgOrder";

    // Reconfigure if its a faculty search rather than subject
    if (filters.subjectType === "Faculty") {
      filters.faculty = filters.subject;
      filters.subject = "";
      filters.sortBy = "ugOrderFaculty";
      if (getInputVal(inputLevel).includes("Postgraduate")) filters.sortBy = "pgOrderFaculty";
    }

    // Reconfigure Study Level and Subject strings
    if (filters.studyLevel === "Postgraduate Taught") filters.studyLevel = "Postgraduate (taught)";
    if (filters.studyLevel === "Postgraduate Research") filters.studyLevel = "Postgraduate (research)";

    if (filters.subject === "!padrenullquery") filters.subject = "";
    filters.subject = filters.subject.toLowerCase();

    // Make sure we have values for everything
    if (!filters.subjectType) filters.subjectType = "";

    return filters;
  };

  /*
   * On load data comsumption
   */

  const initialData = stir.jsonscholarships.scholarships || [];

  if (!initialData.length) return;

  /*
   * Form based version ie scholarship finder
   */

  if (searchForm && resultsArea) {
    /*
     * Main controller function
     */
    const loadData = (setFilters, page) => {
      const setDOMResults = setDOMContent(resultsArea);

      // Update the form filters if required
      if (setFilters) setFormValues();

      // Set the context with helper currys
      const filterDataCurry = stir.filter(filterData(getFilterVars()));
      const sortDataFn = stir.sort((a, b) =>
        parseInt(a.pos) < parseInt(b.pos) ? -1 : parseInt(a.pos) > parseInt(b.pos) ? 1 : 0
      );

      // First pass of running the data through the curries
      const data = stir.compose(sortDataFn, filterDataCurry, stir.clone)(initialData);

      // Metadata
      const newMeta = {
        currentPage: page,
        totalPosts: data.length,
        start: (page - 1) * initialMeta.postsPerPage,
        end: (page - 1) * initialMeta.postsPerPage + initialMeta.postsPerPage,
      };

      const last = newMeta.end > newMeta.totalPosts ? newMeta.totalPosts : newMeta.end;
      const meta = stir.Object.extend({}, initialMeta, newMeta, { last: last });

      // New currys to set final context
      const pageFilter = stir.filter((e, i) => i >= meta.start && i < last);
      const renderer = renderFormResults(meta);

      // Final pass of running the data to the screen
      return stir.compose(setDOMResults, renderer, pageFilter)(data);
    };

    /*
     * Submit event (Filtering form)
     */
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const page = 1;
      loadData(false, page);
      stir.scrollToElement && stir.scrollToElement(resultsArea, 20);

      // set query params as an object so that it writes to the browser history
      const params = {
        page: page,
        nationality: inputNation.options[inputNation.selectedIndex].value,
        subject: inputSubject.options[inputSubject.selectedIndex].value,
        level: inputLevel.options[inputLevel.selectedIndex].value,
        feestatus: inputFeeStatus.options[inputFeeStatus.selectedIndex].value,
      };

      QueryParams.set(params);
      return;
    });

    /*
     * Pagination click processes
     */
    const doPageClick = (page) => {
      const params = { page: page };
      QueryParams.set(params);

      loadData(false, page);
      stir.scrollToElement(searchForm, -40);
      return;
    };

    /*
     * Event: Pagination click events
     */
    resultsArea.addEventListener(
      "click",
      (e) => {
        if (e.target.matches("#pagination-box a")) {
          let loadPage = e.target.getAttribute("data-page");
          doPageClick(loadPage);
          e.preventDefault();
        }
        if (e.target.matches("#pagination-box a span")) {
          let loadPage = e.target.parentNode.getAttribute("data-page");
          doPageClick(loadPage);
          e.preventDefault();
        }
      },
      false
    );

    /*
     * Event: Reset filters button click
     */
    if (searchClearBtn) {
      searchClearBtn.onclick = (e) => {
        // set query params as an object so that it writes to the browser history
        const params = {
          page: 1,
          nationality: "",
          subject: "!padrenullquery",
          level: "",
          feestatus: "",
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
    const page = stir.isNumeric(QueryParams.get("page")) ? QueryParams.get("page") : 1;
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
    const getHardFilterVars = (el) => {
      return {
        subject: "",
        subjectType: "",
        nation: el.dataset.country,
        studyLevel: el.dataset.studylevel,
        feeStatus: "",
        faculty: "",
        sortBy: el.dataset.studylevel.includes("Postgraduate") ? "pgOrder" : "ugOrder",
      };
    };

    /* ------------------------------------------------
     * Output the results from the dataset attributes.
     * Only items with a weight less than 1000
     * ------------------------------------------------ */
    const renderHardResults = stir.curry((_data) => {
      return `
        <ul> 
        ${stir
          .map((el) => `<li><a href="${el.url}">${el.title}</a> ${debug ? el.pos : ""}</li>`, _data)
          .join("")} </ul>`;
    });

    /*
     * On load
     */
    nationListing.forEach((element) => {
      // Set the context with a few helper currys
      const setDOMResults = setDOMContent(element);
      const filterDataCurry = stir.filter(filterData(getHardFilterVars(element)));
      const limitData = stir.filter((el) => parseInt(el.pos) < 1000);
      const sortData = stir.sort((a, b) =>
        parseInt(a.pos) < parseInt(b.pos) ? -1 : parseInt(a.pos) > parseInt(b.pos) ? 1 : 0
      );

      // Run the data through the curries till it hits the screen
      return stir.compose(
        setDOMResults,
        renderHardResults,
        limitData,
        sortData,
        filterDataCurry,
        stir.clone
      )(initialData);
    });
  }
})();
