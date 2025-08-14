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

  // Copies the current URL to the clipboard
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
  const seriesId =
    seriesEventsArea &&
    seriesEventsArea.dataset &&
    seriesEventsArea.dataset.seriesid
      ? seriesEventsArea.dataset.seriesid
      : null;
  const seriesDateFilter = stir.node("#seriesdatefilter");
  const moreEventsArea = stir.node("#moreevents");

  if (!seriesEventsArea && !moreEventsArea) return;

  /*
       Renderers
  */

  //const renderHeader = (text, classes) => text ? `<h3 class="header-stripped ${classes}">${text}</h3>` : ``;
  // Renders a header (currently disabled)
  const renderHeader = (text, classes) => ``;

  // Renders the audience information for an event
  const renderAudience = (audience) => {
    return !audience.trim
      ? ``
      : `<strong>Audience</strong><br />${audience.replaceAll(",", "<br/>")}`;
  };

  // Renders an information tag (e.g., "Cancelled")
  const renderInfoTag = (info) =>
    `<span class="u-bg-heritage-berry u-white c-tag u-mr-1 u-inline-block u-mb-1">${info}</span><br/>`;

  // Renders a link for an event item
  const renderLink = (item) => {
    if (!item.url) return `${item.title}<br />`;
    return `<a href="${item.url}" class="u-underline">${item.title}</a><br />`;
  };

  // Renders the HTML for a single event
  const renderEvent = (item, index) => {
    return `
      <div class="${index % 2 === 0 ? `u-bg-white` : ``} ${
      index === 0 ? `u-heritage-line-top u-border-width-5` : ``
    } u-p-1 c-event-list u-gap">
        <div>
          ${item.cancelled ? renderInfoTag("Cancelled") : ``}
          ${item.rescheduled ? renderInfoTag("Rescheduled") : ``}
          <span class="u-inline-block u-mb-1">
            <strong>Event</strong><br />
            ${renderLink(item)}
            <strong>Date:</strong> ${item.stirStart} ${
      item.stirEnd !== item.stirStart ? ` - ` + item.stirEnd : ``
    }<br />
            <strong>Time:</strong> ${item.startTime} - ${item.endTime}
          </span>
        </div>
        <div>
          <span class="u-inline-block u-mb-1">
            <strong>Description</strong><br />
            ${item.summary}<br />
            <strong>Location</strong><br />
            ${item.location}.
          </span>
        </div>
        <div>
          <span class="u-inline-block u-mb-1">
            ${renderAudience(item.audience)}
          </span>
        </div>
        <div>
          <span class="u-inline-block u-mb-1">
            ${
              item.recording
                ? `<strong>Recording</strong><br /><a href="https://www.youtube.com/watch?v=n_uFzLPYDd8">Available</a>`
                : ``
            }
          </span>
        </div>
      </div>`;
  };

  // Formats a date string into a readable format (e.g., "14 August 2025")
  const renderReadableDate = (date) => {
    const d = new Date(date);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  };

  // Renders a date as an <option> element
  const renderDates = (item) =>
    `<option value="${item}">${renderReadableDate(item)}</option>`;

  // Renders the default "Filter by" option for a select dropdown
  const renderOptionOne = () =>
    `<option value="">Filter by upcoming date</option>`;

  // Renders the end date of an event if it differs from the start date
  const renderEndDate = (item) =>
    item.stirStart === item.stirEnd ? `` : `- ${item.stirEnd}`;

  // Renders the HTML for an event in the "more events" section
  const renderMoreEvent = (item) => {
    return `<a href="${
      item.url
    }" class="u-border u-p-1 u-mb-1 flex-container flex-dir-column large-flex-dir-row   u-gap">
                <span class="u-flex1"><strong>${item.title}</strong></span>
                <span class="flex-container align-middle u-gap u-dark-grey">
                    <strong>${item.stirStart} ${renderEndDate(item)}</strong>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1080 800"
                        stroke-width="1.5" stroke="none" style="width: 20px; height:20px">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M315.392 9.728c0 8.192 4.096 16.384 10.24 22.528l413.696 415.744-413.696 415.744c-12.288 12.288-12.288 32.768 0 47.104 12.288 12.288 32.768 12.288 47.104 0l438.272-438.272c12.288-12.288 12.288-34.816 0-47.104l-440.32-438.272c-12.288-12.288-32.768-12.288-47.104 0-6.144 6.144-8.192 14.336-8.192 22.528z" />
                    </svg>
                </span>
            </a>`;
  };

  // Renders a message indicating no events were found for the selected date
  const renderNoEvents = () =>
    "<p><strong>No events on date selected</strong></p>";

  /*
    Helpers
  */

  // Maps over events to render them for the "more events" section
  const renderMoreEventsMapper = stir.map(renderMoreEvent);

  // Filters an array to the first 3 items
  const limitTo3 = stir.filter((item, index) => index < 3);

  // Curried function to filter events by a user-selected date
  const dateUserFilter = stir.curry((d, item) => {
    if (d === ``) return item;

    const itemDays = getDaysArray(item.start, item.end);
    if (inDateRange(itemDays, d)) return item;
  });

  // Curried function to remove duplicate objects from an array based on a key
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

  // Filters out events that do not have a start date
  const filterEmpties = (item) => item.start;

  // Maps over events to render them
  const renderEventsMapper = stir.map(renderEvent);

  // Joins an array of strings into a single string
  const joiner = stir.join("");

  // Gets the current date and time as a comparable number
  const getNow = () => {
    let yourDate = new Date();
    return Number(
      yourDate.toISOString().split("T")[0].split("-").join("") +
        ("0" + yourDate.getHours()).slice(-2) +
        ("0" + yourDate.getMinutes()).slice(-2)
    );
  };

  // Sort comparator for sorting events by start date (ascending)
  const sortByStartDate = (a, b) => a.startInt - b.startInt;
  //const sortByEndDateDesc = (a, b) => b.endInt - a.endInt;

  // Checks if an event is upcoming
  const isUpcoming = (item) => {
    return item.endInt >= getNow();
  };

  // Filter function to get only upcoming events
  const isUpcomingFilter = stir.filter(isUpcoming);

  // Checks if an event has passed and has an archive link
  const isPassed = (item) =>
    Number(item.endInt) < getNow() && item.archive.length;

  // Filter function to get only passed events
  const isPassedFilter = stir.filter(isPassed);

  // Filter function to get events that are children of the current series
  const isSeriesChildFilter = stir.filter(
    (item) => item.isSeriesChild === seriesId
  );

  // Sort comparator for sorting events by a "pin" property
  const sortByPin = (a, b) => Number(a.pin) - Number(b.pin);

  // Gets the JSON data URL based on the environment
  const getJSONUrl = (env) => {
    if (env === "dev") return "../index.json";
    if (env === "preview" || env === "appdev-preview")
      return '<t4 type="navigation" id="5214" />'; //5222 for limited archive

    return `/data/events/revamp/json/index.json`;
  };

  // Curried function to set the inner HTML of a DOM element
  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /* 
      filterByTag : Returns a boolean
  */
  // Curried function to filter events by tags
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
      inDateRange : Returns a boolean
  */
  // Curried function to check if a date is within a given range
  const inDateRange = stir.curry((filterRange, date) => {
    const matches = filterRange.filter((day) => day === date);
    return matches.length ? true : false; // Only need one match
  });

  /* 
      getDaysArray : Returns an array of date strings eg 2023-07-24
  */
  // Generates an array of date strings between a start and end date
  const getDaysArray = (s, e) => {
    let a = [];

    for (d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
      a.push(new Date(d).toISOString().split("T")[0]);
    }
    return a;
  };

  // Checks if a date string is today or in the future
  const isDateInFuture = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) >= today;
  };

  // Gets all the days an event spans
  const getEventDays = (event) => getDaysArray(event.start, event.end);

  // Gets all past events for the current series
  const getPastSeriesEvents = (events) => {
    return stir.compose(
      isPassedFilter,
      stir.sort(sortByStartDate),
      isSeriesChildFilter,
      stir.filter(filterEmpties)
    )(events);
  };

  // Gets all upcoming events for the current series
  const getUpcomingSeriesEvents = (events) => {
    return stir.compose(
      isUpcomingFilter,
      stir.sort(sortByStartDate),
      isSeriesChildFilter,
      stir.filter(filterEmpties)
    )(events);
  };

  /*
      Controllers
  */

  // Fetches and renders past series events based on a date filter
  const doPastSeries = (date, initialData) => {
    const dateUserFilterCurry = stir.filter(dateUserFilter(date));

    const passedEvents = getPastSeriesEvents(initialData);
    console.log(passedEvents);
    const seriesPastData = stir.compose(
      joiner,
      renderEventsMapper,
      stir.sort(sortByStartDate),
      dateUserFilterCurry
    )(passedEvents);

    return seriesPastData.length
      ? renderHeader("Passed", "u-mt-2") + seriesPastData
      : ``;
  };

  // Fetches and renders upcoming series events based on a date filter
  const doUpcomingSeries = (date, initialData) => {
    const dateUserFilterCurry = stir.filter(dateUserFilter(date));

    const upcomingEvents = getUpcomingSeriesEvents(initialData);
    const seriesUpcomingData = stir.compose(
      joiner,
      renderEventsMapper,
      stir.sort(sortByStartDate),
      dateUserFilterCurry
    )(upcomingEvents);
    const upcomingHtml = seriesUpcomingData.length
      ? renderHeader("Upcoming", "") + seriesUpcomingData
      : ``;

    return upcomingHtml;
  };

  // Generates and renders the date filter options for the series
  const doDateFilter = (initialData) => {
    const passedEvents = getPastSeriesEvents(initialData);
    const upcomingEvents = getUpcomingSeriesEvents(initialData);
    const allSeriesEvents = [...passedEvents, ...upcomingEvents];
    const isDateInFutureFilter = stir.filter(isDateInFuture);

    const dates = stir.compose(
      stir.removeDuplicates,
      stir.flatten,
      stir.map(getEventDays)
    )(upcomingEvents);

    return stir.compose(
      joiner,
      stir.map(renderDates),
      isDateInFutureFilter,
      stir.removeDuplicates,
      stir.flatten,
      stir.map(getEventDays)
    )(upcomingEvents);
  };

  // Fetches and renders the "more events" section
  const doMoreEvents = (initialData) => {
    const removeDupsById = removeDuplicateObjectFromArray("id");

    const currentId = moreEventsArea.dataset.currentid
      ? moreEventsArea.dataset.currentid
      : null;
    const currents = currentId
      ? stir.filter((item) => item.id === Number(currentId), initialData)
      : null;
    const current = currents.length ? currents[0] : null;

    // Priority 1: events with same tag
    const tags = current ? current.tags : null;
    const filterByTagCurry = stir.filter(filterByTag(tags));
    const filterCurrent = stir.filter((item) => item.id !== Number(currentId));

    const tagItems = stir.compose(
      filterCurrent,
      filterByTagCurry,
      stir.sort(sortByStartDate),
      isUpcomingFilter
    )(initialData);

    // Priority 2: pinned events then Priority 3: most imminent events
    const items = stir.compose(
      filterCurrent,
      stir.sort(sortByPin),
      stir.sort(sortByStartDate),
      isUpcomingFilter
    )(initialData);
    const allItems = [...tagItems, ...items];

    stir.compose(
      setDOMContent(moreEventsArea),
      joiner,
      renderMoreEventsMapper,
      limitTo3,
      removeDupsById
    )(allItems);
  };

  /*
  
     ON LOAD
    
  */

  const url = getJSONUrl(UoS_env.name);

  //Fetch the data
  stir.getJSON(url, (initialData) => {
    if (initialData.error) return;

    // Passed events
    const seriesEventsAreaPast = stir.node("#serieseventspast");
    seriesEventsAreaPast &&
      setDOMContent(seriesEventsAreaPast, doPastSeries("", initialData));

    // Upcoming events
    if (seriesEventsArea && seriesDateFilter) {
      setDOMContent(seriesEventsArea, doUpcomingSeries("", initialData));

      // Add Series filter
      setDOMContent(
        seriesDateFilter,
        renderOptionOne() + doDateFilter(initialData)
      );

      // Event Listener
      seriesDateFilter.addEventListener("change", (event) => {
        const upcomingHtml = doUpcomingSeries(
          seriesDateFilter.options[seriesDateFilter.selectedIndex].value,
          initialData
        );
        const pastHtml = doPastSeries(
          seriesDateFilter.options[seriesDateFilter.selectedIndex].value,
          initialData
        );

        const html = upcomingHtml === "" ? renderNoEvents() : upcomingHtml;
        setDOMContent(seriesEventsArea, html);
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

  // Curried function to set the inner HTML of a DOM element
  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  // Renders an image from Flickr data
  const renderImage = (item) => {
    const alt = item.title.length ? item.title : "Flickr image " + item.id;
    return `<img alt="${alt}" class="u-object-cover"  src="https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_c.jpg" width="${item.o_width}" height="${item.o_height}"></img>`;
  };

  // Renders a call-to-action to view the album on Flickr
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

  setDOMContent(
    scope,
    gallery.map(renderImage).join("") + renderCTA(galleryId)
  );
})(stir.node("#flickrgallery"));
