(function (scope) {
  if (!scope) return;

  /**
   * GLOBAL VARIABLES
   */

  const ITEMS_PER_PAGE = 10;

  const ART_TAG = "Art Collection";
  const WEBINAR_TAG = "Webinar";
  const PUBLIC_TAG = "Public";
  const STAFF_TAG = "Staff";
  const STUDENT_TAG = "Student";

  const tagsNode = stir.node("[data-tags]") || "";
  const tags = tagsNode ? tagsNode.dataset.tags : "";
  const TAGS = tags.split(",")[0];

  /**
   * NODES
   */

  const DOM = {
    eventsPublic: stir.node("#eventspublic"),
    eventsStaff: stir.node("#eventsstaff"),
    eventsArt: stir.node("#eventsart"),
    eventsWebinars: stir.node("#eventswebinars"),
    eventsArchive: stir.node("#eventsarchive"),
    eventsPromo: stir.node("#eventspromo"),
    eventsPublicFilters: stir.node("#eventspublicfilters"),
    eventsStaffFilters: stir.node("#eventsstafffilters"),
    eventsArtFilters: stir.node("#eventsartfilters"),
    eventsWebinarsFilters: stir.node("#eventswebinarsfilters"),
    eventsArchiveFilters: stir.node("#eventsarchivefilters"),
    eventsPublicTab: stir.node("#eventspublictab"),
    eventsStaffTab: stir.node("#eventsstafftab"),
    eventsArtTab: stir.node("#eventsarttab"),
    eventsWebinarsTab: stir.node("#eventswebinarstab"),
    eventsArchiveTab: stir.node("#eventsarchivetab"),
    stirTabs: stir.nodes(".stir-tabs__tab"),
  };

  /**
   *
   *   RENDERERS : Return a string of Html
   *
   */

  const renderImage = (image, alt) => {
    return `<div class="u-mt-1"><img src="${image}" width="275" height="275" alt="Image: ${alt}"></div>`;
  };

  const renderTab = (text) => {
    return `<div class="u-absolute u-top--16">
                <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">${text}</span>
            </div>`;
  };

  const renderLabelTab = (item) => {
    if (item.type === WEBINAR_TAG) return renderTab(WEBINAR_TAG);
    if (item.isSeries) return renderTab("Event series");
    return ``;
  };

  const renderNoData = (text) => {
    return `<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">${text}</p></div>`;
  };

  const renderEndDate = (start, end, stirEnd) => {
    return start === end ? `` : `– <time datetime="${end}">${stirEnd}</time>`;
  };

  const renderInfoTag = (val) => {
    return !val ? `` : `<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${val}</span>`;
  };

  const renderLink = (item) => {
    if (!item.url) return `${item.type === WEBINAR_TAG ? `Webinar: ` : ``}${item.title}`;

    return ` <a href="${item.url}">${item.type === WEBINAR_TAG ? `Webinar: ` : ``}${item.title}</a>`;
  };

  const renderTimes = (item) => {
    return item.isSeries
      ? ``
      : `<div class="u-flex u-gap-16 align-middle">
          <span class="uos-clock u-icon h5"></span>
          <span><time>${item.startTime}</time> – <time>${item.endTime}</time></span>
        </div>`;
  };

  const renderSeriesInfo = (series, seriesData) => {
    const linkedSeries = seriesData.filter((item) => item.isSeries === series);
    const url = linkedSeries.length ? `<a href="${linkedSeries[0].url}">${linkedSeries[0].title}</a>` : series;

    return `<p class="text-sm">Part of the ${url} series.</p>`;
  };

  const renderIconTag = (item) => {
    if (item.pin < 1) return `data-label-icon="pin"`;
    if (item.type === WEBINAR_TAG) return `data-label-icon="computer"`;
    if (item.isSeries) return `data-label-icon="startdates"`;

    return ``;
  };

  const renderFavBtns = (showUrlToFavs, cookie, id) => (cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, showUrlToFavs) : stir.favourites.renderAddBtn(id, showUrlToFavs));

  const renderEvent = stir.curry((seriesData, item) => {
    const cookieType = "event";
    const cookie = stir.favourites && stir.favourites.getFav(item.sid, cookieType);
    return `<div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event" ${renderIconTag(item)} data-perf="${item.perfId}" >
                ${renderLabelTab(item)} 
                <div class="u-grid-medium-up u-gap-24 ${item.image ? "u-grid-cols-3_1" : ``} ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1" >
                      <p class="u-text-regular u-m-0">
                        ${renderInfoTag(item.cancelled)} ${renderInfoTag(item.rescheduled)} 
                          <strong>${renderLink(item)} </strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${item.start}">${item.stirStart}</time> ${renderEndDate(item.start, item.end, item.stirEnd)}</span>
                          </div>
                          ${renderTimes(item)}
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 ${item.online ? `uos-computer` : `uos-location`} "></span>
                              <span>${item.location}</span>
                          </div>
                      </div>
                      <p class="u-m-0">${item.summary}</p>
                      ${item.isSeriesChild ? renderSeriesInfo(item.isSeriesChild, seriesData) : ``}
                  </div>
                ${item.image ? renderImage(item.image, item.title) : ``} 
                 </div>
                  <div class="u-mt-2" id="favbtns${item.sid}">${cookie && renderFavBtns("true", cookie, item.sid)}</div>
            </div>`;
  });

  const renderArchiveEvent = stir.curry((seriesData, item) => {
    return `<div class="u-border-width-5 u-heritage-line-left  u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event"  >
                ${item.recording ? renderTab("Recording available") : ``} 
                ${item.isSeries ? renderTab("Event series") : ``} 
                
                <div class="u-grid-medium-up u-gap-24 ${item.image ? "u-grid-cols-3_1" : ``} ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1 ">
                      <p class="u-text-regular u-m-0">
                          <strong><a href="${item.url}">${item.title}</a></strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${item.start}">${item.stirStart}</time> ${renderEndDate(item.start, item.end, item.stirEnd)}</span>
                          </div>
                      </div>
                      <p class="u-m-0">${item.summary}</p>
                      ${item.isSeriesChild ? renderSeriesInfo(item.isSeriesChild, seriesData) : ``}
                  </div>
                  ${item.image ? renderImage(item.image, item.title) : ``}  
                </div>
            </div>`;
  });

  const rendereventsPromo = stir.curry((seriesData, item) => {
    const cookieType = "event";
    const cookie = stir.favourites && stir.favourites.getFav(item.sid, cookieType);
    return `<div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${item.image ? `medium-8` : ``} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${item.isSeries ? renderTab("Event series") : ``}
                  <p class="u-text-regular u-mb-2">
                  ${renderInfoTag(item.cancelled)} ${renderInfoTag(item.rescheduled)} <strong><a href="${item.url}">${item.title}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span><time datetime="${item.start}">${item.stirStart}</time> ${renderEndDate(item.start, item.end, item.stirEnd)}</span>
                      </div>
                      ${renderTimes(item)}
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 ${item.online ? `uos-computer` : `uos-location`}"></span>
                          <span>${item.location}</span>
                      </div>
                  </div>
                  <p class="u-m-0 text-sm">${item.summary}</p>
                  ${item.isSeriesChild ? renderSeriesInfo(item.isSeriesChild, seriesData) : ``}
                 </div>
                  <div id="favbtns${item.sid}">${cookie && renderFavBtns("true", cookie, item.sid)}</div>
                </div>
            </div>
            ${item.image ? `<div class="cell medium-4"><img src="${item.image}" class="u-object-cover" width="800" height="800" alt="Image: ${item.title}" /></div>` : ``}  
        </div>`;
  });

  const renderPaginationBtn = (end, noOfResults) => {
    return end >= noOfResults ? `` : `<div class="loadmorebtn u-flex align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>`;
  };

  const renderPageMeta = (start, end, noOfResults) => {
    return start < 2 ? `` : `<div class="u-flex align-center u-mb-2">Showing ${start + 1}-${end > noOfResults ? noOfResults : end} of ${noOfResults} results</div>`;
  };

  /**
   *
   *  HELPERS
   *
   */

  const getJSONUrl = (env) => {
    if (env === "dev") return "../index.json";
    if (env === "preview") return '<t4 type="navigation" id="5214" />'; // 5222 for limitrd archive
    if (env === "appdev-preview") return '<t4 type="navigation" id="5214" />'; // 5222 for limitrd archive

    return `/data/events/revamp/json/index.json`; // live
  };

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const appendDOMContent = stir.curry((elem, html) => {
    elem.insertAdjacentHTML("beforeend", html);
    return elem;
  });

  const removeDuplicateObjectFromArray = stir.curry((key, array) => {
    let check = {};
    let res = [];
    for (let i = 0; i < array.length; i++) {
      if (!check[array[i][key]]) {
        check[array[i][key]] = true;
        res.push(array[i]);
      }
    }
    return res;
  });

  /**
   * Cleans a query parameter by removing non-alphanumeric characters (except hyphen and underscore)
   * @param {string} param - The query parameter to clean
   * @returns {string} The cleaned query parameter
   */
  const cleanQueryParam = (param) => {
    if (typeof param !== "string") return "";
    // Remove any non-alphanumeric characters except hyphen and underscore
    return param.replace(/[^a-zA-Z0-9-_]/g, "");
  };

  /**
   * @namespace SafeQueryParams
   * @description
   * An object providing safe access to query parameters, ensuring that all values are cleaned to prevent XSS attacks.
   * It extends the original `QueryParams` object with a `cleanQueryParam` function to sanitize the values.
   * @property {function} get - A function that retrieves a query parameter by key and cleans it.
   * @property {function} set - A function that sets a query parameter by key, cleaning the value before setting it.
   * @property {function} remove - A function that removes a query parameter by key.
   */
  const SafeQueryParams = {
    get: (key) => cleanQueryParam(QueryParams.get(key)),
    set: (key, value) => QueryParams.set(key, cleanQueryParam(value)),
    remove: QueryParams.remove,
  };

  /**
   *
   *  FILTERS
   *
   */

  const isPublic = (item) => item.audience.includes(PUBLIC_TAG) && !item.tags.includes(ART_TAG) && !item.type.includes(WEBINAR_TAG);

  const isStaffOrStudent = (item) => item.audience.includes(STAFF_TAG) || item.audience.includes(STUDENT_TAG);

  const isStaffStudent = (item) => isStaffOrStudent(item) && !item.audience.includes(PUBLIC_TAG) && !item.tags.includes(ART_TAG);

  const isPublicFilter = stir.filter(isPublic);

  const isStaffFilter = stir.filter(isStaffStudent);

  const isArt = (item) => item.tags && item.tags.includes(ART_TAG);

  const isArtFilter = stir.filter(isArt);

  const isWebinar = (item) => item.type && item.type.includes(WEBINAR_TAG);

  const isWebinarFilter = stir.filter(isWebinar);

  const isPast = (item) => Number(item.endInt) < getNow() && item.archive.length && !item.hideFromFeed.length;

  const isPastFilter = stir.filter(isPast);

  const isUpcoming = (item) => {
    return Number(item.endInt) >= getNow() && !item.hideFromFeed.length;
  };

  const isUpcomingFilter = stir.filter(isUpcoming);

  const isPromo = (item) => item.eventPromo;

  const isPromoFilter = stir.filter(isPromo);

  const joiner = stir.join("");

  const limitToOne = stir.filter((item, index) => {
    return index === 0;
  });

  const hasRecording = stir.filter((item) => item.recording);

  const identity = (input) => input;

  const isSeriesFilter = stir.filter((item) => item.isSeries.length);

  const paginationFilter = stir.curry((page, itemsPerPage, index) => {
    const start = itemsPerPage * (page - 1);
    const end = start + itemsPerPage;
    return index >= start && index < end;
  });

  /**
   * Filters an event item based on whether it contains all specified tags
   * @param {string} tags_ - Comma-separated string of tags to filter by (e.g. "tag1, tag2")
   * @param {Object} item - Event item object containing tags property
   * @returns {Object|undefined} Returns the item if all tags match, undefined otherwise
   * @description
   * This curried function:
   * 1. Splits the input tags string into an array
   * 2. Returns the item if no tags are specified
   * 3. Splits the item's tags into an array
   * 4. Checks if all input tags exist in the item's tags
   * 5. Returns the item only if all tags match
   * @example
   * filterByTag("Workshop, Online")({ tags: "Workshop, Online, Free" }) // returns item
   * filterByTag("Workshop")({ tags: "Conference, Online" }) // returns undefined
   */
  const filterByTag = stir.curry((tags_, item) => {
    const isTrue = (bol) => bol;
    const tags = tags_.split(", ");

    if (!tags && !tags.length) return item;
    if (tags.length === 1 && tags[0] === "") return item;

    const itemTags = item.tags.split(", ");
    const matches = tags.map((ele) => itemTags.includes(ele));

    if (stir.all(isTrue, matches)) return item;
  });

  const filterByTagCurry = stir.filter(filterByTag(TAGS));

  const removeDupsbyPerf = removeDuplicateObjectFromArray("perfId");

  /**
   *
   *  SORTERS
   *
   */

  const sortByStartDate = (a, b) => Number(a.startInt) - Number(b.startInt);

  const sortByStartDateDesc = (a, b) => Number(b.startInt) - Number(a.startInt);

  /**
   * Sort function that uses the pin field to prioritize pinned items then date
   * @param {Object} a - First event item
   * @param {Object} b - Second event item
   * @returns {number} Sort order (-1, 0, 1)
   */
  const sortByPinDate = (a, b) => Number(a.pin) - Number(b.pin);

  /**
   *
   *  DATE HELPERS
   *
   */

  const getNow = () => {
    let yourDate = new Date();
    return Number(yourDate.toISOString().split("T")[0].split("-").join("") + ("0" + yourDate.getHours()).slice(-2) + ("0" + yourDate.getMinutes()).slice(-2));
  };

  /**
   * Checks if a specific date exists within an array of dates
   * @param {string[]} filterRange - Array of date strings in ISO format (YYYY-MM-DD)
   * @param {string} date - Single date string to check against the range
   * @returns {boolean} Returns true if the date exists in the filterRange, false otherwise
   * @example
   * inDateRange(['2023-07-24', '2023-07-25'], '2023-07-24') // returns true
   * inDateRange(['2023-07-24', '2023-07-25'], '2023-07-26') // returns false
   */
  const inDateRange = stir.curry((filterRange, date) => {
    const matches = filterRange.filter((day) => day === date);
    return matches.length ? true : false; // Only need one match
  });

  /**
   * Generates an array of consecutive dates between two dates as ISO strings
   * @param {string} s - Start date in ISO format (YYYY-MM-DD)
   * @param {string} e - End date in ISO format (YYYY-MM-DD)
   * @returns {string[]} Array of dates as ISO strings (YYYY-MM-DD)
   * @example
   * getDaysArray('2023-07-24', '2023-07-26')
   * // returns ['2023-07-24', '2023-07-25', '2023-07-26']
   */
  const getDaysArray = (s, e) => {
    let a = [];

    for (d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
      a.push(new Date(d).toISOString().split("T")[0]);
    }
    return a;
  };

  /**
   * Gets the start and end dates for the current week
   * @returns {Object} Object containing start and end dates
   * @property {string} start - First day of week in ISO format
   * @property {string} end - Last day of week in ISO format
   * @example
   * getThisWeekStartEnds()
   * // returns { start: '2023-07-24', end: '2023-07-30' }
   */
  const getThisWeekStartEnds = () => {
    const date = new Date();
    const first = new Date(date.setDate(date.getDate() + ((0 + (0 - date.getDay())) % 7)));
    const last = new Date(date.setDate(date.getDate() + 6));

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /**
   * Gets the start and end dates for next week
   * @returns {Object} Object containing start and end dates
   * @property {string} start - First day of next week in ISO format
   * @property {string} end - Last day of next week in ISO format
   * @example
   * getNextWeekStartEnds()
   * // returns { start: '2023-07-31', end: '2023-08-06' }
   */
  const getNextWeekStartEnds = () => {
    const date = new Date();
    const first = new Date(date.setDate(date.getDate() + ((0 + (7 - date.getDay())) % 7)));
    const last = new Date(date.setDate(date.getDate() + 6));

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /**
   * Gets the start and end dates for current month
   * @returns {Object} Object containing start and end dates
   * @property {string} start - First day of month in ISO format
   * @property {string} end - Last day of month in ISO format
   * @example
   * getThisMonthStartEnds()
   * // returns { start: '2023-07-01', end: '2023-07-31' }
   */
  const getThisMonthStartEnds = () => {
    const date = new Date();
    const first = new Date(date.getFullYear(), date.getMonth(), 2);
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /**
   * Gets the start and end dates for next month
   * @returns {Object} Object containing start and end dates
   * @property {string} start - First day of next month in ISO format
   * @property {string} end - Last day of next month in ISO format
   * @example
   * getNextMonthStartEnds()
   * // returns { start: '2023-08-01', end: '2023-08-31' }
   */
  const getNextMonthStartEnds = () => {
    const date = new Date();
    const first = new Date(date.getFullYear(), date.getMonth() + 1, 2);
    const last = new Date(date.getFullYear(), date.getMonth() + 2, 1);

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /**
   * Gets a date range array based on the specified time period
   * @param {string} rangeWanted - Time period ('thisweek'|'nextweek'|'thismonth'|'nextmonth')
   * @returns {string[]|null} Array of ISO date strings or null if invalid range
   * @example
   * getFilterRange('thisweek')
   * // returns ['2023-07-24', '2023-07-25', ..., '2023-07-30']
   */
  const getFilterRange = (rangeWanted) => {
    if (rangeWanted === "thisweek") return getDaysArray(getThisWeekStartEnds().start, getThisWeekStartEnds().end);

    if (rangeWanted === "nextweek") return getDaysArray(getNextWeekStartEnds().start, getNextWeekStartEnds().end);

    if (rangeWanted === "thismonth") return getDaysArray(getThisMonthStartEnds().start, getThisMonthStartEnds().end);

    if (rangeWanted === "nextmonth") return getDaysArray(getNextMonthStartEnds().start, getNextMonthStartEnds().end);

    return null;
  };

  /**
   * Checks if an item's date range overlaps with a given filter range
   * @param {string[]} range - Array of date strings to check against
   * @param {Object} item - Event item with start and end dates
   * @returns {boolean} True if dates overlap, false otherwise
   * @example
   * inRange(['2023-07-24', '2023-07-25'],
   *         {start: '2023-07-24', end: '2023-07-26'})
   * // returns true
   */
  const inRange = stir.curry((range, item) => {
    const itemRange = getDaysArray(item.start, item.end);

    const ranges = itemRange.map((day) => inDateRange(range, day));
    return stir.any((item) => item, ranges);
  });

  /**
   *
   *  CONTROLLERS
   *
   */

  /**
   * Handles display of upcoming events with filtering, pagination and rendering
   * @param {string} rangeWanted - Time period filter ('thisweek'|'nextweek'|'thismonth'|'nextmonth'|'all')
   * @param {HTMLElement} node - DOM element to render events into
   * @param {Function} filter - Filter function to apply to events (e.g. isPublicFilter, isStaffFilter)
   * @param {Array} initData - Initial array of event data objects
   */
  function doUpcomingEvents(rangeWanted, node, filter, initData) {
    const filterRange = getFilterRange(rangeWanted);
    const page = Number(SafeQueryParams.get("page")) || 1;
    const start = ITEMS_PER_PAGE * (page - 1);
    const end = start + ITEMS_PER_PAGE;

    const seriesData = stir.compose(isSeriesFilter)(initData);
    const renderEventsMapper = stir.map(renderEvent(seriesData));

    const setDOMPublic = page === 1 ? setDOMContent(node) : appendDOMContent(node);

    const sorter = stir.sort(sortByPinDate);

    const pageFilterCurry = stir.filter((item, index) => {
      if (paginationFilter(page, ITEMS_PER_PAGE, index)) return item;
    });

    /**
     * Processes event data through filtering pipeline
     * @param {Array} dataSource - The source data to process
     * @returns {Array} Array containing the number of results and the rendered HTML
     */
    const processUpcomingEvents = (dataSource) => {
      const dataAll = stir.pipe(isUpcomingFilter, removeDupsbyPerf, filterByTagCurry, filter, sorter)(dataSource);
      const dataAllRendered = stir.pipe(pageFilterCurry, renderEventsMapper, joiner)(dataAll);

      return [dataAll.length, dataAllRendered];
    };

    let noOfResults, results;

    if (!filterRange) {
      [noOfResults, results] = processUpcomingEvents(initData);
    }

    if (filterRange) {
      const inRangeCurry = inRange(filterRange);
      const dataDateFiltered = stir.filter(inRangeCurry, initData);
      [noOfResults, results] = processUpcomingEvents(dataDateFiltered);
    }

    if (!noOfResults) {
      const tab = node.closest("[role=tabpanel]");
      if (tab) {
        const tabId = tab.id;
        const tabBtn = document.querySelector(`[aria-controls=${tabId}]`);
        tab.remove();
        tabBtn && tabBtn.remove();
      }
    }

    noOfResults && setDOMPublic(renderPageMeta(start, end, noOfResults) + results + renderPaginationBtn(end, noOfResults));
  }

  /**
   * Handles display of archived events with filtering, pagination and rendering
   * @param {string} target - Filter target ('all'|'recordings'|'public'|'staffstudent')
   * @param {Array} initData - Initial array of event data objects
   */
  function doArchiveEvents(target, initData) {
    const page = Number(SafeQueryParams.get("page")) || 1;
    const start = ITEMS_PER_PAGE * (page - 1);
    const end = start + ITEMS_PER_PAGE;

    const seriesData = stir.compose(isSeriesFilter)(initData);
    const renderArchiveEventsMapper = stir.map(renderArchiveEvent(seriesData));

    const sorter = stir.sort(sortByStartDateDesc);
    const setDOMArchive = page === 1 ? setDOMContent(DOM.eventsArchive) : appendDOMContent(DOM.eventsArchive);

    const pageFilterCurry = stir.filter((item, index) => {
      if (paginationFilter(page, ITEMS_PER_PAGE, index)) return item;
    });

    /**
     * Processes event data through filtering pipeline
     * @param {Function} filterFn - Filter function to apply to events (e.g. isPublicFilter, isStaffFilter)
     * @param {Array} dataSource - The source data to process
     * @returns {Array} Array containing the number of results and the rendered HTML
     */
    const processArchiveEvents = (filterFn, initdata) => {
      const dataAll = stir.pipe(isPastFilter, filterByTagCurry, filterFn, sorter)(initdata);
      const dataAllRendered = stir.pipe(pageFilterCurry, renderArchiveEventsMapper, joiner)(dataAll);

      return [dataAll.length, dataAllRendered];
    };

    // Process the data based on selected filter
    let noOfResults, results;

    if (target === "all") {
      [noOfResults, results] = processArchiveEvents(identity, initData);
    }
    if (target === "recordings") {
      [noOfResults, results] = processArchiveEvents(hasRecording, initData);
    }
    if (target === PUBLIC_TAG) {
      [noOfResults, results] = processArchiveEvents(isPublicFilter, initData);
    }
    if (target === "staffstudent") {
      [noOfResults, results] = processArchiveEvents(isStaffFilter, initData);
    }

    // Render the results data  or no results message
    noOfResults ? setDOMArchive(renderPageMeta(start, end, noOfResults) + results + renderPaginationBtn(end, noOfResults)) : setDOMArchive(renderNoData("No events found."));
  }

  /**
   * Renders featured/promotional event at the top of the events listing
   * @param {Array} initData - Array of event data objects to filter and render
   * @description
   * This function:
   * 1. Filters the events data to find series events
   * 2. Creates a curried version of the promo event renderer
   * 3. Filters for promotional events that are:
   *    - Upcoming
   *    - Match any specified tags
   *    - Marked as promotional (eventPromo flag)
   * 4. Takes the first promotional event found
   * 5. Renders it into the promo section DOM element
   * @example
   * doPromo(eventsData);
   */
  function doPromo(initData) {
    const seriesData = stir.filter(isSeriesFilter, initData);
    const rendereventsPromoCurry = stir.map(rendereventsPromo(seriesData));
    const sorter = stir.sort(sortByStartDate);
    const setDOMPromo = setDOMContent(DOM.eventsPromo);

    stir.pipe(isUpcomingFilter, filterByTagCurry, sorter, isPromoFilter, limitToOne, rendereventsPromoCurry, joiner, setDOMPromo)(initData);
  }

  /**
   *
   *  ON LOAD EVENTS
   *
   */

  DOM.eventsPublic && setDOMContent(DOM.eventsPublic, "");
  DOM.eventsStaff && setDOMContent(DOM.eventsStaff, "");
  DOM.eventsArt && setDOMContent(DOM.eventsArt, "");
  DOM.eventsWebinars && setDOMContent(DOM.eventsWebinars, "");

  DOM.eventsPublicFilters && DOM.eventsPublicFilters.querySelector("input[type=radio]") && (DOM.eventsPublicFilters.querySelector("input[type=radio]").checked = true);
  DOM.eventsStaffFilters && DOM.eventsStaffFilters.querySelector("input[type=radio]") && (DOM.eventsStaffFilters.querySelector("input[type=radio]").checked = true);
  DOM.eventsArchiveFilters && DOM.eventsArchiveFilters.querySelector("input[type=radio]") && (DOM.eventsArchiveFilters.querySelector("input[type=radio]").checked = true);
  DOM.eventsArtFilters && DOM.eventsArtFilters.querySelector("input[type=radio]") && (DOM.eventsArtFilters.querySelector("input[type=radio]").checked = true);
  DOM.eventsWebinarsFilters && DOM.eventsWebinarsFilters.querySelector("input[type=radio]") && (DOM.eventsWebinarsFilters.querySelector("input[type=radio]").checked = true);

  const url = getJSONUrl(UoS_env.name);

  /**
   * Fetch the data and set things off
   */
  stir.getJSON(url, (data) => {
    if (data.error) return;

    const initData = data.filter((item) => item.id);
    SafeQueryParams.set("page", "1");

    DOM.eventsStaff && doUpcomingEvents("all", DOM.eventsStaff, isStaffFilter, initData);
    DOM.eventsPublic && doUpcomingEvents("all", DOM.eventsPublic, isPublicFilter, initData);
    DOM.eventsArt && doUpcomingEvents("all", DOM.eventsArt, isArtFilter, initData);
    DOM.eventsWebinars && doUpcomingEvents("all", DOM.eventsWebinars, isWebinarFilter, initData);

    doArchiveEvents("all", initData);
    doPromo(initData);

    // Make sure the first tab available is open
    scope.querySelector("[role=tab]") && scope.querySelector("[role=tab]").click();
    window.scrollTo(0, 0);

    /**
     *
     *  CLICK EVENTS LISTENERS
     *
     */

    /*
     * Tab clicks
     */
    stir.each((item) => {
      item.addEventListener("click", (event) => {
        SafeQueryParams.set("page", "1");
      });
    }, DOM.stirTabs);

    /**
     * Filter clicks
     */

    /**
     * Handle filter click events
     * @param {HTMLElement} tabElement - DOM element for the tab
     * @param {HTMLElement} filtersElement - DOM element containing the filters
     * @param {HTMLElement} contentElement - DOM element where content should be displayed
     * @param {Function} filterFunction - Filter function to use
     * @param {Function} eventFunction - Event function to call (doUpcomingEvents or doArchiveEvents)
     * @param {Object} initData - Initial data for the events
     */
    function handleFilterClick(tabElement, filtersElement, contentElement, filterFunction, eventFunction, initData) {
      tabElement.addEventListener("click", (event) => {
        const page = Number(SafeQueryParams.get("page")) || 1;

        if (event.target.type === "radio") {
          SafeQueryParams.set("page", "1");
          eventFunction(filtersElement.querySelector("input:checked").value, contentElement, filterFunction, initData);
        }

        if (event.target.type === "submit") {
          setDOMContent(event.target.closest(".loadmorebtn"), "");
          SafeQueryParams.set("page", String(page + 1));
          eventFunction(filtersElement.querySelector("input:checked").value, contentElement, filterFunction, initData);
        }
      });
    }

    // Handle each tab with the appropriate parameters
    DOM.eventsPublicTab && handleFilterClick(DOM.eventsPublicTab, DOM.eventsPublicFilters, DOM.eventsPublic, isPublicFilter, doUpcomingEvents, initData);
    DOM.eventsArtTab && handleFilterClick(DOM.eventsArtTab, DOM.eventsArtFilters, DOM.eventsArt, isArtFilter, doUpcomingEvents, initData);
    DOM.eventsWebinarsTab && handleFilterClick(DOM.eventsWebinarsTab, DOM.eventsWebinarsFilters, DOM.eventsWebinars, isWebinarFilter, doUpcomingEvents, initData);
    DOM.eventsStaffTab && handleFilterClick(DOM.eventsStaffTab, DOM.eventsStaffFilters, DOM.eventsStaff, isStaffFilter, doUpcomingEvents, initData);

    // Note that archive tab uses doArchiveEvents function instead
    handleFilterClick(
      DOM.eventsArchiveTab,
      DOM.eventsArchiveFilters,
      null, // Content element not needed for archive events
      null, // Filter function not needed for archive events
      (filterValue, _, __, initData) => doArchiveEvents(filterValue, initData), // Adapter function
      initData
    );

    /**
     * Handle Favourite Button clicks
     */
    const updateFavouriteBtn = (id) => {
      const cookie = stir.favourites.getFav(id, "event");
      const node = stir.node("#favbtns" + id);

      if (node) setDOMContent(node)(renderFavBtns("true", cookie, id));
    };

    const handleFavouriteBtnClick = () => (event) => {
      const cookieType = "event";
      const target = event.target.closest("button");
      if (!target || !target.dataset || !target.dataset.action) return;

      if (target.dataset.action === "addtofavs") {
        stir.favourites.addToFavs(target.dataset.id, cookieType);
        updateFavouriteBtn(target.dataset.id);
      }

      if (target.dataset.action === "removefav") {
        stir.favourites.removeFromFavs(target.dataset.id);
        updateFavouriteBtn(target.dataset.id);
      }
    };

    stir.node("main").addEventListener("click", handleFavouriteBtnClick());
  });
})(stir.node("#eventsrevamp"));
