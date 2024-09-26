(function () {
  /* Renderers */

  const renderDate = (date) => {
    if (typeof date !== "string" || !date.trim().length) return ``;
    const parts = date.split(" ");
    return `${parts[0]} ${parts[1].slice(0, 3)} ${parts[2]}`;
  };

  const renderEvent = (item) => {
    return `
        <img class="show-for-medium" src="${item.image}" alt="Image for event: ${item.title}" loading="lazy" />
        <time class="u-block u-my-1 u-grey--dark">${renderDate(item.stirStart)} - ${renderDate(item.stirEnd)}</time>
        <h3 class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
            <a href="${item.url}" class="c-link u-inline">${item.title}</a>
        </h3>
        <p class="text-sm">${item.summary}</p>`;
  };

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

  const initializeEvents = (dataEvents, tag, node) => {
    const now = getISONow();

    const processEvents = stir.compose(stir.map(renderEvent), first, stir.sort(sortByDatetime), stir.filter(filterByTag(tag)), stir.filter(filterUpcomingEvents), stir.map(addIsUpcoming(now)), stir.filter(filterValidEvents))(dataEvents);

    node.innerHTML = processEvents.join("");
  };

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
    const node = stir.node("#eventListing");
    const tag = node.dataset.tags;

    if (!node || !tag) return;

    fetchEventsData(getApiUrl(UoS_env.name)).then((dataEvents) => initializeEvents(dataEvents, tag, node));
  };

  main();
})();
