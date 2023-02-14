/*
 * Start dates: Populate the start date filter dynamically
 * @author: Ryan Kaye
 * @version: 2
 */
(function () {
  var filterPanel = stir.node("#filters_panel__startdate");
  if (!filterPanel) return;
  /*
   * VARS
   */

  var constants = {
    yearStartMonth: "08",
    // First month of the academic year
    yearEndMonth: "07",
    // Last month of the academic year
    switchMonth: "09" // Month to auto switch to the new year if its not specified in T4

  };
  /*
   * HELPER FUNCTIONS
   */

  /* ------------------------------------------------
   * Returns tue if input is probably a year
   * ------------------------------------------------ */

  var isYear = function isYear(input) {
    return stir.isNumeric(input) && initialStartYear.toString().length === 4 && initialStartYear.toString().slice(0, 2) === new Date().getFullYear().toString().slice(0, 2);
  };
  /* ------------------------------------------------
   * Returns an object with academic year meta data (start and end values)
   * ------------------------------------------------ */


  var getAcadYear = function getAcadYear(year, yearStartMonth, yearEndMonth) {
    return {
      year: year,
      start: parseInt(year + yearStartMonth),
      end: parseInt(year + 1 + yearEndMonth)
    };
  };
  /* ------------------------------------------------
   * Returns a list of dates that fit with an academic year
   * ------------------------------------------------ */


  var filterDatesByAcadYear = function filterDatesByAcadYear(year, data) {
    return stir.filter(function (item) {
      return parseInt(item.num) >= year.start && parseInt(item.num) < year.end;
    }, data);
  };
  /* ------------------------------------------------
   * Returns current date in the format we use for comparing (eg int 202008)
   * ------------------------------------------------ */


  var getDateAsInt = function getDateAsInt(year, month) {
    var currentMonth = String(month).length < 2 ? "0" + String(month) : String(month);
    return parseInt(String(year) + currentMonth);
  };
  /* ------------------------------------------------
   * Calclate academic start year using the supplied year
   * Academic year starts in eg Aug so not as easy as simply returning current year
   * ------------------------------------------------ */


  var getStartYear = function getStartYear(year, month, acadStartMonth, switchMonth) {
    var currentAcadYear = month < acadStartMonth ? year - 1 : year; // Are we past the switchover point?

    return month >= parseInt(switchMonth) && month < parseInt(acadStartMonth) ? currentAcadYear + 1 : currentAcadYear;
  };
  /*
   * RENDERERS
   */

  /* ------------------------------------------------
   * Forms the html for a year panel
   * ------------------------------------------------*/


  var renderYear = function renderYear(dates, meta) {
    return "\n        <fieldset>\n          <legend>".concat(String(meta.start).slice(0, 4), "/").concat(String(meta.end).slice(2, 4), " </legend>\n          ").concat(stir.join("", stir.map(renderFilter, dates)), "\n        </fieldset>");
  };
  /* ------------------------------------------------
   * Forms the html for an individual filter / date
   * ------------------------------------------------*/


  var renderFilter = function renderFilter(date) {
    return "    \n      <div class=\" c-search-filters-panel__filter\">\n        <label><input type=\"checkbox\" name=\"startdate\" value=\"".concat(date.name, "\">\n        ").concat(date.name, "\n        </label>\n      </div>");
  };
  /*
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * Output html content to the page
   * ------------------------------------------------ */


  var setDOMContent = stir.curry(function (elem, html) {
    // !!SIDE EFFECTS!!
    elem.innerHTML = html;
    return elem;
  });
  /*
   * ON LOAD: INPUT (!!SIDE EFFECTS!!)
   */

  /* Import data via T4 Globals */

  var initialStartYear = parseInt(stir.T4Globals.startyear); // T4

  var initialDates = stir.T4Globals.startdates.startdates || {}; // T4 list data

  if (!initialDates.length) return;
  /* Check start year is correctly defined */

  var startYear = isYear(initialStartYear) ? initialStartYear : getStartYear(new Date().getFullYear(), new Date().getMonth() + 1, constants.yearStartMonth, constants.switchMonth);
  /* Define the DOM elements and associated years */

  var panels = [{
    year: startYear,
    node: filterPanel.children[0]
  }, {
    year: startYear + 1,
    node: filterPanel.children[1]
  }];
  /* Define the current date in correct format eg 202104 */

  var currentDate = getDateAsInt(new Date().getFullYear(), new Date().getMonth() + 1);
  /* Get the dates data cleaned and sorted */

  var sortFn = stir.sort(function (a, b) {
    return parseInt(a.num) < parseInt(b.num) ? -1 : parseInt(a.num) > parseInt(b.num) ? 1 : 0;
  });
  var dateFilterer = stir.filter(function (date) {
    return date.num >= currentDate;
  });
  var dates = stir.compose(dateFilterer, sortFn)(initialDates);
  /*
   * Data is all set up so render it to the page
   */

  var results = stir.map(function (item) {
    if (!item.node) return;
    var yearMeta = getAcadYear(item.year, constants.yearStartMonth, constants.yearEndMonth);
    var yearDates = filterDatesByAcadYear(yearMeta, dates);
    if (!renderYear(yearDates, yearMeta).length) return item.node.classList.add("hide");
    return setDOMContent(item.node, renderYear(yearDates, yearMeta));
  }, panels);
})();
/*
 * Course search
 * @author Ryan Kaye <ryan.kaye@stir.ac.uk>, Robert Morrison <r.w.morrison@stir.ac.uk>
 * Undergraduate, taught postgraduate and CPD (modules).
 * Keyword search-results are pulled from Funnelback, then filtered here in JavaScript.
 */


(function () {
  var debug = window.location.hostname.indexOf("stir.ac.uk") === -1 ? true : false;
  var FB_SERVER = debug ? 'stage-shared-15-24-search.clients.uk.funnelback.com' : 'search.stir.ac.uk';
  var searchUrl = "https://".concat(FB_SERVER, "/s/search.json?");
  var form = document.querySelector("form#course-search");
  var hidden = form.querySelectorAll('input[type="hidden"]');
  var searchInput = form.querySelector("#course-search__query");
  var filterTags = form.querySelector("#search-ordered-filters");
  var filterMenu = form.querySelector("#filters-menu");
  var filterBox = form.querySelector("#search__filters");
  var filters = filterBox ? filterBox.querySelectorAll("input[type=checkbox]") : [];
  var subjectSelect = form.querySelector('[name="subject"]');
  var isLive = window.location.hostname === "www.stir.ac.uk";
  var isPreview = window.location.hostname === "t4cms.stir.ac.uk";
  var searchLoading = document.getElementById("course-search__loading");
  var resultsArea = document.getElementById("course-search__results");
  var resultSummary = document.getElementById("course-search__summary");
  var resultFooter = document.createElement("div");
  var subjClearBtn = document.getElementById("btnClearSubs");
  var altSearchUrl = "",
      altSearch = document.createElement("p");
  var index = new stir.indexBoard(document.querySelector("#search-letters__links"));
  var DEFAULT_QUERY = "!padrenullquery";
  var query = DEFAULT_QUERY;
  var level = "";
  var faculty = "";
  var method = "";
  var startdate = "";
  var subject = "";
  var letter = "";
  var comboLinkData;
  var needComboLinks = true;
  var cachedResults; // object to hold the search config data with default values

  var parameters = {
    query: query,
    start_rank: 1,
    sort: ""
  };
  var strings = {
    cpd: {
      description: "Continuing Professional Development (CPD) module. Enrol now to gain new skills and up-to-date knowledge for your career development."
    }
  };

  var search = function search() {
    parameters.sort = query.charAt(0) === "!" ? "title" : ""; // sort by title for negated-query searches (e.g. !padrenullquery)

    stir.getJSON(searchUrl + stir.Concierge.prototype.obj2param(parameters), parseJSON);
  };
  /*
   * Function: Configure the search depending on params and then query FunnelBack
   */


  function doSearch() {
    if (needComboLinks) {
      if (!comboLinkData) {
        var _stir, _stir$t4Globals, _stir$t4Globals$searc;

        var urls = {
          dev: "combo-links.json",
          qa: "combo-links.json",
          preview: ((_stir = stir) === null || _stir === void 0 ? void 0 : (_stir$t4Globals = _stir.t4Globals) === null || _stir$t4Globals === void 0 ? void 0 : (_stir$t4Globals$searc = _stir$t4Globals.search) === null || _stir$t4Globals$searc === void 0 ? void 0 : _stir$t4Globals$searc.comboLinks) || "",
          prod: "https://www.stir.ac.uk/media/stirling/feeds/combo-links.json"
        };
        debug && console.info("[Search] Getting combo data for ".concat(UoS_env.name, " environment (").concat(urls[UoS_env.name], ")"));
        stir.getJSON(urls[UoS_env.name], function (data) {
          comboLinkData = data && !data.error ? data.slice(0, -1) : [];
          search();
        });
      } else {
        search();
      }
    } else {
      search();
    }
  }
  /*
   * Function: Config the data returned
   */


  function parseJSON(data) {
    if (!data.error) {
      cachedResults = data;
      searchLoading.style.display = "none";
      resultsArea.innerHTML = formResultHTML(cachedResults); // show filters now we have results outputted

      filterTags && filterTags.classList.add("stir__slidedown");
      filterBox && filterBox.classList.add("stir__slidedown");
      index.show();
      stir.scrollToElement(form, -40);
    } else {
      resultsArea.appendChild(stir.getMaintenanceMsg());
      searchLoading.style.display = "none";
      console.error(data.error);
    }
  }
  /*
   * Takes two comma separated lists and compares them.
   * Returns true if there's at least one common element among them.
   * @param {*} a
   * @param {*} b
   */


  function matchCSV(a, b) {
    if (!a || !b) return false; //first, replace 'comma-space' with just a comma, using split/join trick:

    a = a.split(", ").join(",");
    b = b.split(", ").join(",");
    var array = a.split(",");

    for (var i = 0; i < array.length; i++) {
      if (b.split(",").indexOf(array[i]) >= 0) {
        return true;
      }
    }

    return false;
  }

  function renderBestBet(title, link, description) {
    return ['<div class="small-12 large-9 cell c-clearing-list-item" data-sid="">', '<p class="c-clearing-list-item__link"><a href="' + link + '">' + title + "</a></p>", '<p class="c-clearing-list-item__summary">' + description + "</p>", "</div>"].join("");
  }

  function renderResult(id, link, description, provider) {
    return ["<div class=\"small-12 large-9 cell c-clearing-list-item\" data-sid=\"".concat(id, "\" data-provider=\"").concat(provider.indexOf("Forth Valley") >= 0 ? "FV" : "", "\">"), "<p class=\"c-clearing-list-item__link\"><strong>".concat(link, "</strong></p>"), "<p class=\"c-clearing-list-item__summary\">".concat(description, "</p>"), "</div>"].join("");
  }

  var renderTag = function () {
    var dictionary = {
      module: "CPD module"
    };
    return function renderTag(name, value, label) {
      return '<button class="is-active" data-filter-name="' + name + '" data-filter-value="' + value + '">' + (label in dictionary ? dictionary[label] : label) + " ×</button>";
    };
  }();

  function anchor(text, href) {
    return '<a href="' + href + '">' + text + "</a>";
  }

  function courseTitle(qualification, title, applycode, comboData, link) {
    if (!comboData) return anchor(qualification + title + applycode, link);
    comboData = JSON.parse(comboData);

    if (comboData.length == 1) {
      return qualification + anchor(title, link) + " and " + anchor(comboData[0].title, comboData[0].link) + applycode;
    }

    if (comboData.length == 2) {
      return qualification + anchor(title, link) + ", " + anchor(comboData[0].title, comboData[0].link) + " and " + anchor(comboData[1].title, comboData[1].link) + applycode;
    }

    return anchor(qualification + title + applycode, link); // default; same as if no combodata.
  }
  /*
   * Function: Form the html for results
   */


  var formResultHTML = function formResultHTML(data) {
    var html = [];
    var results = data.response.resultPacket.results;
    var bestbets = data.response.curator.exhibits;
    var show; // boolean flag: show the result?

    var summaryText, queryQuote, punctuation; // text strings for display

    var awards = /BSc |BAcc |BA |\(Hons\) ?\/? ?/g;
    index.reset(); // Best Bets (a.k.a Curators)

    for (var i = 0; i < bestbets.length; i++) {
      if (bestbets[i].titleHtml) {
        if (!letter || bestbets[i].titleHtml.charAt(0) !== letter) {
          html.push(renderBestBet(bestbets[i].titleHtml, bestbets[i].linkUrl, bestbets[i].descriptionHtml));
        }
      }
    } // now loop through the main results


    for (var i = 0; i < results.length; i++) {
      var result = results[i];

      if (result.displayUrl) {
        show = true;

        if (level) {
          show = matchCSV(level, (result.metaData.level || result.metaData.type || "").replace(" (taught)", ""), true);
        }

        if (show && method) {
          show = matchCSV(method, result.metaData.M);
        }

        if (show && faculty) {
          show = matchCSV(faculty, (result.metaData.A || "").replace("Faculty of ", ""));
        }

        if (show && startdate) {
          show = matchCSV(startdate, result.metaData.sdt);
        }

        if (show && subject) {
          show = matchCSV(subject, result.metaData.subject);
        } // this is the correct time to calculate if the letter is avail or not
        // as the filters have been checked (except letter filter).


        if (show) index.enable(result.title.charAt(0));

        if (letter) {
          if (result.title.charAt(0) !== letter) {
            show = false;
          }
        } // Output the result if it satisfied all filter criteria


        if (show) {
          var title;
          var isCPD = result.metaData["type"] && result.metaData["type"] == "module" ? true : false;
          var qualification = result.metaData.award ? result.metaData.award + " " : "";
          var applycode = result.metaData.ucas ? " - " + result.metaData.ucas : "";
          var description = result.metaData.c || (isCPD ? strings.cpd.description : "");
          var link = "https://".concat(FB_SERVER).concat(result.clickTrackingUrl); //result.liveUrl;

          var id = result.metaData.sid || "";
          var provider = result.metaData.provider || "";
          if (isPreview) link = "https://t4cms.stir.ac.uk/terminalfour/preview/1/en/" + id;

          if (result.collection && result.collection === 'stir-combos') {
            var combo = comboLinkData.filter(function (combo) {
              return combo.sid === parseInt(result.metaData.sid);
            });
            title = "".concat(qualification, " ").concat(combo[0].courses.map(function (combo) {
              return "<a href=\"".concat(combo.url, "\" title=\"").concat(combo.text, "\">").concat(combo.text.replace(awards, ''), "</a>");
            }).join(' and '), " ").concat(applycode);
            description = description || '';
          } else {
            title = "".concat(qualification, " ").concat(courseTitle('', result.title, '', result.metaData.combo, link), " ").concat(applycode);
          }

          html.push(renderResult(id, title, description, provider));
        }
      }
    }

    summaryText = (html.length > 0 ? "Showing <strong>" + html.length.toString() : "<strong>No ") + " results</strong>";
    queryQuote = query.charAt(0) === "!" || !query ? "" : " for &ldquo;" + stir.String.stripHtml(query) + "&rdquo;";
    punctuation = html.length > 0 ? ":" : ".";
    resultSummary.innerHTML = "<p>" + summaryText + queryQuote + punctuation + "</p>";

    if (query && DEFAULT_QUERY !== query) {
      altSearchUrl = "https://www.stir.ac.uk/search/?query=" + encodeURI(query);
      altSearch.innerHTML = 'Not looking for a course? <a href="' + altSearchUrl + '" class="c-link" id="course-search-to-main">Search the rest of the website for &ldquo;' + stir.String.stripHtml(query) + "&rdquo;</a>";
    }

    index.update();
    return '<div class="grid-x">' + html.join("\n") + "</div>";
  };
  /*
   * Function: Reset the search
   */


  var reset = function reset() {
    resultSummary.innerHTML = "";
    resultsArea.innerHTML = "";
    altSearch.innerHTML = "";
    searchLoading.style.display = "block";
    if (searchInput) searchInput.value = query;
    if (query === DEFAULT_QUERY) if (searchInput) searchInput.value = "";
  };
  /*
   * Function: Filter Checkbox Click Events
   */


  var doCheckBoxFilterChange = function doCheckBoxFilterChange(e) {
    var filter = {
      level: [],
      method: [],
      faculty: [],
      startdate: []
    };
    letter = "";

    for (var i = 0; i < filters.length; i++) {
      if (filters[i].name && filters[i].value && filters[i].checked) filter[filters[i].name].push(filters[i].value);
    }

    level = filter.level.join(",");
    method = filter.method.join(",");
    faculty = filter.faculty.join(",");
    startdate = filter.startdate.join(",");
    QueryParams.set("filter__level", level);
    QueryParams.set("filter__method", method);
    QueryParams.set("filter__faculty", faculty);
    QueryParams.set("filter__startdate", startdate);
    filterTags && updateCheckboxFilters();
    resultsArea.innerHTML = formResultHTML(cachedResults);
  };
  /*
   * Function: Update checkboxes based on QueryString params
   */


  var updateCheckboxFilters = function updateCheckboxFilters() {
    if (!filterTags) return;
    var tags = [];
    filterTags.innerHTML = "";

    for (var i = 0; i < filters.length; i++) {
      if (level.indexOf(filters[i].value) >= 0) {
        filters[i].checked = true;
        tags.push(renderTag("level", filters[i].value, filters[i].value));
      } else if (method.split(",").indexOf(filters[i].value) >= 0) {
        filters[i].checked = true;
        tags.push(renderTag("method", filters[i].value, filters[i].value));
      } else if (faculty.indexOf(filters[i].value) >= 0) {
        filters[i].checked = true;
        tags.push(renderTag("faculty", filters[i].value, filters[i].value));
      } else if (startdate.indexOf(filters[i].value) >= 0) {
        filters[i].checked = true;
        tags.push(renderTag("startdate", filters[i].value, filters[i].value));
      }
    }

    filterTags.innerHTML = tags.join(" ");
  };
  /*
   * Function: Hides the filters
   */


  var hideFilters = function hideFilters() {
    if (filterTags) {
      filterTags.classList.add("stir__slideup");
      filterTags.classList.remove("stir__slidedown");
    }

    if (filterBox) {
      filterBox.classList.add("stir__slideup");
      filterBox.classList.remove("stir__slidedown");
    }

    index.hide();
  };
  /*
   * Function: Form Submission
   */


  form.addEventListener("submit", function (e) {
    e.preventDefault();
    query = searchInput.value;

    if (query) {
      QueryParams.set("query", query);
      parameters.query = query;
    } else {
      QueryParams.remove("query");
      parameters.query = DEFAULT_QUERY;
    }

    hideFilters();
    reset();
    doSearch();
    if (subjectSelect) subjectSelect.value = "";
  });
  /*
   * Function: Filter Selector Menu Click Events
   */

  if (document.querySelector("#search-letters__links")) {
    document.querySelector("#search-letters__links").addEventListener("click", function (e) {
      if (!e.target.dataset.disabled) {
        if (e.target.dataset.letter === letter) {
          letter = "";
        } else {
          letter = e.target.dataset.letter;
        }

        resultsArea.innerHTML = formResultHTML(cachedResults);
      }

      e.preventDefault();
    });
  }
  /*
   * Function: Filter Selector Menu Click Events
   */


  filterMenu && filterMenu.addEventListener("click", function (e) {
    var panels = document.getElementsByClassName("c-search-filters-panel");
    this.querySelectorAll(".is-active").forEach(function (category) {
      category.classList.remove("is-active");
    });
    e.target.classList.add("is-active"); // hide all panels

    for (var i = 0; i < panels.length; i++) {
      panels[i].style.display = "none";
    } // show only the selected panel


    if (e.target.hasAttribute("data-menu-id")) {
      var panel = document.getElementById(e.target.getAttribute("data-menu-id"));
      panel && (panel.style.display = "flex");
    }

    e.preventDefault();
  });
  /*
   * Handle clicks events on Filter Tags:
   */

  if (filterTags) {
    filterTags.addEventListener("click", function (e) {
      // detach tag element (but ignore clicks on `this` so we don't detatch the whole thing!)
      if (e.target && e.target !== this) e.target.parentNode.removeChild(e.target);
      var name = e.target.hasAttribute("data-filter-name") ? e.target.getAttribute("data-filter-name") : undefined;
      var value = e.target.hasAttribute("data-filter-value") ? e.target.getAttribute("data-filter-value") : undefined;

      for (var i = 0; i < filters.length; i++) {
        if (filters[i].name === name && filters[i].value === value) {
          filters[i].checked = false;
        }
      }

      doCheckBoxFilterChange(e);
    });
  }
  /*
   * Event: Letter filter Btn click
   */


  var letterBtn = document.querySelector(".c-search-letters__toggle-link");
  if (letterBtn) letterBtn.addEventListener("click", letterBtnClick);

  function letterBtnClick(e) {
    var letterNav = document.querySelector("#search-letters__links");
    letterNav.classList.toggle("show-for-medium");
    e.preventDefault();
  }
  /*
   * Function: Populates the select
   */


  function addSelectOptions(el, options) {
    if (!el || !options) return;
    options.sort(function (a, b) {
      return a.name > b.name;
    });

    for (var i = 0; i < options.length; i++) {
      el.appendChild(new Option(options[i].name, options[i].value));
    }
  }
  /*
   * Function: Filter Selector Menu Click Events
   */


  subjClearBtn && subjClearBtn.addEventListener("click", function (e) {
    subjectSelect.value = "";
    subject = "";
    reset();
    doSearch();
    e.preventDefault();
  });
  /*
   * Functions and variables defined above. Procedures start from here…
   *
   *
   *
   * */
  // Set up HTML containers etc.

  resultFooter.setAttribute("class", "course-search__footer");
  resultsArea.insertAdjacentElement("afterend", resultFooter);
  resultFooter.appendChild(altSearch); //getHiddenInputs

  for (var i = 0; i < hidden.length; i++) {
    parameters[hidden[i].name] = hidden[i].value;
  } // hide the filters not needed at load time


  (function (elementsToHide) {
    for (var i = 0; i < elementsToHide.length; i++) {
      var el = document.getElementById(elementsToHide[i]);
      if (el) el.style.display = "none";
    }
  })(["filters_panel__method", "filters_panel__faculty", "filters_panel__startdate"]);

  hideFilters(); // add a delegate to listen for any checkbox changes

  filterBox && filterBox.addEventListener("change", doCheckBoxFilterChange); // Get QueryString params

  if (QueryParams.get("query")) query = QueryParams.get("query");
  if (QueryParams.get("filter__level")) level = QueryParams.get("filter__level");
  if (QueryParams.get("filter__method")) method = QueryParams.get("filter__method");
  if (QueryParams.get("filter__faculty")) faculty = QueryParams.get("filter__faculty");
  if (QueryParams.get("filter__startdate")) startdate = QueryParams.get("filter__startdate"); // if no level set - set up as both to avoid confusion

  if (level === "") {
    var levelValues = [];
    var filtersEnabled = filterBox ? Array.prototype.slice.call(filterBox.querySelectorAll('input[type=checkbox][name="level"]:not([disabled])')) : [];
    filtersEnabled.forEach(function (item) {
      levelValues.push(item.value);
    });
    level = levelValues.join(",");
    QueryParams.set("filter__level", level);
  }

  updateCheckboxFilters();

  if (subjectSelect) {
    var url = "https://www.stir.ac.uk/data/subjects/index.js";

    switch (window.location.hostname) {
      case "localhost":
        url = "subjects.js";
        break;

      case "mediadev.stir.ac.uk":
        url = "subjects.js";
        break;

      case "t4cms.stir.ac.uk":
        url = "https://t4cms.stir.ac.uk/terminalfour/preview/1/en/24197";
        break;

      default:
        break;
    }

    stir.getJSON(url, function (options) {
      if (!options || !options.subjects) return;
      addSelectOptions(subjectSelect, options.subjects);
      subjectSelect.addEventListener("change", function () {
        subject = this.value;
        resultsArea.innerHTML = formResultHTML(cachedResults);
        if (subject !== "") resultSummary.innerHTML = '<p>Showing results for subject "' + subject + '"</p>';else resultSummary.innerHTML = "<p>Showing results for all subjects </p>";
        searchInput.value = "";
        stir.scrollToElement(subjectSelect);
      });
    });
  } // fetch the data


  parameters.query = query;
  reset();
  doSearch();
})();