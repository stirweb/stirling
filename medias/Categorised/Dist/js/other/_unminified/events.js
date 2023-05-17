(function (scope) {
  if (!scope) return;

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
    return `<div class="u-bg-white u-p-3"><p>No events found</p></div>`;
  };

  const renderEvent = (item) => {
    return `
            <div class="c-search-result  ${item.image ? "c-search-result__with-thumbnail" : ``}" data-result-type="event" ${item.pin < 0 ? `data-label-icon="pin"` : ``} >
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
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="uos-clock u-icon h5"></span>
                            <span><time>${item.startTime}</time> – <time>${item.endTime}</time></span>
                        </div>
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-location"></span>
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
            ${item.image ? `<div class="cell medium-4"><img src="${item.image}" width="500" height="500" alt="Image: ${item.title}" /></div>` : ``}  
        </div>`;
  };

  const renderArchiveEvent = (item) => {
    return ` <div class="c-search-result ${item.image ? "c-search-result__with-thumbnail" : ``}" data-result-type="event"  >
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

  const setDOMPublic = setDOMContent(eventspublic);

  const setDOMStaff = setDOMContent(eventsstaff);

  const setDOMArchive = setDOMContent(eventsarchive);

  const setDOMPromo = setDOMContent(eventspromo);

  const getNow = () => {
    let yourDate = new Date();
    return Number(yourDate.toISOString().split("T")[0].split("-").join(""));
  };

  const isPublic = (item) => item.isPublic === "Yes"; // TODO Break out past and future

  const isStaffStudent = (item) => item.isPublic !== "Yes"; // TODO Break out past and future

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
    //console.log(first, last);
    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getNextWeekStartEnds : Returns an object with start & end dates eg 2023-07-24, 2023-07-30
    */
  const getNextWeekStartEnds = () => {
    let date = new Date();
    let first = new Date(date.setDate(date.getDate() + ((0 + (7 - date.getDay())) % 7)));
    const last = new Date(date.setDate(date.getDate() + 6));
    //console.log(first, last);
    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getThisMonthStartEnds : Returns an object with start & end dates eg 2023-04-01, 2023-04-30 
    */
  const getThisMonthStartEnds = () => {
    let date = new Date();
    let first = new Date(date.getFullYear(), date.getMonth(), 2);
    let last = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    //console.log(first, last);
    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getNextMonthStartEnds : Returns an object with start & end dates eg 2023-04-01, 2023-04-30 
    */
  const getNextMonthStartEnds = () => {
    let date = new Date();
    let first = new Date(date.getFullYear(), date.getMonth() + 1, 2);
    let last = new Date(date.getFullYear(), date.getMonth() + 2, 1);
    //console.log(first, last);
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
    |  ON LOAD
    |
    */

  eventspublicfilters.querySelector("input[type=radio]").checked = true;
  eventsstafffilters.querySelector("input[type=radio]").checked = true;
  eventsarchivefilters.querySelector("input[type=radio]").checked = true;

  const initData = stir.feeds.events.filter((item) => item.id);

  // Populate the 3 tabs
  const htmlPublic = stir.compose(joiner, renderEventsMapper, stir.sort(sortByPin), stir.sort(sortByStartDate), isPublicFilter, isUpcomingFilter)(initData);
  htmlPublic.length ? setDOMPublic(htmlPublic) : setDOMPublic(renderNoData());

  const htmlStaff = stir.compose(joiner, renderEventsMapper, stir.sort(sortByStartDate), isStaffFilter, isUpcomingFilter)(initData);
  htmlStaff.length ? setDOMStaff(htmlStaff) : setDOMStaff(renderNoData());

  const htmlArchive = stir.compose(joiner, renderArchiveEventsMapper, stir.sort(sortByStartDateDesc), isPassedFilter)(initData);
  htmlArchive.length ? setDOMArchive(htmlArchive) : setDOMArchive(renderNoData());

  stir.compose(setDOMPromo, joiner, stir.map(renderEventsPromo), isPromoFilter, stir.sort(sortByStartDate))(initData);

  /*
    | 
    |  EVENTS
    |
    */

  eventspublicfilters.addEventListener("click", (event) => {
    if (event.target.type === "radio") {
      const rangeWanted = event.target.value;
      const filterRange = getFilterRange(rangeWanted);
      //console.log(filterRange);

      if (!filterRange) {
        const html1 = stir.compose(joiner, renderEventsMapper, stir.sort(sortByPin), stir.sort(sortByStartDate), isPublicFilter, isUpcomingFilter)(initData);
        html1.length ? setDOMPublic(html1) : setDOMPublic(renderNoData());
      } else {
        const inRangeCurry = inRange(filterRange);
        const dataDateFiltered = stir.filter(inRangeCurry, initData);
        const html2 = stir.compose(joiner, renderEventsMapper, stir.sort(sortByPin), stir.sort(sortByStartDate), isPublicFilte, isUpcomingFilter)(dataDateFiltered);
        html2.length ? setDOMPublic(html2) : setDOMPublic(renderNoData());
      }
    }
  });

  eventsstafffilters.addEventListener("click", (event) => {
    if (event.target.type === "radio") {
      const rangeWanted = event.target.value;
      const filterRange = getFilterRange(rangeWanted);

      if (!filterRange) {
        const html1 = stir.compose(joiner, renderEventsMapper, stir.sort(sortByPin), stir.sort(sortByStartDate), isStaffFilter, isUpcomingFilter)(initData);
        html1.length ? setDOMStaff(html1) : setDOMStaff(renderNoData());
      } else {
        const inRangeCurry = inRange(filterRange);
        const dataDateFiltered = stir.filter(inRangeCurry, initData);
        const html2 = stir.compose(joiner, renderEventsMapper, stir.sort(sortByPin), stir.sort(sortByStartDate), isStaffFilter, isUpcomingFilter)(dataDateFiltered);
        html2.length ? setDOMStaff(html2) : setDOMStaff(renderNoData());
      }
    }
  });

  eventsarchivefilters.addEventListener("click", (event) => {
    if (event.target.type === "radio") {
      if (event.target.value === "all") {
        const html = stir.compose(joiner, renderArchiveEventsMapper, stir.sort(sortByStartDateDesc), isPassedFilter)(initData);
        html.length ? setDOMArchive(html) : setDOMArchive(renderNoData());
      }

      if (event.target.value === "recordings") {
        const htmlRecordings = stir.compose(joiner, renderArchiveEventsMapper, stir.sort(sortByStartDateDesc), hasRecording, isPassedFilter)(initData);
        htmlRecordings.length ? setDOMArchive(htmlRecordings) : setDOMArchive(renderNoData());
      }

      if (event.target.value === "public") {
        const htmlPublic = stir.compose(joiner, renderArchiveEventsMapper, stir.sort(sortByStartDateDesc), isPublicFilter, isPassedFilter)(initData);
        htmlPublic.length ? setDOMArchive(htmlPublic) : setDOMArchive(renderNoData());
      }

      if (event.target.value === "staffstudent") {
        const htmlPublic = stir.compose(joiner, renderArchiveEventsMapper, stir.sort(sortByStartDateDesc), isStaffFilter, isPassedFilter)(initData);
        htmlPublic.length ? setDOMArchive(htmlPublic) : setDOMArchive(renderNoData());
      }
    }
  });
})(stir.node("#eventsrevamp"));
