/*

  Video Banner

*/

(function () {
  var elem;
  if ((elem = document.querySelector("[data-videoId]"))) {
    elem.addEventListener("ended", function (e) {
      // check elem has a parent before trying to remove it from the DOM
      // just in case this gets called more than once!
      if (!elem.parentNode) return;

      if ((fallback = elem.getAttribute("data-fallback-html"))) {
        //elem.style.display = 'none';
        /* var suoty = document.createElement('div');
                var suotyH1 = document.createElement('h1');
                var badge = new Image();
                badge.src = 'https://www.stir.ac.uk/webcomponents/dist/images/accreditations/sport-accolade-times-gug.svg';
                badge.alt = 'Good University Guide 2020 Sports University of the Year';
                badge.classList.add('portrait')
                suoty.classList.add('show-for-medium');
                suoty.classList.add('masthead_suoty');
                suotyH1.innerHTML = 'Sports University<br>of&nbsp;the&nbsp;Year <span>2020</span>'
                suoty.appendChild(suotyH1);
                suoty.appendChild(badge);
                elem.insertAdjacentElement("beforebegin", suoty);*/
        //elem.parentNode.removeChild(elem);
      } else if ((fallback = elem.getAttribute("data-fallback-image"))) {
        var image = new Image();
        (function (elem) {
          image.addEventListener("load", function (event) {
            elem.insertAdjacentElement("beforebegin", image);
            elem.parentNode.removeChild(elem);
          });
        })(elem);
        image.src = fallback;
      }

      // if neither; do nothing!
    });
  }
})();

/*
 *
 *  News and Events JSON Loader
 *
 */

var stir = stir || {};

(function (scope) {
  if (!scope) return;

  /*
   * getFeedUrl
   * A helper function to determine the correct URL for the news and events feed based on the current host and any global variables set by T4
   * @param {String} host - the hostname of the current page
   * @param {String} cacheBuster - a string to append to the URL to prevent caching (e.g. "?v=123456789")
   * @param {Object} globals  - an object containing any global variables set by T4, which may include preview URLs for the feed
   * @returns {String|null}
   * Actual feed is at https://www.stir.ac.uk//media/stirling/feeds/homepage.json
   */
  const getFeedUrl = (host, cacheBuster, globals) => {
    if (host === "localhost" || host === "stirweb.github.io") return "homepage.json" + cacheBuster;

    if (globals) {
      if (host === "stiracuk-cms01-production.terminalfour.net" || host === "stiracuk-cms01-test.terminalfour.net") {
        return globals.preview && globals.preview.homepagefeed ? globals.preview.homepagefeed : null;
      }
      return globals.homepagefeed ? globals.homepagefeed + cacheBuster : null;
    }
    return null;
  };

  /*
   *
   * Data helper functions
   *
   */

  const filterEmpties = stir.filter((item) => {
    if (item.id && item.id !== 0) return item;
  });

  /*
   * filterDuplicates
   * A helper function to filter out duplicate items based on their IDs
   * @param {Number} first - the ID of the first item to exclude
   * @param {Number} second - the ID of the second item to exclude
   * @param {Object} item - the current item being processed in the array
   * @returns {Object} - the item if its ID is not equal to the first or second ID, otherwise undefined (which will be filtered out by stir.filter)
   */
  const filterDuplicates = (first, second, item) => {
    if (item.id !== first && item.id !== second) return item;
  };

  /*
   * filterLimit
   * A helper function to filter an array to a certain length, curried to take the max number of items as its first argument
   * @param {Number} max - the maximum number of items to return
   * @param {Object} item - the current item being processed in the array
   * @param {Number} index - the index of the current item being processed in the array
   * @returns {Object} - the item if its index is less than the max, otherwise undefined (which will be filtered out by stir.filter)
   */
  const filterLimit = (max, item, index) => {
    if (index < max) return item;
  };

  /*
   * getAdditionalNews
   * Filters out the primary and secondary news items from the rest of the news items to avoid duplicates in the display
   * @param {Array} items - the array of news items to filter through
   * @param {Number} news1id - the id of the primary news item
   * @param {Number} news2id - the id of the secondary news item
   * @returns {Array} - the filtered array of news items with the primary and secondary items removed
   */
  const getAdditionalNews = (items, news1id, news2id) => stir.filter((item) => filterDuplicates(news1id, news2id, item), items);

  /*
   * Extract the news data needed and process it to html
   * @param {Number} noOfNews - the number of news items to display
   * @param {Object} data - the JSON data containing the news information
   * @returns {String} - the HTML for the news section
   */
  const getNews = (noOfNews, data) => {
    const newsItems1 = filterEmpties(data.news.primary);
    const newsItems2 = filterEmpties(data.news.secondary);

    const news1 = newsItems1[0] ? newsItems1[0] : { id: 0 };
    const news2 = newsItems2[0] ? newsItems2[0] : { id: 0 };

    // Form a single array ordered by Primary, Seconardy, Other Primaries, Other Secondaries
    const newsComined = [...[news1, news2], ...getAdditionalNews(newsItems1, news1.id, news2.id), ...getAdditionalNews(newsItems2, news1.id, news2.id)];

    const gridClasses = noOfNews === 3 ? "medium-12 " : "large-8 medium-6 ";
    const cellClasses = noOfNews === 3 ? "large-4 medium-6" : "large-6 medium-12";

    // Curry set ups
    const renderItems = stir.map(renderItem(cellClasses, "article"));
    const limiterer = stir.filter((item, index) => filterLimit(noOfNews, item, index)); // limit to number we need

    // Run the data through the various processes
    return stir.compose(renderNews(noOfNews, gridClasses), stir.join(""), renderItems, limiterer, filterEmpties)(newsComined);
  };

  /*
   * getEvents
   * Extract the events data needed and process it to html
   * @param {Number} noOfEvents - the number of events to display
   * @param {Object} data - the JSON data containing the events information
   * @returns {String} - the HTML for the events section
   */
  const getEvents = (noOfEvents, data) => {
    const limterer = stir.filter((item, index) => filterLimit(noOfEvents, item, index)); // Curry
    const renderer = renderItem("", "div"); // Curry

    const events = stir.compose(limterer, filterEmpties)(data.events);

    if (!events.length) return "";

    return stir.compose(renderEvents, stir.join(""), stir.map(renderer))(events);
  };

  /*
   *
   * Renderers
   *
   */

  /*
   * renderCTA
   * Returns the HTML for a call to action link with an arrow icon
   * @param {String} link - the URL for the call to action link
   * @param {String} text - the text for the call to action link
   * @returns {String} - the HTML for the call to action link
   */
  const renderCTA = (link, text) => {
    return `<div class="u-flex u-gap-8 cta-link u-mb-tiny">
              <span class="u-svg-24 u-heritage-green">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" class="svg-icon">
                  <path d="M13.833,16.333,17.167,13m0,0L13.833,9.667M17.167,13H8.833M23,13A10,10,0,1,1,13,3,10,10,0,0,1,23,13Z" transform="translate(-1 -1)" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
              <span>
                <a href="${link}">${text}</a>
              </span>
          </div>`;
  };

  /*
   * renderEvents
   * Returns the HTML for the events section, curried to take the events data as its final argument
   * @param {String} events - the HTML for the individual events, already processed through renderItem
   * @returns {String} - the HTML for the whole events section
   */
  const renderEvents = stir.curry((events) => {
    return `
      <!-- All Events -->
      <div class="cell large-4 medium-6 small-12">
          <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
              <h2>Events</h2>
              <span class="flex-container u-gap-16 align-middle">${renderCTA("/events/", "See all events")}</span>
          </div>
          <div class="grid-x " >${events}</div>
      </div>`;
  });

  /*
   * renderNews
   * Returns the HTML for the news section, curried to take the news data as its final argument
   * If there are no events, shows 3 news items, output a simple link to events and makes the news section full width.
   * If there are events, shows 2 news items and makes the news section 2/3 width to accommodate the events section without an events link
   * @param {Number} noOfNews - the number of news items to display
   * @param {String} classes - the CSS classes to apply to the news container
   * @param {String} news - the HTML for the individual news items, already processed through renderItem
   * @returns {String} - the HTML for the whole news section
   */
  const renderNews = stir.curry((noOfNews, classes, news) => {
    return `
        <!-- All News -->
        <div class="cell small-12 ${classes}" >
            <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
                <h2>News</h2>
                <span class="u-flex1 flex-container u-gap-16 align-middle">${renderCTA("/news/", "See all articles")}</span>
                ${noOfNews === 3 ? renderCTA("/events/", "See our events") : ``}
            </div>
            <div class="grid-x" >${news}</div>
        </div>`;
  });

  /*
   * renderItem
   * Returns the HTML for a news or event item, curried to take the item data as its final argument
   * @param {String} classes - the CSS classes to apply to the item container
   * @param {String} node - the HTML node to use for the item container (e.g. "article" or "div")
   * @param {Object} item - the data for the news or event item
   * @returns {String} - the HTML for the news or event item
   */
  const renderItem = stir.curry((classes, node, item) => {
    return `
      <${node} class="small-12 cell ${classes}">
        <div class="u-aspect-ratio-16-9 "><a href="${item.url}"><img class=" u-object-cover" src="${item.image}" alt="${item.imagealt}" loading="lazy"></a></div>
        <div class="u-flex u-gap-8 cta-link u-my-1">
            <span class="u-svg-24 u-heritage-green">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" class="svg-icon">
                <path d="M13.833,16.333,17.167,13m0,0L13.833,9.667M17.167,13H8.833M23,13A10,10,0,1,1,13,3,10,10,0,0,1,23,13Z" transform="translate(-1 -1)" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span>
              <a href="${item.url}">${item.title}</a>
            </span>
        </div>
        ${item._uos.location ? `<strong>${item._uos.location}</strong>` : ``}
        ${renderTime(item._uos)} 
        <p class="text-sm">${item.summary}</p>
      </${node} >`;
  });

  /*
   * renderTime
   * Returns the HTML for the time element of a news or event item
   * @param {Object} meta - the metadata for the news or event item
   * @returns {String} - the HTML for the time element, or an empty string if there is no start date
   */
  const renderTime = (meta) => {
    if (!meta.startDate) return "";

    const endDate = meta.endDate === meta.startDate ? `` : ` until ${meta.endDate}`;
    return `<time class="u-block u-my-1 u-dark-grey">${meta.startDate}${endDate}</time>`;
  };

  /*
   * render
   * Returns the HTML for the whole news and events section, curried to take the news and events data as its final arguments
   * @param {String} news - the HTML for the news section, already processed through renderNews
   * @param {String} events - the HTML for the events section, already processed through renderEvents
   * @returns {String} - the HTML for the whole news and events section
   */
  const render = (news, events) => {
    return `<div class="grid-x  c-news-event__news">${news}${events}</div>`;
  };

  /*
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /*
   * On Load
   */

  const noOfEvents = 1;
  const noOfItems = 3;

  const cacheBuster = "?v=" + new Date().getTime();
  const url = getFeedUrl(window.location.hostname, cacheBuster, stir.t4Globals);

  if (!url) return;

  /* 
    Get the JSON data and process it 
  */
  stir.getJSON(url, function (data) {
    if (typeof data == "undefined" || !data.news) return;

    const events = getEvents(noOfEvents, data);
    const noOfNews = !events.length ? noOfItems : noOfItems - noOfEvents;
    const news = getNews(noOfNews, data);

    setDOMContent(scope, render(news, events));
  });
})(stir.node(".c-news-event"));

/*
 * Mobile search placeholder toggle
 *
 */
(function () {
  const placeholder = document.querySelector("[data-placeholder-mobile]");
  if (placeholder) {
    //save the original placeholder value
    placeholder.setAttribute("data-placeholder", placeholder.placeholder);

    // function to handle toggling the value
    const placeholderchanger = (event) => {
      if (stir.MediaQuery.current === "small") {
        placeholder.placeholder = placeholder.getAttribute("data-placeholder-mobile");
      } else {
        placeholder.placeholder = placeholder.getAttribute("data-placeholder");
      }
    };

    // do an immediate check
    placeholderchanger();

    // listen for MediaQueryChange events so we can check again
    window.addEventListener("MediaQueryChange", placeholderchanger);
  }
})();
