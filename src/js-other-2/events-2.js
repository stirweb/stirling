(function () {
  /*
   * Nodes we are going to need
   */
  const staffNode = document.querySelector("#eventsstaff");
  const publicNode = document.querySelector("#eventspublic");
  const artNode = document.querySelector("#eventsart");
  const archiveNode = document.querySelector("#eventsarchive");
  const promoNode = document.querySelector("#eventspromo");
  const webinarsNode = document.querySelector("#eventswebinars");

  /*
   * Parse data field into an object
   * @param {string|Array} data - Data field from custom fields
   * @returns {Object} - Parsed data object
   */
  const getDataObject = (data) => {
    if (typeof data === "string") {
      return JSON.parse(decodeURIComponent(data));
    }
    return "object" === typeof data ? Object.assign({}, ...data.map((datum) => JSON.parse(decodeURIComponent(datum)))) : {};
  };

  /*
   * RENDERERS
   */

  /*
   * Render event dates
   * @param {string} start - Start date
   * @param {string} end - End date
   * @returns {string} - Formatted date string
   */
  const renderDates = (dateTimes) => {
    if (dateTimes.end === dateTimes.start) {
      return `<time datetime="${dateTimes.startISO}">${dateTimes.start}</time>`;
    }
    return `<time datetime="${dateTimes.startISO}">${dateTimes.start}</time> - <time datetime="${dateTimes.endISO}">${dateTimes.end}</time>`;
  };

  /*
   * Render wee tab for series events
   * @param {Object} item - Event item
   * @returns {string} - HTML string for wee tab
   */
  const renderWeeTab = (item) => {
    return `
        <div class="u-absolute u-top--16">
            <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Event series</span>
        </div>`;
  };

  /*
   * Render series info
   * @param {string} seriesName - Series name
   * @param {Array} seriesData - Series data
   * @returns {string} - HTML string for series info
   */
  const renderSeriesInfo = (seriesName, seriesData) => {
    if (!seriesName) return "";

    const series = seriesData && seriesData.find((seriesItem) => seriesItem.title === seriesName); // replace all non alphanumeric characters

    if (!series) return `<p class="text-sm">Part of the <strong>${seriesName}</strong> series.</p>`;
    return `<p class="text-sm">Part of the <a href="${series ? series.url : "#"}">${seriesName}</a> series.</p>`;
  };

  /*
   * Render favourite buttons
   * @param {string} showUrlToFavs - Whether to show URL to favourites
   * @param {Array} cookie - Favourite cookie
   * @param {string} id - Favourite ID
   * @returns {string} - HTML string for favourite buttons
   */
  const renderFavBtns = (showUrlToFavs, cookie, id) => {
    return cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, showUrlToFavs) : stir.favourites.renderAddBtn(id, showUrlToFavs);
  };

  /*
   * Render archive event item
   * @param {Object} series - Series data
   * @param {Object} item - Event item
   * @returns {string} - HTML string for event
   */
  const renderArchiveEvent = stir.curry((seriesData, item) => {
    const data = "object" === typeof item.custom_fields.data ? Object.assign({}, ...item.custom_fields.data.map((datum) => JSON.parse(decodeURIComponent(datum)))) : {};
    const cf = item.custom_fields;
    const dateTimes = getEventDateTimes(cf.d, cf.e);

    return `
          <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event">
                  <div class="u-grid-medium-up u-gap-24  ">
                    <div class=" u-flex flex-dir-column u-gap u-mt-1 ">
                        <p class="u-text-regular u-m-0">
                            <strong><a href="${item.url}">${cf.h1_custom}</a></strong>
                        </p>
                        <div class="u-flex flex-dir-column u-gap-8">
                            <div class="u-flex u-gap-16 align-middle">
                                  <span class="u-icon h5 uos-calendar"></span>
                                  <span>${renderDates(dateTimes)}</span>
                            </div>
                        </div>
                        <p class="u-m-0">${cf.snippet}</p>
                        ${renderSeriesInfo(data.isSeriesChild, seriesData)}
                    </div>

                  </div>
            </div>`;
  });

  const renderImage = (imagePath, altText) => {
    if (!imagePath) return `<div></div>`;

    return `<div class="u-mt-1">
            <img src="${imagePath}" width="275" height="275" alt="Image: ${altText}"></div>
         </div>`;
  };

  const renderTimes = (startTime, endTime) => {
    //console.log(startTime, endTime);
    return `
      <div class="u-flex u-gap-16 align-middle">
        <span class="uos-clock u-icon h5"></span>
        <span><time>${startTime}</time> – <time>${endTime}</time></span>
      </div>`;
  };

  const renderInfoTag = (val) => {
    return !val ? `` : `<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${val}</span>`;
  };

  const renderTab = (type) => {
    return type ? `data-label-icon=${type}` : ``;
  };

  /*
   * Render event item
   * @param {Object} series - Series data
   * @param {Object} item - Event item
   * @returns {string} - HTML string for event
   */
  const renderEvent = stir.curry((seriesData, item) => {
    if (item.hide) return ``;

    const data = "object" === typeof item.custom_fields.data ? Object.assign({}, ...item.custom_fields.data.map((datum) => JSON.parse(decodeURIComponent(datum)))) : {};
    const cf = item.custom_fields;
    const dateTimes = getEventDateTimes(item.start, item.end);
    const showTimes = dateTimes.start === dateTimes.end ? true : false;
    const cookieType = "event";
    const cookie = stir.favourites && stir.favourites.getFav(cf.sid, cookieType);
    const favId = item.repeater ? cf.sid + "|" + new Date(item.start).getTime() : cf.sid;

    const isSeries = data.isSeries ? "startdates" : "";
    const isPinned = data.pin === "Yes" ? "pin" : "";

    const startTime = new Date(cf.d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const endTime = new Date(cf.e).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    return `
        <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event"
          ${renderTab(isSeries)} ${renderTab(isPinned)} data-perf="172580">
          ${data.isSeries ? renderWeeTab(item) : ""}
         
            <div class="u-grid-medium-up u-gap-24 ${cf.image ? "u-grid-cols-3_1" : ""}">
                <div class=" u-flex flex-dir-column u-gap u-mt-1">
                    <p class="u-text-regular u-m-0">
                        ${renderInfoTag(data.cancelled)} ${renderInfoTag(data.rescheduled)} <strong><a href="${item.url}">${cf.h1_custom}</a></strong>
                    </p>
                    <div class="u-flex flex-dir-column u-gap-8">
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-calendar"></span>
                        <span>${renderDates(dateTimes)}</span>
                    </div>
                    ${showTimes ? renderTimes(startTime, endTime) : ``}
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-location "></span>
                        <span>${data.location || ""}</span>
                    </div>
                    </div>
                    <p class="u-m-0">${cf.snippet || ""}</p>
                    ${renderSeriesInfo(data.isSeriesChild, seriesData)}
                </div>
                ${renderImage(cf.image, cf.h1_custom)}
                <div class="u-mt-2">
                    <div id="favbtns${favId}">${cookie && renderFavBtns("true", cookie, favId)}</div>
                 </div>
            </div>
        </div>`;
  });

  /*
   * Render Promo event item
   * @param {Object} item - Event item
   * @returns {string} - HTML string for event
   */
  const rendereventsPromo = stir.curry((seriesData, item) => {
    const cf = item.custom_fields;
    const dateTimes = getEventDateTimes(cf.d, cf.e);
    const data = "object" === typeof item.custom_fields.data ? Object.assign({}, ...item.custom_fields.data.map((datum) => JSON.parse(decodeURIComponent(datum)))) : {};
    const cookieType = "event";
    const cookie = stir.favourites && stir.favourites.getFav(cf.sid, cookieType);
    const favId = item.repeater ? cf.sid + "|" + new Date(item.start).getTime() : cf.sid;
    const showTimes = dateTimes.start === dateTimes.end ? true : false;

    // Get start time from string 2026-03-25T14:00:00.000Z
    const startTime = new Date(cf.d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const endTime = new Date(cf.e).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    return `<div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${cf.image ? `medium-8` : ``} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${item.isSeries ? renderTab("Event series") : ``}
                  <p class="u-text-regular u-mb-2">
                  ${renderInfoTag(data.cancelled)} ${renderInfoTag(data.rescheduled)} <strong><a href="${item.url}">${cf.h1_custom}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span>${renderDates(dateTimes)}</span>
                      </div>
                     ${showTimes ? renderTimes(startTime, endTime) : ``}
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 ${item.online ? `uos-computer` : `uos-location`}"></span>
                          <span>${data.location}</span>
                      </div>
                  </div>
                  <p class="u-m-0 text-sm">${cf.snippet}</p>
                  ${item.isSeriesChild ? renderSeriesInfo(item.isSeriesChild, seriesData) : ``}
                 </div>
                   <div id="favbtns${favId}">${cookie && renderFavBtns("true", cookie, favId)}</div>
                </div>
            </div>
            ${cf.image ? `<div class="cell medium-4"><img src="${cf.image}" class="u-object-cover" width="800" height="800" alt="Image: ${cf.h1_custom}" /></div>` : ``}  
        </div>`;
  });

  /* Render webinar item
   * @param {Object} item - Webinar item
   * @returns {string} - HTML string for webinar
   */
  const renderWebinar = (item) => {
    const cf = item.custom_fields;
    const data = getDataObject(cf.data);
    const cookieType = "webinar";
    const cookie = stir.favourites && stir.favourites.getFav(cf.sid, cookieType);
    const favId = cf.sid;
    const dateTimes = getEventDateTimes(cf.d, cf.e);
    const startTime = new Date(cf.d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const endTime = new Date(cf.e).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    return `<div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" 
              data-result-type="event" data-perf="${cf.sid}">
                <div class="u-absolute u-top--16">
                  <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Webinar</span>
                </div> 
                <div class="u-grid-medium-up u-gap-24  ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1">
                      <p class="u-text-regular u-m-0">
                          <strong> <a href="${data.register}">${cf.h1_custom}</a> </strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${cf.d}">${dateTimes.start}</time> </span>
                          </div>
                          <div class="u-flex u-gap-16 align-middle">
                            <span class="uos-clock u-icon h5"></span>
                            <span><time>${startTime}</time> – <time>${endTime}</time></span>
                          </div>
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-computer"></span>
                              <span>Online</span>
                          </div>
                      </div>
                      <div class="u-m-0">${cf.snippet}</div>
                      <div id="favbtns${favId}">${cookie && renderFavBtns("true", cookie, favId)}</div>
                  </div>
                 </div>
            </div>`;
  };

  const renderMoreButton = (page) => {
    return `<div class="loadmorebtn u-flex align-center u-mb-2"><button class="button hollow tiny" data-page="${page}">Load more results</button></div>
        `;
  };

  const renderNoEvents = (page) => {
    return `<div id="eventsarchive" class="cell large-8 large-order-2 u-mt-3-small ">
            <div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No events found.</p></div>
          </div>`;
  };

  /*
   * HELPERS
   */

  /*
   * Get event date and time strings in Stirling format
   * @param {string} start - Start date string
   * @param {string} end - End date string
   * @returns {Object} - Object with start and end date and time strings
   */
  const getEventDateTimes = (start, end) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const startDate = new Date(start);
    const endDate = new Date(end);

    return {
      start: startDate.toLocaleDateString("en-GB", options),
      end: endDate.toLocaleDateString("en-GB", options),
      // startTime: start.split("T")[1].slice(0, 5),
      // endTime: end.split("T")[1].slice(0, 5),
      startISO: startDate.toISOString().slice(0, 10),
      endISO: endDate.toISOString().slice(0, 10),
    };
  };

  /*
   * Get current date in YYYY-MM-DD format
   * @returns {string} - Current date
   */
  const getNow = () => {
    return new Date().toISOString();
  };

  /*
   * Get archive filter string based on selected value
   * @param {string} selectedValue - Selected filter value
   * @returns {string} - Filter string for query
   */
  function getArchiveFilterString(selectedValue, limit, maintags) {
    const filterConditions = [
      { "custom_fields.tag": "Archive" },
      {
        range: { "custom_fields.e": { gt: "2015-01-01", lt: getNow() } },
      },
    ];

    // Add maintags array to filter
    if (maintags && maintags.length > 0) {
      maintags.forEach((tag) => {
        filterConditions.push({ "custom_fields.tag": tag });
      });
    }

    if (selectedValue !== "All") {
      filterConditions.push({ "custom_fields.tag": selectedValue });
    }

    const filterObject = { and: filterConditions };

    return `&limit=${limit}&order=desc&filter=${encodeURIComponent(JSON.stringify(filterObject))}&sort=custom_fields.e&`;
  }

  /*
   * Generate staff object for date range
   * @param {string} from - Start date
   * @param {string} to - End date
   * @returns {Object} - Upcoming object for query
   */
  const getUpcomingObject = (from, to, type, maintags) => {
    const obj = {
      and: [
        { "custom_fields.tag": type },
        { not: { "custom_fields.tag": "Promo" } },
        {
          range: { "custom_fields.e": { gt: from, lt: to } },
        },
      ],
    };

    // Add maintags array to filter
    if (maintags && maintags.length > 0) {
      maintags.forEach((tag) => {
        obj.and.push({ "custom_fields.tag": tag });
      });
    }

    if (type !== "Art Collection") {
      obj.and.push({ not: { "custom_fields.tag": "Art Collection" } });
    }

    return obj;
  };

  /*
   * Get filter string based on type
   * @param {string} type - Event type
   * @returns {string} - Filter string for query
   */
  const getFilterString = (type, maintags) => {
    if (type === "staff") {
      return `&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(getUpcomingObject(getNow(), "2099-12-31", "StaffStudent", maintags)))}&sort=custom_fields.sort&`;
    }

    if (type === "art") {
      return `&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(getUpcomingObject(getNow(), "2099-12-31", "Art Collection", maintags)))}&sort=custom_fields.sort&`;
    }

    if (type === "public") {
      return `&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(getUpcomingObject(getNow(), "2099-12-31", "Public", maintags)))}&sort=custom_fields.sort&`;
    }
  };

  /*
   * Get every 7 days between two dates
   * @param {Date} from - Start date
   * @param {Date} to - End date
   * @returns {Array} - Array of dates
   */
  function getEvery7Days(from, to) {
    const dates = [];
    let currentDate = new Date(from);
    const now = new Date();

    while (currentDate <= new Date(to)) {
      if (currentDate > now) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return dates;
  }

  /*
   * Creates a new date by combining the date from one and the time from another.
   * @param {Date} dateWithTime - The date object to take the time from.
   * @param {Date} dateToCopy - The date object to copy the year, month, and day from.
   * @returns {Date} - The new combined date object.
   */
  function combineDateAndTime(dateWithTime, dateToCopy) {
    const newDate = new Date(dateWithTime);
    newDate.setFullYear(dateToCopy.getFullYear());
    newDate.setMonth(dateToCopy.getMonth());
    newDate.setDate(dateToCopy.getDate());
    return newDate;
  }

  /*
   * Filter functions
   * @param {Object} item - Event item
   * @returns {boolean} - Whether the event is in the next month, week, etc.
   */
  function isNextMonth(item) {
    const eventStart = new Date(item.start);
    const eventEnd = new Date(item.end);
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

    // Check if the event's date range overlaps with the current month
    return eventStart <= lastDayOfMonth && eventEnd >= firstDayOfMonth;
  }

  function isThisMonth(item) {
    const eventStart = new Date(item.start);
    const eventEnd = new Date(item.end);
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Check if the event's date range overlaps with the current month
    return eventStart <= lastDayOfMonth && eventEnd >= firstDayOfMonth;
  }

  function isThisWeek(item) {
    const eventStart = new Date(item.start);
    const eventEnd = new Date(item.end);
    const now = new Date();
    const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const thisWeekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6 - now.getDay());

    // Check if the event's date range overlaps with this week
    return eventStart <= thisWeekEnd && eventEnd >= thisWeekStart;
  }

  function isNextWeek(item) {
    const eventStart = new Date(item.start);
    const eventEnd = new Date(item.end);
    const now = new Date();
    const nextWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7 - now.getDay());
    const nextWeekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 13 - now.getDay());

    // Check if the event's date range overlaps with next week
    return eventStart <= nextWeekEnd && eventEnd >= nextWeekStart;
  }

  /*
   * Handle Favourite Button clicks
   */
  const updateFavouriteBtn = (id) => {
    const cookie = stir.favourites.getFav(id, "event");
    const favNodes = document.querySelectorAll(`[id*="favbtns${id}"]`);

    favNodes.forEach((favnode) => {
      const btnHtml = renderFavBtns("true", cookie, id);
      favnode.innerHTML = btnHtml;
    });
  };

  const handleFavouriteBtnClick = () => (event) => {
    const cookieType = "event";
    const target = event.target.closest("button");
    if (!target || !target.dataset || !target.dataset.action) return;

    if (target.dataset.action === "addtofavs") {
      const id = target.dataset.id.split("|")[0];
      stir.favourites.addToFavs(id, cookieType);
      updateFavouriteBtn(id);
    }

    if (target.dataset.action === "removefav") {
      const id = target.dataset.id.split("|")[0];
      stir.favourites.removeFromFavs(id);
      updateFavouriteBtn(id);
    }
  };

  /*
   * Fetch series data
   * @returns {Promise<Object>} - Series data
   */
  async function doSeriesSearch(baseUrl) {
    const seriesQuery =
      baseUrl +
      `&limit=50&order=asc&filter=${encodeURIComponent(
        JSON.stringify({
          and: [{ "custom_fields.tag": "Series" }],
        }),
      )}&sort=custom_fields.sort`;

    try {
      const response = await fetch(seriesQuery);
      const data = await response.json();

      const dataCleaned = data.hits.map((item) => {
        const data2 = "object" === typeof item.custom_fields.data ? Object.assign({}, ...item.custom_fields.data.map((datum) => JSON.parse(decodeURIComponent(datum)))) : {};
        return {
          title: data2.isSeries,
          url: item.url,
        };
      });

      return dataCleaned;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  }

  /*
   * Main Archive Controller
   * Fetch and display Archive events
   * @param {string} baseUrl - The base URL for the search API
   * @param {HTMLElement} node - The DOM node to insert results into
   * @return {void}
   */
  function doArchive(baseUrl, node, seriesData, maintags) {
    const radios = node.parentNode.querySelectorAll("input[type='radio']");
    const limit = 10;
    const renderer = renderArchiveEvent(seriesData);

    radios &&
      radios.forEach((radio) => {
        radio.checked = false;
        if (radio.value === "All") {
          radio.checked = true;
        }
      });

    // Initial search
    const filterString = getArchiveFilterString("All", limit, maintags);
    let page = 1;

    fetch(baseUrl + filterString + `page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        const totalPages = Number(data.total_hits) / limit;
        const currentPage = page;

        const html = data.hits.map(renderer).join("");
        const moreButton = currentPage < totalPages ? renderMoreButton(2) : "";
        node.innerHTML = html + moreButton;
      })
      .catch((error) => console.error("Error fetching data:", error));

    // Pagination Event Listener
    node.addEventListener("click", function (event) {
      if (event.target.tagName === "BUTTON") {
        const nextPage = event.target.getAttribute("data-page");

        const selectedValue = node.parentNode.querySelector("input[type='radio']:checked").value;
        const filterString = getArchiveFilterString(selectedValue, limit, maintags);

        fetch(baseUrl + filterString + `page=${nextPage}`)
          .then((response) => response.json())
          .then((data) => {
            const totalPages = Number(data.total_hits) / limit;
            const currentPage = Number(nextPage);

            const html = data.hits.map(renderer).join("");
            event.target.parentNode.remove(); // Remove the old button

            const moreButton = currentPage < totalPages ? renderMoreButton(Number(nextPage) + 1) : "";
            node.insertAdjacentHTML("beforeend", html + moreButton);
          })
          .catch((error) => console.error("Error fetching data:", error));
      }
    });

    /*
     * Add event listeners to radio input Filters
     */
    radios &&
      radios.forEach((radio) => {
        radio.addEventListener("click", function (event) {
          event.stopPropagation();

          const selectedValue = event.target.value;
          const filterString = getArchiveFilterString(selectedValue, limit, maintags);

          fetch(baseUrl + filterString + `page=1`)
            .then((response) => response.json())
            .then((data) => {
              const totalPages = Number(data.total_hits) / limit;
              const currentPage = 1;

              const html = Number(data.total_hits) === 0 ? renderNoEvents() : data.hits.map(renderer).join("");
              const moreButton = currentPage < totalPages ? renderMoreButton(2) : "";
              node.innerHTML = html + moreButton;
            })
            .catch((error) => console.error("Error fetching data:", error));
        });
      });
  }

  /*
   * Main Controller
   * Fetch and display upcoming events
   * @param {string} baseUrl - The base URL for the search API
   * @param {string} type - The type of events to fetch
   * @param {HTMLElement} node - The DOM node to insert results into
   * @return {void}
   */
  function doUpcoming(baseUrl, type, node, seriesData, maintags) {
    if (!node) return;

    let filterString = getFilterString(type, maintags);
    const renderer = renderEvent(seriesData);

    fetch(baseUrl + filterString + `page=1`)
      .then((response) => response.json())
      .then((data) => {
        const extras = []; // Holds any fake extra events

        let hits = data.hits.map((item) => {
          const cf = item.custom_fields;
          const startTime = cf.d.split("T")[1].split(":")[0] + ":" + cf.d.split("T")[1].split(":")[1];
          const endTime = cf.e.split("T")[1].split(":")[0] + ":" + cf.e.split("T")[1].split(":")[1];
          let repeater = false;

          if (cf.data) {
            if (Array.isArray(cf.data)) {
              // Any extra performances
              const perfs = cf.data
                .filter((item) => {
                  const parsedItem = JSON.parse(decodeURIComponent(item));
                  if (parsedItem.type && parsedItem.type === "perf") return parsedItem;
                })
                .map((item) => JSON.parse(decodeURIComponent(item)))
                .filter((perf) => new Date(perf.end) > new Date());

              if (perfs.length > 0) {
                perfs.forEach((perf) => {
                  const startTimePerf = perf.start.split("T")[1].split(":")[0] + ":" + perf.start.split("T")[1].split(":")[1];
                  const endTimePerf = perf.end.split("T")[1].split(":")[0] + ":" + perf.end.split("T")[1].split(":")[1];
                  const sortValue = Number(String(perf.pin).substring(0, 10));
                  const extraPerf = { ...item, ...perf, startTime: startTimePerf, endTime: endTimePerf, sort: sortValue, repeater: true };
                  extras.push(extraPerf);
                });
                item["hide"] = true; // hide the parent perf event
              }

              // Any repeating events
              const repeat = cf.data
                .filter((item) => {
                  const parsedItem = JSON.parse(decodeURIComponent(item));
                  if (parsedItem.repeat) return parsedItem;
                })
                .map((item) => JSON.parse(decodeURIComponent(item)));

              if (repeat.length > 0) {
                repeater = true;
                const repeatDates = getEvery7Days(cf.d, cf.e).slice(0, 5);

                repeatDates.forEach((date) => {
                  const startDate = combineDateAndTime(cf.d, date);
                  const endDate = combineDateAndTime(cf.e, date);

                  const sortValue = Number(startDate.toISOString().replace(/\D/g, "").slice(0, 10));
                  const extraRepeat = {
                    ...item,
                    start: startDate.toISOString(),
                    startTime: startTime,
                    end: endDate.toISOString(),
                    endTime: endTime,
                    sort: sortValue,
                    repeater: false,
                  };

                  extras.push(extraRepeat);
                });

                item["hide"] = true; // Hide the parent repeater event
              }
            }
          }

          const shortcuts = { start: cf.d, end: cf.e, startTime: startTime, endTime: endTime, sort: cf.sort, repeater: repeater };
          return { ...item, ...shortcuts };
        });

        // Combine hits and extras, then sort by pin
        const allEvents = hits.concat(extras).sort((a, b) => {
          return a.sort - b.sort;
        });

        const html = allEvents.map(renderer).join("");
        node.innerHTML = html || renderNoEvents();

        /*
         * DOM Manipulation for filters
         */
        const radios = node.parentNode.querySelectorAll("input[type='radio']");

        radios &&
          radios.forEach((radio) => {
            radio.checked = false;
            if (radio.value === "all") {
              radio.checked = true;
            }
          });

        /*
         * Add event listeners to radio inputs
         */
        radios &&
          radios.forEach((radio) => {
            radio.addEventListener("click", function (event) {
              event.stopPropagation();

              const selectedValue = event.target.value;

              if (selectedValue === "thisweek") {
                const thisWeekEvents = allEvents.filter(isThisWeek);
                const html = thisWeekEvents.map(renderer).join("");
                node.innerHTML = html || renderNoEvents();
              }

              if (selectedValue === "nextweek") {
                const nextWeekEvents = allEvents.filter(isNextWeek);
                const html = nextWeekEvents.map(renderer).join("");
                node.innerHTML = html || renderNoEvents();
              }

              if (selectedValue === "thismonth") {
                const thisMonthEvents = allEvents.filter(isThisMonth);
                const html = thisMonthEvents.map(renderer).join("");
                node.innerHTML = html || renderNoEvents();
              }

              if (selectedValue === "nextmonth") {
                const nextMonthEvents = allEvents.filter(isNextMonth);
                const html = nextMonthEvents.map(renderer).join("");
                node.innerHTML = html || renderNoEvents();
              }

              if (selectedValue === "all") {
                const html = allEvents.map(renderer).join("");
                node.innerHTML = html || renderNoEvents();
              }
            });
          });

        node.addEventListener("click", handleFavouriteBtnClick());
      });
  }

  /*
   * Webinars Controller
   * Fetch and display Webinars
   * @param {HTMLElement} node - The DOM node to insert results into
   * @return {void}
   */
  function doWebinars(node, maintags) {
    const searchAPI = "https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de";
    const searchUrl = `${searchAPI}?term=*&customField=type%3Dwebinar&`;

    const upcomingObj = {
      and: [
        {
          range: { "custom_fields.e": { gt: getNow(), lt: "2099-12-31" } },
        },
      ],
    };

    // Add maintags array to filter
    if (maintags && maintags.length > 0) {
      maintags.forEach((tag) => {
        upcomingObj.and.push({ "custom_fields.tag": tag });
      });
    }

    const filterString = `&limit=90&resultType=organic&order=asc&filter=${encodeURIComponent(JSON.stringify(upcomingObj))}&sort=custom_fields.d&`;

    fetch(searchUrl + filterString + `page=1`)
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) {
          node.innerHTML = renderNoEvents();
          return;
        }

        const webinars = data.hits.map((item) => {
          const cf = item.custom_fields;
          const shortcuts = { start: cf.d, end: cf.e };
          return { ...item, ...shortcuts };
        });

        const html = webinars.map(renderWebinar).join("");
        node.innerHTML = html || renderNoEvents();

        /*
         * DOM Manipulation for filters
         */
        const radios = node.parentNode.querySelectorAll("input[type='radio']");

        radios &&
          radios.forEach((radio) => {
            radio.checked = false;
            if (radio.value === "all") {
              radio.checked = true;
            }
          });

        /*
         * Add event listeners to radio inputs
         */
        radios &&
          radios.forEach((radio) => {
            radio.addEventListener("click", function (event) {
              event.stopPropagation();

              const selectedValue = event.target.value;

              if (selectedValue === "thisweek") {
                const thisWeekEvents = webinars.filter(isThisWeek);
                const html = thisWeekEvents.map(renderWebinar).join("");

                node.innerHTML = html || renderNoEvents();
              }

              if (selectedValue === "nextweek") {
                const nextWeekEvents = webinars.filter(isNextWeek);
                const html = nextWeekEvents.map(renderWebinar).join("");
                node.innerHTML = html || renderNoEvents();
              }

              if (selectedValue === "thismonth") {
                const thisMonthEvents = webinars.filter(isThisMonth);
                const html = thisMonthEvents.map(renderWebinar).join("");
                node.innerHTML = html || renderNoEvents();
              }

              if (selectedValue === "nextmonth") {
                const nextMonthEvents = webinars.filter(isNextMonth);
                const html = nextMonthEvents.map(renderWebinar).join("");
                node.innerHTML = html || renderNoEvents();
              }

              if (selectedValue === "all") {
                const html = webinars.map(renderWebinar).join("");
                node.innerHTML = html || renderNoEvents();
              }
            });
          });

        node.addEventListener("click", handleFavouriteBtnClick());
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  /*
   * Promo Search Controller
   * Fetch and display Promo events
   * @param {string} baseUrl - The base URL for the search API
   * @param {HTMLElement} promoNode - The DOM node to insert results into
   * @return {void}
   */
  function doPromoSearch(baseUrl, node, seriesData, maintags) {
    const promoFilter = {
      and: [
        { "custom_fields.tag": "Promo" },
        {
          range: { "custom_fields.e": { gt: getNow(), lt: "2099-12-31" } },
        },
      ],
    };

    // Add maintags array to filter
    if (maintags && maintags.length > 0) {
      maintags.forEach((tag) => {
        promoFilter.and.push({ "custom_fields.tag": tag });
      });
    }

    const filterString = `&limit=1&order=asc&filter=${encodeURIComponent(JSON.stringify(promoFilter))}&sort=custom_fields.sort&`;
    fetch(baseUrl + filterString + `page=1`)
      .then((response) => response.json())
      .then((data) => {
        if (data.total_hits > 0) {
          const html = rendereventsPromo(seriesData, data.hits[0]);
          node.innerHTML = html || ``;
        }

        node.addEventListener("click", handleFavouriteBtnClick());
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  /*
   * Load tab content
   * @param {HTMLElement} targetNode - The target tab content node
   * @param {Array} tabmap - The tab mapping array
   * @param {Object} seriesData - The series data
   * @return {void}
   */
  function loadTab(baseUrl, tab, seriesData, maintags) {
    const id = tab.querySelector("h2").innerText.toLowerCase().split(" ")[0];

    if (id === "archive") {
      return doArchive(baseUrl, tab.querySelector(".c-search-results-events "), seriesData, maintags);
    }

    if (id === "webinars") {
      return doWebinars(tab.querySelector(".c-search-results-events "), maintags);
    }

    doUpcoming(baseUrl, id, tab.querySelector(".c-search-results-events "), seriesData, maintags);
  }

  /*
   * Initialize
   */
  (async () => {
    const maintags = document
      .querySelector("#eventsrevamp")
      .dataset.tags.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const searchAPI = "https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de";
    const searchUrl = `${searchAPI}?term=*&customField=type%3Devent&resultType=organic&`;

    const seriesData = await doSeriesSearch(searchUrl);

    // Promo
    promoNode && doPromoSearch(searchUrl, promoNode, seriesData, maintags);

    publicNode && (publicNode.innerHTML = ``);
    staffNode && (staffNode.innerHTML = ``);
    artNode && (artNode.innerHTML = ``);
    archiveNode && (archiveNode.innerHTML = ``);
    webinarsNode && (webinarsNode.innerHTML = ``);
    //webinarsNode && doWebinars(webinarsNode, getWebinarsJSON(UoS_env.name));
    webinarsNode && doWebinars(webinarsNode, maintags);

    // TABS
    const tabButtons = document.querySelectorAll('[data-behaviour="tabs"] button');

    const activeBtn = document.querySelector('[data-behaviour="tabs"] [role="tab"][aria-selected="true"]')
      ? document.querySelector('[data-behaviour="tabs"] [role="tab"][aria-selected="true"]')
      : document.querySelector('.pseudotab[aria-expanded="true"]');

    if (activeBtn) {
      const targetId = activeBtn.getAttribute("aria-controls");
      const targetNode = document.getElementById(targetId);
      loadTab(searchUrl, targetNode, seriesData, maintags);
    }

    // Attach event listeners for tab clicks
    tabButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const targetId = event.target.getAttribute("aria-controls");
        loadTab(searchUrl, document.getElementById(targetId), seriesData, maintags);
      });
    });
  })();
})();
