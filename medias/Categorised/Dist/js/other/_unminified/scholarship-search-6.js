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

  var countryNodes = stir.nodes("[data-scholcountrylisting]");
  var subjectNodes = stir.nodes("[data-scholsubjectlisting]");
  var debug = UoS_env.name == "dev" || UoS_env.name == "qa" ? true : false;

  /* DOM elements for FORM version (found on the main scholarship page) */

  var inputNation = stir.node("#scholarship-search__nationality");
  var inputSubject = stir.node("#scholarship-search__subject");
  var inputLevel = stir.node("#scholarship-search__level");
  var inputFeeStatus = stir.node("#scholarship-search__feestatus");
  var searchForm = stir.node("#scholarship-search__form");
  var resultsArea = stir.node("#scholarship-search__results");
  var searchClearBtn = stir.node("#scholarship-search__clear");
  var stirt4globals = stir.t4Globals || {};
  var regionmacros = stirt4globals.regionmacros || [];
  var feeStatusesAll = stirt4globals.feeStatusesAll.feestatuses || [];
  var CONSTANTS = {
    debug: debug,
    regions: {
      ukroi: stir.flatten(regionmacros.filter(function (item) {
        return item.tag === "UK and ROI";
      }).map(function (el) {
        return el.data;
      })) // Changed from item.tag === "United Kingdom" to include ROI 20 Sep 2022
    },

    regionmacros: stir.filter(function (item) {
      if (item.tag) return item;
    }, regionmacros) || [],
    feeStatusesAll: feeStatusesAll,
    feeStatusAllSize: feeStatusesAll.map(function (item) {
      return item.name;
    }).join(", ").split(", ").length,
    nodes: {
      inputNation: inputNation,
      inputSubject: inputSubject,
      inputLevel: inputLevel,
      inputFeeStatus: inputFeeStatus,
      searchForm: searchForm,
      resultsArea: resultsArea,
      searchClearBtn: searchClearBtn
    }
  };
  var initialMeta = {
    postsPerPage: 10,
    noPageLinks: 9 // odd number only as doesnt include the current page
  };

  /*
   
    D A T A   P R O C E S S I N G
   
   */

  /*  
    Find the results that match the filters and reorder 
  */
  var filterData = stir.curry(function (CONSTS, filters, schol) {
    if (schol.title) {
      if (isMatch(filters, schol, CONSTS)) {
        return schol;
      }
    }
  });

  /*  
    Return the schol with a ranking 
  */
  var mapRank = stir.curry(function (filters, schol) {
    var rank = getRank(filters, schol);
    return {
      rank: rank,
      scholarship: schol
    };
  });

  /* 
    isMatch() helpers
  */

  var matchStudyLevel = function matchStudyLevel(scholStudyLevel, filterStudyLevel) {
    if (filterStudyLevel === "Any") return true;
    return scholStudyLevel.includes(filterStudyLevel);
  };
  var matchFeeStatus = function matchFeeStatus(scholFeeStatus, filterFeeStatus) {
    if (filterFeeStatus == "Any" || filterFeeStatus == "International") return true;
    if (scholFeeStatus == "Any" || scholFeeStatus == "International") return true;
    return scholFeeStatus.includes(filterFeeStatus);
  };
  var matchSubject = function matchSubject(scholData, filterSubject) {
    if (filterSubject === "Any") return true;
    return scholData.otherSubject.toLowerCase().includes(filterSubject.toLowerCase()) || scholData.promotedSubject.toLowerCase().includes(filterSubject.toLowerCase());
  };
  var matchFaculty = function matchFaculty(scholFaculty, filterFaculty) {
    return true;
    //return scholFaculty.includes(filterFaculty) || scholFaculty.includes("All Faculties");
  };

  var isInternational = function isInternational(scholNation, filterNation, ukroi) {
    if (ukroi.includes(filterNation)) return false;
    return scholNation.includes("All international");
  };
  var isRegion = function isRegion(scholNation, filterRegions) {
    if (!filterRegions || filterRegions.length) return false;
    var hasRegion = filterRegions.map(function (item) {
      return scholNation.includes(item);
    });
    return stir.any(function (item) {
      return item;
    }, hasRegion);
  };
  var matchLocation = function matchLocation(scholNation, filterNation, filterRegions, ukroi) {
    if (filterNation === "Any") return true;
    return scholNation.includes(filterNation) || scholNation.includes("All nationalities") || isInternational(scholNation, filterNation, ukroi) || isRegion(scholNation, filterRegions);
  };

  /*
    Determine if a scholarship matches the filters
  */
  var isMatch = function isMatch(filters, schol, CONSTS) {
    var matchFilter = [matchStudyLevel(schol.studyLevel, filters.studyLevel), matchFeeStatus(schol.feeStatus, filters.feeStatus), matchSubject(schol, filters.subject), matchFaculty(schol.faculty, filters.faculty), matchLocation(schol.nationality, filters.nation, filters.regions, CONSTS.regions.ukroi)];

    //console.log(matchFilter);

    return stir.all(function (b) {
      return b;
    }, matchFilter);
  };

  /* 
    getRank() helpers
  */
  var getInitialRank = function getInitialRank(schol, filters) {
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
  var getPos = function getPos(scholVal, filterVal) {
    return scholVal.toLowerCase().indexOf(filterVal.toLowerCase()); // TODO Work in String length
  };

  var getRankValue = function getRankValue(scholVal, filterVal, startVal, weight) {
    if (filterVal !== "" && scholVal.toLowerCase().includes(filterVal.toLowerCase())) {
      return calcRank(startVal, weight, getPos(scholVal, filterVal));
    }
    return startVal;
  };

  /* 
    Determine the final weighting (position) 
  */
  var calcRank = function calcRank(initialVal, weight, stringPos) {
    return String(weight + parseInt(initialVal) + stringPos);
  };

  /* 
    Return the final calculated rank value 
  */
  var getRank = function getRank(filters, schol) {
    var initrank = getInitialRank(schol, filters);
    var rank = stir.isNumeric(parseInt(initrank)) ? initrank : "1000";
    var rank2 = getRankValue(schol.nationality, filters.nation, rank, -10000);
    var rank3 = isRegion(schol.nationality, filters.regions) ? calcRank(rank2, -100, 0) : rank2;
    var rank4 = getRankValue(schol.promotedSubject, filters.subject, rank3, -20000);
    var rank5 = getRankValue(schol.faculty, filters.faculty, rank4, -20000);
    return rank5;
  };

  /* 
    Sorts a comma separated string. Returns an array
  */
  var getReorderedString = function getReorderedString(str, direction) {
    return direction !== "desc" ? str.split(", ").sort() : str.split(", ").sort().reverse();
  };

  /* 
    Return Fee Status as a full string 
  */
  var getFeeStatus = function getFeeStatus(feeStatus, consts) {
    var feeStatuses = feeStatus.split(", ").map(function (schol) {
      var matched = stir.filter(function (el) {
        if (el.value === schol) return el;
      }, consts.feeStatusesAll);
      if (matched[0]) return matched[0].name;
      return schol;
    });
    return feeStatuses.join(", ").split(", ").length === consts.feeStatusAllSize ? "All fee statuses" : feeStatuses.join(", ");
  };

  /*
    
     R E N D E R E R S
    
   */

  /* 
    Form the html for the pagination  
  */
  var renderPagination = function renderPagination(_ref) {
    var currentPage = _ref.currentPage,
      totalPosts = _ref.totalPosts,
      last = _ref.last;
    return last >= totalPosts ? "" : "<div class=\"cell text-center\">\n              <button class=\"button hollow tiny\" data-page=\"".concat(currentPage, "\">Load more results</button>\n        </div>");
  };

  /* 
    Form the HTML for all results 
  */
  var renderFormResults = stir.curry(function (consts, _meta, _data) {
    return "\n        <p class=\"u-margin-bottom text-center\"> Displaying  ".concat(_meta.start + 1, " - ").concat(_meta.last, "  of  <strong>").concat(_meta.totalPosts, " results</strong> that match your criteria.</p>\n        ").concat(stir.map(function (schol) {
      return renderItem(consts, schol);
    }, _data).join(""), " \n        <div class=\"grid-x grid-padding-x \" id=\"pagination-box\">\n          ").concat(renderPagination(_meta), "\n        </div> ");
  });

  /* 
    Form the HTML for an individual result
  */
  var renderItem = function renderItem(consts, schol) {
    return "\n        <div class=\"u-margin-bottom u-bg-white u-p-2 u-heritage-green-line-left u-relative\">\n            <div class=\"u-absolute u-top--15\">\n            ".concat(getReorderedString(schol.scholarship.studyLevel, "desc").map(renderTag).join(""), "\n            </div>\n            <div class=\"grid-x grid-padding-x\">\n                <div class=\"cell  u-mt-1\">\n                    <p class=\"u-heritage-green u-mb-2\">\n                      <strong><a href=\"").concat(schol.scholarship.url, "\">").concat(schol.scholarship.title, "</a></strong></p>\n                    <p class=\"u-mb-2\">").concat(schol.scholarship.teaser, "</p> \n                </div>\n\n                ").concat(renderDetail(schol.scholarship.value, "Value", false), "\n                ").concat(renderDetail(schol.scholarship.awards, "Number of awards", true), "\n                ").concat(renderDetail(getFeeStatus(schol.scholarship.feeStatus, consts), "Fee status", true), "\n              \n                ").concat(debug && schol ? renderDebug(schol) : "", "\n            </div>\n        </div>");
  };
  var renderTag = function renderTag(item) {
    return "<span class=\"u-bg-mint c-tag u-mr-1 \">".concat(item, "</span>");
  };

  /* 
    Form the HTML for the details snippet 
  */
  var renderDetail = function renderDetail(content, header, addDivider) {
    return !content ? "" : "\n        <div class=\"cell small-12  large-4 ".concat(addDivider ? "u-grey-line-left u-no-border-medium" : "", " \">\n          <div class=\"u-mb-fixed-1 u-h-full\">\n            <p class=\"u-font-bold\">").concat(header, "</p>\n            <p class=\"u-m-0\">").concat(content, "</p>\n          </div>\n        </div> ");
  };

  /* 
    Form the HTML for debugging info 
  */
  var renderDebug = function renderDebug(schol) {
    return "\n        <div class=\"cell u-mt-2 u-p-2 u-border-solid \" >\n          <h3>Debugger</h3>\n          <b>Weighting: </b> ".concat(schol.rank, "\n          <br><b>Nationalities (M):</b> ").concat(schol.scholarship.nationality, "\n          <br><b>Fee Status (M):</b> ").concat(schol.scholarship.feeStatus, "\n          <br><b>Promoted (R):</b> ").concat(schol.scholarship.promotedSubject, "\n          <br><b>Other (Q):</b> ").concat(schol.scholarship.otherSubject, "\n          <br><b>Order (UG, PG):</b> ").concat(schol.scholarship.ugOrder, ", ").concat(schol.scholarship.pgOrder, "\n          <br><b>Faculty:</b> ").concat(schol.scholarship.faculty, "\n          <br><b>Faculty Order (UG, PG):</b> ").concat(schol.scholarship.ugOrderFaculty, " , ").concat(schol.scholarship.pgOrderFaculty, "</p>\n        </div> ");
  };

  /*
    
     EVENTS: OUTPUT (!!SIDE EFFECTS!!)
    
   */

  /* 
    Output the html content to the page 
  */
  var setDOMContent = stir.curry(function (elem, html) {
    elem.innerHTML = html;
    return elem;
  });
  var appendDOMContent = stir.curry(function (elem, html) {
    elem.insertAdjacentHTML("beforeend", html);
    return elem;
  });

  /* 
    Populate selects with query params from url string e.g. ?level=ug  
  */
  var setFormValues = function setFormValues(nodes) {
    nodes.inputNation.value = QueryParams.get("nationality") || "Any";
    nodes.inputSubject.value = QueryParams.get("subject") || "!padrenullquery";
    nodes.inputLevel.value = QueryParams.get("level") || "Any";
    nodes.inputFeeStatus.value = QueryParams.get("feestatus") || "Any";
    return true;
  };

  /*
    
     EVENTS: INPUT (!!SIDE EFFECTS!!)
    
   */

  /* 
    Filter Helper functions 
  */

  var getRegionTags = stir.curry(function (scholNation, item) {
    if (item.data.includes(scholNation)) {
      return item.tag;
    }
    return "!No findy me!";
  });
  var getInputValue = function getInputValue(input) {
    if (!input.options[input.selectedIndex].value) return "Any";
    return input.options[input.selectedIndex].value;
  };
  var getSortBy = function getSortBy(type, value) {
    if (!value) return "";
    if (type === "Faculty") {
      if (value.includes("Undergraduate")) return "ugOrderFaculty";
      if (value.includes("Postgraduate")) return "pgOrderFaculty";
    }
    if (value.includes("Undergraduate")) return "ugOrder";
    if (value.includes("Postgraduate")) return "pgOrder";
  };
  var getSubject = function getSubject(type, value) {
    if (!value) return "Any";
    if (type === "Faculty") return "";
    if (value === "!padrenullquery") return "";
    return value.toLowerCase();
  };
  var getFaculty = function getFaculty(type, value) {
    if (!value) return "Any";
    if (type === "Subject") return "";
    if (value === "!padrenullquery") return "";
    return value;
  };
  var getStudyLevel = function getStudyLevel(value) {
    if (!value) return "Any";
    if (value === "Postgraduate Taught") return "Postgraduate (taught)";
    if (value === "Postgraduate Research") return "Postgraduate (research)";
    return value;
  };

  //const getSubjectType = (value) => (value && value.length > 0 ? value : "");

  /* 
    Extract filter vars from the form and reconfig them if nec 
  */
  var getFilterVars = function getFilterVars(nodes, regionmacros) {
    var subjectType = "Subject"; // getSubjectType(nodes.inputSubject.options[nodes.inputSubject.selectedIndex].parentNode.label);

    var regionTagCurry = getRegionTags(getInputValue(nodes.inputNation));
    return {
      subjectType: subjectType,
      subject: getSubject(subjectType, getInputValue(nodes.inputSubject)),
      nation: getInputValue(nodes.inputNation),
      studyLevel: getStudyLevel(getInputValue(nodes.inputLevel)),
      feeStatus: getInputValue(nodes.inputFeeStatus),
      faculty: getFaculty(subjectType, getInputValue(nodes.inputSubject)),
      sortBy: getSortBy(subjectType, getInputValue(nodes.inputLevel)),
      regions: stir.map(regionTagCurry, regionmacros)
    };
  };

  /* 
    Main controller function  
  */
  var main = function main(setFiltersFlag, page, CONSTS, initMeta, initData) {
    if (setFiltersFlag) setFormValues(CONSTS.nodes);
    var setDOMResults = page === 1 ? setDOMContent(CONSTS.nodes.resultsArea) : appendDOMContent(CONSTS.nodes.resultsArea);
    var filterDataCurry = stir.filter(filterData(CONSTS, getFilterVars(CONSTS.nodes, CONSTS.regionmacros)));
    var mapRankCurry = stir.map(mapRank(getFilterVars(CONSTS.nodes, CONSTS.regionmacros)));
    var sortDataCurry = stir.sort(function (a, b) {
      return parseInt(a.rank) < parseInt(b.rank) ? -1 : parseInt(a.rank) > parseInt(b.rank) ? 1 : 0;
    });
    var data = stir.compose(sortDataCurry, mapRankCurry, filterDataCurry)(initData);
    var newMeta = {
      currentPage: page,
      totalPosts: data.length,
      start: (page - 1) * initMeta.postsPerPage,
      end: (page - 1) * initMeta.postsPerPage + initMeta.postsPerPage
    };
    var last = newMeta.end > newMeta.totalPosts ? newMeta.totalPosts : newMeta.end;
    var meta = stir.Object.extend({}, initMeta, newMeta, {
      last: last
    });
    var paginationFilter = stir.filter(function (schol, index) {
      return index >= meta.start && index < last;
    });
    var renderer = renderFormResults(CONSTS, meta);
    return stir.compose(setDOMResults, renderer, paginationFilter)(data);
  };

  /*
    
     FORM BASED VERSION
     ie scholarship finder
    
   */

  if (searchForm && resultsArea) {
    var initialData = stir.jsonscholarships.scholarships || [];
    if (!initialData.length) return;
    /* 
      EVENT: Submit form (Filtering form) 
    */
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var page = 1;
      main(false, page, CONSTANTS, initialMeta, initialData);
      stir.scrollToElement && stir.scrollToElement(resultsArea, 20);
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
      Pagination click controller 
    */
    var doPageClick = function doPageClick(page) {
      var params = {
        page: page
      };
      QueryParams.set(params);
      main(false, page, CONSTANTS, initialMeta, initialData);
      //stir.scrollToElement(searchForm, -40);
      return;
    };

    /* 
      EVENT: Pagination click events 
    */
    resultsArea.addEventListener("click", function (e) {
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
    }, false);

    /* 
      EVENT: Reset filters button click 
    */
    if (searchClearBtn) {
      searchClearBtn.onclick = function (e) {
        var params = {
          page: 1,
          nationality: "Any",
          subject: "!padrenullquery",
          level: "Any",
          feestatus: "Any"
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

    var page = stir.isNumeric(QueryParams.get("page")) ? QueryParams.get("page") : 1;
    main(true, page, CONSTANTS, initialMeta, initialData);
  }

  /*
   
    HARD CODED Listings
    eg on the international Pages
   
   */

  /* 
    Form the html for the listing 
  */
  var renderHardcodedResults = stir.curry(function (data) {
    return stir.map(function (el) {
      return "<li data-rank=\"".concat(el.rank, "\"><a href=\"").concat(el.scholarship.url, "\">").concat(el.scholarship.title, "</a> ").concat(debug ? el.rank : "", "</li>");
    }, data);
  });
  var renderWrapper = stir.curry(function (data) {
    return "<ul> ".concat(data.join("\n"), "</ul>");
  });

  /* 
    This version loads the data async so we need a url to the data
  */
  var jsonurl = {
    dev: "data.json",
    qa: "data.json",
    preview: "https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/29339/",
    prod: "/data/scholarships/json/index.json"
  };

  /*
    Hard coded country listing
  */

  /* 
    Extract the vars from the html element 
  */
  var getCountryListingFilters = function getCountryListingFilters(el, country, regionmacros) {
    return {
      subject: "Any",
      subjectType: "",
      nation: country,
      studyLevel: el.dataset.studylevel,
      feeStatus: "Any",
      faculty: "Any",
      sortBy: el.dataset.studylevel.includes("Postgraduate") ? "pgOrder" : "ugOrder",
      regions: stir.map(getRegionTags(country), regionmacros)
    };
  };

  /* 
    Loop the countries and get the matches for each
  */
  var getCountriesData = function getCountriesData(CONSTS, element, allData) {
    return element.dataset.country.split(", ").map(function (country) {
      var filters = getCountryListingFilters(element, country, CONSTS.regionmacros);
      var filterDataCurry = stir.filter(filterData(CONSTS, filters));
      var mapRankCurry = stir.map(mapRank(filters));
      var limitDataCurry = stir.filter(function (el) {
        return parseInt(el.rank) < 1000;
      });
      return stir.compose(limitDataCurry, mapRankCurry, filterDataCurry)(allData);
    });
  };

  /*
    On load
  */

  if (countryNodes.length) {
    stir.getJSON(jsonurl[UoS_env.name], function (initialData2) {
      if (!initialData2.length) return;
      countryNodes.forEach(function (element) {
        var setDOMResultsCurry = setDOMContent(element);
        var sortCurry = stir.sort(function (a, b) {
          return parseInt(a.rank) < parseInt(b.rank) ? -1 : parseInt(a.rank) > parseInt(b.rank) ? 1 : 0;
        });
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
  var getSubjectListingFilters = function getSubjectListingFilters(el) {
    return {
      subject: el.dataset.subject,
      subjectType: "Subject",
      nation: "Any",
      studyLevel: el.dataset.studylevel,
      feeStatus: "Any",
      faculty: "Any",
      sortBy: el.dataset.studylevel.includes("Postgraduate") ? "pgOrder" : "ugOrder",
      regions: []
    };
  };

  /*
       On load
  */

  if (subjectNodes.length) {
    stir.getJSON(jsonurl[UoS_env.name], function (initialData) {
      if (!initialData.length) return;
      subjectNodes.forEach(function (element) {
        var filters = getSubjectListingFilters(element);
        var filterDataCurry = stir.filter(filterData(CONSTANTS, filters));
        var mapRankCurry = stir.map(mapRank(filters));
        var sortCurry = stir.sort(function (a, b) {
          return parseInt(a.rank) < parseInt(b.rank) ? -1 : parseInt(a.rank) > parseInt(b.rank) ? 1 : 0;
        });
        var setDOMResultsCurry = setDOMContent(element);
        //const limitDataCurry = stir.filter((el) => parseInt(el.rank) < 1000);
        var limitDataCurry = stir.filter(function (el, index) {
          return index < 5;
        });
        return stir.compose(setDOMResultsCurry, renderWrapper, renderHardcodedResults, limitDataCurry, sortCurry, mapRankCurry, filterDataCurry)(initialData);
      });
    });
  }
})();