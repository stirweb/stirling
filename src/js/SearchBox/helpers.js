/**
 * Search box helpers
 * These are just to aid html generation
 */
var SearchBoxViewHelpers = (function () {
  /**
   * Generate param string e.g. q=arts&group=internal
   * @param {Array} parameters
   */
  var _encodeURIParameters = function (parameters) {
    var str = [];
    for (var p in parameters) {
      if (parameters.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(parameters[p]));
      }
    }
    return str.join("&");
  };

  /**
   * In the header search, we don't bother about news and course search whether
   * we are in external/internal/etc. But, for suggest we only want suggestions
   * for the correct area, and we want the suggest link to have the correct params
   * This function is used by datasets.suggestions.request.url and suggestion links
   * @param {string} base_url e.g. /internal-staff/search
   * @param {string} type e.g. staff
   */
  var _generateSuggestUrlBySubgroup = function (base_url, subgroup) {
    var params = {
      collection: "external",
    };

    switch (subgroup) {
      case "staff":
        params = $.extend(
          {
            // search all (use checkboxes to filter)
            // ...
          },
          params
        );
        break;
      case "students":
        params = $.extend(
          {
            // only include students (no staff or external)
            meta_subgroup_and: "student",
          },
          params
        );
        break;
      default: // e.g. external
        params = $.extend(
          {
            // don't include internal (staff or students)
            meta_group_not: "internal",
          },
          params
        );
    }

    // check base_url for existing params. This isn't perfect, but should work if
    // url is neat (e.g. "search.html?" or "search.html?q=arts&" are not neat)
    return base_url + (base_url.indexOf("?") > -1 ? "&" : "?") + _encodeURIParameters(params);
  };

  var _getPaginationInfo = function (options, results_length) {
    if (!options) options = {};

    // set defaults
    options = $.extend(
      {
        // default page and limit
        page: parseInt(QueryParams.get("page", 1)),
        limit: parseInt(QueryParams.get("limit", 10)),

        // this is the number of links to render when we show pagination page
        // links. It can be overwritten wherever used.
        max_page_links_to_display: 10,
      },
      options
    );

    // caluclate start from page and limit
    options.start = options.page * options.limit - options.limit;

    if (typeof results_length !== "undefined") {
      options.total_results = results_length;
      options.total_pages = Math.ceil(results_length / options.limit);
    }

    return options;
  };

  // html generators

  /**
   * Will do a for loop for us but hide away all the mess.
   * @param results {array} In format [{..}, {..}, {..}, ..]
   * @param pageInfo {object} In format {start: .. , limit: .. , page .. }
   * @param handler {function} Will process each result e.g. function(result) {..}
   */
  var _paginateResults = function (results, pageInfo, handler) {
    for (var i = pageInfo.start; i < pageInfo.start + results.slice(pageInfo.start, pageInfo.start + pageInfo.limit).length; i++) {
      handler(results[i], i);
    }
  };

  /**
   * Will do a for loop for us but hide away all the mess.
   * @param results {array} In format [{..}, {..}, {..}, ..]
   * @param pageInfo {object} In format {start: .. , limit: .. , page .. }
   * @param query_string {string} The query used in the search
   * @param num_ranks {integer} The max results the api will return
   */
  var _generatePaginationInfo = function (results, pageInfo, query_string, num_ranks) {
    /**
     * catch inverse (logical NOT) queries and hide them
     */
    if (!query_string || query_string.match(/^!|\|\[/)) {
      query_string = "";
    }

    var start = pageInfo.start + 1;
    var end = pageInfo.start + pageInfo.limit;
    var keywords = query_string ? " for " + stir.String.stripHtml(query_string) : "";
    var total = (results.length >= num_ranks ? "first " : "") + results.length.toString();

    if (end > results.length) end = results.length;

    if (!num_ranks) {
      num_ranks = 10000000; // insanely high that it'll never be required
    }

    return "<p>Showing " + start + "–" + end + ' of <span class="u-font-bold">' + total + " results" + keywords + "</span></p>";
  };

  /**
   * Generate only the html for pagination but don't apply any behaviour yet
   */
  var _generatePaginationLinksHTML = function (pageInfo, results) {
    var total_pages = Math.ceil(results.length / pageInfo.limit);
    var page = pageInfo.page;

    var html = [];

    html.push("<hr>");
    html.push('<div class="grid-x grid-padding-x">');
    html.push('<div class="small-3 medium-3 cell">');
    if (pageInfo.page - 1 > 0) {
      html.push('    <a href="#" class="button small no-arrow heritage-green" aria-label="Previous page" data-page="' + (page - 1) + '"><span class="uos-chevron-left"></span> <span class="show-for-medium">Previous <span class="show-for-sr">page</span></span></a>');
    } else {
      html.push('    <span class="button small no-arrow disabled"><span class="uos-chevron-left"></span> <span class="show-for-medium">Previous <span class="show-for-sr">page</span></span></span>');
    }
    html.push("</div>");

    html.push('<div class="small-6 medium-6 cell text-center u-font-bold">');

    // if we have too many pages we have to crop them and be aware of the current
    // page and try to put that in the middle.
    // var pagination__total_pages = total_pages;
    var pagination__max_pages_to_display = total_pages < pageInfo.max_page_links_to_display ? total_pages : pageInfo.max_page_links_to_display;
    var pagination__start_page = 1;
    var pagination__end_page = pagination__start_page + (pagination__max_pages_to_display - 1); // 1 + (10-1) = 10

    // if total_pages is larger that the max we'll display we have to calculate
    // the first page to show, and the last one, and put current page in the middle (maybe)
    if (total_pages > pagination__max_pages_to_display) {
      // if we pass the half way mark, we wanna change the start and end links
      var pagination__halfway = pagination__max_pages_to_display / 2;
      if (page > pagination__halfway) {
        // start should never be less than 1
        pagination__start_page = page - Math.floor(pagination__halfway);
        if (pagination__start_page < 1) {
          pagination__start_page = 1;
        }

        // calculate the end page value: 1 + (10-1) = 10
        pagination__end_page = pagination__start_page + (pagination__max_pages_to_display - 1);
        if (pagination__end_page > total_pages) {
          pagination__end_page = total_pages;
        }

        // now, if start to end is less that max, we'll re-calculate start so we always have max pages showing
        // e.g. when on last page we want a trail behind it: 4,5,6,7,8,9,10,11,12,*13*
        if (pagination__end_page - (pagination__start_page - 1) < pagination__max_pages_to_display) {
          pagination__start_page = pagination__end_page - pagination__max_pages_to_display + 1;
        }
      }
    }

    // large links
    html.push('<ul class="pagination show-for-large" role="navigation" aria-label="Pagination">');
    for (var p = pagination__start_page; p <= pagination__end_page; p++) {
      if (p === page) {
        html.push('    <li class="current"><span class="show-for-sr">You\'re on page</span> ' + p + "</li>");
      } else {
        html.push('    <li><a href="#" aria-label="Page ' + p + '" data-page="' + p + '">' + p + "</a></li>");
      }
    }
    html.push("</ul>");

    // medium down info
    html.push('  <p class="hide-for-large">Page ' + pageInfo.page + " of " + total_pages + "</p>");

    html.push("</div>");

    html.push('<div class="small-3 medium-3 cell text-right">');
    if (pageInfo.page + 1 > total_pages) {
      html.push('    <span class="button no-arrow disabled"><span class="show-for-medium">Next <span class="show-for-sr">page</span></span> <span class="uos-chevron-right"></span></span>');
    } else {
      html.push('    <a href="#" class="button small no-arrow heritage-green" aria-label="Next page" data-page="' + (pageInfo.page + 1) + '"><span class="show-for-medium">Next <span class="show-for-sr">page</span></span> <span class="uos-chevron-right"></span></a></li>');
    }
    html.push("</div>");
    html.push("</div>");

    return html.join("\n");
  };

  /**
   *
   */
  var _generatePaginationLinks = function ($results, data, results, pageInfo, dataset, options, searchBox) {
    var total_pages = Math.ceil(results.length / pageInfo.limit);
    var link_action = function (e) {
      var page = this.getAttribute("data-page");

      searchBox.trigger("custom:paginating");
      QueryParams.set("page", page);
      dataset.renderer(data, options);
      searchBox.trigger("custom:paginated");

      // scroll back to the top. 120 is a sufficent offset as it is double padding
      $("html,body").animate({ scrollTop: $results.position().top - 120 });

      e.preventDefault();
      return false;
    };

    html = [];

    html.push(_generatePaginationLinksHTML(pageInfo, results));

    var $pagination = $(html.join(""));

    $pagination.find("a").on("click", link_action);

    $results.append($pagination);

    // TODO MB course-search__pagination-links???? Why? I think this is old and can be removed
    //   surely link_action is used instead
    $(".course-search__pagination-links a", $results).on("click", function (e) {
      QueryParams.set("page", $(this).data("page"));
      options.datasets.results.renderer(data, options);
      e.preventDefault();
      return false;
    });

    if (total_pages > 1) {
      $(".course-search__pagination-links").show();
    } else {
      $(".course-search__pagination-links").hide();
    }
  };

  /**
   * Will populate with empty filters where they are present when no filters are
   * applied. For example, will put back in for displaying "Undergraduate (0)"
   * @param searchBox {searchBox}
   * @param data {object} Unfiltered data so we can find out the empty filters
   * @param results {object} Filtered results
   * @param filters {object} dataset.filters
   */
  var _getFiltersDataWithEmptyFilters = function (searchBox, data, results, filters) {
    var filters_data = searchBox.getAvailableFilters(results, filters);

    // we'll loop through the unfiltered and populate filters_data with any
    // missing, assuming they are missing as zero
    var unfiltered_filters_data = searchBox.getAvailableFilters(data, filters);
    for (var filterName in unfiltered_filters_data) {
      for (var filterValue in unfiltered_filters_data[filterName]) {
        // create the filter name object first if it does't exist
        if (typeof filters_data[filterName] == "undefined") {
          filters_data[filterName] = {};
        }

        // now create the filter value with a zero if it doesn't exist
        if (typeof filters_data[filterName][filterValue] == "undefined") {
          filters_data[filterName][filterValue] = 0;
        }
      }
    }

    return filters_data;
  };

  var searchLettersLinksVizClass = "show-for-medium";

  /**
   * Will populate with empty filters where they are present when no filters are
   * applied. For example, will put back in for displaying "Undergraduate (0)"
   * used together with registerSearchLettersEventHandlers
   * @see registerSearchLettersEventHandlers
   * @param searchBox {searchBox}
   * @param filters_data {object}
   */
  var _generateSearchLettersHTMLOnly = function (searchBox, filters_data) {
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    var html = [];
    var resultsCount;

    html.push('    <div class="hide-for-medium"><a href="#" class="c-search-letters__toggle-link" id="search-letters__toggle-link">Filter by letter</a></div>');
    html.push('    <ul class="c-search-letters ' + searchLettersLinksVizClass + '" id="search-letters__links">');
    for (var i = 0; i < letters.length; i++) {
      resultsCount = filters_data["starts_with"][letters[i]];

      // if starts_with filter is active, then the styling will be
      // something like: unavailable letters, disabled; non-selected
      // but available letters, normal; selected letter, highlighted
      if (searchBox.active_filters.has("starts_with")) {
        if (resultsCount > 0) {
          html.push('<li class="c-search-letters__box"><a href="#" data-letter="' + letters[i] + '" class="c-search-letters__link--is-active">' + letters[i] + "</a></li>");
        } else if (resultsCount === 0) {
          //
          html.push('<li class="c-search-letters__box"><a href="#" data-letter="' + letters[i] + '">' + letters[i] + "</a></li>");
        } else {
          // undefined
          html.push('<li class="c-search-letters__box"><a href="#" data-letter="' + letters[i] + '" data-disabled>' + letters[i] + "</a></li>");
        }
      } else {
        if (resultsCount > 0) {
          html.push('<li class="c-search-letters__box"><a href="#" data-letter="' + letters[i] + '">' + letters[i] + "</a></li>");
        } else {
          // undefined
          html.push('<li class="c-search-letters__box"><a href="#" data-letter="' + letters[i] + '" data-disabled>' + letters[i] + "</a></li>");
        }
      }
    }
    html.push("    </ul>");

    return html.join("\n");
  };

  /**
   * this will register click event behaviour after the html has been generated
   * used together with generateSearchLettersHTMLOnly
   * @see generateSearchLettersHTMLOnly
   * @param searchBox {SearchBox}
   */
  var _registerSearchLettersEventHandlers = function (searchBox, data, options) {
    $("#search-letters__toggle-link").on("click", function (e) {
      // toggle link class
      $(this).toggleClass("c-search-letters__toggle-link--is-active");

      // toggle links list class
      $("#search-letters__links").toggleClass(searchLettersLinksVizClass);

      e.preventDefault();
      return false;
    });

    // assign behaviour to the newly created letter links
    $(".c-search-letters__box a").on("click", function (e) {
      // if the button is disabled, we'll escape here
      if (this.hasAttribute("data-disabled")) {
        e.preventDefault();
        return false;
      }

      var this_letter = $(this).data("letter");

      if (searchBox.active_filters.has("starts_with", this_letter)) {
        searchBox.active_filters.remove("starts_with");
      } else {
        // remove the currently selected letter so we can select this one
        if (searchBox.active_filters.has("starts_with")) {
          searchBox.active_filters.remove("starts_with");
        }

        searchBox.active_filters.add("starts_with", this_letter);
      }

      // re-render the countries
      searchBox.options.datasets.results.renderer(data, options);

      e.preventDefault();
      return false;
    });
  };

  var activeFilterId = null; //null;
  var $wrapper = $("#search__filters");

  // this is a flag to tell us that this is the first time we've been called to
  // do this, from here on this will be false;
  var isFirstRunFilterLinks = true;

  /**
   * Generate filter links for slide up/down and ordered filter links
   * @param searchBox {searchBox}
   * @param data {object} Data passed into renderer
   * @param filters_data {object} Result from searchBox.getAvailableFilters
   * @see course-search.html
   */
  var _generateFilterLinks = function (searchBox, data, results, filters, defaultActiveFilterId) {
    // set the default active filter if none given
    // don't bother with a default filter if not the first run coz that looks a
    // wee tad strange
    if (defaultActiveFilterId && isFirstRunFilterLinks && !activeFilterId) {
      activeFilterId = defaultActiveFilterId;
    }

    // var filters_data = searchBox.getAvailableFilters(results, filters);
    //
    // // we'll loop through the unfiltered and populate filters_data with any
    // // missing, assuming they are missing as zero
    // var unfiltered_filters_data = searchBox.getAvailableFilters(data, filters);
    // for (var filterName in unfiltered_filters_data) {
    //     for (var filterValue in unfiltered_filters_data[filterName]) {
    //
    //         // create the filter name object first if it does't exist
    //         if (typeof filters_data[filterName] == "undefined") {
    //             filters_data[filterName] = {};
    //         }
    //
    //         // now create the filter value with a zero if it doesn't exist
    //         if (typeof filters_data[filterName][filterValue] == "undefined") {
    //             filters_data[filterName][filterValue] = 0;
    //         }
    //     }
    // }
    var filters_data = _getFiltersDataWithEmptyFilters(searchBox, data, results, filters);

    // we need to sort filters into order again coz we've added new ones
    var filters_data__sorted = {};
    Object.keys(filters_data).forEach(function (name) {
      // sorted filters is the order we'll output
      filters_data__sorted[name] = {};

      //
      Object.keys(filters_data[name])
        .sort()
        .forEach(function (key) {
          filters_data__sorted[name][key] = filters_data[name][key];
        });
    });
    filters_data = filters_data__sorted;

    var menu_html = [];
    var panels_html = {}; // level, method, etc
    var showFilters = false; // will set to true when in the loop

    // as we'll be appending, we don't want old stuff
    $("#search__filters").html("");

    // this method is required for both ordered_filters and
    // each filter panel's links
    var filter_link_click = function (e) {
      // if this label is disabled, exit
      if (this.hasAttribute("data-disabled")) {
        e.preventDefault();
        return false;
      }

      // update the style of this filter (active, or not)
      $(this).toggleClass("is-active");

      // do action require for new status

      var filterName = $(this).data("filter-name");
      var filterValue = $(this).data("filter-value");

      if ($(this).hasClass("is-active")) {
        // add the filter to the container
        searchBox.active_filters.add(filterName, filterValue);
      } else {
        // remove the filter from the container
        searchBox.active_filters.remove(filterName, filterValue);
      }

      // we wannna re-render the results as we've changed
      // filters
      QueryParams.set("page", 1);
      searchBox.options.datasets.results.renderer(data, searchBox.options);

      e.preventDefault();
      return false;
    };

    // BUILD FILTERS MENU AND SLIDE UP/DOWN TABS

    var panels_wrapper_html = [];

    panels_wrapper_html.push('<div class="u-bg-grey--dark">');
    panels_wrapper_html.push('  <div class="grid-container">');
    panels_wrapper_html.push('    <div class="grid-x grid-padding-x">');
    panels_wrapper_html.push('      <div class="cell small-12 medium-12">');

    // using filters_data, we'll build up ALL available filters. We'll use the
    // has(name, value) method to determine whether active_filters has a given
    // filter already coz we wanna style it as such
    Object.keys(filters_data).forEach(function (name) {
      panels_html[name] = [];

      // build menu html
      menu_html.push('<li><a href="#" data-menu-id="filters_panel__' + name + '">' + name.charAt(0).toUpperCase() + name.slice(1) + "</a></li>");

      // just to tidy up the html building below..
      var isNotZero;

      // build html for menu and links panel from filters object
      panels_html[name].push('<div class="grid-x c-search-filters-panel" id="filters_panel__' + name + '">');
      for (var value in filters_data[name]) {
        // if we enter inside this loop then we know that there are filters
        showFilters = true;

        isNotZero = filters_data[name][value] > 0;

        if (value !== "BEST_BETS") {
          // build panel html
          panels_html[name].push('<div class="small-12 medium-4 large-3 cell c-search-filters-panel__filter">');
          panels_html[name].push('  <label data-filter-name="' + name + '" data-filter-value="' + value + '" class="' + (searchBox.active_filters.has(name, value) ? "is-active" : "") + '"' + (isNotZero ? "" : " data-disabled") + '><input type="checkbox" ' + (searchBox.active_filters.has(name, value) ? "checked" : "") + (isNotZero ? "" : " disabled") + "> " + value + " (" + filters_data[name][value] + ")</label>");
          panels_html[name].push("</div>");
        }
      }
      panels_html[name].push("</div>");

      panels_wrapper_html.push(panels_html[name].join(""));
    });
    $("#filters-menu").html(menu_html.join(""));
    if (!showFilters) $("#filters-menu").hide();

    panels_wrapper_html.push("      </div>");
    panels_wrapper_html.push("    </div>");
    panels_wrapper_html.push("  </div>");
    panels_wrapper_html.push("</div>");

    $("#search__filters").html(panels_wrapper_html.join(""));

    // BUILD ORDERED FILTERS LIST

    // Ordered filters list is just so we can display all the filters that have
    // been selected in order. It's purely for vis/usability even though the same
    // links are inside each filter tab.
    var ordered_filters = searchBox.active_filters.getOrderedFilters();
    $("#search-ordered-filters").html("");
    if (ordered_filters.length > 0) {
      for (var i = 0; i < ordered_filters.length; i++) {
        $newLink = $('<label class="is-active" data-filter-name="' + ordered_filters[i]["name"] + '" data-filter-value="' + ordered_filters[i]["value"] + '">' + ordered_filters[i]["value"] + ' <span aria-hidden="true">&times;</span></label>');

        // new element that needs click event behaviour
        $newLink.on("click", filter_link_click);

        // append the new link to the ordered_filters
        $("#search-ordered-filters").append($newLink);
      }

      // show as we know we have at least one
      $("#search-ordered-filters").show();
    }

    // OPEN AN ACTIVE FILTER PANEL AFTER RE-RENDERING

    // if this is the first run (e.g. page load) then we'll attempt to pull
    // an active filter (the last one makes sense) so we can set the active
    // id to open the filter panel for displaying
    var ordered_filters = searchBox.active_filters.getOrderedFilters();
    var last_filter = ordered_filters[ordered_filters.length - 1];
    if (isFirstRunFilterLinks && last_filter) {
      activeFilterId = "filters_panel__" + last_filter.name;
    }

    // // we will show/hide with the unchanged activeFilterId
    $(".c-search-filters-panel").hide();
    $("#" + activeFilterId).show();
    $("[data-menu-id='" + activeFilterId + "']").addClass("is-active");

    // SLIDE UP/DOWN BEHAVIOUR

    // slide gracefully depending on what is open/closed/selected etc
    $("#filters-menu li a").on("click", function (e) {
      var $activeFilter = $("#" + activeFilterId);

      // remove is-active classes from links, will add again if required
      $(this).closest("ul").find("a").removeClass("is-active");

      if (activeFilterId && $activeFilter.length && $activeFilter.attr("id").valueOf() !== $(this).data("menu-id").valueOf()) {
        // slide up the current filter panel, reset the active filter for
        // when we need to re-render, slide down the selected one
        $activeFilter.slideUp();
        activeFilterId = $(this).data("menu-id");
        $("#" + activeFilterId).slideDown();

        // set the is-active class to the menu link. also, remember the id
        // coz we'll need it when we regenerate links (e.g. user clicks on
        // a new filter, all is re-rendered)
        $(this).addClass("is-active");
        activeFilterMenuId = this.id;
      } else if (activeFilterId && $activeFilter.length && $activeFilter.attr("id").valueOf() === $(this).data("menu-id").valueOf()) {
        // everything closed down and forgotten
        activeFilterId = null;
        $activeFilter.slideUp();
      } else {
        // !$activeFilter

        // nothing is currently open, so just a case of showing the selected
        // panel and remembering the selection for when re-rendering
        activeFilterId = $(this).data("menu-id");
        $(".c-search-filters-panel").hide();
        $wrapper.show();
        $("#" + activeFilterId).slideDown();

        // set the is-active class to the menu link. also, remember the id
        // coz we'll need it when we regenerate links (e.g. user clicks on
        // a new filter, all is re-rendered)
        $(this).addClass("is-active");
        activeFilterMenuId = this.id;
      }

      e.preventDefault();
      return false;
    });

    // attach behaviour to filter links
    $("#search__filters label").on("click", filter_link_click);

    // tell subsequent runs that this is no longer first time generating filter links
    isFirstRunFilterLinks = false;
  };

  /**
   * get filters from the url, set these before we call request()
   * @param searchBox {SearchBox}
   */
  var _addFiltersFromQueryString = function (searchBox) {
    var params = QueryParams.getAll(),
      filterName,
      filterValues;
    for (var name in params) {
      if (name.match(/^filter__/)) {
        filterName = name.replace(/^filter__/, "");
        filterValues = params[name].split(",");
        for (var i = 0; i < filterValues.length; i++) {
          // hack to fix query string issues Ryan (Aug 2019)
          filterValues[i] = filterValues[i].replace("Faculty+of+", "");
          filterValues[i] = filterValues[i].replace(/\+/g, " ");

          if (filterValues[i]) {
            // don't set if empty
            searchBox.active_filters.add(filterName, filterValues[i]);
          }
        }
      }
    }
  };

  /**
   * Push filters to url when updated
   * @param searchBox {SearchBox}
   * @param validParams {Array} valid filter names to push to url e.g. ["level", "method"]
   */
  var _setQueryParamsOnFiltersUpdated = function (searchBox, validParams) {
    // This handler will set query params in the url when filters change
    // note: define this after request is called as it's a little pointless calling
    // it prior coz query param may already have been set
    searchBox.on("filters:updated", function (filters) {
      // This will allow us to remove those empty ones from the url.
      // Gonna repopulate this will the filters we know exist, we could get
      // filter names automatically from getAvailableFilters but this allows
      // us to whitelist names... also getAvailableFilters required filtered
      // results so would need to reside inside renderer and caution would be
      // required as this will run every time to re-render... could use
      // searchBox.off("filters:updated") before re-applying event handlers
      var filter_params = {
        // "level": [],
        // "method": [],
        // "faculty": []
      };

      // built filter_params from validParams
      for (var i = 0; i < validParams.length; i++) {
        filter_params[validParams[i]] = [];
      }

      // build up a object of names -> array values (e.g. {level: ["UG"], "method": ["FT, ..."]})
      for (var filterName in filters) {
        for (var filterValue in filters[filterName]) {
          if (typeof filter_params[filterName] === "undefined") {
            filter_params[filterName] = [];
          }
          filter_params[filterName].push(filterValue);
        }
      }

      // convert that objects array values to csv (e.g. ["FT", "On-campus"] -> "FT,On-campus")
      for (var filterName in filter_params) {
        if (filter_params[filterName].length) {
          filter_params[filterName] = filter_params[filterName].join(",");
        } else {
          QueryParams.remove("filter__" + filterName);
          delete filter_params[filterName];
        }
      }

      // set the filter__* query params in the url (e.g. ?filter__level=UG&filter__method=FT,On-campus)
      var formattedParams = {}; // each key needs "filter__" prefix
      for (var filterName in filter_params) {
        formattedParams["filter__" + filterName] = filter_params[filterName];
      }
      QueryParams.set(formattedParams); // do in one go!
    });
  };

  /**
   * get filters from data attributes of a given dom element
   * @param searchBox {SearchBox}
   * @param el {dom}
   * @param names {Array}
   */
  var _addFiltersFromDataAttribute = function (searchBox, el, names) {
    // if the data attribute is null, return
    if (!el) return false;

    var values;
    for (var i = 0; i < names.length; i++) {
      if (el.getAttribute("data-" + names[i])) {
        values = el.getAttribute("data-" + names[i]).split(",");
        for (var j = 0; j < values.length; j++) {
          if (values[i]) {
            // not empty
            searchBox.active_filters.add(names[i], values[j]);
          }
        }
      }
    }
  };

  /**
   * handle showing and hiding the loading pages
   * @param searchBox {SearchBox}
   * @param $results {jQuery} (optional)
   * @param $loading {jQuery} (optional)
   */
  var _handleShowHideLoadingResults = function (searchBox, $results, $loading) {
    if ($results) {
      searchBox.on("search:requesting", function (options) {
        $results.hide();
        $loading.show();
      });
    }

    if ($loading) {
      searchBox.on("search:rendered", function (options) {
        $results.show();
        $loading.hide();
      });
    }
  };

  /**
   * link to show depending on the environment (eg. live will use /s/redirect/...)
   * @param {object} result
   * @returns string Url
   */
  var _getResultLinkUrl = function (result) {
    // will use the normal link in dev/test environments
    switch (window.location.hostname) {
      // dev/test environments
      case "localhost":
      case "t4appdev.stir.ac.uk":
      case "t4cms.stir.ac.uk":
      case "mediadev.stir.ac.uk":
      case "t4webdev.stir.ac.uk":
      case "www-stir.t4appdev.stir.ac.uk":
      case "www-stir.t4cms.stir.ac.uk":
        url = result.displayUrl || result.link;
        break;

      // live
      default:
        url = result.clickTrackingUrl;
        break;
    }

    return url;
  };

  /**
   * Will generate the student stories result html - this is because it is shared
   * by two scripts for student stories landing and search pages.
   * @param {object} result
   */
  var _getStudentStoriesResultHTML = function (result) {
    var html = [];

    var displayName = (result.title ? result.title + " " : "") + result.name;

    html.push('<div class="c-testimonial-result" data-name="' + result.name + '" data-level="' + result.level + '" data-subject="' + result.subject + '" data-country="' + result.country + '" data-type="' + result.type + '" data-liveUrl="' + result.liveUrl + '">');

    html.push('<div class="c-image-block-search-result">');

    if (result.image) html.push('            <img src="' + result.image + '" alt="' + displayName + '" class="c-image-block-search-result__image">');

    html.push('  <div class="c-image-block-search-result__body">');
    html.push('    <p class="u-font-bold c-image-block-search-result__title">' + displayName + "</p>");

    if (result.maindegree) {
      html.push('    <p class="c-image-block-search-result__course c-heading--highlight">' + result.maindegree + "</p>");
    }

    if (result.pullquote) {
      html.push('    <blockquote class="c-image-block-search-result__quote">' + result.pullquote + "</blockquote>");
    }

    if (result.video) {
      html.push('    <p class="c-image-block-search-result__read-more"><a href="' + result.video + '" class="c-link no-arrow" data-open="testimonial-video-modal">Watch ' + result.fname + '\'s video <span class="uos-tv-camera"></span></a></p>');
    }

    if (result.show_read_more) {
      html.push('    <p class="c-image-block-search-result__read-more"><a href="' + SearchBoxViewHelpers.getResultLinkUrl(result) + '" class="c-link">Read more</a></p>');
    }

    html.push("  </div>");
    html.push("</div>");

    html.push("</div>");

    return html.join("\n");
  };

  /**
   * Will get the options for the instance of searchbox for student stories, as
   * this is shared in two scripts. There is the option to overwrite the defaults.
   * @param {object} options overwrite defaults
   */
  var _getStudentStoriesSearchBoxOptions = function (options) {
    return $.extend(
      true,
      {
        // datasets are each of our ajax calls to get results and renderers to
        // handle the data received
        datasets: {
          testimonials: {
            // this is essentially the jquery ajax options
            // note: some options, such as success, are not configurable here
            // as the lib defines its own to do some housekeeping before calling
            // renderer functions
            request: {
              // num_rows is pretty high here coz we wanna get enough image results
              // TODO can we sort the search on this? (e.g. has images) Then we can make num_rows much smaller
              url: "https://www.stir.ac.uk/s/search.json?collection=profiles&num_ranks=100",

              // The name of the callback parameter, as specified by the api
              jsonp: "callback",

              // Tell jQuery we're expecting JSONP
              dataType: "jsonp",
            },

            // this allows us to map the results in the response. Results will be passed into
            // the renderer function.
            mapData: SearchBoxMappers.buildMapDataHandler({
              include_results: true,
              include_best_bets: false,
            }),

            // the following properties all exist in metaData and have letters
            // that don't really match the property name sometimes (e.g. teaser is
            // metaData["c"]). So these just improve readability inside the renderer
            // title is already a property, so no need to add that
            formatters: {
              name: function (value, result) {
                return result.metaData["t"];
              },
              title: function (value, result) {
                return result.metaData["A"];
              },
              type: function (value, result) {
                return result.metaData["B"];
              },
              level: function (value, result) {
                return result.metaData["C"];
              },
              subject: function (value, result) {
                return result.metaData["D"];
              },
              faculty: function (value, result) {
                return result.metaData["E"];
              },
              fname: function (value, result) {
                return result.metaData["F"];
              },
              year: function (value, result) {
                return result.metaData["G"];
              },
              casestudy: function (value, result) {
                return result.metaData["H"];
              },
              image: function (value, result) {
                return typeof result.metaData["I"] !== "undefined" ? "https://www.stir.ac.uk" + result.metaData["I"] : result.metaData["I"];
              },
              maindegree: function (value, result) {
                return result.metaData["J"];
              },
              degree1: function (value, result) {
                return result.metaData["L"];
              },
              degree2: function (value, result) {
                return result.metaData["M"];
              },
              pullquote: function (value, result) {
                return result.metaData["P"];
              },
              surname: function (value, result) {
                return result.metaData["S"];
              },
              video: function (value, result) {
                return result.metaData["V"];
              },
              t4name: function (value, result) {
                return result.metaData["4"];
              },
              country: function (value, result) {
                return result.metaData["J"];
              },
              show_read_more: function (value, result) {
                return !(result.metaData["R"] === "Yes");
              },
            },

            //
            renderer: function (data, options, _data) {
              console.log("Student stories renderer not defined");
            },
          },
        },
      },
      options
    );
  };

  return {
    //
    getPaginationInfo: _getPaginationInfo,
    getResultLinkUrl: _getResultLinkUrl,
    getFiltersDataWithEmptyFilters: _getFiltersDataWithEmptyFilters,

    // html generators
    encodeURIParameters: _encodeURIParameters,
    generateSuggestUrlBySubgroup: _generateSuggestUrlBySubgroup,
    generateFilterLinks: _generateFilterLinks,
    addFiltersFromQueryString: _addFiltersFromQueryString,
    addFiltersFromDataAttribute: _addFiltersFromDataAttribute,
    generatePaginationLinks: _generatePaginationLinks,
    generatePaginationLinksHTML: _generatePaginationLinksHTML,
    generatePaginationInfo: _generatePaginationInfo,
    generateSearchLettersHTMLOnly: _generateSearchLettersHTMLOnly,

    // student stories helpers - these are used on landing and finder so made
    // sense not to repeat the same code in two scripts but they do have different
    // renderers, kind of
    getStudentStoriesSearchBoxOptions: _getStudentStoriesSearchBoxOptions,
    getStudentStoriesResultHTML: _getStudentStoriesResultHTML,

    // iterators
    paginateResults: _paginateResults,

    // event handlers
    handleShowHideLoadingResults: _handleShowHideLoadingResults,
    setQueryParamsOnFiltersUpdated: _setQueryParamsOnFiltersUpdated,
    registerSearchLettersEventHandlers: _registerSearchLettersEventHandlers,
  };
})();
