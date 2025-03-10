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

  /* 
    Renderers 
  */

  const renderDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = CONFIG.months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const renderImage = (src, alt) => {
    if (!src) return ``;
    return ` <div class="u-aspect-ratio-3-2 ">
                <img class="show-for-medium u-object-cover" src="${src}" alt="Image for: ${alt}" loading="lazy" />
              </div>`;
  };

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

  const renderWrapper = (width, header, content) => {
    if (!content) return "";
    return ` <div class="cell small-12 medium-${width}">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">${header}</h2></div>
                    ${content}
                </div>
            </div>`;
  };

  /* 
    Data Processing Helpers 
  */

  const getFormattedDate = (d) => d.toISOString().split(".")[0].replaceAll(/[-:T]/g, "").slice(0, -2);

  const getISONow = () => Number(getFormattedDate(new Date()));

  const isUpcomingByDate = (compareDate) => (item) => Number(getFormattedDate(new Date(item.metaData.d))) > compareDate;

  const addIsUpcoming = (now) => (item) => ({ ...item, isupcoming: isUpcomingByDate(now)(item) });

  const filterUpcomingEvents = (item) => item.isupcoming;

  const take = stir.curry((start, num, items) => items.slice(start, num));

  /* 
    getNewsOffset
  */
  const getNewsOffset = (size) => {
    if (size === "small") return 0;

    const compactEvents = document.querySelectorAll('[data-type="compactevent"]');

    if (!compactEvents) return 0;
    if (compactEvents === 1) return 1;

    return 2;
  };

  /* 
    getNewsSettings
  */
  const getNewsSettings = (size, eventCount) => {
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

    return {
      noOfNews: CONFIG.items.large,
      newsCellWidth: CONFIG.sizes.full,
      newsWrapperWidth: CONFIG.sizes.full,
    };
  };

  /* 
    fetchData 
  */
  const fetchData = (apiUrl) => {
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
    return fetch(apiUrl)
      .then((response) => (response.ok ? response.json() : Promise.reject("Network response was not ok")))
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
        return [];
      });
  };

  /* 
    processData
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

  /* 
    updateDOM Impure function (side effect)
  */

  const updateDOM = (node, content) => {
    node.insertAdjacentHTML("beforeend", content.newsContent + content.eventsContent);
  };

  /* 
    getSearchParam
  */
  const getSearchParam = (tag) => {
    if (tag.includes("Faculty of") || tag.includes("Management School") || tag.includes("Business School")) {
      return `meta_faculty=${tag}`;
    }
    return `meta_tags=${tag}`;
  };

  /* 
    3 x Controller
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

  /*
    10 x Controller
  */
  function doLargeListing(node) {
    const fbhost = `https://${UoS_env.search}`;
    const eventtag = node?.dataset.eventtag;
    const newstag = node?.dataset.newstag;

    const eventsApiUrl = `${fbhost}/s/search.json?collection=stir-events&SF=[d,startDate,type,tags,page,image]&query=!null&num_ranks=20&sort=date&fmo=true&meta_tags=${eventtag}`;
    const newsApiUrl = `${fbhost}/s/search.json?collection=stir-main&SF=[d,type,tags,faculty,thumbnail]&query=!null&num_ranks=20&sort=date&fmo=true&meta_type=news&${getSearchParam(newstag)}`;

    Promise.all([fetchData(eventsApiUrl), fetchData(newsApiUrl)])
      .then(([eventsData, newsData]) => {
        const dataEvents = eventsData.response.resultPacket.results;
        const dataNews = newsData.response.resultPacket.results;

        const contentSmallListing = processData(dataEvents, dataNews, "small");
        const contentLargeListing = processData(dataEvents, dataNews, "large");

        updateDOM(node, contentSmallListing);
        updateDOM(node, contentLargeListing);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  /* 
    Main function 
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
