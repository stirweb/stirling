/*

*/
(function () {
  // get a reference to the Section ID meta tag
  var pageSID = document.head.querySelector("[name=sid][content]");

  // only continue if the meta tag exists. if it didn't (and we
  // don't check) a Reference Error would be thrown.
  if (pageSID) {
    // get all links that match our criteria…
    var upcomingEventLinks = document.querySelectorAll('a[data-section-id="' + pageSID.getAttribute("content") + '"][data-type="event"]');

    //…and loop thru to remove them all
    for (var i = 0; i < upcomingEventLinks.length; i++) {
      upcomingEventLinks[i].parentNode.removeChild(upcomingEventLinks[i]);
      //upcomingEventLinks[i].style.display = "none"; // <- or just hide them if you want!
    }
  }
})();

/*
|
|   SHARE BUTTONS
|
*/

(function (scope) {
  if (!scope) return;

  const shareInput = scope;

  if (shareInput) shareInput.value = window.location.href;

  const copyUrlBtn = stir.node("#copyurl");

  const copyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  copyUrlBtn && copyUrlBtn.addEventListener("click", (event) => copyUrl());
})(stir.node("#shareurl"));

/*
|
|   SERIES LISTING
|
*/

(function (scope) {
  if (!scope) return;

  const seriesEventsArea = scope;
  const seriesId = seriesEventsArea.dataset && seriesEventsArea.dataset.seriesid ? seriesEventsArea.dataset.seriesid : null;
  const seriesDateFilter = stir.node("#seriesdatefilter");

  /*
    |
    |   RENDERERS
    |
    */

  const renderHeader = (text, classes) => (text ? `<h3 class="header-stripped ${classes}">${text}</h3>` : ``);

  const renderAudience = (audience) => {
    return !audience.trim ? `` : `<strong>Audience</strong><br />${audience.replaceAll(",", "<br/>")}`;
  };

  const renderInfoTag = (info) => `<span class="u-bg-heritage-berry u-white c-tag u-mr-1 u-inline-block u-mb-1">${info}</span>`;

  const renderEvent = (item, index) => {
    return `
        <div class="${index % 2 === 1 ? `` : `u-bg-grey`} ${index === 0 ? `u-heritage-line-top u-border-width-5` : ``} u-p-1 c-event-list u-gap">
          <div >
            ${item.cancelled ? renderInfoTag("Cancelled") : ``}${item.rescheduled ? renderInfoTag("Rescheduled") : ``}
            <span class="u-inline-block u-mb-1"><strong>Event</strong><br />
            <a href="${item.url}">${item.title}</a></span><br />
            <strong >Date:</strong> ${item.stirStart} <br />
            <strong>Time:</strong> ${item.startTime} - ${item.endTime}
          </div>
          <div><span class="u-inline-block u-mb-1"><strong>Description</strong><br />${item.summary} </span></div>
          <div><span class="u-inline-block u-mb-1">${renderAudience(item.audience)}</span></div>
          <div><span class="u-inline-block u-mb-1">${item.recording ? `<strong>Recording</strong><br />Available` : ``}</span></div>
        </div>`;
  };

  const renderDates = (item) => {
    return `<option value="${item.startInt}">${item.stirStart}</option>`;
  };

  const renderOptionOne = () => `<option value="">Filter by date</option>`;

  /*
    |
    |   HELPERS
    |
    */

  const dateUserFilter = stir.curry((d, item) => {
    if (d === ``) return item;
    if (item.startInt === Number(d)) return item;
  });

  const dateMapper = (item) => {
    return { start: item.start, stirStart: item.stirStart, startInt: item.startInt };
  };

  const removeDuplicateObjectFromArray = (array, key) => {
    let check = {};
    let res = [];
    for (let i = 0; i < array.length; i++) {
      if (!check[array[i][key]]) {
        check[array[i][key]] = true;
        res.push(array[i]);
      }
    }
    return res;
  };

  const filterEmpties = (item) => item.start;

  const renderEventsMapper = stir.map(renderEvent);

  const joiner = stir.join("");

  const getNow = () => {
    let yourDate = new Date();
    return Number(yourDate.toISOString().split("T")[0].split("-").join(""));
  };

  const sortByStartDate = (a, b) => a.startInt - b.startInt;

  const isUpcoming = (item) => item.endInt >= getNow();

  const isUpcomingFilter = stir.filter(isUpcoming);

  const isPassed = (item) => item.endInt < getNow();

  const isPassedFilter = stir.filter(isPassed);

  const isSeriesChildFilter = stir.filter((item) => item.isSeriesChild === seriesId);

  const getJSONUrl = (env) => {
    if (env === "dev") return "index.json";
    if (env === "preview") return '<t4 type="navigation" id="5214" />';

    return `/data/events/revamp/json/index.json`;
  };

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /*
    |
    |   CONTROLLERS
    |
    */

  const doUpcoming = (date, initialData) => {
    const dateUserFilterCurry = stir.filter(dateUserFilter(date));

    const seriesUpcomingData = stir.compose(joiner, renderEventsMapper, stir.sort(sortByStartDate), dateUserFilterCurry, isUpcomingFilter, isSeriesChildFilter)(initialData);
    const upcomingHtml = seriesUpcomingData.length ? renderHeader("Upcoming", "") + seriesUpcomingData : ``;

    return upcomingHtml;
  };

  const doPast = (initialData) => {
    const seriesPastData = stir.compose(joiner, renderEventsMapper, stir.sort(sortByStartDate), isPassedFilter, isSeriesChildFilter)(initialData);
    return seriesPastData.length ? renderHeader("Passed", "u-mt-2") + seriesPastData : ``;
  };

  const doDateFilter = (initialData) => {
    const dates = stir.compose(stir.map(dateMapper), stir.sort(sortByStartDate), isUpcomingFilter, isSeriesChildFilter, stir.filter(filterEmpties))(initialData);
    const dates2 = removeDuplicateObjectFromArray(dates, "startInt");
    return stir.compose(joiner, stir.map(renderDates))(dates2);
  };

  /*
    |
    |   ON LOAD
    |
    */

  const url = getJSONUrl(UoS_env.name);

  /* Fetch the data */
  stir.getJSON(url, (initialData) => {
    const pastHtml = doPast(initialData);
    setDOMContent(seriesEventsArea, doUpcoming("", initialData) + pastHtml);

    if (!seriesDateFilter) return;

    /* Series filter */
    setDOMContent(seriesDateFilter, renderOptionOne() + doDateFilter(initialData));

    /* Event Listener */
    seriesDateFilter.addEventListener("change", (event) => {
      const upcomingHtml = doUpcoming(seriesDateFilter.options[seriesDateFilter.selectedIndex].value, initialData);
      setDOMContent(seriesEventsArea, upcomingHtml + pastHtml);
    });
  });
})(stir.node("#seriesevents"));
