(function () {
  /* Renderers */

  const renderEventDate = (date) => {
    if (typeof date !== "string" || !date.trim().length) return ``;
    const parts = date.split(" ");
    return `${parts[0]} ${parts[1].slice(0, 3)} ${parts[2]}`;
  };

  const renderNewsWrapper = (width, content) => {
    return ` <div class="cell small-12 medium-${width}">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped u-header--margin-stripped">News</h2></div>
                    ${content}
                </div>
            </div>`;
  };

  const renderEventsWrapper = (content) => {
    return ` <div class="cell small-12 medium-4">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped u-header--margin-stripped">Events</h2></div>
                    ${content}
                </div>
            </div>`;
  };

  const renderEvent = (item) => {
    return `<div class="cell small-12 ">
                <img class="show-for-medium" src="${item.image}" alt="Image for event: ${item.title}" loading="lazy" />
                <time class="u-block u-my-1 u-grey--dark">${renderEventDate(item.stirStart)} - ${renderEventDate(item.stirEnd)}</time>
                <h3 class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${item.url}" class="c-link u-inline">${item.title}</a>
                </h3>
                <p class="text-sm">${item.summary}</p>
            </div>`;
  };

  const renderNewsItem = stir.curry((width, item) => {
    return `<div class="cell small-12 medium-${width}">
                <img class="show-for-medium" src="${item.thumbnail}" alt="Image for article: ${item.title}" loading="lazy" />
                <time class="u-block u-my-1 u-grey--dark">${item.date}</time>
                <h3 class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${item.url}" class="c-link u-inline">${item.title}</a>
                </h3>
                <p class="text-sm">${item.summary}</p>
            </div>`;
  });

  /* Data Processing Helpers */

  const getISONow = () => Number(new Date().toISOString().split(".")[0].replaceAll(/[-:T]/g, "").slice(0, -2));

  const isUpcomingByDate = (compareDate) => (item) => Number(item.endInt) > compareDate;

  const sortByDatetime = (a, b) => parseInt(a.startInt) - parseInt(b.startInt);

  const addIsUpcoming = (now) => (item) => ({ ...item, isupcoming: isUpcomingByDate(now)(item) });

  const filterValidEvents = (item) => item.id;

  const filterUpcomingEvents = (item) => item.isupcoming;

  const filterByTag = (tag) => (item) => item.tags.includes(tag);

  const first = (items) => items.filter((item, index) => index === 0);

  /* Processors */

  const fetchEventsData = (apiUrl) =>
    fetch(apiUrl)
      .then((response) => (response.ok ? response.json() : Promise.reject("Network response was not ok")))
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
        return [];
      });

  // processData
  const processData = (dataEvents, dataNews, tag, node) => {
    const now = getISONow();
    const event = stir.compose(stir.map(renderEvent), first, stir.sort(sortByDatetime), stir.filter(filterByTag(tag)), stir.filter(filterUpcomingEvents), stir.map(addIsUpcoming(now)), stir.filter(filterValidEvents))(dataEvents);

    //const event = [];
    const noOfNews = event.length === 1 ? 2 : 3;
    const newsCellWidth = noOfNews === 2 ? 6 : 4;
    const newsWrapperWidth = noOfNews === 2 ? 8 : 12;

    const renderNewsCurry = renderNewsItem(newsCellWidth);

    const news = stir.map(renderNewsCurry, dataNews).slice(0, noOfNews);

    node.innerHTML = renderNewsWrapper(newsWrapperWidth, news.join("")) + renderEventsWrapper(event.join(""));
  };

  // getApiUrl
  const getApiUrl = (env) => {
    const urls = {
      dev: "../index.json",
      preview: '<t4 type="navigation" id="5214" />',
      default: '<t4 type="navigation" id="5214" />' + "index.json",
    };
    return urls[env] || urls.default;
  };

  /* Main function */

  const main = () => {
    console.log(newsList);
    const node = stir.node("#newsEventListing");
    const tag = node.dataset.tags;

    if (!node || !tag) return;

    fetchEventsData(getApiUrl(UoS_env.name)).then((dataEvents) => processData(dataEvents, newsList, tag, node));
  };

  main();
})();
