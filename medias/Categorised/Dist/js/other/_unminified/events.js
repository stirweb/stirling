(function (scope) {
  if (!scope) return;

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
            <div class="c-search-result ${item.image ? "c-search-result__with-thumbnail" : ``}" data-result-type="event" ${item.pin < 0 ? `data-label-icon="pin"` : ``} >
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
                            <span><time>12.00</time> – <time>18:00</time></span>
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
    return `<div class="u-bg-grey u-p-2" >
                <p>${item.title}</p>
            </div>`;
  };

  /*
    |
    |   HELPERS
    |
    */

  const renderEventsMapper = stir.map(renderEvent);

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

  const isPublic = (item) => item.isPublic === "Yes" && item.endInt >= getNow();

  const isStaffStudent = (item) => item.isPublic !== "Yes";

  const isPublicFilter = stir.filter(isPublic);

  const isStaffFilter = stir.filter(isStaffStudent);

  const isPassed = (item) => item.endInt < getNow();

  const isPassedFilter = stir.filter(isPassed);

  const isPromo = (item) => item.promo;

  const isPromoFilter = stir.filter(isPromo);

  const joiner = stir.join("");

  const sortByStartDate = (a, b) => a.startInt - b.startInt;

  const sortByStartDateDesc = (a, b) => b.startInt - a.startInt;

  const sortByPin = (a, b) => a.pin - b.pin;

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
        getThisWeekDates : Returns an object with start & end dates eg 2023-07-24, 2023-07-30 
    */
  const getThisWeekDates = () => {
    let today = new Date();
    let first = new Date(today.setDate(today.getDate() + ((0 + (0 - today.getDay())) % 7)));
    let last = new Date();
    last.setDate(first.getDate() + 6);

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getNextWeekDates : Returns an object with start & end dates eg 2023-07-24, 2023-07-30
    */
  const getNextWeekDates = () => {
    let today = new Date();
    let first = new Date(today.setDate(today.getDate() + ((0 + (7 - today.getDay())) % 7)));
    let last = new Date();
    last.setDate(first.getDate() + 6);

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getThisMonthDates : Returns an object with start & end dates eg 2023-04-01, 2023-04-30 
    */
  const getThisMonthDates = () => {
    let date = new Date();
    let first = new Date(date.getFullYear(), date.getMonth(), 1);
    let last = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getNextMonthDates : Returns an object with start & end dates eg 2023-04-01, 2023-04-30 
    */
  const getNextMonthDates = () => {
    let date = new Date();
    let first = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    let last = new Date(date.getFullYear(), date.getMonth() + 2, 0);

    return { start: first.toISOString().split("T")[0], end: last.toISOString().split("T")[0] };
  };

  /* 
        getFilterRange : Returns the correct array of dates [2023-07-24, 2023-07-24]
    */
  const getFilterRange = (rangeWanted) => {
    if (rangeWanted === "thisweek") return getDaysArray(getThisWeekDates().start, getThisWeekDates().end);

    if (rangeWanted === "nextweek") return getDaysArray(getNextWeekDates().start, getNextWeekDates().end);

    if (rangeWanted === "thismonth") return getDaysArray(getThisMonthDates().start, getThisMonthDates().end);

    if (rangeWanted === "nextmonth") return getDaysArray(getNextMonthDates().start, getNextMonthDates().end);

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

  const initData = stir.feeds.events.filter((item) => item.id);

  // Populate the 3 tabs
  stir.compose(setDOMPublic, joiner, renderEventsMapper, stir.sort(sortByPin), stir.sort(sortByStartDate), isPublicFilter)(initData);
  stir.compose(setDOMStaff, joiner, renderEventsMapper, stir.sort(sortByStartDate), isStaffFilter)(initData);
  stir.compose(setDOMArchive, joiner, renderEventsMapper, stir.sort(sortByStartDateDesc), isPassedFilter)(initData);

  stir.compose(setDOMPromo, joiner, stir.map(renderEventsPromo), stir.sort(sortByStartDate), isPublicFilter, isPromoFilter)(initData);

  /*
    | 
    |  EVENTS
    |
    */

  eventspublicfilters.addEventListener("click", (event) => {
    if (event.target.type === "radio") {
      const rangeWanted = event.target.value;
      const filterRange = getFilterRange(rangeWanted);

      if (!filterRange) {
        const html1 = stir.compose(joiner, renderEventsMapper, stir.sort(sortByPin), stir.sort(sortByStartDate), isPublicFilter)(initData);
        html1.length ? setDOMPublic(html1) : setDOMPublic(renderNoData());
      } else {
        const inRangeCurry = inRange(filterRange);
        const dataDateFiltered = stir.filter(inRangeCurry, initData);
        const html2 = stir.compose(joiner, renderEventsMapper, stir.sort(sortByPin), stir.sort(sortByStartDate), isPublicFilter)(dataDateFiltered);
        html2.length ? setDOMPublic(html2) : setDOMPublic(renderNoData());
      }
    }
  });

  eventsstafffilters.addEventListener("click", (event) => {
    if (event.target.type === "radio") {
      const rangeWanted = event.target.value;
      const filterRange = getFilterRange(rangeWanted);

      console.log(filterRange);

      if (!filterRange) {
        const html1 = stir.compose(joiner, renderEventsMapper, stir.sort(sortByPin), stir.sort(sortByStartDate), isStaffFilter)(initData);
        html1.length ? setDOMStaff(html1) : setDOMStaff(renderNoData());
      } else {
        const inRangeCurry = inRange(filterRange);
        const dataDateFiltered = stir.filter(inRangeCurry, initData);
        const html2 = stir.compose(joiner, renderEventsMapper, stir.sort(sortByPin), stir.sort(sortByStartDate), isStaffFilter)(dataDateFiltered);
        html2.length ? setDOMStaff(html2) : setDOMStaff(renderNoData());
      }
    }
  });
})(stir.node("#eventsrevamp"));
