/*
 * @author: Ryan Kaye & Robert Morrison
 *
 */
(function () {
  /* Elements and DOM stuff */
  var widget = document.getElementById('course-search-widget');
  if (!widget) return;
  var results = new stir.ToggleWidget(widget.querySelector('#course-search-widget__wrapper'), 'stir__slidedown', 'stir__slideup');
  var resultsArea = widget.querySelector('#course-search-widget__results');
  var filters = widget.querySelector('.filters');
  var searchInput = widget.querySelector('#course-search-widget__search-input');
  var searchLoading = widget.querySelector('#course-search-widget__loading');
  var defaultLevel = widget.querySelector('input[name="filter__level"]');
  var placeholder = searchInput.placeholder;
  /* Search params */

  var cachedResults;
  var postsPerPage = 256;
  var collection = 'courses-and-modules';
  var searchUrl = 'https://www.stir.ac.uk/s/search.json?';
  var suggestUrl = 'https://www.stir.ac.uk/s/suggest.json?&collection=' + collection + '&show=5&partial_query=';
  var query = '';
  var level = defaultLevel ? defaultLevel.value : null; // define a few constants

  var KEY_ESC = 27; // keycode for the Esc key (i.e. press the key to dismiss the search results box)

  var POOL_LIMIT = postsPerPage;
  var MAX_RESULTS = 5; // how many results to show

  var MIN_QUERY_LENGTH = 3; // this is the min characters in query before activating the suggest box
  // object to hold the search config data with default values

  var parameters = {
    query: query,
    start_rank: 1,
    num_ranks: postsPerPage,
    collection: collection
  };
  var strings = {
    cpd: {
      description: 'Continuing Professional Development (CPD) module. Enrol now to gain new skills and up-to-date knowledge for your career development.'
    }
  };
  searchLoading.innerHTML = '';
  var spinner = new stir.Spinner(searchLoading);
  results.hide(); // TODO: refactor this legacy CSS stuff

  widget.querySelector('#course-search-widget__wrapper').style.display = 'block';
  spinner.element.classList.add('loader');
  spinner.element.classList.add('loader--small');
  spinner.element.style.position = 'absolute';
  spinner.element.style.top = '10px';
  spinner.element.style.right = '50px';
  /*
   * Function: Query Funnelback 
   */

  function doSearch(myQuery) {
    parameters.query = myQuery;
    stir.getJSON(searchUrl + stir.Concierge.prototype.obj2param(parameters), parseJSON);
  }
  /*
  * Function: Get the suggest result (if one exists) and fire off another search
   */


  var parseSuggest = function parseSuggest(data) {
    spinner.hide();

    if (data.length > 0) {
      doSearch(data[0]);
      return true;
    }

    resultsArea.innerHTML = '<p>No results found</p>';
    return false;
  };
  /*
   * Take a raw Funnelback JSON response object and return an array of results
   * @param {*} data 
   */


  var parseJSON = function parseJSON(data) {
    if (!data) return;
    cachedResults = [];

    if (data.error) {
      console.error(data.error);
      return resultsArea.innerHTML = '<p>An error has occurred</p>';
    }

    if (data.response && parseInt(data.response.resultPacket.resultsSummary.totalMatching) > 0) {
      // cache the results, up to MAX_RESULTS
      cachedResults = data.response.resultPacket.results.slice(0, POOL_LIMIT); // Filter then display the results

      displayResults(filterResults(cachedResults));
      results.show();
      spinner.hide();
    } else {
      // do a search based on a suggest instead
      stir.getJSON(suggestUrl + parameters.query, parseSuggest);
    }
  };
  /*
   * Take a Funnelback results array and return only the ones we want 
   * @param {*} data 
   */


  function filterResults(data) {
    var results = [];
    data.forEach(function (result) {
      if (result.title) {
        if (level) {
          if (result.metaData['L'] && result.metaData['L'].indexOf(level) > -1) {
            results.push(result);
          } else if (result.metaData['type'] && result.metaData['type'] === level) {
            results.push(result);
          }
        } else {
          results.push(result);
        }
      }
    });
    return results.slice(0, MAX_RESULTS);
  }
  /*
   * Take a (filtered) Funnelback result array and transform it into HTML
   * @param {*} result 
   */


  function renderResult(result) {
    var isCPD = false;
    var award = result.metaData['B'] || '';
    var description = result.metaData['c'] || '';
    var html = [];

    if (result.metaData['type'] && result.metaData['type'] == 'module') {
      isCPD = true;
    }

    html.push('<div class="course-search-widget__result">');
    html.push('<a href="' + result.liveUrl + '" class="result">' + award + ' ' + result.title + '</a>');
    html.push('<p>' + (isCPD ? strings.cpd.description : description) + '</p>');
    html.push('</div>');
    return html.join("\n");
  }
  /*
   * Take a pre-rendered HTML snippet and display it in the results pane
   * @param {*} data 
   */


  function displayResults(data) {
    var html = [];
    var queryString = stir.Concierge.prototype.obj2param(getFilterValues());
    var queryHost = widget.getAttribute('data-js-action') || widget.getAttribute('action');
    var url = queryHost + '?' + queryString;

    if (0 === data.length) {
      html.push('<p class="u-padding-y">No ' + level.toLowerCase() + ' results for that search term.</p>');
    } else {
      data.forEach(function (result) {
        html.push(renderResult(result));
      });
    }

    html.push('<p><a href="' + url + '" class="button expanded">See all results for “' + parameters.query + '”</a></p>');
    resultsArea.innerHTML = html.join("\n");
  }
  /*
  * Event: on keyup of search attempts
  **/
  // define the event handler


  function handleInput(event) {
    if (this.value === '') {
      results.hide();
    } else if (this.value != query) {
      results.hide();

      if (this.value.length >= MIN_QUERY_LENGTH) {
        spinner.show();
        doSearch(this.value);
        query = this.value;
      } else {
        spinner.hide();
        results.hide();
        query = '';
      }
    }

    event.stopPropagation();
  } //attach the event handler


  searchInput.addEventListener('keyup', stir.debounce(handleInput, 400));
  /*
   * Event: Search Input on focus 
   */

  searchInput.addEventListener('focus', function (e) {
    searchInput.placeholder = '';
  });
  /*
   * Event: Search Input off focus 
   */

  searchInput.addEventListener('blur', function (e) {
    searchInput.placeholder = placeholder;
  });
  /*
   * Event: Search Input - stop it closing the pop up when clicked 
   */

  searchInput.addEventListener('click', function (e) {
    e.stopPropagation();
  });
  document.addEventListener('widgetRequestClose', function (event) {
    results.hide();
  });
  /*
   * Function: update the result filters states - (in)active 
   * enforce one "level" only as if radio buttons.
   */

  var updateFilters = function updateFilters() {
    Array.prototype.forEach.call( // The following query selector will return a NodeList, that will be
    // transformed into an Array. We're selecting checkboxed that *don't*
    // match the current 'value'. I.e. toggle between UG and PG as if they
    // were radio buttons.
    widget.querySelectorAll('.filters input[name^="filter__"]:not([value="' + level + '"])'), // then we'll foreach round the array calling this function on each element
    function (filter) {
      // each of the elements in the array is a checkbox that we want to un-check:
      filter.checked = false;
    });
  };
  /*
   * Return an object with key/value pairs that represent the active query and filters.
   */


  function getFilterValues() {
    var filterSet = {
      query: parameters.query
    }; // first get hidden inputs…

    widget.querySelectorAll('input[type="hidden"]').forEach(function (filter) {
      filterSet[filter.name] = filter.value;
    }); // …then get user inputs:

    filters && filters.querySelectorAll('input:checked').forEach(function (filter) {
      filterSet[filter.name] = filter.value;
    });
    return filterSet;
  }

  function filterHandler(event) {
    if (event.target.hasAttribute('name') && event.target.hasAttribute('value')) {
      if (event.target.getAttribute('name') === 'filter__level') {
        level = event.target.checked ? event.target.getAttribute('value') : undefined;
      }

      updateFilters();
      cachedResults && displayResults(filterResults(cachedResults));
    }
  }

  filters && filters.addEventListener('click', filterHandler);
  /*
   * Event: Popup for results - stop it closing when clicked 
   */

  widget.onclick = function (e) {
    e.stopPropagation();
  };
  /*
   * Event: On load
   */


  updateFilters();
})();