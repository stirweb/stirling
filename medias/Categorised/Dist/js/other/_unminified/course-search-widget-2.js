/*
 * @author Ryan Kaye
 */
(function () {
  /* Elements we need */
  var resultsAreaWrapper = document.getElementById("course-search-widget__wrapper");
  var resultsArea = document.getElementById("course-search-widget__results");
  var resultsPopup = document.getElementsByClassName("c-course-search-widget-popup__results")[0];
  var resultFilters = document.querySelectorAll("label[data-filter-name]");
  var searchInput = document.getElementById("course-search-widget__search-input");
  var searchLoading = document.getElementById("course-search-widget__loading");
  var placeholderText = searchInput.placeholder;
  /* Search params */

  var xhr; // ajax request object

  var myData;
  var postsPerPage = 50;
  var collection = 'stir-courses';
  var jsonUrl = "https://www.stir.ac.uk/s/search.json?";
  var jsonSuggestUrl = 'https://www.stir.ac.uk/s/suggest.json?&collection=' + collection + '&show=5&partial_query=';
  var query = '';
  var level = document.getElementsByName("filter__level")[0].value;
  var maxRst = 5; // object to hold the search config data with default values

  var searchFacets = {
    query: query,
    start_rank: 1,
    num_ranks: postsPerPage,
    collection: collection
  };
  /*
   * Function: Query Funnelback 
   */

  var doSearch = function doSearch(myQuery) {
    searchLoading.style.display = "block";
    searchFacets.query = myQuery;
    var jsonUrl1 = jsonUrl;

    for (var key in searchFacets) {
      if (searchFacets.hasOwnProperty(key)) {
        jsonUrl1 += key + '=' + searchFacets[key] + '&';
      }
    }

    xhr = stir.getJSON(jsonUrl1, parseJSON);
  };
  /*
   * Function: Get the suggest result (if one exists) and fire off another search
   */


  var parseSuggest = function parseSuggest(data) {
    if (data.length > 0) {
      doSearch(data[0]);
      return true;
    }

    resultsArea.innerHTML = "<p>No results found</p>";
    return false;
  };
  /*
   * Function: Work with the data returned
   */


  var parseJSON = function parseJSON(data) {
    var noOfRsts = 0;
    myData = data;
    var totalPosts = parseInt(data.response.resultPacket.resultsSummary.totalMatching);

    if (data.error) {
      resultsArea.innerHTML = "<p>An error has occurred</p>";
    }

    if (totalPosts > 0) {
      var rst = data.response.resultPacket.results;
      var html = [];
      var i = 0;

      for (var key in rst) {
        if (i < maxRst) {
          var val = rst[key];

          if (typeof val.title != "undefined") {
            if (val.metaData["L"].indexOf(level) > -1) {
              var award = val.metaData["B"] || '';
              var descr = val.metaData["c"] || '';
              html.push('<div class="course-search-widget__result">');
              html.push('<a href="' + val.liveUrl + '" class="result">' + award + ' ' + val.title + '</a>');
              html.push('<p>' + descr + '</p>');
              html.push('</div');
              i++;
              noOfRsts++;
            }
          }
        }
      }

      if (noOfRsts === 0) html.push('<p class="u-padding-y">No results found at ' + level + ' level</p>');
      html.push('<p><a href="/courses/?query=' + searchFacets.query + '&filter__level=' + level + '" class="button expanded" >See all results for ' + searchFacets.query + '</a></p>');
      updateFilters(); // output and show the results

      resultsArea.innerHTML = html.join(" ");
      resultsAreaWrapper.style.display = "block";
      searchLoading.style.display = "none";
    }

    if (totalPosts === 0) {
      // do a search based on a suggest instead
      if (xhr != undefined) xhr.abort();
      var jsonSuggestUrl1 = jsonSuggestUrl + searchFacets.query;
      xhr = stir.getJSON(jsonSuggestUrl1, parseSuggest);
    }
  };
  /*
   * Function: update the result filters states - (in)active 
   */


  var updateFilters = function updateFilters() {
    for (var i = 0; i < resultFilters.length; i++) {
      // labels
      resultFilters[i].classList.remove("is-active");
      if (resultFilters[i].dataset.filterValue === level) resultFilters[i].classList.add("is-active"); // checkboxes

      resultFilters[i].querySelectorAll('input[type=checkbox]')[0].removeAttribute("checked");

      if (resultFilters[i].dataset.filterValue === level) {
        resultFilters[i].querySelectorAll('input[type=checkbox]')[0].setAttribute("checked", "checked");
      }
    }
  };
  /*
   * Event: on keyup of search attempts
   */
  // this timeout will allow us to only make requests when the user is idle (e.g. stopped typing)


  var searchTimeout;
  var keyUpTime = 1000; // this is the min characters in query before activating the suggest box

  var minQueryLength = 2;
  searchInput.addEventListener("keyup", function (e) {
    if (xhr != undefined) xhr.abort();
    clearTimeout(searchTimeout);

    if (searchInput.value != query) {
      query = searchInput.value;

      if (query.length >= minQueryLength) {
        // do a search
        searchTimeout = setTimeout(function () {
          doSearch(query);
        }, keyUpTime);
      }
    }

    if (searchInput.value === '') {
      UoS_closeAllWidgetsExcept();
      e.stopPropagation();
    }
  });
  /*
   * Event: Search Input on focus 
   */

  searchInput.addEventListener("focus", function (e) {
    searchInput.placeholder = '';
  });
  /*
   * Event: Search Input - stop it closing the pop up when clicked 
   */

  searchInput.addEventListener("click", function (e) {
    UoS_closeAllWidgetsExcept('courseSearchWidget');
    e.stopPropagation();
  });
  /*
   * Event: Search Input off focus 
   */

  searchInput.addEventListener("blur", function (e) {
    if (searchInput.value === '') searchInput.placeholder = placeholderText;
  });
  /*
   * Event: Filter button clicks 
   */

  for (var i = 0; i < resultFilters.length; i++) {
    resultFilters[i].addEventListener("click", function (e) {
      if (this.dataset.filterValue != level) {
        level = this.dataset.filterValue;
        parseJSON(myData);
        updateFilters();
      }
    });
  }
  /*
   * Event: Popup for results - stop it closing when clicked 
   */


  resultsPopup.onclick = function (e) {
    UoS_closeAllWidgetsExcept('courseSearchWidget');
    e.stopPropagation();
  };
  /*
   * Event: On load
   */


  updateFilters();
})();