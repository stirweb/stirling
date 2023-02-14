/*
 * @author: Ryan Kaye
 */
(function () {
  var num_ranks = 9;
  var postsPerPage = 9; // number of posts to fetch at one time

  var noOfPageLinks = 9; // odd number only cause it doesnt include the current page

  var jsonUrl = "https://www.stir.ac.uk/s/search.json?";
  var paginationArea = document.getElementById("pagination-box");
  var resultSummaryArea = document.getElementById("testimonials-search__summary");
  var resultsArea = document.getElementById("testimonials-search__results");
  var searchForm = document.getElementById("testimonials-search__form");
  var searchLoading = document.querySelector('.c-search-loading__feedback'); // form elements
  //var typeWidget          = document.getElementById('testimonials-search__type');

  var levelWidget = document.getElementById('testimonials-search__level');
  var subjectWidget = document.getElementById('testimonials-search__subject');
  var regionWidget = document.getElementById('testimonials-search__nationality');
  var onlineWidget = document.getElementById("testimonials-search__online"); // Macros

  var macroUK = '["United Kingdom" "Wales" "England" "Scotland" "Northern Ireland"]'; // Search var defaults

  var searchFacets = {
    collection: "student-stories",
    start_rank: 1,
    num_ranks: num_ranks,
    query: "!padre",
    meta_tags: '[student alum]',
    // Type - student, staff, alum, employer, intern, research-partner [student alum]
    meta_country: '',
    // Nationality / Region
    meta_level: '',
    // Level
    meta_subject: '',
    // Subject
    meta_faculty: '',
    // Faculty
    meta_course1modes: '',
    sort: "metaimage",
    // Image
    fmo: "true"
  };
  var page = 1;
  var resultSet;
  var windowSize;
  /*
   * Function: Create query string then perform the search 
   */

  var doSearch = function doSearch() {
    // United Kingdom Macro
    if (searchFacets.meta_country === 'United Kingdom') searchFacets.meta_country = macroUK; // And the other way around

    /* if(searchFacets.meta_country === 'England' || searchFacets.meta_country === 'Wales' || searchFacets.meta_country === 'Scotland' || searchFacets.meta_country === 'Northern Ireland'){ 
        searchFacets.meta_country = '["'+searchFacets.meta_country + '" "United Kingdom"]';
    } */
    // reset everything to avoid unwanted appendages

    var jsonUrl1 = '';
    var jsonUrl2 = ''; // form the jsonp string 	

    for (var key in searchFacets) {
      if (searchFacets.hasOwnProperty(key)) {
        jsonUrl1 += key + '=' + searchFacets[key] + '&';
      }
    }

    searchLoading.style.display = "block";
    jsonUrl2 = jsonUrl + jsonUrl1;
    stir.getJSON(jsonUrl2, parseJSON);
  };
  /*
   * Function: Work with the data returned
   */


  var parseJSON = function parseJSON(dataAjax) {
    resultSet = dataAjax;
    doResults();
  };
  /*
   * Function: Work with the data returned
   */


  var doResults = function doResults() {
    if (!resultSet.error) {
      if (resultSet.response.resultPacket !== null && resultSet.response.resultPacket.results.length > 0) {
        outputResults();
        searchLoading.style.display = "none"; // if its a pagination click slide to the results

        if (Number(QueryParams.get("page"))) stir.scrollToElement(searchForm, -30);
      } else {
        resultsArea.style.display = 'block';
        resultsArea.innerHTML = '<p>We don\'t have any student stories that match those filters. <a href="#" class="resetBtn">Start a new search</a>.</p>';
        paginationArea.innerHTML = '';
        resultSummaryArea.innerHTML = '';
        searchLoading.style.display = "none";
      }
    } else {
      resultsArea.appendChild(stir.getMaintenanceMsg());
      searchLoading.style.display = "none";
      console.log(resultSet.error);
    }
  };
  /*
   * Function: output the results
   */


  var outputResults = function outputResults() {
    var totalPosts = resultSet.response.resultPacket.resultsSummary.totalMatching;
    var lastPost = searchFacets.start_rank + postsPerPage - 1;
    if (lastPost > totalPosts) lastPost = totalPosts;
    resultsArea.style.display = 'block';
    resultsArea.innerHTML = formResultHTML(totalPosts);
    resultSummaryArea.innerHTML = StirSearchHelpers.formSearchSummaryHTML(totalPosts, searchFacets.start_rank, lastPost); // Add pagination if required

    paginationArea.innerHTML = '';
    if (postsPerPage < totalPosts) paginationArea.innerHTML = StirSearchHelpers.formPaginationHTML(totalPosts, postsPerPage, page, noOfPageLinks);
  };
  /*
   * Function: Form the html for results
   * Bespoke masonry 
   */


  var formResultHTML = function formResultHTML(totalPosts) {
    var html = [];
    var noOfCols;

    switch (windowSize) {
      case 'medium':
        noOfCols = 2;
        break;

      case 'small':
        noOfCols = 1;
        break;

      case 'large':
        noOfCols = 3;
        break;

      default:
        noOfCols = 3;
    } // work out how many posts will be in each column noOfRsts / noOfCols (masonry)


    var noOfRsts = resultSet.response.resultPacket.results.length;
    var postsPerCol = Math.round(noOfRsts / noOfCols); // Loop the search results and form the html

    var rst = resultSet.response.resultPacket.results;
    html.push('<div class="grid-x grid-padding-x">');

    for (var index in rst) {
      var element = rst[index];

      if (element.displayUrl) {
        // data to output 
        var img = element.metaData.image || ''; //element.metaData["I"] || '';

        var country = element.metaData.country || ''; //element.metaData["J"] || '';

        var snippet = element.metaData.snippet || ''; //element.metaData["P"] || '';

        var degreeTitle = element.metaData.degreeTitle || ''; //element.metaData["M"] || '';
        //var num = index / noOfCols ;

        var num = index / postsPerCol;
        var media = element.metaData.media || '';
        var fullname = element.title.split(' | ')[0];
        var firstname = fullname.split(' ')[0]; // open / close the cell

        if (num % 1 === 0 || index === 0) {
          if (index !== 0) html.push('</section>');
          html.push('<section class="cell small-12 medium-6 large-4 u-padding-bottom" aria-label="Student Story quote ' + fullname + '">');
        }

        if (noOfRsts === 1) html.push('<section class="cell small-12 medium-6 large-4 u-padding-bottom" aria-label="Student Story quote ' + fullname + '">'); // start 1&2

        html.push('<!-- Start c-testimonial-result --><div class="c-testimonial-result">');
        html.push('<div class="c-image-block-search-result">');

        if (media.indexOf("a_vid") > -1) {
          var myvid = media.split('-')[1];
          html.push('<div class="u-bg-grey"><div id="vimeoVideo-' + myvid + '" class="responsive-embed widescreen " data-videoembedid="' + myvid + '" data-vimeo-initialized="true"><iframe src="https://player.vimeo.com/video/' + myvid + '?app_id=122963" allow="autoplay; fullscreen" allowfullscreen="" title="' + element.title.split(' | ')[0] + ' Testimonial" data-ready="true" width="426" height="240" frameborder="0"></iframe></div>');
        } else if (img !== '') html.push('<img src="https://www.stir.ac.uk' + img + '"  alt="' + fullname + '" class="c-image-block-search-result__image" loading="lazy" />'); // start 3


        html.push('<div class="c-image-block-search-result__body"> ');
        html.push('<p class="u-font-bold c-image-block-search-result__title">' + fullname + '</p> ');
        if (country || degreeTitle) html.push('<cite>');
        if (country) html.push('<span class="info">' + country + ' <br></span>');
        if (degreeTitle) html.push('<span class="info">' + degreeTitle + '</span>');
        if (country || degreeTitle) html.push('</cite>');
        if (snippet !== '') html.push('<blockquote class="c-image-block-search-result__quote">' + snippet + '</blockquote>');
        html.push('<div class="c-image-block-search-result__read-more"><a href="' + element.liveUrl + '" aria-label="View ' + fullname.trim() + '\'s story" class="c-link">View ' + firstname + '\'s story</a></div>'); // end 3

        html.push('</div>'); // end 1&2

        html.push('</div>');
        html.push('</div><!-- End c-testimonial-result -->');
      }
    } // end cell / grid-x


    html.push('</section></div>');
    return html.join("\n");
  };
  /*
   * Event: window size changed on the fly
   */


  window.addEventListener('MediaQueryChange', function (event) {
    if (stir.MediaQuery.current !== windowSize) {
      windowSize = stir.MediaQuery.current;
      doResults();
    }
  });
  /*
   * Function: Pagination click processes
   */

  var doPageClick = function doPageClick(page) {
    QueryParams.set("page", page);
    searchFacets.start_rank = (page - 1) * postsPerPage + 1;
    doSearch();
  };
  /*
   * Function: Listen for click events 
   */


  paginationArea.addEventListener('click', function (e) {
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
   * Function: Reset Button clicked
   */

  resultsArea.addEventListener('click', function (e) {
    if (e.target.matches('a.resetBtn')) {
      resetSearch();
      stir.scrollToElement(searchForm, -30);
      e.preventDefault();
    }
  }, false);
  /*
   * Function: Resets the form and query params to null values
   */

  function resetSearch() {
    QueryParams.set("level", '');
    levelWidget.value = '';
    QueryParams.set("region", '');
    regionWidget.value = '';
    QueryParams.set("subject", '!padrenullquery');
    subjectWidget.value = '!padrenullquery';
    QueryParams.set("mode", '');
    searchFacets.meta_course1modes = '';
  }
  /*
   * Function: Search Form submitted
   */


  searchForm.addEventListener("submit", function (e) {
    //var typeVal     = typeWidget.value;
    var levelVal = levelWidget.value;
    var subjectVal = subjectWidget.value;
    var regionVal = regionWidget.value;
    var onlineVal = onlineWidget.checked; // reset the page / start number number

    page = 1;
    QueryParams.set("page", page);
    searchFacets.start_rank = (page - 1) * postsPerPage + 1;

    if (onlineVal) {
      searchFacets.meta_course1modes = 'online';
      QueryParams.set("mode", 'online');
    } else {
      searchFacets.meta_course1modes = '';
      QueryParams.set("mode", '');
    } //searchFacets.meta_B = typeVal;
    //QueryParams.set("type", typeVal);


    searchFacets.meta_country = regionVal;
    QueryParams.set("region", regionVal);

    if (levelVal !== '') {
      searchFacets.meta_level = levelVal;
      QueryParams.set("level", levelVal);
    } else {
      searchFacets.meta_level = '!padre';
      levelVal = '!padre';
    }

    getSubjectFaculty(subjectVal);
    QueryParams.set("subject", subjectVal); // perform the search

    doSearch();
    e.preventDefault();
  }, false);
  /*
   * Function: Retrieves the subject / faculty value
   */

  var getSubjectFaculty = function getSubjectFaculty(subjectVal) {
    var subjectBits = subjectVal.split(":");

    if (subjectBits[0] === '|[subject') {
      searchFacets.meta_subject = subjectBits[1];
      searchFacets.meta_faculty = '';
    }

    if (subjectBits[0] === '|[faculty') {
      searchFacets.meta_subject = '';
      searchFacets.meta_faculty = subjectBits[1];
    }

    if (!subjectBits[1]) {
      searchFacets.meta_subject = '';
      searchFacets.meta_faculty = '';
    }
  };
  /*
   * On Load
   */


  windowSize = stir.MediaQuery.current;

  if (QueryParams.get("region")) {
    searchFacets.meta_country = QueryParams.get("region");
    regionWidget.value = QueryParams.get("region");
  }
  /*
  if(QueryParams.get("type") !== '' && QueryParams.get("type") !== undefined){
  searchFacets.meta_B = QueryParams.get("type");
  typeWidget.value = QueryParams.get("type");
  }
  */


  if (QueryParams.get("level")) {
    searchFacets.meta_level = QueryParams.get("level");
    levelWidget.value = QueryParams.get("level");
  }

  if (QueryParams.get("subject")) {
    getSubjectFaculty(QueryParams.get("subject"));
    subjectWidget.value = QueryParams.get("subject");
  }

  if (QueryParams.get("mode") === 'online') {
    searchFacets.meta_course1modes = 'online';
    onlineWidget.checked = true;
  } // pagination - set the page / start number number


  if (!isNaN(QueryParams.get("page"))) page = QueryParams.get("page");
  searchFacets.start_rank = (page - 1) * postsPerPage + 1;
  if (resultsArea) doSearch();
})();