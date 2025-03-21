(function (scope) {
  if (!scope) return;

  const ITEMS_PER_PAGE = 10;

  const tagsNode = stir.node("[data-tags]") || "";
  const TAGS = tagsNode ? tagsNode.dataset.tags : "";

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
    return `<div class="u-mt-1"><img src="${image}" width="275" height="275" alt="Image: ${alt}"></div>`;
  };

  const renderTab = (text) => {
    return `<div class="u-absolute u-top--16">
                <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">${text}</span>
            </div>`;
  };

  const renderLabelTab = (item) => {
    if (item.type === "Webinar") return renderTab("Webinar");
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
    if (!item.url) return `${item.type === "Webinar" ? `Webinar: ` : ``}${item.title}`;

    return ` <a href="${item.url}">${item.type === "Webinar" ? `Webinar: ` : ``}${item.title}</a>`;
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
    if (item.type === "Webinar") return `data-label-icon="computer"`;
    if (item.isSeries) return `data-label-icon="startdates"`;

    return ``;
  };

  const renderFavBtns = (showUrlToFavs, cookie, id) => (cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, showUrlToFavs) : stir.favourites.renderAddBtn(id, showUrlToFavs));

  const renderEvent = stir.curry((seriesData, item) => {
    const cookieType = "event";
    const cookie = stir.favourites && stir.favourites.getFav(item.sid, cookieType);
    return `
            <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event" ${renderIconTag(item)} data-perf="${item.perfId}" >
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
    return `
            <div class="u-border-width-5 u-heritage-line-left  u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event"  >
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

  const renderEventsPromo = stir.curry((seriesData, item) => {
    const cookieType = "event";
    const cookie = stir.favourites && stir.favourites.getFav(item.sid, cookieType);
    return `
          <div class="grid-x u-bg-grey u-mb-2 ">
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

  /*
    |
    |   HELPERS
    |
    */

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
    return Number(yourDate.toISOString().split("T")[0].split("-").join("") + ("0" + yourDate.getHours()).slice(-2) + ("0" + yourDate.getMinutes()).slice(-2));
  };

  const isPublic = (item) => item.audience.includes("Public");

  const isStaffStudent = (item) => item.audience.includes("Staff") || item.audience.includes("Student");

  const isPublicFilter = stir.filter(isPublic);

  const isStaffFilter = stir.filter(isStaffStudent);

  const isPassed = (item) => Number(item.endInt) < getNow() && item.archive.length && !item.hideFromFeed.length;

  const isPassedFilter = stir.filter(isPassed);

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

  const sortByStartDate = (a, b) => Number(a.startInt) - Number(b.startInt);

  const sortByStartDateDesc = (a, b) => Number(b.startInt) - Number(a.startInt);

  const sortByPin = (a, b) => Number(a.pin) - Number(b.pin);

  const hasRecording = stir.filter((item) => item.recording);

  const isSeriesFilter = stir.filter((item) => item.isSeries.length);

  const paginationFilter = stir.curry((page, itemsPerPage, index) => {
    const start = itemsPerPage * (page - 1);
    const end = start + itemsPerPage;
    return index >= start && index < end;
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

  const getJSONUrl = (env) => {
    if (env === "dev") return "../index.json";
    if (env === "preview") return '<t4 type="navigation" id="5214" />'; //5222 for limitrd archive
    if (env === "appdev-preview") return '<t4 type="navigation" id="5214" />'; //5222 for limitrd archive

    return `/data/events/revamp/json/index.json`;
  };

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
        tags : Returns a boolean
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

    const seriesData = stir.compose(isSeriesFilter)(initData);
    const renderEventsMapper = stir.map(renderEvent(seriesData));

    const setDOMPublic = page === 1 ? setDOMContent(eventspublic) : appendDOMContent(eventspublic);

    const pageFilterCurry = stir.filter((item, index) => {
      if (paginationFilter(page, ITEMS_PER_PAGE, index)) return item;
    });

    if (!filterRange) {
      const dataAll1 = stir.compose(stir.sort(sortByPin), stir.sort(sortByStartDate), isPublicFilter, filterByTagCurry, removeDupsbyPerf, isUpcomingFilter)(initData);
      const dataAll1b = stir.compose(joiner, renderEventsMapper, pageFilterCurry)(dataAll1);
      const noOfResults = dataAll1.length;

      dataAll1.length ? setDOMPublic(renderPageMeta(start, end, noOfResults) + dataAll1b + renderPaginationBtn(end, noOfResults)) : setDOMPublic(renderNoData("No events found. Try the staff and student events tab."));
    } else {
      const inRangeCurry = inRange(filterRange);
      const dataDateFiltered = stir.filter(inRangeCurry, initData);

      const dataAll2 = stir.compose(stir.sort(sortByPin), stir.sort(sortByStartDate), isPublicFilter, filterByTagCurry, removeDupsbyPerf, isUpcomingFilter)(dataDateFiltered);
      const dataAll2b = stir.compose(joiner, renderEventsMapper, pageFilterCurry)(dataAll2);
      const noOfResults = dataAll2.length;

      dataAll2.length ? setDOMPublic(renderPageMeta(start, end, noOfResults) + dataAll2b + renderPaginationBtn(end, noOfResults)) : setDOMPublic(renderNoData("No events found. Try the staff and student events tab."));
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

    const seriesData = stir.compose(isSeriesFilter)(initData);
    const renderEventsMapper = stir.map(renderEvent(seriesData));

    const setDOMStaff = page === 1 ? setDOMContent(eventsstaff) : appendDOMContent(eventsstaff);

    const pageFilterCurry = stir.filter((item, index) => {
      if (paginationFilter(page, ITEMS_PER_PAGE, index)) return item;
    });

    if (!filterRange) {
      const dataAll1 = stir.compose(stir.sort(sortByPin), stir.sort(sortByStartDate), isStaffFilter, filterByTagCurry, removeDupsbyPerf, isUpcomingFilter)(initData);
      const dataAll1b = stir.compose(joiner, renderEventsMapper, pageFilterCurry)(dataAll1);
      const noOfResults = dataAll1.length;

      dataAll1.length ? setDOMStaff(renderPageMeta(start, end, noOfResults) + dataAll1b + renderPaginationBtn(end, noOfResults)) : setDOMStaff(renderNoData("No events found. Try the public events tab."));
    } else {
      const inRangeCurry = inRange(filterRange);
      const dataDateFiltered = stir.filter(inRangeCurry, initData);

      const dataAll2 = stir.compose(stir.sort(sortByPin), stir.sort(sortByStartDate), isStaffFilter, filterByTagCurry, removeDupsbyPerf, isUpcomingFilter)(dataDateFiltered);
      const dataAll2b = stir.compose(joiner, renderEventsMapper, pageFilterCurry)(dataAll2);
      const noOfResults = dataAll2.length;

      dataAll2.length ? setDOMStaff(renderPageMeta(start, end, noOfResults) + dataAll2b + renderPaginationBtn(end, noOfResults)) : setDOMStaff(renderNoData("No events found. Try the public events tab."));
    }
  };

  /* 
  |  doArchiveEvents
  */
  const doArchiveEvents = (target, initData) => {
    const page = Number(QueryParams.get("page")) || 1;
    const start = ITEMS_PER_PAGE * (page - 1);
    const end = start + ITEMS_PER_PAGE;

    const seriesData = stir.compose(isSeriesFilter)(initData);
    const renderArchiveEventsMapper = stir.map(renderArchiveEvent(seriesData));

    const setDOMArchive = page === 1 ? setDOMContent(eventsarchive) : appendDOMContent(eventsarchive);

    const pageFilterCurry = stir.filter((item, index) => {
      if (paginationFilter(page, ITEMS_PER_PAGE, index)) return item;
    });

    if (target === "all") {
      const dataAll = stir.compose(stir.sort(sortByStartDateDesc), filterByTagCurry, isPassedFilter)(initData);
      const dataAllb = stir.compose(joiner, renderArchiveEventsMapper, pageFilterCurry)(dataAll);
      const noOfResults = dataAll.length;

      dataAll.length ? setDOMArchive(renderPageMeta(start, end, noOfResults) + dataAllb + renderPaginationBtn(end, noOfResults)) : setDOMArchive(renderNoData("No events found."));
    }

    if (target === "recordings") {
      const htmlRecordings = stir.compose(stir.sort(sortByStartDateDesc), hasRecording, filterByTagCurry, isPassedFilter)(initData);
      const htmlRecordingsb = stir.compose(joiner, renderArchiveEventsMapper, pageFilterCurry)(htmlRecordings);
      const noOfResults = htmlRecordings.length;

      htmlRecordings.length ? setDOMArchive(renderPageMeta(start, end, noOfResults) + htmlRecordingsb + renderPaginationBtn(end, noOfResults)) : setDOMArchive(renderNoData("No events found."));
    }

    if (target === "public") {
      const htmlPublic = stir.compose(stir.sort(sortByStartDateDesc), isPublicFilter, filterByTagCurry, isPassedFilter)(initData);
      const htmlPublicb = stir.compose(joiner, renderArchiveEventsMapper, pageFilterCurry)(htmlPublic);
      const noOfResults = htmlPublic.length;

      htmlPublic.length ? setDOMArchive(renderPageMeta(start, end, noOfResults) + htmlPublicb + renderPaginationBtn(end, noOfResults)) : setDOMArchive(renderNoData("No events found."));
    }

    if (target === "staffstudent") {
      const htmlStaff = stir.compose(stir.sort(sortByStartDateDesc), isStaffFilter, filterByTagCurry, isPassedFilter)(initData);
      const htmlStaffb = stir.compose(joiner, renderArchiveEventsMapper, pageFilterCurry)(htmlStaff);
      const noOfResults = htmlStaff.length;

      htmlStaff.length ? setDOMArchive(renderPageMeta(start, end, noOfResults) + htmlStaffb + renderPaginationBtn(end, noOfResults)) : setDOMArchive(renderNoData("No events found."));
    }
  };

  const doPromo = (initData) => {
    const seriesData = stir.filter(isSeriesFilter, initData);
    const renderEventsPromoCurry = renderEventsPromo(seriesData);

    stir.compose(setDOMPromo, joiner, stir.map(renderEventsPromoCurry), limitToOne, isPromoFilter, stir.sort(sortByStartDate), filterByTagCurry, isUpcomingFilter)(initData);
  };

  /*
    | 
    |  ON LOAD
    |
    */

  setDOMContent(eventspublic, "");
  setDOMContent(eventsstaff, "");

  eventspublicfilters.querySelector("input[type=radio]").checked = true;
  eventsstafffilters.querySelector("input[type=radio]").checked = true;
  eventsarchivefilters.querySelector("input[type=radio]").checked = true;

  const url = getJSONUrl(UoS_env.name);

  /* Fetch the data */
  stir.getJSON(url, (data) => {
    if (data.error) return;

    const initData = data.filter((item) => item.id);
    QueryParams.set("page", 1);

    // Populate the 3 tabs + promo
    doPublicEvents("all", initData);
    doStaffEvents("all", initData);
    doArchiveEvents("all", initData);
    doPromo(initData);

    /*
    | 
    |  CLICK EVENTS LISTENERS
    |
    */

    const updateFavouriteBtn = (id) => {
      const cookie = stir.favourites.getFav(id, "event");
      const node = stir.node("#favbtns" + id);

      if (node) setDOMContent(node)(renderFavBtns("true", cookie, id));
    };

    /* 
          handleFavouriteBtnClick 
      */
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

        if (consts.activity === "managefavs") {
          const node = stir.node("#fav-" + target.dataset.id);
          if (node) setDOMContent(node)("");
        }
      }
    };

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

    stir.node("main").addEventListener("click", handleFavouriteBtnClick());
  });
})(stir.node("#eventsrevamp"));
