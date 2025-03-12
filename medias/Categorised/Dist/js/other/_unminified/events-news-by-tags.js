(function () {
  /**
   * News and Events Module - Functional Programming Style
   * Using immutability, pure functions, and function composition
   */

  // Configuration (immutable)
  const CONFIG = Object.freeze({
    items: Object.freeze({
      small: 3,
      large: 10,
    }),
    sizes: Object.freeze({
      third: 4,
      half: 6,
      twoThirds: 8,
      full: 12,
    }),
    months: Object.freeze(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]),
  });

  /**
   * Formats a date string into a user-friendly format (DD Mon YYYY)
   *
   * @param {string} dateString - ISO date string to format
   * @returns {string} Formatted date string (e.g., "10 Mar 2025")
   */
  const renderDate = (dateString) => {
    const date = new Date(dateString);

    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      console.error(`Invalid date provided: ${dateString}`);
      return ``;
    }

    const day = date.getDate();
    const month = CONFIG.months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  /**
   * Renders an image container with responsive classes if an image source is provided
   * Returns empty string if no image source is available
   *
   * @param {string|null} src - Image source URL
   * @param {string} alt - Alternative text for the image
   * @returns {string} HTML for image container or empty string
   */
  const renderImage = (src, alt) => {
    if (!src) return ``;
    return ` <div class="u-aspect-ratio-3-2 ">
                <img class="show-for-medium u-object-cover" src="${src}" alt="Image for: ${alt}" loading="lazy" />
              </div>`;
  };

  /**
   * Renders a full-width news item with image and text content
   * Uses curried function pattern for partial application
   *
   * @param {Object} item - News item data object
   * @returns {string} HTML markup for the full news item
   */
  const renderNewsItemFull = stir.curry((item) => {
    return `<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
              <div class="u-border-width-5 u-heritage-line-left u-p-2 ">
               <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                  <a href="${item.displayUrl}" class=" u-inline text-sm">${item.title.split(" | ")[0]}</a>
                </p>
                <time class="u-block u-my-1 u-grey--dark">${renderDate(item.date)}</time>
                <p class="text-sm">${item.summary}</p>
              </div>
               ${renderImage(item.metaData.thumbnail, item.title)}
            </div>`;
  });

  /**
   * Renders a full-width event item with image and date range
   * Uses curried function pattern for partial application
   *
   * @param {Object} item - Event item data object
   * @returns {string} HTML markup for the full event item
   */
  const renderEventFull = stir.curry((item) => {
    const end = item.metaData.startDate.split("T")[0] === item.metaData.d.split("T")[0] ? "" : ` - ${renderDate(item.metaData.d.split("T")[0])}`;
    return `<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
              <div class="u-border-width-5 u-heritage-line-left u-p-2">  
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                  <a href="${item.metaData.page}" class=" u-inline text-sm">${item.title}</a>
                </p>
                 <time class="u-block u-my-1 u-grey--dark">${renderDate(item.metaData.startDate.split("T")[0])} ${end}</time>
                <p class="text-sm">${item.summary}</p>
              </div>
              ${renderImage(item.metaData.image, item.title)}
            </div>`;
  });

  /**
   * Renders a compact event item suitable for smaller layouts
   * Uses curried function pattern for partial application
   *
   * @param {Object} item - Event item data object
   * @returns {string} HTML markup for the compact event item
   */
  const renderEventCompact = stir.curry((item) => {
    const end = item.metaData.startDate.split("T")[0] === item.metaData.d.split("T")[0] ? "" : ` - ${renderDate(item.metaData.d.split("T")[0])}`;
    return `<div class="cell small-12" data-type="compactevent">
              ${renderImage(item.metaData.image, item.title)}
                <time class="u-block u-my-1 u-grey--dark">${renderDate(item.metaData.startDate.split("T")[0])} ${end}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${item.metaData.page}" class=" u-inline text-sm">${item.title}</a>
                </p>
                <p class="text-sm">${item.summary}</p>
            </div>`;
  });

  /**
   * Renders a regular news item with configurable width
   * Uses curried function pattern for partial application
   *
   * @param {number} width - Width in grid columns
   * @param {Object} item - News item data object
   * @returns {string} HTML markup for the news item
   */
  const renderNewsItem = stir.curry((width, item) => {
    return `<div class="cell small-12 medium-${width}">
                 ${renderImage(item.metaData.thumbnail, item.title)}
                <time class="u-block u-my-1 u-grey--dark">${renderDate(item.date)}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${item.displayUrl}" class=" u-inline text-sm">${item.title.split(" | ")[0]}</a>
                </p>
                <p class="text-sm">${item.summary}</p>
            </div>`;
  });

  /**
   * Creates a wrapper container for a group of items with a header
   *
   * @param {number} width - Width in grid columns
   * @param {string} header - Section heading text
   * @param {string} content - HTML content to be wrapped
   * @returns {string} HTML markup for the wrapper or empty string if no content
   */
  const renderWrapper = (width, header, content) => {
    if (!content) return "";
    return `<div class="cell small-12 medium-${width} u-mt-3">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">${header}</h2></div>
                    ${content}
                </div>
            </div>`;
  };

  /* 
    Data Processing Helpers 
  */

  /**
   * Formats a Date object into a numeric string format (YYYYMMDDHHMMSS)
   * Used for date comparisons
   *
   * @param {Date} d - Date object to format
   * @returns {string} Formatted date as numeric string
   */
  const getFormattedDate = (d) => d.toISOString().split(".")[0].replaceAll(/[-:T]/g, "").slice(0, -2);

  /**
   * Gets the current date/time as a numeric string for comparison
   *
   * @returns {number} Current date/time as numeric value
   */
  const getISONow = () => Number(getFormattedDate(new Date()));

  /**
   * Predicate function that checks if an event is upcoming based on its date
   *
   * @param {number} compareDate - Numeric date to compare against
   * @returns {Function} Function that evaluates if an item is upcoming
   */
  const isUpcomingByDate = (compareDate) => (item) => Number(getFormattedDate(new Date(item.metaData.d))) > compareDate;

  /**
   * Decorates an item with an isupcoming property based on its date
   *
   * @param {number} now - Current date as numeric value
   * @returns {Function} Function that adds the isupcoming property to an item
   */
  const addIsUpcoming = (now) => (item) => ({ ...item, isupcoming: isUpcomingByDate(now)(item) });

  /**
   * Filters items to include only those marked as upcoming
   *
   * @param {Object} item - Item to check
   * @returns {boolean} True if item is marked as upcoming
   */
  const filterUpcomingEvents = (item) => item.isupcoming;

  /**
   * Takes a specific slice of an array
   * Uses curried function pattern for partial application
   *
   * @param {number} start - Starting index
   * @param {number} num - Number of items to take (end index)
   * @param {Array} items - Array to slice
   * @returns {Array} Sliced array
   */
  const take = stir.curry((start, num, items) => items.slice(start, num));

  /**
   * Determines the starting index for news items based on layout size and event count
   * For small layouts, we always start at 0
   * For larger layouts, we adjust based on how many compact events are displayed in the small layout
   * In the small layout, events will show only 1 or 0
   *
   * @param {string} size - Layout size ('small' or 'large')
   * @returns {number} The offset index where news items should start
   */
  const getNewsOffset = (size) => {
    // Small layouts always start news from the latest
    if (size === "small") return 0;

    const compactEventsCount = stir.nodes('[data-type="compactevent"]').length;

    if (compactEventsCount === 1) {
      return 2;
    }

    return 3;
  };

  /**
   * Determines the layout configuration for news items based on the layout size and event count
   *
   * This function calculates three key metrics:
   * 1. The number of news items to display
   * 2. The width of each individual news cell
   * 3. The overall width of the news container wrapper
   *
   * For small layouts, the configuration adapts based on how many events are shown:
   * - When 1 event is shown: displays 2 news items at half-width each (6 cols)
   * - When 0 events are shown: displays 3 news items at one-third width each (4 cols)
   *
   * For large layouts, it always uses the maximum number of items from CONFIG
   * with full width for both cells and wrapper.
   *
   * @param {string} size - Layout size ('small' or 'large')
   * @param {number} eventCount - Number of events shown in the small layout
   * @returns {object} Configuration object with noOfNews, newsCellWidth and newsWrapperWidth
   */
  const getNewsSettings = (size, eventCount) => {
    // For small layouts, adjust the news layout based on event count
    if (size === "small") {
      const noOfNews = eventCount === 1 ? 2 : 3;
      const newsCellWidth = noOfNews === 2 ? CONFIG.sizes.half : CONFIG.sizes.third;
      const newsWrapperWidth = noOfNews === 2 ? CONFIG.sizes.twoThirds : CONFIG.sizes.full;

      return {
        noOfNews: noOfNews,
        newsCellWidth: newsCellWidth,
        newsWrapperWidth: newsWrapperWidth,
      };
    }

    // For large layouts, use maximum number of items with full width
    return {
      noOfNews: CONFIG.items.large,
      newsCellWidth: CONFIG.sizes.full,
      newsWrapperWidth: CONFIG.sizes.full,
    };
  };

  /**
   *  Retrieves data from a FunnelBack API endpoint or returns an empty result structure if no URL is provided.
   *
   *  @param {string|null} apiUrl - The URL to fetch data from. If null or empty, returns a pre-structured empty response.
   *  @returns {Promise<Object>} A promise that resolves to either:
   *    - The parsed JSON response from the API if successful
   *    - A pre-structured empty response object if no URL was provided
   *    - An empty array if there was an error fetching or parsing the data
   */
  const fetchData = (apiUrl) => {
    // If no API URL is provided, return a structured empty response
    // This avoids errors when working with the response data structure later
    if (!apiUrl) {
      const response = {
        response: {
          resultPacket: {
            results: [],
          },
        },
      };
      return Promise.resolve(response);
    }

    // Make the API request and process the response
    return (
      fetch(apiUrl)
        // Parse JSON if response is OK (status in 200-299 range), otherwise reject
        .then((response) => (response.ok ? response.json() : Promise.reject("Network response was not ok")))
        // Handle any errors that occur during fetching or parsing
        .catch((error) => {
          console.error("There was a problem fetching the data:", error);
          // Return empty array as fallback so downstream functions don't break
          return [];
        })
    );
  };

  /**
   * Processes events and news data into renderable content
   * Creates different layouts based on the specified size
   *
   * @param {Array} dataEvents - Array of event data objects
   * @param {Array} dataNews - Array of news data objects
   * @param {string} size - Layout size ('small' or 'large')
   * @returns {Object} Object containing HTML content for news and events
   */
  const processData = (dataEvents, dataNews, size) => {
    const now = getISONow();
    const noOfEvents = size === "small" ? 1 : 10;
    const eventsWrapperWidth = size === "small" ? 4 : 12;

    const eventRender = size === "small" ? renderEventCompact() : renderEventFull();

    const processEvents = stir.pipe(stir.map(addIsUpcoming(now)), stir.filter(filterUpcomingEvents), take(0, noOfEvents), stir.map(eventRender));
    const event = processEvents(dataEvents);

    const { noOfNews, newsCellWidth, newsWrapperWidth } = getNewsSettings(size, event.length);

    const newsRender = size === "small" ? renderNewsItem(newsCellWidth) : renderNewsItemFull();

    const start = getNewsOffset(size);

    const processNews = stir.pipe(stir.map(newsRender), take(start, noOfNews));
    const news = processNews(dataNews);

    return {
      newsContent: renderWrapper(newsWrapperWidth, "News", news.join("")),
      eventsContent: renderWrapper(eventsWrapperWidth, "Events", event.join("")),
    };
  };

  /**
   * Updates the DOM with rendered content
   * This is an impure function as it causes side effects
   *
   * @param {HTMLElement} node - DOM node to update
   * @param {Object} content - Object containing HTML content to insert
   */
  const updateDOM = (node, content) => {
    node.insertAdjacentHTML("beforeend", content.newsContent + content.eventsContent);
  };

  /**
   * Determines the correct search parameter based on tag content
   * Handles faculty-based tags differently from regular tags
   *
   * @param {string} tag - Tag to convert to search parameter
   * @returns {string} Formatted search parameter string
   */
  const getSearchParam = (tag) => {
    if (tag.includes("Faculty of") || tag.includes("Management School") || tag.includes("Business School")) {
      return `meta_faculty=${tag}`;
    }
    return `meta_tags=${tag}`;
  };

  /**
   * Controller for small listing view
   * Fetches and renders a compact view of news and events
   *
   * @param {HTMLElement} node - DOM node to update
   */
  function doSmallListing(node) {
    const fbhost = `https://${UoS_env.search}`;
    const eventtag = node?.dataset.eventtag;
    const newstag = node?.dataset.newstag;

    const eventsApiUrl = !eventtag ? `` : `${fbhost}/s/search.json?collection=stir-events&SF=[d,startDate,type,tags,page,image]&query=!null&num_ranks=20&sort=date&fmo=true&meta_tags=${eventtag}`;
    const newsApiUrl = !newstag ? `` : `${fbhost}/s/search.json?collection=stir-main&SF=[d,type,tags,faculty,thumbnail]&query=!null&num_ranks=20&sort=date&fmo=true&meta_type=news&${getSearchParam(newstag)}`;

    Promise.all([fetchData(eventsApiUrl), fetchData(newsApiUrl)])
      .then(([eventsData, newsData]) => {
        const dataEvents = eventsData.response.resultPacket.results;
        const dataNews = newsData.response.resultPacket.results;

        const content = processData(dataEvents, dataNews, "small");
        updateDOM(node, content);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  /**
   * Controller for large listing view
   * Fetches and renders both small and large views of news and events
   *
   * @param {HTMLElement} node - DOM node to update
   */
  function doLargeListing(node) {
    const fbhost = `https://${UoS_env.search}`;
    const eventtag = node?.dataset.eventtag;
    const newstag = node?.dataset.newstag;

    const eventsApiUrl = !eventtag ? `` : `${fbhost}/s/search.json?collection=stir-events&SF=[d,startDate,type,tags,page,image]&query=!null&num_ranks=20&sort=date&fmo=true&meta_tags=${eventtag}`;
    const newsApiUrl = !newstag ? `` : `${fbhost}/s/search.json?collection=stir-main&SF=[d,type,tags,faculty,thumbnail]&query=!null&num_ranks=20&sort=date&fmo=true&meta_type=news&${getSearchParam(newstag)}`;

    Promise.all([fetchData(eventsApiUrl), fetchData(newsApiUrl)])
      .then(([eventsData, newsData]) => {
        const dataEvents = eventsData.response.resultPacket.results;
        const dataNews = newsData.response.resultPacket.results;

        const contentSmallListing = processData(dataEvents, dataNews, "small");
        const contentLargeListing = processData(dataEvents, dataNews, "large");

        // if no news dont bother rendering small listing
        dataNews.length && updateDOM(node, contentSmallListing);
        updateDOM(node, contentLargeListing);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  /**
   * Main entry point that initializes the module
   * Finds necessary DOM nodes and triggers appropriate controllers
   */
  function main() {
    const smallListingNode = stir.node("#newsEventListing");
    const largeListingNode = stir.node("#newsEventListing-10");

    if (smallListingNode) doSmallListing(smallListingNode);
    if (largeListingNode) doLargeListing(largeListingNode);
  }

  /*
    On load
  */
  main();
})();
