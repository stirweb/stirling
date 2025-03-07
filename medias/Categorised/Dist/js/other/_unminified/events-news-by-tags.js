(function () {
  /* 
    Renderers 
  */

  const renderDate = (dateString) => {
    const date = new Date(dateString);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const renderImage = (src, alt) => {
    if (!src) return ``;
    return ` <div class="u-aspect-ratio-16-9 ">
                <img class="show-for-medium u-object-cover" src="${src}" alt="Image for: ${alt}" loading="lazy" />
              </div>`;
  };

  const renderEventsWrapper = (content) => {
    return !content
      ? ``
      : ` <div class="cell small-12 medium-4">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">Events</h2></div>
                    ${content}
                </div>
            </div>`;
  };

  const renderEvent = (item) => {
    return `<div class="cell small-12 ">
              ${renderImage(item.metaData.image, item.title)}
                <time class="u-block u-my-1 u-grey--dark">${renderDate(item.metaData.startDate.split("T")[0])} - ${renderDate(item.metaData.d.split("T")[0])}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${item.metaData.page}" class=" u-inline text-sm">${item.title}</a>
                </p>
                <p class="text-sm">${item.summary}</p>
            </div>`;
  };

  const renderNewsWrapper = (width, content) => {
    return ` <div class="cell small-12 medium-${width}">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">News</h2></div>
                    ${content}
                </div>
            </div>`;
  };

  const renderNewsItem = stir.curry((width, item) => {
    return `<div class="cell small-12 medium-${width}">
                 ${renderImage(item.metaData.thumbnail, item.title)}
                <time class="u-block u-my-1 u-grey--dark">${renderDate(item.date)}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${item.url}" class=" u-inline text-sm">${item.title.split(" | ")[0]}</a>
                </p>
                <p class="text-sm">${item.summary}</p>
            </div>`;
  });

  /* 
    Data Processing Helpers 
  */

  const getFormattedDate = (d) => d.toISOString().split(".")[0].replaceAll(/[-:T]/g, "").slice(0, -2);

  const getISONow = () => Number(getFormattedDate(new Date()));

  const isUpcomingByDate = (compareDate) => (item) => Number(getFormattedDate(new Date(item.metaData.d))) > compareDate;

  const addIsUpcoming = (now) => (item) => ({ ...item, isupcoming: isUpcomingByDate(now)(item) });

  const filterUpcomingEvents = (item) => item.isupcoming;

  const first = (items) => items.slice(0, 1);

  const take = stir.curry((num, items) => items.slice(0, num));

  /* 
    fetchData 
  */

  const fetchData = (apiUrl) =>
    fetch(apiUrl)
      .then((response) => (response.ok ? response.json() : Promise.reject("Network response was not ok")))
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
        return [];
      });

  /* 
    processData
  */
  const processData = (dataEvents, dataNews) => {
    const now = getISONow();

    const processEvents = stir.pipe(stir.map(addIsUpcoming(now)), stir.filter(filterUpcomingEvents), first, stir.map(renderEvent));
    const event = processEvents(dataEvents);

    //const testUpcoming = stir.pipe(stir.map(addIsUpcoming(now)), stir.filter(filterUpcomingEvents));
    //console.log(testUpcoming(dataEvents));

    const noOfNews = event.length === 1 ? 2 : 3;
    const newsCellWidth = noOfNews === 2 ? 6 : 4;
    const newsWrapperWidth = noOfNews === 2 ? 8 : 12;

    const processNews = stir.pipe(stir.map(renderNewsItem(newsCellWidth)), take(noOfNews));
    const news = processNews(dataNews);

    return {
      newsContent: renderNewsWrapper(newsWrapperWidth, news.join("")),
      eventsContent: renderEventsWrapper(event.join("")),
    };
  };

  /* 
    updateDOM Impure function (side effect)
  */

  const updateDOM = (node, content) => {
    node.innerHTML = content.newsContent + content.eventsContent;
  };

  /* 
    Main function 
  */

  const main = () => {
    const fbhost = `https://${UoS_env.search}`;
    const node = stir.node("#newsEventListing");
    const eventtag = node?.dataset.eventtag;
    const newstag = node?.dataset.newstag;

    if (!node) return;

    const eventsApiUrl = `${fbhost}/s/search.json?collection=stir-events&SF=[d,startDate,type,tags,page,image]&query=!null&sort=date&fmo=true&meta_tags=${eventtag}`;
    const newsApiUrl = `${fbhost}/s/search.json?collection=stir-main&SF=[d,type,tags,facult,thumbnail]&query=&sort=date&fmo=true&meta_type=news&meta_tags=${newstag}`;

    Promise.all([fetchData(eventsApiUrl), fetchData(newsApiUrl)])
      .then(([eventsData, newsData]) => {
        const dataEvents = eventsData.response.resultPacket.results;
        const dataNews = newsData.response.resultPacket.results;

        //console.log("Events:", dataEvents);
        //console.log("News:", dataNews);

        const content = processData(dataEvents, dataNews);
        updateDOM(node, content);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  /*
    On load
  */
  main();
})();
