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
     Vars
   */

  const countryNodes = stir.nodes("[data-scholcountrylisting]");
  const subjectNodes = stir.nodes("[data-scholsubjectlisting]");

  const debug = window.location.hostname == "localhost" || window.location.hostname == "mediadev.stir.ac.uk" ? true : false;

  const feeSpanders = [
    { short: "RUK", long: "England, Wales, NI, Republic of Ireland" },
    { short: "European", long: "European Union" },
    { short: "International", long: "International" },
    { short: "Scotland", long: "Scotland" },
  ];

  /* DOM elements for FORM version (found on the main scholarship page) */

  const inputNation = stir.node("#scholarship-search__nationality");
  const inputSubject = stir.node("#scholarship-search__subject");
  const inputLevel = stir.node("#scholarship-search__level");
  const inputFeeStatus = stir.node("#scholarship-search__feestatus");

  const searchForm = stir.node("#scholarship-search__form");
  const resultsArea = stir.node("#scholarship-search__results");
  const searchClearBtn = stir.node("#scholarship-search__clear");

  const regionmacros = stir.t4Globals.regionmacros || [];

  const CONSTANTS = {
    debug: debug,
    regions: {
      ukroi: stir.flatten(regionmacros.filter((item) => item.tag === "UK and ROI").map((el) => el.data)), // Changed from item.tag === "United Kingdom" to include ROI 20 Sep 2022
    },
    regionmacros:
      stir.filter((item) => {
        if (item.tag) return item;
      }, regionmacros) || [],
    feeSpanders: feeSpanders,
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
   
    D A T A   P R O C E S S I N G
   
   */

  /*  
    Find the results that match the filters and reorder 
  */
  const filterData = stir.curry((CONSTS, filters, schol) => {
    if (schol.title) {
      if (isMatch(filters, schol, CONSTS)) {
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
    return scholStudyLevel.includes(filterStudyLevel);
  };

  const matchFeeStatus = (scholFeeStatus, filterFeeStatus) => {
    return scholFeeStatus.includes(filterFeeStatus);
  };

  const matchSubject = (scholData, filterSubject) => {
    return scholData.otherSubject.toLowerCase().includes(filterSubject.toLowerCase()) || scholData.promotedSubject.toLowerCase().includes(filterSubject.toLowerCase());
  };

  const matchFaculty = (scholFaculty, filterFaculty) => {
    return scholFaculty.includes(filterFaculty) || scholFaculty.includes("All Faculties");
  };

  const isInternational = (scholNation, filterNation, ukroi) => {
    if (ukroi.includes(filterNation)) return false;
    return scholNation.includes("All international");
  };

  const isRegion = (scholNation, filterRegions) => {
    if (!filterRegions || filterRegions.length) return false;

    const hasRegion = filterRegions.map((item) => scholNation.includes(item));
    return stir.any((item) => item, hasRegion);
  };

  const matchLocation = (scholNation, filterNation, filterRegions, ukroi) => {
    return scholNation.includes(filterNation) || scholNation.includes("All nationalities") || isInternational(scholNation, filterNation, ukroi) || isRegion(scholNation, filterRegions);
  };

  /*
    Determine if a scholarship matches the filters
  */
  const isMatch = (filters, schol, CONSTS) => {
    const matchFilter = [matchStudyLevel(schol.studyLevel, filters.studyLevel), matchFeeStatus(schol.feeStatus, filters.feeStatus), matchSubject(schol, filters.subject), matchFaculty(schol.faculty, filters.faculty), matchLocation(schol.nationality, filters.nation, filters.regions, CONSTS.regions.ukroi)];

    return stir.all((b) => b, matchFilter);
  };

  /* 
    getRank() helpers
  */
  const getInitialRank = (schol, filters) => {
    if (filters.sortBy === "") {
      if (schol.ugOrder !== "") return schol.ugOrder;
      if (schol.pgOrder !== "") return schol.pgOrder;
    }

    if (filters.sortBy === "ugOrder") return schol.ugOrder;
    if (filters.sortBy === "pgOrder") return schol.pgOrder;
    if (filters.sortBy === "ugOrderFaculty") return schol.ugOrderFaculty;
    if (filters.sortBy === "pgOrderFaculty") return schol.pgOrderFaculty;

    return "1000";
  };

  const getPos = (scholVal, filterVal) => {
    return scholVal.toLowerCase().indexOf(filterVal.toLowerCase()); // TODO Work in String length
  };

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
    const rank5 = getRankValue(schol.faculty, filters.faculty, rank4, -20000);

    return rank5;
  };

  /* 
    Sorts a comma separated string. Returns an array
  */
  const getReorderedString = (str, direction) => {
    return direction !== "desc" ? str.split(", ").sort() : str.split(", ").sort().reverse();
  };

  /* 
    Return Fee Status as a full string 
  */
  const getFeeStatus = (feeStatus, feeSpanders) => {
    return feeStatus.split(", ").map((schol) => {
      const matched = stir.filter((el) => {
        if (el.short === schol) return el;
      }, feeSpanders);

      if (matched[0]) return matched[0].long;
      return schol;
    });
  };

  /*
    
     R E N D E R E R S
    
   */

  /* 
    Form the HTML for all results 
  */
  const renderFormResults = stir.curry((feeSpanders, _meta, _data) => {
    return `
        <p class="u-margin-bottom text-center"> Displaying  ${_meta.start + 1} - ${_meta.last}  of  <strong>${_meta.totalPosts} results</strong> that match your criteria.</p>
        ${stir.map((schol) => renderItem(feeSpanders, schol), _data).join("")} 
        <div class="grid-x grid-padding-x " id="pagination-box">
          ${renderPagination(_meta)}
        </div> `;
  });

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
    Form the HTML for an individual result
  */
  const renderItem = (feeSpanders, schol) => {
    return `
        <div class="u-margin-bottom u-bg-white u-p-2 u-heritage-green-line-left u-relative">
            <div class="u-absolute u-top--15">
            ${getReorderedString(schol.scholarship.studyLevel, "desc").map(renderTag).join("")}
            </div>
            <div class="grid-x grid-padding-x">
                <div class="cell  u-mt-1">
                    <p class="u-heritage-green u-mb-2">
                      <strong><a href="${schol.scholarship.url}">${schol.scholarship.title}</a></strong></p>
                    <p class="u-mb-2">${schol.scholarship.teaser}</p> 
                </div>

                ${renderDetail(schol.scholarship.value, "Value", false)}
                ${renderDetail(schol.scholarship.awards, "Number of awards", true)}
                ${renderDetail(getFeeStatus(schol.scholarship.feeStatus, feeSpanders).join(", "), "Fee status", true)}
              
                ${debug && schol ? renderDebug(schol) : ""}
            </div>
        </div>`;
  };

  const renderTag = (item) => `<span class="u-bg-mint c-tag u-mr-1 ">${item}</span>`;

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
    return `<!--
        <div class="cell u-mt-2 u-p-2 u-border-solid " >
          <h3>Debugger</h3>
          <b>Weighting: </b> ${schol.rank}
          <br><b>Nationalities (M):</b> ${schol.scholarship.nationality}
          <br><b>Promoted (R):</b> ${schol.scholarship.promotedSubject}
          <br><b>Other (Q):</b> ${schol.scholarship.otherSubject}
          <br><b>Order (UG, PG):</b> ${schol.scholarship.ugOrder}, ${schol.scholarship.pgOrder}
          <br><b>Faculty:</b> ${schol.scholarship.faculty}
          <br><b>Faculty Order (UG, PG):</b> ${schol.scholarship.ugOrderFaculty} , ${schol.scholarship.pgOrderFaculty}</p>
        </div> -->`;
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
    nodes.inputNation.value = QueryParams.get("nationality") || "";
    nodes.inputSubject.value = QueryParams.get("subject") || "!padrenullquery";
    nodes.inputLevel.value = QueryParams.get("level") || "";
    nodes.inputFeeStatus.value = QueryParams.get("feestatus") || "";

    return true;
  };

  /*
    
     EVENTS: INPUT (!!SIDE EFFECTS!!)
    
   */

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
    if (!input.options[input.selectedIndex].value) return "";
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
    if (!value) return "";

    if (type === "Faculty") return "";
    if (value === "!padrenullquery") return "";

    return value.toLowerCase();
  };

  const getFaculty = (type, value) => {
    if (!value) return "";

    if (type === "Subject") return "";
    if (value === "!padrenullquery") return "";

    return value;
  };

  const getStudyLevel = (value) => {
    if (!value) return "";

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
  const main = (setFiltersFlag, page, CONSTS, initMeta, initData) => {
    if (setFiltersFlag) setFormValues(CONSTS.nodes);

    const setDOMResults = page === 1 ? setDOMContent(CONSTS.nodes.resultsArea) : appendDOMContent(CONSTS.nodes.resultsArea);
    const filterDataCurry = stir.filter(filterData(CONSTS, getFilterVars(CONSTS.nodes, CONSTS.regionmacros)));
    const mapRankCurry = stir.map(mapRank(getFilterVars(CONSTS.nodes, CONSTS.regionmacros)));

    const sortDataCurry = stir.sort((a, b) => (parseInt(a.rank) < parseInt(b.rank) ? -1 : parseInt(a.rank) > parseInt(b.rank) ? 1 : 0));

    const data = stir.compose(sortDataCurry, mapRankCurry, filterDataCurry)(initData);

    const newMeta = {
      currentPage: page,
      totalPosts: data.length,
      start: (page - 1) * initMeta.postsPerPage,
      end: (page - 1) * initMeta.postsPerPage + initMeta.postsPerPage,
    };

    const last = newMeta.end > newMeta.totalPosts ? newMeta.totalPosts : newMeta.end;
    const meta = stir.Object.extend({}, initMeta, newMeta, { last: last });

    const paginationFilter = stir.filter((schol, index) => index >= meta.start && index < last);
    const renderer = renderFormResults(CONSTS.feeSpanders, meta);

    return stir.compose(setDOMResults, renderer, paginationFilter)(data);
  };

  /*
    
     FORM BASED VERSION
     ie scholarship finder
    
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

        // if (e.target.matches("#pagination-box a")) {
        //   const loadPage = e.target.getAttribute("data-page");

        //   doPageClick(loadPage);
        //   e.preventDefault();
        // }

        // if (e.target.matches("#pagination-box a span")) {
        //   const loadPage2 = e.target.parentNode.getAttribute("data-page");

        //   doPageClick(loadPage2);
        //   e.preventDefault();
        // }
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
          nationality: "",
          subject: "!padrenullquery",
          level: "",
          feestatus: "",
        };

        QueryParams.set(params);

        main(true, 1, CONSTANTS, initialMeta, initialData);
        stir.scrollToElement(searchForm, -40);

        e.preventDefault();
        return false;
      };
    }

    /*
       EVENT: On load
     */

    const page = stir.isNumeric(QueryParams.get("page")) ? QueryParams.get("page") : 1;
    main(true, page, CONSTANTS, initialMeta, initialData);
  }

  /*
   
    HARD CODED Listings
    eg on the international Pages
   
   */

  /* 
    Form the html for the listing 
  */
  const renderHardcodedResults = stir.curry((data) => {
    return stir.map((el) => `<li data-rank="${el.rank}"><a href="${el.scholarship.url}">${el.scholarship.title}</a> ${debug ? el.rank : ""}</li>`, data);
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
      subject: "",
      subjectType: "",
      nation: country,
      studyLevel: el.dataset.studylevel,
      feeStatus: "",
      faculty: "",
      sortBy: el.dataset.studylevel.includes("Postgraduate") ? "pgOrder" : "ugOrder",
      regions: stir.map(getRegionTags(country), regionmacros),
    };
  };

  /* 
    Loop the countries and get the matches for each
  */
  const getCountriesData = (CONSTS, element, allData) => {
    return element.dataset.country.split(", ").map((country) => {
      const filters = getCountryListingFilters(element, country, CONSTS.regionmacros);

      const filterDataCurry = stir.filter(filterData(CONSTS, filters));
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
      nation: "",
      studyLevel: el.dataset.studylevel,
      feeStatus: "",
      faculty: "",
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
