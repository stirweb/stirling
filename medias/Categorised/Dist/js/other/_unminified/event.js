/*

  NO LONGER NEEDED AS ITS HANDLED BELOW

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
*/

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
|   SERIES LISTING + MORE EVENTS LISTING
|
*/

(function () {
  const seriesEventsArea = stir.node("#seriesevents");
  const seriesId = seriesEventsArea && seriesEventsArea.dataset && seriesEventsArea.dataset.seriesid ? seriesEventsArea.dataset.seriesid : null;
  const seriesDateFilter = stir.node("#seriesdatefilter");
  const moreEventsArea = stir.node("#moreevents");

  if (!seriesEventsArea && !moreEventsArea) return;

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
          <div><span class="u-inline-block u-mb-1">${item.recording ? `<strong>Recording</strong><br /><a href="https://www.youtube.com/watch?v=n_uFzLPYDd8">Available</a>` : ``}</span></div>
        </div>`;
  };

  const renderDates = (item) => {
    return `<option value="${item.start}">${item.stirStart}</option>`;
  };

  const renderOptionOne = () => `<option value="">Filter by date</option>`;

  const renderEndDate = (item) => (item.stirStart === item.stirEnd ? `` : `- ${item.stirEnd}`);

  const renderMoreEvent = (item) => {
    return `<a href="#" class="u-border u-p-1 u-mb-1 flex-container flex-dir-column large-flex-dir-row   u-gap">
                <span class="u-flex1"><strong>${item.title}</strong></span>
                <span class="flex-container align-middle u-gap u-grey--dark">
                    <strong>${item.stirStart} ${renderEndDate(item)}</strong>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1080 800"
                        stroke-width="1.5" stroke="none" style="width: 20px; height:20px">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M315.392 9.728c0 8.192 4.096 16.384 10.24 22.528l413.696 415.744-413.696 415.744c-12.288 12.288-12.288 32.768 0 47.104 12.288 12.288 32.768 12.288 47.104 0l438.272-438.272c12.288-12.288 12.288-34.816 0-47.104l-440.32-438.272c-12.288-12.288-32.768-12.288-47.104 0-6.144 6.144-8.192 14.336-8.192 22.528z" />
                    </svg>
                </span>
            </a>`;
  };

  /*
    |
    |   HELPERS
    |
    */

  const renderMoreEventsMapper = stir.map(renderMoreEvent);

  const limitTo3 = stir.filter((item, index) => index < 3);

  const dateUserFilter = stir.curry((d, item) => {
    if (d === ``) return item;
    if (item.start === d) return item;
  });

  const dateMapper = (item) => {
    return { start: item.start, stirStart: item.stirStart, startInt: item.startInt };
  };

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

  const filterEmpties = (item) => item.start;

  const renderEventsMapper = stir.map(renderEvent);

  const joiner = stir.join("");

  const getNow = () => {
    let yourDate = new Date();
    return Number(yourDate.toISOString().split("T")[0].split("-").join("") + ("0" + yourDate.getHours()).slice(-2) + ("0" + yourDate.getMinutes()).slice(-2));
  };

  const sortByStartDate = (a, b) => a.startInt - b.startInt;

  const isUpcoming = (item) => item.endInt >= getNow();

  const isUpcomingFilter = stir.filter(isUpcoming);

  const isPassed = (item) => Number(item.endInt) < getNow() && item.archive.length;

  const isPassedFilter = stir.filter(isPassed);

  const isSeriesChildFilter = stir.filter((item) => item.isSeriesChild === seriesId);

  const sortByPin = (a, b) => Number(a.pin) - Number(b.pin);

  const getJSONUrl = (env) => {
    if (env === "dev") return "index.json";
    if (env === "preview") return '<t4 type="navigation" id="5214" />'; //5222

    return `/data/events/revamp/json/index.json`;
  };

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
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

    if (stir.any(isTrue, matches)) return item;
  });

  /*
    |
    |   CONTROLLERS
    |
    */

  const doUpcomingSeries = (date, initialData) => {
    const dateUserFilterCurry = stir.filter(dateUserFilter(date));

    const seriesUpcomingData = stir.compose(joiner, renderEventsMapper, stir.sort(sortByStartDate), dateUserFilterCurry, isUpcomingFilter, isSeriesChildFilter)(initialData);
    const upcomingHtml = seriesUpcomingData.length ? renderHeader("Upcoming", "") + seriesUpcomingData : ``;

    return upcomingHtml;
  };

  const doPastSeries = (date, initialData) => {
    const dateUserFilterCurry = stir.filter(dateUserFilter(date));

    const seriesPastData = stir.compose(joiner, renderEventsMapper, stir.sort(sortByStartDate), dateUserFilterCurry, isPassedFilter, isSeriesChildFilter)(initialData);
    return seriesPastData.length ? renderHeader("Passed", "u-mt-2") + seriesPastData : ``;
  };

  const doDateFilter = (initialData) => {
    const removeDupsByStart = removeDuplicateObjectFromArray("start");
    return stir.compose(joiner, stir.map(renderDates), removeDupsByStart, stir.map(dateMapper), stir.sort(sortByStartDate), isSeriesChildFilter, stir.filter(filterEmpties))(initialData);
  };

  const doMoreEvents = (initialData) => {
    const removeDupsById = removeDuplicateObjectFromArray("id");

    const currentId = moreEventsArea.dataset.currentid ? moreEventsArea.dataset.currentid : null;
    const currents = currentId ? stir.filter((item) => item.id === Number(currentId), initialData) : null;
    const current = currents.length ? currents[0] : null;

    //Priority 1: events with same tag
    const tags = current ? current.tags : null;
    const filterByTagCurry = stir.filter(filterByTag(tags));
    const filterCurrent = stir.filter((item) => item.id !== Number(currentId));

    const tagItems = stir.compose(filterCurrent, filterByTagCurry, stir.sort(sortByStartDate), isUpcomingFilter)(initialData);

    //Priority 2: pinned events then Priority 3: most imminent events
    const items = stir.compose(filterCurrent, stir.sort(sortByPin), stir.sort(sortByStartDate), isUpcomingFilter)(initialData);
    const allItems = [...tagItems, ...items];

    stir.compose(setDOMContent(moreEventsArea), joiner, renderMoreEventsMapper, limitTo3, removeDupsById)(allItems);
  };

  /*
    |
    |   ON LOAD
    |
    */

  const url = getJSONUrl(UoS_env.name);

  /* Fetch the data */
  stir.getJSON(url, (initialData) => {
    if (initialData.error) return;

    console.log(initialData);

    if (seriesEventsArea && seriesDateFilter) {
      const pastHtml = doPastSeries("", initialData);
      setDOMContent(seriesEventsArea, doUpcomingSeries("", initialData) + pastHtml);

      /* Series filter */
      setDOMContent(seriesDateFilter, renderOptionOne() + doDateFilter(initialData));

      /* Event Listener */
      seriesDateFilter.addEventListener("change", (event) => {
        const upcomingHtml = doUpcomingSeries(seriesDateFilter.options[seriesDateFilter.selectedIndex].value, initialData);
        const pastHtml = doPastSeries(seriesDateFilter.options[seriesDateFilter.selectedIndex].value, initialData);

        setDOMContent(seriesEventsArea, upcomingHtml + pastHtml);
      });
    }

    if (moreEventsArea) {
      doMoreEvents(initialData);
    }
  });
})();

/*

  Flickr gallery

*/
(function (scope) {
  if (!scope) return;

  if (!gallery || !galleryId) return;

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const renderImage = (item) => {
    const alt = item.title.length ? item.title : "Flickr image " + item.id;
    return `<img alt="${alt}" class="u-object-cover"  src="https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_c.jpg" width="${item.o_width}" height="${item.o_height}"></img>`;
  };

  const renderCTA = (galleryId) => {
    return `<div>
              <svg width="70px" height="70px" viewBox="0 -13 47 47" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Color-" transform="translate(-501.000000, -474.000000)">
                        <g id="Flickr" transform="translate(501.000000, 474.000000)">
                            <path d="M46.8292683,10.1695828 C46.8292683,15.7864719 42.2171072,20.3418803 36.5173021,20.3418803 C30.8119899,20.3418803 26.1970752,15.7864719 26.1970752,10.1695828 C26.1970752,4.55540841 30.8119899,0 36.5173021,0 C42.2171072,0 46.8292683,4.55540841 46.8292683,10.1695828" fill="#FF007F">

                            </path>
                            <path d="M20.6294395,10.1695828 C20.6294395,15.7864719 16.0145249,20.3418803 10.3092127,20.3418803 C4.61216113,20.3418803 0,15.7864719 0,10.1695828 C0,4.55540841 4.61216113,0 10.3092127,0 C16.0145249,0 20.6294395,4.55540841 20.6294395,10.1695828" fill="#0960D5">

                            </path>
                                    </g>
                                </g>
                            </g>
              </svg>
              <a href="https://www.flickr.com/photos/79498756@N04/albums/${galleryId}" class="button expanded heritage-green">View the album on Flickr</a>
            </div>`;
  };

  setDOMContent(scope, gallery.map(renderImage).join("") + renderCTA(galleryId));
})(stir.node("#flickrgallery"));
