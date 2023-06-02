(function (scope) {
  if (!scope) return;

  const ITEMS_PER_PAGE = 4;

  /* 
    NODES
  */
  const eventspublic = stir.node("#eventspublic");
  const eventsstaff = stir.node("#eventsstaff");
  const eventsarchive = stir.node("#eventsarchive");
  const eventspromo = stir.node("#eventspromo");
  const eventspublicfilters = stir.node("#eventspublicfilters");
  const eventsstafffilters = stir.node("#eventsstafffilters");
  const eventsarchivefilters = stir.node("#eventsarchivefilters");

  const eventsPublicTab = stir.node("#eventspublictab");
  const eventsStaffTab = stir.node("#eventsstafftab");
  const eventsArchiveTab = stir.node("#eventsarchivetab");

  const stirTabs = stir.nodes(".stir-tabs__tab");

  /* 
    |
    |   RENDERERS : Return a string of Html Code
    |
    */

  const renderImage = (image, alt) => {
    return `<div class="c-search-result__image"><img src="${image}" width="275" height="275" alt="Image: ${alt}"></div>`;
  };

  const renderTab = (text) => {
    return `<div class="c-search-result__tags">
                <span class="c-search-tag">${text}</span>
            </div>`;
  };

  const renderSeriesInfo = (series) => {
    return `<p>Part of the ${series} series.</p>`;
  };

  const renderNoData = () => {
    return `<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No more events found</p></div>`;
  };

  const renderEvent = (item) => {
    return `
            <div class="c-search-result  ${item.image ? "c-search-result__with-thumbnail" : ``}" data-result-type="event" ${item.pin < 0 ? `data-label-icon="pin"` : ``} >
                ${item.isSeries ? renderTab("Event series") : ``} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                        <strong><a href="${item.url}">${item.type === "Webinar" ? `Webinar: ` : ``}${item.title}</a></strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-calendar"></span>
                            <span><time datetime="${item.start}">${item.stirStart}</time> – <time datetime="${item.end}">${item.stirEnd}</time></span>
                        </div>
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="uos-clock u-icon h5"></span>
                            <span><time>${item.startTime}</time> – <time>${item.endTime}</time></span>
                        </div>
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 ${item.type === "Webinar" ? `uos-computer` : `uos-location`} "></span>
                            <span>${item.location}</span>
                        </div>
                    </div>
                    <p class="u-m-0">${item.summary}</p>
                    ${item.isSeriesChild ? renderSeriesInfo(item.isSeriesChild) : ``}
                </div>
                ${item.image ? renderImage(item.image, item.title) : ``}  
            </div>`;
  };

  const renderEventsPromo = (item) => {
    return `
          <div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell u-p-2 small-12 ${item.image ? `medium-8` : ``} ">
                ${item.isSeries ? renderTab("Event series") : ``}
                <p class="u-text-regular u-mb-2">
                    <strong><a href="${item.url}">${item.title}</a></strong>
                </p>
                <div class="flex-container flex-dir-column u-gap-8 u-mb-1">
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="u-icon h5 uos-calendar"></span>
                        <span><time datetime="${item.start}">${item.stirStart}</time> – <time datetime="${item.end}">${item.stirEnd}</time></span>
                    </div>
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="uos-clock u-icon h5"></span>
                        <span><time>${item.startTime}</time> – <time>${item.endTime}</time></span>
                    </div>
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="u-icon h5 uos-location"></span>
                        <span>${item.location}</span>
                    </div>
                </div>
                <p class="u-m-0 text-sm">${item.summary}</p>
                ${item.isSeriesChild ? renderSeriesInfo(item.isSeriesChild) : ``}
            </div>
            ${item.image ? `<div class="cell medium-4"><img src="${item.image}" class="u-object-cover" width="800" height="800" alt="Image: ${item.title}" /></div>` : ``}  
        </div>`;
  };

  const renderArchiveEvent = (item) => {
    return `
            <div class="c-search-result ${item.image ? "c-search-result__with-thumbnail" : ``}" data-result-type="event"  >
                ${item.recording ? renderTab("Recording available") : ``} 
                ${item.isSeries ? renderTab("Event series") : ``} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                        <strong><a href="${item.url}">${item.title}</a></strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-calendar"></span>
                            <span><time datetime="${item.start}">${item.stirStart}</time> – <time datetime="${item.end}">${item.stirEnd}</time></span>
                        </div>
                    </div>
                    <p class="u-m-0">${item.summary}</p>
                    ${item.isSeriesChild ? renderSeriesInfo(item.isSeriesChild) : ``}
                </div>
                ${item.image ? renderImage(item.image, item.title) : ``}  
            </div>`;
  };

  const renderPaginationBtn = (end, noOfResults) => {
    return end > noOfResults ? `` : `<div class="loadmorebtn flex-container align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>`;
  };

  const renderPageMeta = (start, end, noOfResults) => {
    return start < 2 ? `` : `<div class="flex-container align-center u-mb-2">Showing ${start + 1}-${end > noOfResults ? noOfResults : end} of ${noOfResults} results</div>`;
  };

  /*
    |
    |   HELPERS
    |
    */

  const renderEventsMapper = stir.map(renderEvent);

  const renderArchiveEventsMapper = stir.map(renderArchiveEvent);

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const appendDOMContent = stir.curry((elem, html) => {
    elem.insertAdjacentHTML("beforeend", html);
    return elem;
  });

  const setDOMPromo = setDOMContent(eventspromo);

  const getNow = () => {
    let yourDate = new Date();
    return Number(yourDate.toISOString().split("T")[0].split("-").join(""));
  };

  const isPublic = (item) => item.isPublic === "Yes";

  const isStaffStudent = (item) => item.isPublic !== "Yes";

  const isPublicFilter = stir.filter(isPublic);

  const isStaffFilter = stir.filter(isStaffStudent);

  const isPassed = (item) => item.endInt < getNow();

  const isPassedFilter = stir.filter(isPassed);

  const isUpcoming = (item) => item.endInt >= getNow();

  const isUpcomingFilter = stir.filter(isUpcoming);

  const isPromo = (item) => item.promo;

  const isPromoFilter = stir.filter(isPromo);

  const joiner = stir.join("");

  const sortByStartDate = (a, b) => a.startInt - b.startInt;

  const sortByStartDateDesc = (a, b) => b.startInt - a.startInt;

  const sortByPin = (a, b) => a.pin - b.pin;

  const hasRecording = stir.filter((item) => item.recording);

  const paginationFilter = stir.curry((page, itemsPerPage, index) => {
    const start = itemsPerPage * (page - 1);
    const end = start + itemsPerPage;
    return index >= start && index < end;
  });

  /* 
    | 
    |    DATE HELPERS
    |
    */

  /* 
        inDateRange : Returns a boolean
    */
  const inDateRange = stir.curry((filterRange, date) => {
    const matches = filterRange.filter((day) => day === date);
    return matches.length ? true : false; // Only need one match
  });

  /* 
        getDaysArray : Returns an array of date strings eg 2023-07-24
    */
  const getDaysArray = (s, e) => {
    let a = [];

    for (d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
      a.push(new Date(d).toISOString().split("T")[0]);
    }
    return a;
  };

  /* 
        getThisWeekStartEnds : Returns an object with start & end dates eg 2023-07-24, 2023-07-30 
    */
  const getThisWeekStartEnds = () => {
    const date = new Date();
    const first = new Date(date.setDate(date.getDate() + ((0 + (0 - date.getDay())) % 7)));
    const last = new Date(date.setDate(date.getDate() + 6));

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getNextWeekStartEnds : Returns an object with start & end dates eg 2023-07-24, 2023-07-30
    */
  const getNextWeekStartEnds = () => {
    const date = new Date();
    const first = new Date(date.setDate(date.getDate() + ((0 + (7 - date.getDay())) % 7)));
    const last = new Date(date.setDate(date.getDate() + 6));

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getThisMonthStartEnds : Returns an object with start & end dates eg 2023-04-01, 2023-04-30 
    */
  const getThisMonthStartEnds = () => {
    const date = new Date();
    const first = new Date(date.getFullYear(), date.getMonth(), 2);
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getNextMonthStartEnds : Returns an object with start & end dates eg 2023-04-01, 2023-04-30 
    */
  const getNextMonthStartEnds = () => {
    const date = new Date();
    const first = new Date(date.getFullYear(), date.getMonth() + 1, 2);
    const last = new Date(date.getFullYear(), date.getMonth() + 2, 1);

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getFilterRange : Returns the correct array of dates [2023-07-24, 2023-07-24]
    */
  const getFilterRange = (rangeWanted) => {
    if (rangeWanted === "thisweek") return getDaysArray(getThisWeekStartEnds().start, getThisWeekStartEnds().end);

    if (rangeWanted === "nextweek") return getDaysArray(getNextWeekStartEnds().start, getNextWeekStartEnds().end);

    if (rangeWanted === "thismonth") return getDaysArray(getThisMonthStartEnds().start, getThisMonthStartEnds().end);

    if (rangeWanted === "nextmonth") return getDaysArray(getNextMonthStartEnds().start, getNextMonthStartEnds().end);

    return null;
  };

  /* 
        inRange : Returns a boolean
    */
  const inRange = stir.curry((range, item) => {
    const itemRange = getDaysArray(item.start, item.end);

    const ranges = itemRange.map((day) => inDateRange(range, day));
    return stir.any((item) => item, ranges);
  });

  /* 
  | 
  |  CONTROLLERS
  |
  */
  const doPublicEvents = (rangeWanted, initData) => {
    const filterRange = getFilterRange(rangeWanted);
    const page = Number(QueryParams.get("page")) || 1;
    const start = ITEMS_PER_PAGE * (page - 1);
    const end = start + ITEMS_PER_PAGE;

    const setDOMPublic = page === 1 ? setDOMContent(eventspublic) : appendDOMContent(eventspublic);

    const pageFilterCurry = stir.filter((item, index) => {
      if (paginationFilter(page, ITEMS_PER_PAGE, index)) return item;
    });

    if (!filterRange) {
      const dataAll1 = stir.compose(stir.sort(sortByPin), stir.sort(sortByStartDate), isPublicFilter, isUpcomingFilter)(initData);
      const dataAll1b = stir.compose(joiner, renderEventsMapper, pageFilterCurry)(dataAll1);
      const noOfResults = dataAll1.length;

      dataAll1.length ? setDOMPublic(renderPageMeta(start, end, noOfResults) + dataAll1b + renderPaginationBtn(end, noOfResults)) : setDOMPublic(renderNoData());
    } else {
      const inRangeCurry = inRange(filterRange);
      const dataDateFiltered = stir.filter(inRangeCurry, initData);

      const dataAll2 = stir.compose(stir.sort(sortByPin), stir.sort(sortByStartDate), isPublicFilter, isUpcomingFilter)(dataDateFiltered);
      const dataAll2b = stir.compose(joiner, renderEventsMapper, pageFilterCurry)(dataAll2);
      const noOfResults = dataAll2.length;

      dataAll2.length ? setDOMPublic(renderPageMeta(start, end, noOfResults) + dataAll2b + renderPaginationBtn(end, noOfResults)) : setDOMPublic(renderNoData());
    }
  };

  /* 
  |  doStaffEvents
  */
  const doStaffEvents = (rangeWanted, initData) => {
    const filterRange = getFilterRange(rangeWanted);
    const page = Number(QueryParams.get("page")) || 1;
    const start = ITEMS_PER_PAGE * (page - 1);
    const end = start + ITEMS_PER_PAGE;

    const setDOMStaff = page === 1 ? setDOMContent(eventsstaff) : appendDOMContent(eventsstaff);

    const pageFilterCurry = stir.filter((item, index) => {
      if (paginationFilter(page, ITEMS_PER_PAGE, index)) return item;
    });

    if (!filterRange) {
      const dataAll1 = stir.compose(stir.sort(sortByPin), stir.sort(sortByStartDate), isStaffFilter, isUpcomingFilter)(initData);
      const dataAll1b = stir.compose(joiner, renderEventsMapper, pageFilterCurry)(dataAll1);
      const noOfResults = dataAll1.length;

      dataAll1.length ? setDOMStaff(renderPageMeta(start, end, noOfResults) + dataAll1b + renderPaginationBtn(end, noOfResults)) : setDOMStaff(renderNoData());
    } else {
      const inRangeCurry = inRange(filterRange);
      const dataDateFiltered = stir.filter(inRangeCurry, initData);

      const dataAll2 = stir.compose(stir.sort(sortByPin), stir.sort(sortByStartDate), isStaffFilter, isUpcomingFilter)(dataDateFiltered);
      const dataAll2b = stir.compose(joiner, renderEventsMapper, pageFilterCurry)(dataAll2);
      const noOfResults = dataAll2.length;

      dataAll2.length ? setDOMStaff(renderPageMeta(start, end, noOfResults) + dataAll2b + renderPaginationBtn(end, noOfResults)) : setDOMStaff(renderNoData());
    }
  };

  /* 
  |  doArchiveEvents
  */
  const doArchiveEvents = (target, initData) => {
    const page = Number(QueryParams.get("page")) || 1;
    const start = ITEMS_PER_PAGE * (page - 1);
    const end = start + ITEMS_PER_PAGE;

    const setDOMArchive = page === 1 ? setDOMContent(eventsarchive) : appendDOMContent(eventsarchive);

    const pageFilterCurry = stir.filter((item, index) => {
      if (paginationFilter(page, ITEMS_PER_PAGE, index)) return item;
    });

    if (target === "all") {
      const dataAll = stir.compose(stir.sort(sortByStartDateDesc), isPassedFilter)(initData);
      const dataAllb = stir.compose(joiner, renderArchiveEventsMapper, pageFilterCurry)(dataAll);
      const noOfResults = dataAll.length;

      dataAll.length ? setDOMArchive(renderPageMeta(start, end, noOfResults) + dataAllb + renderPaginationBtn(end, noOfResults)) : setDOMArchive(renderNoData());
    }

    if (target === "recordings") {
      const htmlRecordings = stir.compose(stir.sort(sortByStartDateDesc), hasRecording, isPassedFilter)(initData);
      const htmlRecordingsb = stir.compose(joiner, renderArchiveEventsMapper, pageFilterCurry)(htmlRecordings);
      const noOfResults = htmlRecordings.length;

      htmlRecordings.length ? setDOMArchive(renderPageMeta(start, end, noOfResults) + htmlRecordingsb + renderPaginationBtn(end, noOfResults)) : setDOMArchive(renderNoData());
    }

    if (target === "public") {
      const htmlPublic = stir.compose(stir.sort(sortByStartDateDesc), isPublicFilter, isPassedFilter)(initData);
      const htmlPublicb = stir.compose(joiner, renderArchiveEventsMapper, pageFilterCurry)(htmlPublic);
      const noOfResults = htmlPublic.length;

      htmlPublic.length ? setDOMArchive(renderPageMeta(start, end, noOfResults) + htmlPublicb + renderPaginationBtn(end, noOfResults)) : setDOMArchive(renderNoData());
    }

    if (target === "staffstudent") {
      const htmlStaff = stir.compose(stir.sort(sortByStartDateDesc), isStaffFilter, isPassedFilter)(initData);
      const htmlStaffb = stir.compose(joiner, renderArchiveEventsMapper, pageFilterCurry)(htmlStaff);
      const noOfResults = htmlStaff.length;

      htmlStaff.length ? setDOMArchive(renderPageMeta(start, end, noOfResults) + htmlStaffb + renderPaginationBtn(end, noOfResults)) : setDOMArchive(renderNoData());
    }
  };

  /*
    | 
    |  ON LOAD
    |
    */

  eventspublicfilters.querySelector("input[type=radio]").checked = true;
  eventsstafffilters.querySelector("input[type=radio]").checked = true;
  eventsarchivefilters.querySelector("input[type=radio]").checked = true;

  const initData = stir.feeds.events.filter((item) => item.id);
  QueryParams.set("page", 1);

  // Populate the 3 tabs
  doPublicEvents("all", initData);
  doStaffEvents("all", initData);
  doArchiveEvents("all", initData);

  // Populate the Promo
  stir.compose(setDOMPromo, joiner, stir.map(renderEventsPromo), isPromoFilter, stir.sort(sortByStartDate))(initData);

  /*
    | 
    |  CLICK EVENTS LISTENERS
    |
    */

  stir.each((item) => {
    item.addEventListener("click", (event) => {
      QueryParams.set("page", 1);
    });
  }, stirTabs);

  eventsPublicTab.addEventListener("click", (event) => {
    const page = Number(QueryParams.get("page")) || 1;

    if (event.target.type === "radio") {
      QueryParams.set("page", 1);
      doPublicEvents(eventspublicfilters.querySelector("input:checked").value, initData);
    }

    if (event.target.type === "submit") {
      setDOMContent(event.target.closest(".loadmorebtn"), "");
      QueryParams.set("page", page + 1);
      doPublicEvents(eventspublicfilters.querySelector("input:checked").value, initData);
    }
  });

  eventsStaffTab.addEventListener("click", (event) => {
    const page = Number(QueryParams.get("page")) || 1;

    if (event.target.type === "radio") {
      QueryParams.set("page", 1);
      doStaffEvents(eventsstafffilters.querySelector("input:checked").value, initData);
    }

    if (event.target.type === "submit") {
      setDOMContent(event.target.closest(".loadmorebtn"), "");
      QueryParams.set("page", page + 1);
      doStaffEvents(eventsstafffilters.querySelector("input:checked").value, initData);
    }
  });

  eventsArchiveTab.addEventListener("click", (event) => {
    const page = Number(QueryParams.get("page")) || 1;

    if (event.target.type === "radio") {
      QueryParams.set("page", 1);
      doArchiveEvents(eventsarchivefilters.querySelector("input:checked").value, initData);
    }

    if (event.target.type === "submit") {
      setDOMContent(event.target.closest(".loadmorebtn"), "");
      QueryParams.set("page", page + 1);
      doArchiveEvents(eventsarchivefilters.querySelector("input:checked").value, initData);
    }
  });
})(stir.node("#eventsrevamp"));
