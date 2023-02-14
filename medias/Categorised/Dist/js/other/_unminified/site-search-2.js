/*
 * @author Ryan Kaye
 *
 * TODO
 * Filter out research hub from internal
 * *
 */
// If persisted then it is in the page cache, force a reload of the page.
(function () {
  window.onpageshow = function (evt) {
    if (evt.persisted) {
      document.body.style.display = "none";
      location.reload();
    }
  };
})();

(function () {
  // Vars
  var page;
  var query = "";
  var postsPerPage = 10;
  var jsonUrl = "https://www.stir.ac.uk/s/search.json?";
  var collection = "external";
  var noOfPageLinks = 11; // odd number only because it doesnt include the current page

  var showCurator = true; // BestBets
  // DOM elements

  var searchForm = document.getElementById("site-search");
  var resultsArea = document.getElementById("site-search__results");
  var resultSummaryArea = document.getElementById("news-search__summary");
  var searchLoading = document.getElementById("site-search__loading");
  var searchInput = document.getElementById("site-search__search-input");
  var pagination = document.getElementById("pagination-box");
  var extFilters = document.querySelector(".c-internal-external-filters");
  var extCheckbox = document.getElementById("c-site-search-external__checkbox");
  var intCheckbox = document.getElementById("c-site-search-internal__checkbox");
  var intLabel = document.getElementById("c-site-search-internal__label"); // object to hold the config data with default values

  var searchFacets = {
    query: query,
    start_rank: 1,
    num_ranks: postsPerPage,
    collection: collection,
    meta_group: "",
    meta_group_not: "internal",
    meta_subgroup_not: ""
  };
  if (!searchForm) return;
  /* --------------------------------------------
   *  On Load
   * ------------------------------------------ */

  var onLoad = function onLoad() {
    query = QueryParams.get("query");
    page = 1; // reset the page to 1

    QueryParams.set("page", page);
    if (getAuthUserType() === "STUDENT") if (intLabel) intLabel.innerHTML = "Student pages";

    if (query) {
      searchInput.value = query;
      resetHTML();
      searchFacets.query = query;
      configSearch();
    }
  };
  /* --------------------------------------------
   * Function: Configure the search based on params
   * ------------------------------------------ */


  var configSearch = function configSearch() {
    // If the filters are on the page and an internal cookie is set
    if (extFilters) {
      if (getAuthUserType() === "STAFF" || getAuthUserType() === "STUDENT") {
        // Reset a few params
        searchFacets.meta_group = "";
        searchFacets.meta_group_not = "";
        searchFacets.meta_subgroup_not = "";
        showCurator = true; // Internal + External Checked

        if (extCheckbox.checked && intCheckbox.checked) {
          if (getAuthUserType() === "STUDENT") searchFacets.meta_subgroup_not = "staff";
        } // External NOT Checked + Internal Checked


        if (extCheckbox.checked === false && intCheckbox.checked) {
          searchFacets.meta_group = "internal&meta_group=media";
          if (getAuthUserType() === "STUDENT") searchFacets.meta_subgroup_not = "staff";
        } // Internal NOT Checked + External Checked


        if (extCheckbox.checked && intCheckbox.checked === false) {
          searchFacets.meta_group_not = "internal";
        } // Nothing Checked


        if (extCheckbox.checked === false && intCheckbox.checked === false) {
          searchFacets.query = "301eae7b00ca10104eb7cb36cac1a509"; // force an empty result set by using a nonsense query
        }
      }
    } // this will pick up the collection from the url, it let's us provide a deep search
    // on another collection (stirling) by link e.g. ?collection=stirling


    searchFacets.collection = QueryParams.get("collection") || collection;
    if (searchFacets.collection === "stirling") searchFacets.meta_group_not = "www";
    doSearch();
    updateDeepLinkUrls();
  };
  /* --------------------------------------------
   * Function: Query Funnelback
   * ------------------------------------------ */


  var doSearch = function doSearch() {
    var jsonUrlFull = jsonUrl;

    for (var key in searchFacets) {
      if (searchFacets.hasOwnProperty(key)) jsonUrlFull += key + "=" + searchFacets[key] + "&";
    }

    stir.getJSON(jsonUrlFull, outputResults);
  };
  /* --------------------------------------------
   *  Function: Output the data returned ot the page
   * ------------------------------------------ */


  var outputResults = function outputResults(data) {
    if (!resultsArea) return;

    if (data.error) {
      resultsArea.appendChild(stir.getMaintenanceMsg());
      searchLoading.style.display = "none";
      console.log(data.error);
      return;
    }

    if (!data.error) {
      resultsArea.innerHTML = render(data);
      var totalPosts = data.response.resultPacket.resultsSummary.totalMatching;
      var lastPost = searchFacets.start_rank + postsPerPage - 1;
      if (lastPost > totalPosts) lastPost = totalPosts;
      resultSummaryArea ? resultSummaryArea.innerHTML = StirSearchHelpers.formSearchSummaryHTML(totalPosts, searchFacets.start_rank, lastPost) : "";
      if (totalPosts < 1) resultsArea.innerHTML = "";

      if (pagination) {
        pagination.innerHTML = "";
        if (postsPerPage < totalPosts) pagination.innerHTML = StirSearchHelpers.formPaginationHTML(totalPosts, postsPerPage, page, noOfPageLinks);
      }

      stir.scrollToElement(searchForm, 10);
      searchLoading.style.display = "none";
      return;
    }
  };
  /* --------------------------------------------
   *  Function: Lets us know if the search page is internal or external
   * ------------------------------------------ */


  var getSiteArea = function getSiteArea(myUrl) {
    var uri = myUrl.split("/");
    if (uri[3] === "internal-students") return "STUDENT";
    if (uri[3] === "portal") return "STUDENT";
    if (uri[3] === "internal-staff") return "STAFF";
    if (uri[3] === "media") return "MEDIA";
    return "EXTERNAL";
  };
  /* --------------------------------------------
   * Function: Is this a logged in user - if so whats the user type (STAFF || STUDENT)
   * ------------------------------------------ */


  var getAuthUserType = function getAuthUserType() {
    if (Cookies.get("psessv0")) return Cookies.get("psessv0").split("|")[0];
    return "EXTERNAL";
  };
  /* --------------------------------------------
   *  Function: Reset results area while loading data
   * ------------------------------------------ */


  var resetHTML = function resetHTML() {
    resultSummaryArea.innerHTML = "";
    pagination.innerHTML = "";
    searchLoading.style.display = "block";
  };
  /* --------------------------------------------
   *  Function: Deep links
   * ------------------------------------------ */


  var updateDeepLinkUrls = function updateDeepLinkUrls() {
    var qs = "&query=" + encodeURIComponent(searchFacets.query);
    var myLinkId = "site-search-link__deep-search";

    if (document.getElementById(myLinkId)) {
      var myLink = document.getElementById(myLinkId);
      var myUrl = myLink.getAttribute("href") + qs;
      myLink.setAttribute("href", myUrl);
    }
  };
  /* --------------------------------------------
   *  Function: Pagination clicks
   * ------------------------------------------ */


  var doPageClick = function doPageClick() {
    searchLoading.style.display = "block";
    QueryParams.set("page", page);
    searchFacets.start_rank = (page - 1) * postsPerPage + 1;
    searchFacets.query = searchInput.value;
    configSearch();
  };
  /* --------------------------------------------
   *  Event: Pagination click events
   * ------------------------------------------ */


  if (pagination) {
    pagination.addEventListener("click", function (e) {
      if (e.target.matches("#pagination-box a")) page = e.target.getAttribute("data-page");
      if (e.target.matches("#pagination-box a span")) page = e.target.parentNode.getAttribute("data-page");
      doPageClick();
      e.preventDefault();
    }, false);
  }
  /* --------------------------------------------
   *  Event: Search Form Submission
   * ------------------------------------------ */


  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      page = 1; // reset the page to 1

      QueryParams.set("page", page);
      searchFacets.start_rank = "1";
      QueryParams.set("query", searchInput.value);
      searchFacets.query = searchInput.value;
      resetHTML();
      configSearch();
      e.preventDefault();
    });
  }
  /* --------------------------------------------
   *  Event: Internal Checkbox Click
   * ------------------------------------------ */


  if (intCheckbox) {
    intCheckbox.onclick = function (e) {
      page = 1;
      searchFacets.start_rank = (page - 1) * postsPerPage + 1;
      QueryParams.set("page", page);
      resetHTML();
      searchFacets.query = searchInput.value;
      configSearch();
    };
  }
  /* --------------------------------------------
   *  Event: External Checkbox Click
   * ------------------------------------------ */


  if (extCheckbox) {
    extCheckbox.onclick = function (e) {
      page = 1;
      searchFacets.start_rank = (page - 1) * postsPerPage + 1;
      QueryParams.set("page", page);
      resetHTML();
      searchFacets.query = searchInput.value;
      configSearch();
    };
  }
  /* --------------------------------------------
   *  Function: Builds the icon html
   * ------------------------------------------ */


  function renderIcon(iconType) {
    switch (iconType) {
      case "Public":
        icon = "uos-study-abroad";
        text = "Public";
        break;

      case "Media":
        icon = "uos-document";
        text = "Media";
        break;

      case "Internal":
        icon = "uos-security-unlocked";
        text = "Internal";
        break;

      default:
        icon = "uos-study-abroad";
        text = "Public";
    }

    return '<span class="c-site-search__external-icon-wrapper"><span class="c-site-search__external-icon ' + icon + '"></span> <span class="show-for-sr">' + text + "</span></span>";
  }
  /* --------------------------------------------
   * Function: Form the html for results
   * TODO: Break this up
   * ------------------------------------------ */


  var render = function render(data) {
    var html = [];
    html.push('<div class="c-search-result">');
    html.push('<div class="grid-x">'); // Curator (BestBets)

    if (showCurator && page == 1) {
      var curs = data.response.curator.exhibits;

      for (var key in curs) {
        var val = curs[key];

        if (val.titleHtml) {
          // Internal Only checked
          if (searchFacets.meta_group == "internal") {
            // Internal Student (and Staff by Assoc)
            if (getSiteArea(val.displayUrl) === "STUDENT" && getAuthUserType() !== "EXTERNAL") {
              html.push('<div class="cell small-12 c-search-result">');
              html.push('<p class="c-search-result__link"><a href="' + val.linkUrl + '">' + val.titleHtml + "</a> " + renderIcon("Internal") + "</p>");
              html.push('<p class="c-search-result__summary">' + val.descriptionHtml + "</p>");
              html.push("</div>");
            } // Internal Staff Only


            if (getSiteArea(val.displayUrl) === "STAFF" && getAuthUserType() === "STAFF") {
              html.push('<div class="cell small-12 c-search-result">');
              html.push('<p class="c-search-result__link"><a href="' + val.linkUrl + '">' + val.titleHtml + "</a> " + renderIcon("Internal") + "</p>");
              html.push('<p class="c-search-result__summary">' + val.descriptionHtml + "</p>");
              html.push("</div>");
            }
          } // External Checked and Possibly Internal Checked


          if (searchFacets.meta_group === "") {
            // External Only BB
            if (getSiteArea(val.displayUrl) === "EXTERNAL") {
              html.push('<div class="cell small-12 c-search-result">');
              html.push('<p class="c-search-result__link"><a href="' + val.linkUrl + '">' + val.titleHtml + "</a> " + renderIcon("Public") + "</p>");
              html.push('<p class="c-search-result__summary">' + val.descriptionHtml + "</p>");
              html.push("</div>");
            }

            if (intCheckbox) {
              // Internal checked along with External
              if (intCheckbox.checked) {
                // Internal Student (or Staff by Assoc) BB
                if (getSiteArea(val.displayUrl) === "STUDENT" && getAuthUserType() !== "EXTERNAL") {
                  html.push('<div class="cell small-12 c-search-result">');
                  html.push('<p class="c-search-result__link"><a href="' + val.linkUrl + '">' + val.titleHtml + "</a> " + renderIcon("Internal") + "</p>");
                  html.push('<p class="c-search-result__summary">' + val.descriptionHtml + "</p>");
                  html.push("</div>");
                } // Internal Staff Only BB


                if (getSiteArea(val.displayUrl) === "STAFF" && getAuthUserType() === "STAFF") {
                  html.push('<div class="cell small-12 c-search-result">');
                  html.push('<p class="c-search-result__link"><a href="' + val.linkUrl + '">' + val.titleHtml + "</a> " + renderIcon("Internal") + "</p>");
                  html.push('<p class="c-search-result__summary">' + val.descriptionHtml + "</p>");
                  html.push("</div>");
                }
              }
            }
          }
        }
      } // end of for loop

    } // Loop the search results and form the html


    var rst = data.response.resultPacket.results;

    for (var key2 in rst) {
      var val2 = rst[key2];
      var iconHtml = "";

      if (val2.displayUrl) {
        var urlType = getSiteArea(val2.displayUrl);
        if (urlType === "EXTERNAL") iconHtml = renderIcon("Public");
        if (urlType === "MEDIA") iconHtml = renderIcon("Media");
        if (urlType === "STAFF" || urlType === "STUDENT") iconHtml = renderIcon("Internal");
        if (getAuthUserType() === "EXTERNAL") iconHtml = "";
        var url = "https://www.stir.ac.uk" + val2.clickTrackingUrl;
        html.push('<div class="cell small-12 c-search-result">');
        html.push('<p class="c-search-result__link"><a href="' + url + '">' + stir.String.getFirstFromSplit.call(val2.title, "|") + "</a>" + iconHtml + "</p>");
        html.push('			<p class="c-search-result__breadcrumb">' + (val2.metaData.bc || val2.displayUrl) + "</p>");
        html.push('<p class="c-search-result__summary">' + val2.summary + "</p>");
        html.push("</div>");
      }
    }

    html.push("</div>");
    html.push("</div>");
    return html.join("\n");
  }; // Lets go!


  onLoad();
})();