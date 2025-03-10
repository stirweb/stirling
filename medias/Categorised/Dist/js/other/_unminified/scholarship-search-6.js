/*
 * @author: Ryan Kaye
 * @version: 6
 * NOTE: This version does NOT use FunnelBack
 *
 * Country processes. Find scholarships that are avail to
 * 1) the specific nation
 * 2) EU (if applicable)
 * 3) Commonwealth (if applicable)
 * 4) Sub Saharin (if applicable)
 * 5) All international
 * 6) All nationalities
 *
 */

(function () {
  /*
     VARS
   */

  const countryNodes = stir.nodes("[data-scholcountrylisting]");
  const subjectNodes = stir.nodes("[data-scholsubjectlisting]");

  const debug = stir.node("[data-debug]") ? true : false;
  //const debug = false;

  /* DOM elements for FORM version (found on the main scholarship page) */

  const inputNation = stir.node("#scholarship-search__nationality");
  const inputSubject = stir.node("#scholarship-search__subject");
  const inputLevel = stir.node("#scholarship-search__level");
  const inputFeeStatus = stir.node("#scholarship-search__feestatus");

  const searchForm = stir.node("#scholarship-search__form");
  const resultsArea = stir.node("#scholarship-search__results");
  const searchClearBtn = stir.node("#scholarship-search__clear");

  const stirt4globals = stir.t4Globals || {};

  const regionmacros = stirt4globals.regionmacros || [];
  const feeStatusesAll = stirt4globals.feeStatusesAll.feestatuses || [];

  const CONSTANTS = {
    cookieType: "scholarship",
    showUrlToFavs: "true",
    debug: debug,
    regions: {
      ukroi: stir.flatten(regionmacros.filter((item) => item.tag === "UK and ROI").map((el) => el.data)), // Changed from item.tag === "United Kingdom" to include ROI 20 Sep 2022
    },
    regionmacros:
      stir.filter((item) => {
        if (item.tag) return item;
      }, regionmacros) || [],
    feeStatusesAll: feeStatusesAll,
    feeStatusAllSize: feeStatusesAll
      .map((item) => item.name)
      .join(", ")
      .split(", ").length,
    nodes: {
      inputNation: inputNation,
      inputSubject: inputSubject,
      inputLevel: inputLevel,
      inputFeeStatus: inputFeeStatus,
      searchForm: searchForm,
      resultsArea: resultsArea,
      searchClearBtn: searchClearBtn,
    },
  };

  const initialMeta = {
    postsPerPage: 10,
    noPageLinks: 9, // odd number only as doesnt include the current page
  };

  /*
   
    DATA PROCESSING
   
   */

  /*  
    Find the results that match the filters and reorder 
  */
  const filterData = stir.curry((consts, filters, schol) => {
    if (schol.title) {
      if (isMatch(filters, schol, consts)) {
        return schol;
      }
    }
  });

  /*  
    Return the schol with a ranking 
  */
  const mapRank = stir.curry((filters, schol) => {
    const rank = getRank(filters, schol);
    return { rank: rank, scholarship: schol };
  });

  /* 
    isMatch() helpers
  */

  const matchStudyLevel = (scholStudyLevel, filterStudyLevel) => {
    if (filterStudyLevel === "Any") return true;

    return scholStudyLevel.includes(filterStudyLevel);
  };

  const matchFeeStatus = (scholFeeStatus, filterFeeStatus) => {
    //if (filterFeeStatus == "Any" || filterFeeStatus == "International") return true;
    //if (scholFeeStatus == "Any" || scholFeeStatus == "International") return true;

    if (filterFeeStatus == "Any") return true;

    // if (filterFeeStatus == "European") {
    //   if (scholFeeStatus == "European" || scholFeeStatus == "International") return true;
    // }

    return scholFeeStatus.includes(filterFeeStatus);
  };

  const matchSubject = (scholData, filterSubject) => {
    if (filterSubject === "Any") return true;

    return scholData.otherSubject.toLowerCase().includes(filterSubject.toLowerCase()) || scholData.promotedSubject.toLowerCase().includes(filterSubject.toLowerCase());
  };

  const matchFaculty = (scholFaculty, filterFaculty) => {
    return true; // NO LONGER IN USE
    //return scholFaculty.includes(filterFaculty) || scholFaculty.includes("All Faculties");
  };

  const isInternational = (scholNation, filterNation, ukroi) => {
    if (ukroi.includes(filterNation)) return false;
    return scholNation.includes("All international");
  };

  const isRegion = (scholNation, filterRegions) => {
    if (!filterRegions || !filterRegions.length) return false;

    const hasRegion = filterRegions.map((item) => scholNation.includes(item));

    return stir.any((item) => item, hasRegion);
  };

  const matchLocation = (scholNation, filterNation, filterRegions, ukroi) => {
    if (filterNation === "Any") return true;

    return scholNation.includes(filterNation) || scholNation.includes("All nationalities") || isInternational(scholNation, filterNation, ukroi) || isRegion(scholNation, filterRegions);
  };

  /*
    Determine if a scholarship matches the filters
  */
  const isMatch = (filters, schol, consts) => {
    const matchFilter = [matchStudyLevel(schol.studyLevel, filters.studyLevel), matchFeeStatus(schol.feeStatus, filters.feeStatus), matchSubject(schol, filters.subject), matchFaculty(schol.faculty, filters.faculty), matchLocation(schol.nationality, filters.nation, filters.regions, consts.regions.ukroi)];

    return stir.all((b) => b, matchFilter);
  };

  /* 
    getRank() helpers
  */
  const getInitialRank = (schol, filters) => {
    if (!filters.sortBy || filters.sortBy === "") {
      if (schol.ugOrder !== "") return schol.ugOrder;
      if (schol.pgOrder !== "") return schol.pgOrder;
    }

    if (filters.sortBy === "ugOrder") return schol.ugOrder;
    if (filters.sortBy === "pgOrder") return schol.pgOrder;
    if (filters.sortBy === "ugOrderFaculty") return schol.ugOrderFaculty;
    if (filters.sortBy === "pgOrderFaculty") return schol.pgOrderFaculty;

    return "1000";
  };

  /* 
    getPos: Returns an int
  */
  const getPos = (scholVal, filterVal) => {
    return scholVal.toLowerCase().indexOf(filterVal.toLowerCase()); // TODO Work in String length
  };

  /* 
    getRankValue: Returns an int
  */
  const getRankValue = (scholVal, filterVal, startVal, weight) => {
    if (filterVal !== "" && scholVal.toLowerCase().includes(filterVal.toLowerCase())) {
      return calcRank(startVal, weight, getPos(scholVal, filterVal));
    }
    return startVal;
  };

  /* 
    Determine the final weighting (position) 
  */
  const calcRank = (initialVal, weight, stringPos) => {
    return String(weight + parseInt(initialVal) + stringPos);
  };

  /* 
    Return the final calculated rank value 
  */
  const getRank = (filters, schol) => {
    const initrank = getInitialRank(schol, filters);

    const rank = stir.isNumeric(parseInt(initrank)) ? initrank : "1000";
    const rank2 = getRankValue(schol.nationality, filters.nation, rank, -10000);
    const rank3 = isRegion(schol.nationality, filters.regions) ? calcRank(rank2, -100, 0) : rank2;
    const rank4 = getRankValue(schol.promotedSubject, filters.subject, rank3, -20000);
    const rank5 = getRankValue(schol.feeStatus, filters.feeStatus, rank4, -1010);

    return rank5;
  };

  /* 
    Sorts a comma separated string. Returns an array
  */
  const getReorderedString = (str, direction) => {
    return direction !== "desc" ? str.split(", ").sort() : str.split(", ").sort().reverse();
  };

  /* 
    Return Fee Status as an array of full strings 
  */
  const getFeeStatusFullName = (feeStatusesAll, feeStatus) => {
    return feeStatus.split(", ").map((schol) => {
      const matched = stir.filter((el) => {
        if (el.value === schol) return el;
      }, feeStatusesAll);

      if (matched[0]) return matched[0].name;
      return schol;
    });
  };

  /* 
    Return Fee Status as a full string 
  */
  const getFeeStatusText = (feeStatus, consts, feeStatusFilter) => {
    const feeStatuses = getFeeStatusFullName(consts.feeStatusesAll, feeStatus);
    const feeStatusFilterFull = getFeeStatusFullName(consts.feeStatusesAll, feeStatusFilter);
    // const appendix = !feeStatuses.join(", ").includes(feeStatusFilterFull) ? feeStatuses.join(", ") + ` (including ` + feeStatusFilterFull + ` )` : feeStatuses.join(", ");

    const appendix = feeStatuses.join(", ");

    return feeStatuses.join(", ").split(", ").length === consts.feeStatusAllSize ? "All fee statuses" : appendix;
  };

  /*
    
     RENDERERS
    
   */

  /* 
    Form the html for the pagination  
  */
  const renderPagination = ({ currentPage, totalPosts, last }) => {
    return last >= totalPosts
      ? ``
      : `<div class="cell text-center">
              <button class="button hollow tiny" data-page="${currentPage}">Load more results</button>
        </div>`;
  };

  /* 
    Form the HTML for all results 
  */
  const renderFormResults = stir.curry((consts, _meta, _data) => {
    return `
        <p class="u-margin-bottom text-center"> Displaying  ${_meta.start + 1} - ${_meta.last}  of  <strong>${_meta.totalPosts} results</strong> that match your criteria.</p>
        ${stir.map((schol) => renderItem(consts, _meta, schol), _data).join("")} 
        <div class="grid-x " id="pagination-box">
          ${renderPagination(_meta)}
        </div> `;
  });

  const renderFavBtns = (showUrlToFavs, cookie, id) => (cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, showUrlToFavs) : stir.favourites.renderAddBtn(id, showUrlToFavs));

  /* 
    Form the HTML for an individual result
  */
  const renderItem = (consts, _meta, schol) => {
    const cookie = stir.favourites.getFav(schol.scholarship.id, consts.cookieType);
    return `
        <div class="u-margin-bottom u-bg-white u-p-2 u-heritage-line-left u-border-width-5 u-relative">
            <div class="u-absolute u-top--16">
            ${getReorderedString(schol.scholarship.studyLevel, "desc").map(renderTag).join("")}
            </div>
            <div class="grid-x ">
                <div class="cell  u-mt-1">
                    <p class="u-heritage-green u-mb-2">
                      <strong><a href="${schol.scholarship.url}">${schol.scholarship.title}</a></strong></p>
                    <p class="u-mb-2">${schol.scholarship.teaser}</p> 
                </div>

                ${renderDetail(schol.scholarship.value, "Value", false)}
                ${renderDetail(schol.scholarship.awards, "Number of awards", true)}
                ${renderDetail(getFeeStatusText(schol.scholarship.feeStatus, consts, _meta.feeStatusFilter) + " ", "Fee status", true)}
              
                ${debug && schol ? renderDebug(schol) : ""}
            <div class="cell text-sm u-pt-2" id="favbtns${schol.scholarship.id}">
              ${renderFavBtns(consts.showUrlToFavs, cookie, schol.scholarship.id)}
            </div>
            </div>
        </div>`;
  };

  const renderTag = (item) => `<span class="u-bg-heritage-green--10 c-tag u-mr-1 ">${item}</span>`;

  /* 
    Form the HTML for the details snippet 
  */
  const renderDetail = (content, header, addDivider) => {
    return !content
      ? ``
      : `
        <div class="cell small-12  large-4 ${addDivider ? `u-grey-line-left u-no-border-medium` : ``} ">
          <div class="u-mb-fixed-1 u-h-full">
            <p class="u-font-bold">${header}</p>
            <p class="u-m-0">${content}</p>
          </div>
        </div> `;
  };

  /* 
    Form the HTML for debugging info 
  */
  const renderDebug = (schol) => {
    return `
        <div class="cell u-mt-2 u-p-2 u-border-solid " >
          <h3>Debugger</h3>
          <b>Weighting: </b> ${schol.rank}
          <br><b>Nationalities (M):</b> ${schol.scholarship.nationality}
          <br><b>Fee Status (M):</b> ${schol.scholarship.feeStatus}
          <br><b>Promoted (R):</b> ${schol.scholarship.promotedSubject}
          <br><b>Other (Q):</b> ${schol.scholarship.otherSubject}
          <br><b>Order (UG, PG):</b> ${schol.scholarship.ugOrder}, ${schol.scholarship.pgOrder}
          <br><b>Faculty:</b> ${schol.scholarship.faculty}
          <br><b>Faculty Order (UG, PG):</b> ${schol.scholarship.ugOrderFaculty} , ${schol.scholarship.pgOrderFaculty}</p>
        </div> `;
  };

  /*
    
     EVENTS: OUTPUT (!!SIDE EFFECTS!!)
    
   */

  /* 
    Output the html content to the page 
  */
  const setDOMContent = stir.curry((elem, html) => {
    elem.innerHTML = html;
    return elem;
  });

  const appendDOMContent = stir.curry((elem, html) => {
    elem.insertAdjacentHTML("beforeend", html);
    return elem;
  });

  /* 
    Populate selects with query params from url string e.g. ?level=ug  
  */
  const setFormValues = (nodes) => {
    nodes.inputNation.value = QueryParams.get("nationality") || "Any";
    nodes.inputSubject.value = QueryParams.get("subject") || "!padrenullquery";
    nodes.inputLevel.value = QueryParams.get("level") || "Any";
    nodes.inputFeeStatus.value = QueryParams.get("feestatus") || "Any";

    return true;
  };

  /*
    
     EVENTS: INPUT (!!SIDE EFFECTS!!)
    
   */

  const handleSearchResultFavClick = (consts) => (event) => {
    const target = event.target.closest("button");
    if (!target || !target.dataset || !target.dataset.action) return;

    const updateFavButtonDisplay = (id) => {
      const cookie = stir.favourites.getFav(id, consts.cookieType);
      const node = stir.node("#favbtns" + id);

      if (node) {
        setDOMContent(node)(renderFavBtns(consts.showUrlToFavs, cookie, id));
      }
    };

    if (target.dataset.action === "addtofavs") {
      stir.favourites.addToFavs(target.dataset.id, consts.cookieType);
      updateFavButtonDisplay(target.dataset.id);
    }

    if (target.dataset.action === "removefav") {
      stir.favourites.removeFromFavs(target.dataset.id);
      updateFavButtonDisplay(target.dataset.id);

      if (consts.activity === "managefavs") {
        const node = stir.node("#fav-" + target.dataset.id);
        if (node) setDOMContent(node)("");
      }
    }
  };

  /* 
    Filter Helper functions 
  */

  const getRegionTags = stir.curry((scholNation, item) => {
    if (item.data.includes(scholNation)) {
      return item.tag;
    }
    return "!No findy me!";
  });

  const getInputValue = (input) => {
    if (!input.options[input.selectedIndex].value) return "Any";
    return input.options[input.selectedIndex].value;
  };

  const getSortBy = (type, value) => {
    if (!value) return "";

    if (type === "Faculty") {
      if (value.includes("Undergraduate")) return "ugOrderFaculty";
      if (value.includes("Postgraduate")) return "pgOrderFaculty";
    }

    if (value.includes("Undergraduate")) return "ugOrder";
    if (value.includes("Postgraduate")) return "pgOrder";
  };

  const getSubject = (type, value) => {
    if (!value) return "Any";

    if (type === "Faculty") return "";
    if (value === "!padrenullquery") return "";

    return value.toLowerCase();
  };

  const getFaculty = (type, value) => {
    if (!value) return "Any";

    if (type === "Subject") return "";
    if (value === "!padrenullquery") return "";

    return value;
  };

  const getStudyLevel = (value) => {
    if (!value) return "Any";

    if (value === "Postgraduate Taught") return "Postgraduate (taught)";
    if (value === "Postgraduate Research") return "Postgraduate (research)";

    return value;
  };

  //const getSubjectType = (value) => (value && value.length > 0 ? value : "");

  /* 
    Extract filter vars from the form and reconfig them if nec 
  */
  const getFilterVars = (nodes, regionmacros) => {
    const subjectType = "Subject"; // getSubjectType(nodes.inputSubject.options[nodes.inputSubject.selectedIndex].parentNode.label);

    const regionTagCurry = getRegionTags(getInputValue(nodes.inputNation));

    return {
      subjectType: subjectType,
      subject: getSubject(subjectType, getInputValue(nodes.inputSubject)),
      nation: getInputValue(nodes.inputNation),
      studyLevel: getStudyLevel(getInputValue(nodes.inputLevel)),
      feeStatus: getInputValue(nodes.inputFeeStatus),
      faculty: getFaculty(subjectType, getInputValue(nodes.inputSubject)),
      sortBy: getSortBy(subjectType, getInputValue(nodes.inputLevel)),
      regions: stir.map(regionTagCurry, regionmacros),
    };
  };

  /* 
    Main controller function  
  */
  const main = (setFiltersFlag, page, consts, initMeta, initData) => {
    if (setFiltersFlag) setFormValues(consts.nodes);

    const setDOMResults = page === 1 ? setDOMContent(consts.nodes.resultsArea) : appendDOMContent(consts.nodes.resultsArea);
    const filterDataCurry = stir.filter(filterData(consts, getFilterVars(consts.nodes, consts.regionmacros)));
    const mapRankCurry = stir.map(mapRank(getFilterVars(consts.nodes, consts.regionmacros)));
    const sortDataCurry = stir.sort((a, b) => (parseInt(a.rank) < parseInt(b.rank) ? -1 : parseInt(a.rank) > parseInt(b.rank) ? 1 : 0));

    const data = stir.compose(sortDataCurry, mapRankCurry, filterDataCurry)(initData);

    const newMeta = {
      currentPage: page,
      totalPosts: data.length,
      start: (page - 1) * initMeta.postsPerPage,
      end: (page - 1) * initMeta.postsPerPage + initMeta.postsPerPage,
      feeStatusFilter: getFilterVars(consts.nodes, consts.regionmacros).feeStatus,
    };

    const last = newMeta.end > newMeta.totalPosts ? newMeta.totalPosts : newMeta.end;
    const meta = stir.Object.extend({}, initMeta, newMeta, { last: last });

    const paginationFilter = stir.filter((schol, index) => index >= meta.start && index < last);
    const renderer = renderFormResults(consts, meta);

    stir.compose(setDOMResults, renderer, paginationFilter)(data);

    consts.nodes.resultsArea.addEventListener("click", handleSearchResultFavClick(consts));
  };

  /*
    
     Finder
    
   */

  if (searchForm && resultsArea) {
    const initialData = stir.jsonscholarships.scholarships || [];

    if (!initialData.length) return;
    /* 
      EVENT: Submit form (Filtering form) 
    */
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const page = 1;
      main(false, page, CONSTANTS, initialMeta, initialData);
      stir.scrollToElement && stir.scrollToElement(resultsArea, 20);

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
      Pagination click controller 
    */
    const doPageClick = (page) => {
      const params = { page: page };
      QueryParams.set(params);

      main(false, page, CONSTANTS, initialMeta, initialData);
      //stir.scrollToElement(searchForm, -40);
      return;
    };

    /* 
      EVENT: Pagination click events 
    */
    resultsArea.addEventListener(
      "click",
      (e) => {
        if (e.target.matches("#pagination-box button")) {
          e.target.classList.add("hide");
          doPageClick(Number(e.target.getAttribute("data-page")) + 1);
          return;
        }
      },
      false
    );

    /* 
      EVENT: Reset filters button click 
    */
    if (searchClearBtn) {
      searchClearBtn.onclick = (e) => {
        const params = {
          page: 1,
          nationality: "Any",
          subject: "!padrenullquery",
          level: "Any",
          feestatus: "Any",
        };

        QueryParams.set(params);

        main(true, 1, CONSTANTS, initialMeta, initialData);
        stir.scrollToElement(searchForm, -40);

        e.preventDefault();
        return false;
      };
    }

    /*
       On load
     */

    const page = stir.isNumeric(QueryParams.get("page")) ? QueryParams.get("page") : 1;
    main(true, page, CONSTANTS, initialMeta, initialData);
  }

  /*
   
    Hard Coded Listings
    eg on the international Pages
   
   */

  /* 
    Generate the html for the listing 
  */
  const renderHardcodedResults = stir.curry((data) => {
    return stir.map((el) => `<li ><a href="${el.scholarship.url}">${el.scholarship.title}</a> ${debug ? el.rank : ""}</li>`, data);
  });

  const renderWrapper = stir.curry((data) => `<ul> ${data.join("\n")}</ul>`);

  /* 
    This version loads the data async so we need a url to the data
  */
  const jsonurl = {
    dev: "data.json",
    qa: "data.json",
    preview: "https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/29339/",
    prod: "/data/scholarships/json/index.json",
  };

  /*
    Hard coded country listing
  */

  /* 
    Extract the vars from the html element 
  */
  const getCountryListingFilters = (el, country, regionmacros) => {
    return {
      subject: "Any",
      subjectType: "",
      nation: country,
      studyLevel: el.dataset.studylevel,
      feeStatus: "Any",
      faculty: "Any",
      sortBy: el.dataset.studylevel.includes("Postgraduate") ? "pgOrder" : "ugOrder",
      regions: stir.map(getRegionTags(country), regionmacros),
    };
  };

  /* 
    Loop the countries and get the matches for each
  */
  const getCountriesData = (consts, element, allData) => {
    return element.dataset.country.split(", ").map((country) => {
      const filters = getCountryListingFilters(element, country, consts.regionmacros);

      const filterDataCurry = stir.filter(filterData(consts, filters));
      const mapRankCurry = stir.map(mapRank(filters));
      const limitDataCurry = stir.filter((el) => parseInt(el.rank) < 1000);

      return stir.compose(limitDataCurry, mapRankCurry, filterDataCurry)(allData);
    });
  };

  /*
    On load
  */

  if (countryNodes.length) {
    stir.getJSON(jsonurl[UoS_env.name], (initialData2) => {
      if (!initialData2.length) return;

      countryNodes.forEach((element) => {
        const setDOMResultsCurry = setDOMContent(element);
        const sortCurry = stir.sort((a, b) => (parseInt(a.rank) < parseInt(b.rank) ? -1 : parseInt(a.rank) > parseInt(b.rank) ? 1 : 0));

        return stir.compose(setDOMResultsCurry, renderWrapper, stir.removeDuplicates, renderHardcodedResults, sortCurry)(stir.flatten(getCountriesData(CONSTANTS, element, initialData2)));
      });
    });
  }

  /*
    Hard coded subject listing
  */

  /* 
    Extract the vars from the html element 
  */
  const getSubjectListingFilters = (el) => {
    return {
      subject: el.dataset.subject,
      subjectType: "Subject",
      nation: "Any",
      studyLevel: el.dataset.studylevel,
      feeStatus: "Any",
      faculty: "Any",
      sortBy: el.dataset.studylevel.includes("Postgraduate") ? "pgOrder" : "ugOrder",
      regions: [],
    };
  };

  /*
       On load
  */

  if (subjectNodes.length) {
    stir.getJSON(jsonurl[UoS_env.name], (initialData) => {
      if (!initialData.length) return;

      subjectNodes.forEach((element) => {
        const filters = getSubjectListingFilters(element);

        const filterDataCurry = stir.filter(filterData(CONSTANTS, filters));

        const mapRankCurry = stir.map(mapRank(filters));
        const sortCurry = stir.sort((a, b) => (parseInt(a.rank) < parseInt(b.rank) ? -1 : parseInt(a.rank) > parseInt(b.rank) ? 1 : 0));
        const setDOMResultsCurry = setDOMContent(element);
        //const limitDataCurry = stir.filter((el) => parseInt(el.rank) < 1000);
        const limitDataCurry = stir.filter((el, index) => index < 5);

        return stir.compose(setDOMResultsCurry, renderWrapper, renderHardcodedResults, limitDataCurry, sortCurry, mapRankCurry, filterDataCurry)(initialData);
      });
    });
  }
})();
