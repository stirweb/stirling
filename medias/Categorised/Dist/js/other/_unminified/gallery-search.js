/**
 * Based on news-search.js
 * 2019-01-16 3.55 pm
 * @author Robert Morrison <r.w.morrison@stir.ac.uk>
 */
$(function () {
  var num_ranks = 1000;
  form = document.getElementById("gallery-search__form");
  if (!form) return; // quit early if the form is not available

  var inputs = form.querySelectorAll("input, select"); // return initiated search box

  var searchBox = new SearchBox({
    // datasets are each of our ajax calls to get results and renderers to
    // handle the data received
    datasets: {
      gallery: {
        // this is essentially the jquery ajax options
        // note: some options, such as success, are not configurable here
        // as the lib defines its own to do some housekeeping before calling
        // renderer functions
        request: {
          url: "https://www.stir.ac.uk/s/search.json?" + SearchBoxViewHelpers.encodeURIParameters({
            collection: "external",
            SF: "[J|U]",
            sort: "dmetad",
            // sort by metadata 'd' (i.e. date) descending.
            num_ranks: num_ranks,
            meta_T_and: "gallery",
            fmo: true
          }),
          // The name of the callback parameter, as specified by the api
          jsonp: "callback",
          // Tell jQuery we're expecting JSONP
          dataType: "jsonp"
        },
        // this allows us to map the results in the response. Results will be passed into
        // the renderer function.
        mapData: SearchBoxMappers.buildMapDataHandler({
          include_results: true,
          include_best_bets: false
        }),
        // the following properties all exist in metaData and have letters
        // that don't really match the property name sometimes (e.g. teaser is
        // metaData["c"]). So these just improve readability inside the renderer
        // title is already a property, so no need to add that
        formatters: {
          /* school: function(value, result) {
              return result.metaData["H"]
          },
          type: function(value, result) {
              return result.metaData["T"]
          },
          date_formatted: function(value, result) {
              return result.metaData["d"]
          } */
        },
        //
        renderer: function renderer(data, options, _data) {
          var dataset = options.datasets.gallery,
              results = searchBox.getResults(data, dataset.filters, dataset.formatters).slice(0, num_ranks),
              html = [],
              numRanksLocal = document.querySelector('[name="num_ranks_local"]'),
              pageInfo = SearchBoxViewHelpers.getPaginationInfo({
            limit: numRanksLocal ? parseInt(numRanksLocal.value) : 12
          }),
              resultsEl = document.getElementById("gallery-search__results"),
              pageLinksEl = document.getElementById("pagination-links"),
              pageInfoEl = document.getElementById("pagination-info"); // e.g. {start: .. , limit: .. , page .. }

          if (results.length > 0) {
            // html for "Showing 21-30 of first 100 results"
            pageInfoEl && (pageInfoEl.innerHTML = SearchBoxViewHelpers.generatePaginationInfo(results, pageInfo, options.query.query, num_ranks)); // output search results using pageInfo

            SearchBoxViewHelpers.paginateResults(results, pageInfo, function (result) {
              if (window.JSON && result.metaData.U) {
                var customData = result.metaData.U.split("|");

                for (var i = 0; i < customData.length; i++) {
                  photo = JSON.parse(customData[i]);

                  if (photo.hasOwnProperty("farm")) {
                    // "farm" as in Flickr server-farm
                    break;
                  }
                }
              }

              var stripped_title = stir.String.getFirstFromSplit.call(result.title, "|");
              var date = new Date(result.date);
              var formattedTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
              var imageURL = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg'; //c.jpg

              html.push('    <div class="grid-x cell small-10 medium-6 large-4">');
              html.push('        <div class="cell small-12 u-bg-grey">');
              html.push('            <a href="' + result.liveUrl + '">');
              photo && html.push('                <div class="c-photo-gallery__thumb" style="background-image: url(' + imageURL + ')">');
              photo && html.push('                </div>');
              html.push('            </a>');
              html.push('        </div>');
              html.push('        <div class="cell small-12 c-events-box__content u-bg-grey">');
              html.push('            <h2 class="c-promo-box__header header-stripped">');
              html.push('                <a href="' + result.liveUrl + '" class="c-link" style="border-bottom: 2px solid transparent">' + stripped_title + '</a>');
              html.push('            </h2>');
              html.push('            <p class="c-search-result__breadcrumb">' + formattedTime + '</p>');
              html.push('        </div>');
              html.push('    </div>');
            });
          } else {
            pageInfoEl && (pageInfoEl.innerHTML = '');
            html.push('<p>No results found.</p>');
          }

          resultsEl && (resultsEl.innerHTML = html.join("\n"));
          pageLinksEl && (pageLinksEl.innerHTML = '');
          SearchBoxViewHelpers.generatePaginationLinks($("#pagination-links"), data, results, pageInfo, dataset, options, searchBox);
        }
      }
    }
  });
  /**
   * For each form input, set the value according to the data (if the 
   * input name exists as a property on the object.)
   * @param {Object} data 
   */

  function set_form_params(data) {
    if (!inputs) return;
    if (typeof data === "undefined") data = {};

    for (var i = 0; i < inputs.length; i++) {
      if (typeof data[inputs[i].getAttribute("name")] != "undefined") {
        inputs[i].value = data[inputs[i].getAttribute("name")];
      }
    }
  }

  function get_form_params(data) {
    if (!inputs) return;
    if (typeof data === "undefined") data = {};

    for (var i = 0; i < inputs.length; i++) {
      data[inputs[i].getAttribute("name")] = inputs[i].value || '';
    }

    return data;
  }

  ;
  $(".c-news-search__button").on("click", function (e) {
    searchBox.request(get_form_params());
    e.preventDefault(); // prevent default form submission

    return false;
  });
  SearchBoxViewHelpers.handleShowHideLoadingResults(searchBox, $("#gallery-search__results"), $("#gallery-search__loading")); // set query param in the url, ignore !* as these look silly
  // TODO this is duplicated or any search results page that uses query field

  searchBox.on("search:requesting", function (options) {
    var activeOptions = {};
    /* for(var i in options.query) {
        if(options.query.hasOwnProperty(i) && (options.query[i])) {
            activeOptions[i] = options.query[i];
        }
    } */

    if (inputs) {
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute("type") != "hidden") {
          activeOptions[inputs[i].getAttribute("name")] = inputs[i].value || '';
        }
      }
    }

    QueryParams.set(activeOptions);
    var query = options.query.query.match(/^!/) ? "" : options.query.query; // ignore !* as these look silly

    var query_from_url = QueryParams.get("query", ""); // set query param in the url if changed

    if (query !== query_from_url) {
      QueryParams.set("query", query);
    } // on a new request, we always reset to page=1


    var currentPage = QueryParams.get("page", "1"); // default 1

    if (currentPage !== "1") QueryParams.set("page", "1"); // update the input field

    $("input[name='query']").val(query);
  }); // for each option, set the value from QueryParams

  set_form_params(QueryParams.getAll());
  searchBox.request(get_form_params());
});