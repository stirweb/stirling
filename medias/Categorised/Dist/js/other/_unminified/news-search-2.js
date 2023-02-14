/*
 * @author Ryan Kaye
 *
 */
(function () {
  /*
   * Config vars 
   */
  var jsonUrl = "https://www.stir.ac.uk/s/search.json?";
  var resultsArea = document.querySelector("#news-search__results");
  var resultSummaryArea = document.querySelector("#news-search__summary");
  var paginationArea = document.querySelector("#pagination-box");
  var searchFormArea = document.querySelector("#news-search__form");
  var postsPerPage = 10;
  var noOfPageLinks = 11; // odd number only cause it doesnt include the current page

  var page = 1; // Search var defaults

  var searchFacets = {
    query: "!padre",
    collection: "stirling",
    meta_T: "[news gallery]",
    // type
    start_rank: 1,
    num_ranks: postsPerPage,
    sort: "date",
    fmo: "true",
    meta_d: '' // year
    //callback:"?"

  };
  /*
   * Function: Query Funnelback 
   */

  var doSearch = function doSearch() {
    // reset everything to avoid unwanted appendages
    var jsonUrl1 = '';
    var jsonUrl2 = ''; // form the jsonp string 

    for (var key in searchFacets) {
      if (searchFacets.hasOwnProperty(key)) {
        jsonUrl1 += key + '=' + searchFacets[key] + '&';
      }
    }

    jsonUrl2 = jsonUrl + jsonUrl1; // make the json call

    stir.getJSON(jsonUrl2, parseJSON);
  };
  /*
   * Function: Work with the data returned
   */


  var parseJSON = function parseJSON(data) {
    // output the data if no problems encountered
    if (!data.error) {
      if (data.response.resultPacket != null && data.response.resultPacket.results.length > 0) {
        outputResults(data);
      } else {
        resultsArea.innerHTML = '<p>No items found</p>';
        paginationArea.innerHTML = '';
        resultSummaryArea.innerHTML = '';
      }
    } else {
      resultsArea.appendChild(stir.getMaintenanceMsg()); //searchLoading.style.display = "none";

      console.log(data);
    }
  };
  /*
      * Function: output the results
      */


  var outputResults = function outputResults(resultSet) {
    // Fire oot the results and summary
    var totalPosts = resultSet.response.resultPacket.resultsSummary.totalMatching;
    var lastPost = searchFacets.start_rank + postsPerPage - 1;
    if (lastPost > totalPosts) lastPost = totalPosts;
    resultSummaryArea.innerHTML = StirSearchHelpers.formSearchSummaryHTML(totalPosts, searchFacets.start_rank, lastPost);
    resultsArea.innerHTML = formResultHTML(resultSet); // Add pagination if required

    paginationArea.innerHTML = '';
    if (postsPerPage < totalPosts) paginationArea.innerHTML = StirSearchHelpers.formPaginationHTML(totalPosts, postsPerPage, page, noOfPageLinks); // animate back to the top 

    stir.scrollToElement(resultSummaryArea, 20);
  };
  /*
      * Function: Form the html for results
      */


  var formResultHTML = function formResultHTML(myData) {
    var rstHtml = ""; // Loop the search results and form the html

    var rst = myData.response.resultPacket.results;

    for (var index in rst) {
      var element = rst[index]; // vars we are gonna need  

      if (element.title) {
        var stripped_title = stir.String.getFirstFromSplit.call(element.title, "|");
        var date = new Date(element.date);
        var formattedTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        var description = element.metaData["c"];
        if (description == undefined) description = '';else {
          var descriptions = element.metaData["c"].split("|");
          description = descriptions.pop().trim();
          if (description[description.length - 1] != '.') description = description + '...';
        }
        rstHtml += '<div class="c-search-result">';
        rstHtml += '	<div class="grid-x">';
        rstHtml += '    	<div class="cell small-12 c-search-result">';
        rstHtml += '        	<p class="c-search-result__link"><a href="' + element.clickTrackingUrl + '">' + stripped_title + '</a></p>';
        rstHtml += '         	<p class="c-search-result__breadcrumb">' + formattedTime + '</p>';
        rstHtml += '         	<p class="c-search-result__summary">' + description + '</p>';
        rstHtml += '    	</div>';
        rstHtml += '    </div>';
        rstHtml += '</div>';
      }
    }

    return rstHtml;
  };
  /*
   * Function: Pagination click processes
   */


  var doPageClick = function doPageClick(page) {
    QueryParams.set("page", page);
    searchFacets.start_rank = (page - 1) * postsPerPage + 1;
    doSearch(); //configSearch();
  };
  /*
      * Function: Listen click events 
      */


  document.addEventListener('click', function (e) {
    // Pagination clicks
    if (e.target.matches('#pagination-box a')) {
      page = e.target.getAttribute('data-page');
      doPageClick(page);
      e.preventDefault();
    }

    if (e.target.matches('#pagination-box a span')) {
      page = e.target.parentNode.getAttribute('data-page');
      doPageClick(page);
      e.preventDefault();
    }
  }, false);
  /*
      * Function: Search Form submitted
      */

  searchFormArea.addEventListener("submit", function (e) {
    // keyword stuff
    if (document.getElementById('news-search__query').value !== '') {
      searchFacets.query = document.getElementById('news-search__query').value;
      QueryParams.set("keyword", document.getElementById('news-search__query').value);
    } else {
      searchFacets.query = '!padre';
      QueryParams.set("keyword", '');
    } // type stuff


    if (document.getElementById('news-search__format').value !== '') {
      searchFacets.meta_T = document.getElementById('news-search__format').value;
      QueryParams.set("type", document.getElementById('news-search__format').value);
    } // year stuff


    searchFacets.meta_d = document.getElementById('news-search__year').value;
    QueryParams.set("year", searchFacets.meta_d); // pagination stuff

    page = 1; // rest

    QueryParams.set("page", page);
    searchFacets.start_rank = (page - 1) * postsPerPage + 1; // perform the search

    doSearch();
    e.preventDefault();
    return false;
  }, false);
  /*
      * On load
      */
  // keyword stuff

  if (QueryParams.get("keyword") !== '' && QueryParams.get("keyword") !== undefined) {
    document.getElementById('news-search__query').value = QueryParams.get("keyword");
    searchFacets.query = QueryParams.get("keyword");
  } // type stuff


  if (QueryParams.get("type") !== '' && QueryParams.get("type") !== undefined) {
    searchFacets.meta_T = QueryParams.get("type");
    document.getElementById('news-search__format').value = QueryParams.get("type");
  } // year stuff


  if (!isNaN(QueryParams.get("year"))) {
    searchFacets.meta_d = QueryParams.get("year");
    document.getElementById('news-search__year').value = QueryParams.get("year");
  } // pagination stuff


  if (!isNaN(QueryParams.get("page"))) page = QueryParams.get("page");
  searchFacets.start_rank = (page - 1) * postsPerPage + 1; // perform the search

  doSearch();
})();