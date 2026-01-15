/*
 * Generate staff object for date range
 * @param {string} from - Start date
 * @param {string} to - End date
 * @returns {Object} - Upcoming object for query
 */
const getObject = (from, to, series) => {
  const obj = {
    and: [
      { "custom_fields.tag": series },
      {
        range: { "custom_fields.e": { gt: from, lt: to } },
      },
    ],
  };

  return obj;
};

/*
 * Get current date in YYYY-MM-DD format
 * @returns {string} - Current date
 */
const getNow = () => {
  return new Date().toISOString();
};

/*
 * Get filter string based on type
 * @param {string} type - Event type
 * @returns {string} - Filter string for query
 */
const getFilterString = (series, type) => {
  if (type === "upcoming") {
    return `&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(getObject(getNow(), "2099-12-31", series)))}&sort=custom_fields.sort&`;
  }

  return `&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(getObject("2015-01-01", getNow(), series)))}&sort=custom_fields.sort&`;
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
 * Get event date and time details
 * @param {string} start - Start date-time
 * @param {string} end - End date-time
 * @returns {Object} - Event date and time details
 */
const getEventDateTimes = (start, end) => {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const startDate = new Date(start);
  const endDate = new Date(end);
  return {
    start: startDate.toLocaleDateString("en-GB", options),
    end: endDate.toLocaleDateString("en-GB", options),
  };
};

/*
 * Render audience tag
 * @param {Array} tag - Audience tags
 * @returns {string} - HTML string for audience tag
 */
const renderAudience = (tag) => {
  const audience = tag
    .filter((item) => item === "Public" || item === "StaffStudent")
    .map((item) => (item === "StaffStudent" ? "Staff, Students" : item))
    .join(",");
  return !audience.trim ? `` : `<strong>Audience</strong><br />${audience.replaceAll(",", "<br/>")}`;
};

const renderEndDate = (item) => (item.start === item.end ? `` : `- ${item.end}`);

const renderMoreEvent = (item) => {
  const cf = item.custom_fields;
  const dateTimes = getEventDateTimes(cf.d, cf.e);

  return `<a href="${item.url}" class="u-border u-p-1 u-mb-1 flex-container flex-dir-column large-flex-dir-row   u-gap">
                <span class="u-flex1"><strong>${cf.h1_custom}</strong></span>
                <span class="flex-container align-middle u-gap u-dark-grey">
                    <strong>${dateTimes.start} ${renderEndDate(dateTimes)}</strong>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1080 800"
                        stroke-width="1.5" stroke="none" style="width: 20px; height:20px">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M315.392 9.728c0 8.192 4.096 16.384 10.24 22.528l413.696 415.744-413.696 415.744c-12.288 12.288-12.288 32.768 0 47.104 12.288 12.288 32.768 12.288 47.104 0l438.272-438.272c12.288-12.288 12.288-34.816 0-47.104l-440.32-438.272c-12.288-12.288-32.768-12.288-47.104 0-6.144 6.144-8.192 14.336-8.192 22.528z" />
                    </svg>
                </span>
            </a>`;
};

/*
 * Render link
 * @param {Object} item - Event item
 * @returns {string} - HTML string for link
 */
const renderLink = (item) => {
  if (!item.url) return `${item.custom_fields.name}<br />`;
  return `<a href="${item.url}" class="u-underline">${item.custom_fields.name}</a><br />`;
};

const renderInfoTag = (val) => {
  return !val ? `` : `<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-inline-block u-mb-tiny u-mr-1">${val}</span>`;
};

/*
 * Render event item
 * @param {Object} item - Event item
 * @returns {string} - HTML string for event
 */
const renderEvent = (item, index) => {
  const data = "object" === typeof item.custom_fields.data ? Object.assign({}, ...item.custom_fields.data.map((datum) => JSON.parse(decodeURIComponent(datum)))) : {};
  const cf = item.custom_fields;
  const dateTimes = getEventDateTimes(item.start, item.end);

  // Get start time from string 2026-03-25T14:00:00.000Z
  const startTime = new Date(cf.d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const endTime = new Date(cf.e).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
  return `
            <div class="${index % 2 === 0 ? `u-bg-white` : `u-bg-white`} ${index === 0 ? `u-heritage-line-top u-border-width-5` : `u-grey-line-top `} u-p-1 c-event-list u-gap">
                <div>
                    ${data.cancelled ? renderInfoTag("Cancelled") : ``}
                    ${data.rescheduled ? renderInfoTag("Rescheduled") : ``}
                    <span class="u-inline-block u-mb-1">
                        <strong>Event</strong><br />
                        ${renderLink(item)}
                        <strong>Date:</strong> ${dateTimes.start} ${dateTimes.end !== dateTimes.start ? ` - ` + dateTimes.end : ``}<br />
                        <strong>Time:</strong> ${startTime} - ${endTime}
                    </span>
                </div>
                <div>
                    <span class="u-inline-block u-mb-1">
                        <strong>Description</strong><br />
                        ${cf.snippet}<br />
                        <strong>Location</strong><br />
                        ${data.location}.
                    </span>
                </div>
                <div>
                    <span class="u-inline-block u-mb-1">
                        ${renderAudience(cf.tag)}
                    </span>
                </div>
                <div>
                    <span class="u-inline-block u-mb-1">
                        ${cf.tag.includes("Recording") ? `<strong>Recording</strong><br /><a href="${data.recordingLink}">Available</a>` : ``}
                    </span>
                </div>
            </div>`;
};

/*
 * Perform search and render results
 * @param {string} baseUrl - Base URL for search
 * @param {string} type - Event type
 * @param {HTMLElement} node - DOM node to render results
 * @param {string} series - Series name
 */
async function doPast(baseUrl, node, series) {
  let filterString = getFilterString(series, "past");

  fetch(baseUrl + filterString + `page=1`)
    .then((response) => response.json())
    .then((data) => {
      const searchEvents = data.hits.map((item) => {
        const cf = item.custom_fields;
        const startTime = cf.d.split("T")[1].split(":")[0] + ":" + cf.d.split("T")[1].split(":")[1];
        const endTime = cf.e.split("T")[1].split(":")[0] + ":" + cf.e.split("T")[1].split(":")[1];
        const shortcuts = { start: cf.d, end: cf.e, startTime: startTime, endTime: endTime, sort: cf.sort, repeater: null };
        return { ...item, ...shortcuts };
      });
      const html = searchEvents.map(renderEvent).join("");
      node.innerHTML = html;
    });
}

/*
 * Perform search and render results
 * @param {string} baseUrl - Base URL for search
 * @param {string} type - Event type
 * @param {HTMLElement} node - DOM node to render results
 * @param {string} series - Series name
 */
async function doUpcoming(baseUrl, node, series, miniEvents) {
  let filterString = getFilterString(series, "upcoming");

  fetch(baseUrl + filterString + `page=1`)
    .then((response) => response.json())
    .then((data) => {
      const extras = []; // Holds any fake extra events
      //    console.log(data);
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
              .map((item) => JSON.parse(decodeURIComponent(item)));

            perfs.forEach((perf) => {
              const startTimePerf = perf.start.split("T")[1].split(":")[0] + ":" + perf.start.split("T")[1].split(":")[1];
              const endTimePerf = perf.end.split("T")[1].split(":")[0] + ":" + perf.end.split("T")[1].split(":")[1];
              const sortValue = Number(String(perf.pin).substring(0, 10));
              const extraPerf = { ...item, ...perf, startTime: startTimePerf, endTime: endTimePerf, sort: sortValue, repeater: true };
              extras.push(extraPerf);
            });

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
      const searchEvents = hits
        .concat(extras)
        .sort((a, b) => {
          return a.sort - b.sort;
        })
        .filter((a) => !a.hide);

      // Process miniEvents
      const miniEvents2 = miniEvents.map((item) => {
        const shortcuts = { sort: Number(String(item.pin).slice(0, 10)) };
        return { ...item, ...shortcuts };
      });

      const allEvents = searchEvents.concat(miniEvents2).sort((a, b) => a.sort - b.sort);
      const html = allEvents.map(renderEvent).join("");
      node.innerHTML = html;
    });
}

/*
 * Perform search and render results
 * @param {string} baseUrl - Base URL for search
 * @param {HTMLElement} node - DOM node to render results
 */
async function doMoreEvents(baseUrl, node, excludeId) {
  const obj = {
    and: [
      { not: { "custom_fields.sid": excludeId } },
      {
        range: { "custom_fields.e": { gt: getNow(), lt: "2090-12-31" } },
      },
    ],
  };
  let filterString = `&limit=3&order=asc&filter=${encodeURIComponent(JSON.stringify(obj))}&sort=custom_fields.sort&`;

  fetch(baseUrl + filterString)
    .then((response) => response.json())
    .then((data) => {
      node.innerHTML = data.hits.map(renderMoreEvent).join("");
    });
}

/*
 * Main execution
 * @returns {void}
 */
(async () => {
  const searchAPI = "https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de";
  const searchUrl = `${searchAPI}?term=*&customField=type%3Devent&resultType=organic&`;

  const miniEvents = window.miniEvents && window.miniEvents.length ? window.miniEvents.map((item) => JSON.parse(item)) : [];
  const miniEventsFiltered = stir.flatten(miniEvents).filter((item) => item.id);

  const upcomingNode = document.getElementById("seriesevents");
  const moreEventsNode = document.getElementById("moreevents");

  // Series events
  if (upcomingNode) {
    const pastNode = document.getElementById("serieseventspast");

    const seriesId = "SeriesChildof" + upcomingNode.getAttribute("data-seriesid");
    const baseUrl = searchUrl + "customField=series%3D";

    upcomingNode && (await doUpcoming(baseUrl, upcomingNode, seriesId, stir.flatten(miniEventsFiltered)));
    pastNode && (await doPast(baseUrl, pastNode, seriesId));
  }

  // More events
  if (moreEventsNode) {
    doMoreEvents(searchUrl, moreEventsNode, moreEventsNode.getAttribute("data-currentid"));
  }
})();

/*
 *
 * Flickr gallery
 * @param {HTMLElement} scope The DOM element to render the gallery into.
 * @returns {void}
 */
(function (scope) {
  if (!scope) return;

  if (!gallery || !galleryId) return;

  /*
   * Curried function to set the inner HTML of a DOM element.
   * @param {HTMLElement} node The DOM element.
   * @param {string} html The HTML to set.
   * @returns {boolean}
   */
  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /*
   * Renders an image from Flickr data.
   * @param {object} item The Flickr image object.
   * @returns {string} The HTML string for the image.
   */
  const renderImage = (item) => {
    const alt = item.title.length ? item.title : "Flickr image " + item.id;
    return `<img alt="${alt}" class="u-object-cover"  src="https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_c.jpg" width="${item.o_width}" height="${item.o_height}"></img>`;
  };

  /*
   * Renders a call-to-action to view the album on Flickr.
   * @param {string} galleryId The Flickr gallery ID.
   * @returns {string} The HTML string for the CTA.
   */
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
