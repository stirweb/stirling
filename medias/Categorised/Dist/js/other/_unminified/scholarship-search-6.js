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
   * VARS
   */

  const countryNodes = stir.nodes("[data-scholcountrylisting]");
  const subjectNodes = stir.nodes("[data-scholsubjectlisting]");

  const debug = stir.node("[data-debug]") ? true : false;
  //const debug = false;

  /* DOM elements for FORM version (found on the main scholarship page) */

  const inputNation = stir.node("#scholarship-search__nationality");
  const inputSubject = stir.node("#scholarship-search__subject");
  const inputLevel = stir.node("#scholarship-search__level");
  const inputFeeStatus = stir.node("#scholarship-search__feestatus");

  const searchForm = stir.node("#scholarship-search__form");
  const resultsArea = stir.node("#scholarship-search__results");
  const searchClearBtn = stir.node("#scholarship-search__clear");

  const stirt4globals = stir.t4Globals || {};

  const regionmacros = stirt4globals.regionmacros || [];
  const feeStatusesAll = stirt4globals.feeStatusesAll.feestatuses || [];

  const CONSTANTS = {
    cookieType: "scholarship",
    showUrlToFavs: "true",
    debug: debug,
    regions: {
      ukroi: stir.flatten(regionmacros.filter((item) => item.tag === "UK and ROI").map((el) => el.data)), // Changed from item.tag === "United Kingdom" to include ROI 20 Sep 2022
    },
    regionmacros:
      stir.filter((item) => {
        if (item.tag) return item;
      }, regionmacros) || [],
    feeStatusesAll: feeStatusesAll,
    feeStatusAllSize: feeStatusesAll
      .map((item) => item.name)
      .join(", ")
      .split(", ").length,
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
   *
   * DATA PROCESSING
   *
   */

  /*
   * Helper Function: filterData
   * Find the results that match the filters. This is where we call the isMatch function to determine if each scholarship matches the filters and return only the scholarships that match. We also check that the scholarship has a title as some of the data entries are blank and we dont want to include these in the results.
   * @param {Object} consts - the constants object with various configuration values
   * @param {Object} filters - the filter object with the current filter values
   * @param {Object} schol - the scholarship object to filter
   * @return {Object} filteredSchol - the scholarship object if it matches the filters, undefined otherwise
   */
  const filterData = stir.curry((consts, filters, schol) => {
    if (schol.title) {
      if (isMatch(filters, schol, consts)) {
        return schol;
      }
    }
  });

  /*
   * Helper Function: mapRank
   * Return the schol object with a ranking attached
   * @param {Object} filters - the filter object with the current filter values
   * @param {Object} schol - the scholarship object to calculate the rank for
   * @return {Object} rankedSchol - the scholarship object with an added rank property that indicates its rank based on how well it matches the filters. The lower the rank value, the better the match.
   */
  const mapRank = stir.curry((filters, schol) => {
    const rank = getRank(filters, schol);
    return { rank: rank, scholarship: schol };
  });

  /*
   *
   * Matching Helpers
   *
   */

  /*
   * Helper Function: matchStudyLevel
   * Determine if a scholarship matches the study level filter
   * If the filter study level is included in the scholarship study level string, then we have a match. This allows us to match "Postgraduate Taught" filter value to scholarships that are tagged as "Postgraduate (taught)" for example.
   * @param {String} scholStudyLevel - the study level string from the scholarship data (e.g. "Postgraduate (taught)")
   * @param {String} filterStudyLevel - the study level filter value (e.g. "Postgraduate Taught")
   * @return {Boolean} isMatch - true if the scholarship matches the study level filter, false otherwise
   */
  const matchStudyLevel = (scholStudyLevel, filterStudyLevel) => {
    if (filterStudyLevel === "Any") return true;

    return scholStudyLevel.includes(filterStudyLevel);
  };

  /*
   * Helper Function: matchFeeStatus
   * Determine if a scholarship matches the fee status filter
   * If the filter fee status is included in the scholarship fee status string, then we have a match. This allows us to match "European" filter value to scholarships that are tagged as "European" or "European, International" for example.
   * We also want to match "All" filter value to any scholarship that has a fee status, even if it doesnt include "All" in the string as this indicates that the scholarship is available to all fee statuses.
   * @param {String} scholFeeStatus - the fee status string from the scholarship data (e.g. "European, International")
   * @param {String} filterFeeStatus - the fee status filter value (e.g. "European")
   * @return {Boolean} isMatch - true if the scholarship matches the fee status filter, false otherwise
   */
  const matchFeeStatus = (scholFeeStatus, filterFeeStatus) => {
    //if (filterFeeStatus == "Any" || filterFeeStatus == "International") return true;
    //if (scholFeeStatus == "Any" || scholFeeStatus == "International") return true;

    if (filterFeeStatus == "Any") return true;

    // if (filterFeeStatus == "European") {
    //   if (scholFeeStatus == "European" || scholFeeStatus == "International") return true;
    // }

    return scholFeeStatus.includes(filterFeeStatus);
  };

  /*
   * Helper Function: matchSubject
   * Determine if a scholarship matches the subject filter
   * Match the subject filter against both the promoted subject and the other subject fields in the data.
   * @param {Object} scholData - the scholarship data object that includes the promotedSubject and otherSubject fields
   * @param {String} filterSubject - the subject filter value (e.g. "Engineering")
   * @return {Boolean} isMatch - true if the scholarship matches the subject filter, false otherwise
   */
  const matchSubject = (scholData, filterSubject) => {
    if (filterSubject === "Any") return true;

    return scholData.otherSubject.toLowerCase().includes(filterSubject.toLowerCase()) || scholData.promotedSubject.toLowerCase().includes(filterSubject.toLowerCase());
  };

  /*
   * NO LONGER IN USE - Faculty filter has been removed but this function is left in place in case we want to reinstate it at a later date
   */
  const matchFaculty = (scholFaculty, filterFaculty) => {
    return true; // NO LONGER IN USE
    //return scholFaculty.includes(filterFaculty) || scholFaculty.includes("All Faculties");
  };

  /*
   * Helper Function: Determine if a scholarship matches the international filters
   * If the filter nation is included in the ukroi region macro, then we dont want to match "All international" scholarships as these are not available to UK and ROI students
   * If the filter nation is not included in the ukroi region macro, then we do want to match "All international" scholarships as these are available to students outside of the UK and ROI
   * @param {String} scholNation - the nationality string from the scholarship data (e.g. "England, Northern Ireland, Scotland, Wales")
   * @param {String} filterNation - the nation filter value (e.g. "Scotland")
   * @param {Array} ukroi - the array of countries that are included in the "UK and ROI" region macro
   * @return {Boolean} isMatch - true if the scholarship matches the international filters, false otherwise
   */
  const isInternational = (scholNation, filterNation, ukroi) => {
    if (ukroi.includes(filterNation)) return false;
    return scholNation.includes("All international");
  };

  /*
   * Helper Function: Determine if a scholarship matches the region filters
   * @param {String} scholNation - the nationality string from the scholarship data (e.g. "England, Northern Ireland, Scotland, Wales")
   * @param {Array} filterRegions - the region filter values (e.g. ["EU", "Commonwealth"])
   * @return {Boolean} isMatch - true if the scholarship matches any of the region filters, false otherwise
   */
  const isRegion = (scholNation, filterRegions) => {
    if (!filterRegions || !filterRegions.length) return false;

    const hasRegion = filterRegions.map((item) => scholNation.includes(item));

    return stir.any((item) => item, hasRegion);
  };

  /*
   * Helper Function: Determine if a scholarship matches the location filters
   * This includes the specific nation filter, the international filter and the region filters
   * @param {String} scholNation - the nationality string from the scholarship data (e.g. "England, Northern Ireland, Scotland, Wales")
   * @param {String} filterNation - the nation filter value (e.g. "Scotland")
   * @param {Array} filterRegions - the region filter values (e.g. ["EU", "Commonwealth"])
   * @param {Array} ukroi - the array of countries that are included in the "UK and ROI" region macro
   * @return {Boolean} isMatch - true if the scholarship matches the location filters, false otherwisexw
   */
  const matchLocation = (scholNation, filterNation, filterRegions, ukroi) => {
    if (filterNation === "Any") return true;

    // fix issue where content folk select the individual countries instead of United Kingdom - if scholNation includes England, Northern Ireland, Scotland, Wales append  "United Kingom"
    if (scholNation.includes("England") && scholNation.includes("Northern Ireland") && scholNation.includes("Scotland") && scholNation.includes("Wales")) {
      scholNation += ", United Kingdom";
    }

    return (
      scholNation.includes(filterNation) || scholNation.includes("All nationalities") || isInternational(scholNation, filterNation, ukroi) || isRegion(scholNation, filterRegions)
    );
  };

  /*
   * Helper Function: Determine if a scholarship matches the filters
   * This is where we call the individual filter matching functions and combine the results to determine if the scholarship matches all filters
   * @param {Object} filters - the filter object with the current filter values
   * @param {Object} schol - the scholarship object to compare against the filters
   * @param {Object} consts - the constants object that includes the region macros and other constants that may be needed for the filter matching functions
   * @return {Boolean} isMatch - true if the scholarship matches all filters, false otherwise
   */
  const isMatch = (filters, schol, consts) => {
    const matchFilter = [
      matchStudyLevel(schol.studyLevel, filters.studyLevel),
      matchFeeStatus(schol.feeStatus, filters.feeStatus),
      matchSubject(schol, filters.subject),
      matchFaculty(schol.faculty, filters.faculty),
      matchLocation(schol.nationality, filters.nation, filters.regions, consts.regions.ukroi),
    ];

    return stir.all((b) => b, matchFilter);
  };

  /*
   * Helper Function: getInitialRank()
   * Based on the hard coded oredering (ugOrder, pgOrder, ugOrderFaculty, pgOrderFaculty)
   * Set to -30000 so this will always take precedence
   * If no order is set, default to 1000 so that it will be ranked below any scholarship with an order but above any scholarship that doesnt match the filters at all (which are set to 10000)
   * @param {Object} schol - the scholarship object
   * @param {Object} filters - the filter object with the current filter values
   * @return {String} rank - the initial rank value based on the order fields
   */
  const getInitialRank = (schol, filters) => {
    // no filters
    if (!filters.sortBy || filters.sortBy === "") {
      if (schol.ugOrder !== "") return schol.ugOrder - 30000;
      if (schol.pgOrder !== "") return schol.pgOrder - 30000;
    }

    if (filters.sortBy === "ugOrder") if (schol.ugOrder !== "") return schol.ugOrder - 30000;
    if (filters.sortBy === "pgOrder") if (schol.pgOrder !== "") return schol.pgOrder - 30000;
    if (filters.sortBy === "ugOrderFaculty") if (schol.ugOrderFaculty !== "") return schol.ugOrderFaculty - 30000;
    if (filters.sortBy === "pgOrderFaculty") if (schol.pgOrderFaculty !== "") return schol.pgOrderFaculty - 30000;

    return "1000";
  };

  /* 
    getPos: Returns an int
  */
  const getPos = (scholVal, filterVal) => {
    return scholVal.toLowerCase().indexOf(filterVal.toLowerCase()); // TODO Work in String length
  };

  /*
   * Helper Function: getRankValue()
   * If the scholarship value matches the filter value, calculate a rank value based on the position of the filter value in the
   * scholarship value string. This means that if the filter value is at the start of the string it will be ranked higher than if it is at the end.
   * The weight is used to determine how much influence this factor has on the overall ranking. For example
   * @param {String} scholVal - the scholarship value to compare (e.g. "England, Northern Ireland, Scotland, Wales")
   * @param {String} filterVal - the filter value to compare against (e.g. "Scotland")
   * @param {String} startVal - the current rank value before this factor is applied
   * @param {Int} weight - the weight to apply to this factor (e.g. -100 for location, -20000 for subject)
   * @return {String} rank - the new rank value after applying this factor
   */
  const getRankValue = (scholVal, filterVal, startVal, weight) => {
    if (filterVal !== "" && scholVal.toLowerCase().includes(filterVal.toLowerCase())) {
      return calcRank(startVal, weight, getPos(scholVal, filterVal));
    }
    return startVal;
  };

  /*
   * Helper Function: calcRank()
   * Determine the final weighting (position) using the helpers above. The lower the rank value, the higher up the list the scholarship will be.
   * The rank value is a string to allow for easy concatenation of the different factors that influence the ranking.
   * @param {String} initialVal - the initial rank value
   * @param {Int} weight - the weight to apply
   * @param {Int} stringPos - the position of the filter value in the scholarship value string
   * @return {String} rank - the final rank value
   */
  const calcRank = (initialVal, weight, stringPos) => {
    return String(weight + parseInt(initialVal) + stringPos);
  };

  /*
   * Helper Function: getRank()
   * Determine the final rank value for a scholarship based on how well it matches the filters. The lower the rank value, the better the match.
   * @param {Object} filters - the filter object with the current filter values
   * @param {Object} schol - the scholarship object to calculate the rank for
   * @return {String} rank - the final rank value for this scholarship based on how well it matches the filters. The lower the rank value, the better the match.
   */
  const getRank = (filters, schol) => {
    const initrank = getInitialRank(schol, filters);

    const rank = stir.isNumeric(parseInt(initrank)) ? initrank : "1000";
    const rank2 = getRankValue(schol.nationality, filters.nation, rank, -10000);
    const rank3 = isRegion(schol.nationality, filters.regions) ? calcRank(rank2, -100, 0) : rank2;
    const rank4 = getRankValue(schol.promotedSubject, filters.subject, rank3, -20000);
    const rank5 = getRankValue(schol.feeStatus, filters.feeStatus, rank4, -1010);

    return rank5;
  };

  /*
   * Helper Function: getReorderedString()
   * Reorder a comma separated string alphabetically. This is used to reorder the study level string so that we can match the filter value against it more easily in the matchStudyLevel function. For example, if the scholarship study level is "Postgraduate (taught), Undergraduate" and the filter value is "Undergraduate", we want to reorder the scholarship study level to "Undergraduate, Postgraduate (taught)" so that we can match the filter value against it more easily.
   * @param {String} str - the comma separated string to reorder (e.g. "Postgraduate (taught), Undergraduate")
   * @param {String} direction - the direction to reorder the string. If "desc", the string will be reordered in descending order, if "asc" or any other value, the string will be reordered in ascending order.
   * @return {String} reorderedStr - the reordered comma separated string (e.g. "Undergraduate, Postgraduate (taught)")
   */
  const getReorderedString = (str, direction) => {
    return direction !== "desc" ? str.split(", ").sort() : str.split(", ").sort().reverse();
  };

  /*
   * Helper Function: getFeeStatusFullName()
   * Return Fee Status as an array of full strings
   * @param {Array} feeStatusesAll - the array of all possible fee statuses
   * @param {String} feeStatus - the comma separated string of fee statuses to convert
   * @return {Array} feeStatusFullNames - the array of full fee status names
   */
  const getFeeStatusFullName = (feeStatusesAll, feeStatus) => {
    return feeStatus.split(", ").map((schol) => {
      const matched = stir.filter((el) => {
        if (el.value === schol) return el;
      }, feeStatusesAll);

      if (matched[0]) return matched[0].name;
      return schol;
    });
  };

  /*
   * Helper Function: getFeeStatusText()
   * Return the fee status text to display based on the fee status filter and the scholarship fee status. If the scholarship fee
   * status includes all possible fee statuses, return "All fee statuses". Otherwise, return the scholarship fee status with the
   * full names of the fee statuses included in the scholarship fee status. If the scholarship fee status does not include the
   * fee status filter, include the fee status filter in brackets at the end to indicate that this scholarship is being shown because it matches the other filters even though it doesnt match the fee status filter.
   * @param {String} feeStatus - the comma separated string of fee statuses from the scholarship data
   * @param {Object} consts - the constants object that includes the array of all possible fee statuses
   * @param {String} feeStatusFilter - the fee status filter value (e.g. "European")
   */
  const getFeeStatusText = (feeStatus, consts, feeStatusFilter) => {
    const feeStatuses = getFeeStatusFullName(consts.feeStatusesAll, feeStatus);
    const feeStatusFilterFull = getFeeStatusFullName(consts.feeStatusesAll, feeStatusFilter);
    // const appendix = !feeStatuses.join(", ").includes(feeStatusFilterFull) ? feeStatuses.join(", ") + ` (including ` + feeStatusFilterFull + ` )` : feeStatuses.join(", ");

    const appendix = feeStatuses.join(", ");

    return feeStatuses.join(", ").split(", ").length === consts.feeStatusAllSize ? "All fee statuses" : appendix;
  };

  /*
   *
   * RENDERERS
   *
   */

  /*
   * Render Function: renderPagination
   * Render the pagination button if there are more results to show based on the total posts and the last post currently being shown
   * @param {Object} meta - the meta object that includes the current page, total posts, and last post currently being shown
   * @return {String} paginationHTML - the HTML string for the pagination button if there are more results to show, an empty string otherwise
   */
  const renderPagination = ({ currentPage, totalPosts, last }) => {
    return last >= totalPosts
      ? ``
      : `<div class="cell text-center">
              <button class="button hollow tiny" data-page="${currentPage}">Load more results</button>
        </div>`;
  };

  /*
   * Render Function: renderFormResults
   * Form the HTML wrapper for the results based on the meta information and the array of scholarship data to render. This includes the results count and the pagination button.
   * @param {Object} consts - the constants object that includes various configuration values
   * @param {Object} _meta - the meta object that includes the current page, total posts, and last post currently being shown
   * @param {Array} _data - the array of scholarship data to render
   * @return {String} formResultsHTML - the HTML string for all results
   */
  const renderFormResults = stir.curry((consts, _meta, _data) => {
    return `
        <p class="u-margin-bottom text-center"> Displaying  ${_meta.start + 1} - ${_meta.last}  of  <strong>${_meta.totalPosts} results</strong> that match your criteria.</p>
        ${stir.map((schol) => renderItem(consts, _meta, schol), _data).join("")} 
        <div class="grid-x " id="pagination-box">
          ${renderPagination(_meta)}
        </div> `;
  });

  /*
   * Helper Function: renderFavBtns
   * Render the favourite button based on whether the scholarship is already in the favourites or not. If it is in the favourites, render the remove from favourites button, otherwise render the add to favourites button.
   * @param {Boolean} showUrlToFavs - whether to include the URL to the scholarship in the data attributes of the favourite buttons. This is used in the manage favourites page to allow users to navigate to the scholarship from their favourites list.
   * @param {Array} cookie - the array returned from the getFav function that indicates whether this scholarship is in the favourites or not. If the array is empty, the scholarship is not in the favourites, if it has a value, it is in the favourites and the date it was added is included in the first element of the array.
   * @param {String} id - the id of the scholarship to use in the data attributes of the favourite buttons
   * @return {String} favBtnHTML - the HTML string for the favourite button based on whether the scholarship is in the favourites or not
   */
  const renderFavBtns = (showUrlToFavs, cookie, id) => {
    return cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, showUrlToFavs) : stir.favourites.renderAddBtn(id, showUrlToFavs);
  };

  /*
   * Render Function: renderTag
   * Render a tag element for the study level tags that appear at the top of each scholarship result. The content of the tag is based on the scholarship study level string.
   * @param {String} item - the study level string to render as a tag (e.g. "Undergraduate", "Postgraduate (taught)")
   * @return {String} tagHTML - the HTML string for the tag element with the study level string as its content
   */
  const renderTag = (item) => `<span class="u-bg-heritage-green--10 c-tag u-mr-1 ">${item}</span>`;

  /*
   * Render Function: renderDetail
   * Form the HTML for the details information snippet that appears under the scholarship teaser in the search results. This is used to display the scholarship value, number of awards and fee status in a consistent format. If there is no content to display, an empty string is returned and the details snippet is not rendered.
   * @param {String} content - the content to display in the details snippet
   * @param {String} header - the header for the details snippet
   * @param {Boolean} addDivider - whether to add a divider to the details snippet
   * @return {String} detailHTML - the HTML string for the details snippet
   */
  const renderDetail = (content, header, addDivider) => {
    return !content
      ? ``
      : `
        <div class="cell small-12  large-4 ${addDivider ? `u-grey-line-left u-px-1 u-no-border-medium` : ``} ">
          <div class="u-mb-fixed-1 u-h-full">
            <p class="u-font-bold">${header}</p>
            <p class="u-m-0">${content}</p>
          </div>
        </div> `;
  };

  /*
   * Render Function: renderItem
   * Form the HTML for an individual scholarship result item based on the scholarship data and the meta information. This includes the scholarship title, teaser, study level tags, value, number of awards, fee status and the favourite button.
   * @param {Object} consts - the constants object that includes various configuration values
   * @param {Object} _meta - the meta object that includes the current page, total posts, and last post currently being shown
   * @param {Object} schol - the scholarship object to render
   * @return {String} itemHTML - the HTML string for the individual result
   */
  const renderItem = (consts, _meta, schol) => {
    const cookie = stir.favourites.getFav(schol.scholarship.id, consts.cookieType);
    return `
        <div class="u-margin-bottom u-bg-white u-p-2 u-heritage-line-left u-border-width-5 u-relative">
            <div class="u-absolute u-top--16">
            ${getReorderedString(schol.scholarship.studyLevel, "desc").map(renderTag).join("")}
            </div>
            <div class="grid-x ">
                <div class="cell  u-mt-1">
                    <p class="u-heritage-green u-mb-2">
                      <strong><a href="${schol.scholarship.url}">${schol.scholarship.title}</a></strong></p>
                    <p class="u-mb-2">${schol.scholarship.teaser}</p> 
                </div>

                ${renderDetail(schol.scholarship.value, "Value", false)}
                ${renderDetail(schol.scholarship.awards, "Number of awards", true)}
                ${renderDetail(getFeeStatusText(schol.scholarship.feeStatus, consts, _meta.feeStatusFilter) + " ", "Fee status", true)}
              
                ${debug && schol ? renderDebug(schol) : ""}
            <div class="cell text-sm u-pt-2" id="favbtns${schol.scholarship.id}">
              ${renderFavBtns(consts.showUrlToFavs, cookie, schol.scholarship.id)}
            </div>
            </div>
        </div>`;
  };

  /*
   * Render Function: renderDebug
   * Form the HTML for debugging info
   * @param {Object} schol - the scholarship object to render debug info for
   * @return {String} debugHTML - the HTML string for the debug info
   */
  const renderDebug = (schol) => {
    return `
        <div class="cell u-mt-2 u-p-2 u-border-solid " >
          <h3>Debugger</h3>
          <b>Weighting: </b> ${schol.rank}
          <br><b>Nationalities (M):</b> ${schol.scholarship.nationality}
          <br><b>Fee Status (M):</b> ${schol.scholarship.feeStatus}
          <br><b>Promoted (R):</b> ${schol.scholarship.promotedSubject}
          <br><b>Other (Q):</b> ${schol.scholarship.otherSubject}
          <br><b>Order (UG, PG):</b> ${schol.scholarship.ugOrder}, ${schol.scholarship.pgOrder}
          <br><b>Faculty:</b> ${schol.scholarship.faculty}
          <br><b>Faculty Order (UG, PG):</b> ${schol.scholarship.ugOrderFaculty} , ${schol.scholarship.pgOrderFaculty}</p>
        </div> `;
  };

  /*
   *
   * DOM EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   *
   */

  /*
   * Output the html content to the page
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
   * Populate selects with query params from url string e.g. ?level=ug
   */
  const setFormValues = (nodes) => {
    nodes.inputNation.value = QueryParams.get("nationality") || "Any";
    nodes.inputSubject.value = QueryParams.get("subject") || "!padrenullquery";
    nodes.inputLevel.value = QueryParams.get("level") || "Any";
    nodes.inputFeeStatus.value = QueryParams.get("feestatus") || "Any";

    return true;
  };

  /*
   *
   * DOM EVENTS: USER INPUT (!!SIDE EFFECTS!!)
   *
   */

  const handleSearchResultFavClick = (consts) => (event) => {
    const target = event.target.closest("button");
    if (!target || !target.dataset || !target.dataset.action) return;

    const updateFavButtonDisplay = (id) => {
      const cookie = stir.favourites.getFav(id, consts.cookieType);
      const node = stir.node("#favbtns" + id);

      if (node) {
        setDOMContent(node)(renderFavBtns(consts.showUrlToFavs, cookie, id));
      }
    };

    if (target.dataset.action === "addtofavs") {
      stir.favourites.addToFavs(target.dataset.id, consts.cookieType);
      updateFavButtonDisplay(target.dataset.id);
    }

    if (target.dataset.action === "removefav") {
      stir.favourites.removeFromFavs(target.dataset.id);
      updateFavButtonDisplay(target.dataset.id);

      if (consts.activity === "managefavs") {
        const node = stir.node("#fav-" + target.dataset.id);
        if (node) setDOMContent(node)("");
      }
    }
  };

  /*
   * Filter Helper functions
   */

  const getRegionTags = stir.curry((scholNation, item) => {
    if (item.data.includes(scholNation)) {
      return item.tag;
    }
    return "!No findy me!";
  });

  const getInputValue = (input) => {
    if (!input.options[input.selectedIndex].value) return "Any";
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
    if (!value) return "Any";

    if (type === "Faculty") return "";
    if (value === "!padrenullquery") return "";

    return value.toLowerCase();
  };

  const getFaculty = (type, value) => {
    if (!value) return "Any";

    if (type === "Subject") return "";
    if (value === "!padrenullquery") return "";

    return value;
  };

  const getStudyLevel = (value) => {
    if (!value) return "Any";

    if (value === "Postgraduate Taught") return "Postgraduate (taught)";
    if (value === "Postgraduate Research") return "Postgraduate (research)";

    return value;
  };

  //const getSubjectType = (value) => (value && value.length > 0 ? value : "");

  /*
   * Extract filter vars from the form and reconfig them if nec
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
   * Main controller function
   * This is the main function that is called. It takes filter values, processes the scholarship data through the filter, map and sort functions
   * to get the final array of scholarship data to render based on the current filters and the ranking algorithm, and then renders the results to the page.
   * @param {Boolean} setFiltersFlag - whether to set the form values based on the query params in the URL. This is used when the page is first loaded to set the form values based on the URL, but not when the form is submitted as we want to get the filter values directly from the form inputs in that case.
   * @param {Int} page - the current page number for pagination
   * @param {Object} consts - the constants object that includes various configuration values
   * @param {Object} initMeta - the initial meta object that includes the default values for the meta information
   * @param {Array} initData - the initial array of scholarship data to process and render
   * @return {Void} This function does not return anything, it has the side effect of rendering the scholarship results to the page based on the current filters and pagination.
   */
  const main = (setFiltersFlag, page, consts, initMeta, initData) => {
    if (setFiltersFlag) setFormValues(consts.nodes);

    // Currys
    const setDOMResults = page === 1 ? setDOMContent(consts.nodes.resultsArea) : appendDOMContent(consts.nodes.resultsArea);
    const filterDataCurry = stir.filter(filterData(consts, getFilterVars(consts.nodes, consts.regionmacros)));
    const mapRankCurry = stir.map(mapRank(getFilterVars(consts.nodes, consts.regionmacros)));
    const sortDataCurry = stir.sort((a, b) => (parseInt(a.rank) < parseInt(b.rank) ? -1 : parseInt(a.rank) > parseInt(b.rank) ? 1 : 0));

    // Process the data through the filter, map and sort functions to get the final array of scholarship data to render based on the current filters and the ranking algorithm
    const data = stir.compose(sortDataCurry, mapRankCurry, filterDataCurry)(initData);

    const newMeta = {
      currentPage: page,
      totalPosts: data.length,
      start: (page - 1) * initMeta.postsPerPage,
      end: (page - 1) * initMeta.postsPerPage + initMeta.postsPerPage,
      feeStatusFilter: getFilterVars(consts.nodes, consts.regionmacros).feeStatus,
    };

    const last = newMeta.end > newMeta.totalPosts ? newMeta.totalPosts : newMeta.end;
    const meta = stir.Object.extend({}, initMeta, newMeta, { last: last });

    const paginationFilter = stir.filter((schol, index) => index >= meta.start && index < last);
    const renderer = renderFormResults(consts, meta);

    stir.compose(setDOMResults, renderer, paginationFilter)(data);

    consts.nodes.resultsArea.addEventListener("click", handleSearchResultFavClick(consts));
  };

  /*
   * --------------------------------------------------------------------------------------
   * SCHOLARSHIP FINDER CONTROLLER - THE MAIN MAN
   * https://www.stir.ac.uk/scholarships/
   * --------------------------------------------------------------------------------------
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
      },
      false,
    );

    /* 
      EVENT: Reset filters button click 
    */
    if (searchClearBtn) {
      searchClearBtn.onclick = (e) => {
        const params = {
          page: 1,
          nationality: "Any",
          subject: "!padrenullquery",
          level: "Any",
          feestatus: "Any",
        };

        QueryParams.set(params);

        main(true, 1, CONSTANTS, initialMeta, initialData);
        stir.scrollToElement(searchForm, -40);

        e.preventDefault();
        return false;
      };
    }

    /*
       On load
     */

    const page = stir.isNumeric(QueryParams.get("page")) ? QueryParams.get("page") : 1;
    main(true, page, CONSTANTS, initialMeta, initialData);
  }

  /*
   * --------------------------------------------------------------------------------------
   * HARD CODED LISTINGS
   * eg on the international Pages
   * --------------------------------------------------------------------------------------
   */

  /* 
    Generate the html for the listing 
  */
  const renderHardcodedResults = stir.curry((data) => {
    return stir.map((el) => `<li ><a href="${el.scholarship.url}">${el.scholarship.title}</a> ${debug ? el.rank : ""}</li>`, data);
  });

  const renderWrapper = stir.curry((data) => {
    return data?.length ? `<ul class="u-mb-0"> ${data.join("\n")}</ul>` : ``;
  });

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
      subject: "Any",
      subjectType: "",
      nation: country,
      studyLevel: el.dataset.studylevel,
      feeStatus: "Any",
      faculty: "Any",
      sortBy: el.dataset.studylevel.includes("Postgraduate") ? "pgOrder" : "ugOrder",
      regions: stir.map(getRegionTags(country), regionmacros),
    };
  };

  /* 
    Loop the countries and get the matches for each
  */
  const getCountriesData = (consts, element, allData) => {
    const countrires = element.dataset.country + ", All International, All Nationalities";

    const schols = stir.flatten(
      countrires.split(", ").map((country) => {
        const filters = getCountryListingFilters(element, country, consts.regionmacros);
        const filterDataCurry = stir.filter(filterData(consts, filters));
        const mapRankCurry = stir.map(mapRank(filters));
        const limitDataCurry = stir.filter((el) => parseInt(el.rank) < 1000);

        return stir.compose(limitDataCurry, mapRankCurry, filterDataCurry)(allData);
      }),
    );
    return schols;
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

        const limitDataCurry = stir.filter((el, index) => index < 5);

        return stir.compose(
          setDOMResultsCurry,
          renderWrapper,
          limitDataCurry,
          stir.removeDuplicates,
          renderHardcodedResults,
          sortCurry,
        )(stir.flatten(getCountriesData(CONSTANTS, element, initialData2)));
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
      nation: "Any",
      studyLevel: el.dataset.studylevel,
      feeStatus: "Any",
      faculty: "Any",
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
