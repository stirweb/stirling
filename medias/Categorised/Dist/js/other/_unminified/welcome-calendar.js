(function (scope) {
  if (!scope) return;

  const filtersArea = stir.node("#welcomeeventfilters");
  const resultsArea = scope;

  const ITEMS_PER_PAGE = 9;

  /*
      | 
      |  RENDERERS
      |
      */

  const renderLink = (link) => {
    return !link
      ? ``
      : `
      <div class="flex-container u-gap-16 align-middle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px; height: 20px; color: #006938 ">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <a href="${link}">More information</a>
        </div>`;
  };

  const renderEvent = (item) => {
    return `<div class="grid-x u-bg-white u-mb-2 u-energy-line-left u-border-width-5">
                  <div class="cell u-p-2 small-12  ">
                      
                      <p class="u-text-regular u-mb-2">
                      <strong>${item.title}</strong>
                      </p>
                      <div class="flex-container flex-dir-column u-gap-8 u-mb-1">
                          <div class="flex-container u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time>${item.stirStart}</time></span>
                          </div>
                          <div class="flex-container u-gap-16 align-middle">
                              <span class="uos-clock u-icon h5"></span>
                              <span><time>${item.startTime}</time> – <time>${item.endTime}</time></span>
                          </div>
                          <div class="flex-container u-gap-16 align-middle">
                              <span class="u-icon h5 uos-location"></span>
                              <span>${item.location}</span>
                          </div>

                          ${renderLink(item.link)}

                      </div>

                      <p class="text-sm">${item.description}</p>
                      <p class="u-m-0 text-sm"><strong>Theme:</strong> ${item.theme} <br /><strong>Attendance:</strong> ${item.attendance}</p>


                  </div>
              </div>`;
  };

  const renderDateFilter = (item) => {
    return `<option value="${item.startIntFull}">${item.stirStart}</option>`;
  };

  const renderThemeFilter = stir.curry((selected, item) => {
    return `<option value="${item.theme}" ${selected === item.theme ? `selected` : ``}>${item.theme}</option>`;
  });

  const renderSelectFilter = (html, title) => {
    return `<select id="${title.toLowerCase().replaceAll(" ", "-")}"><option value="">${title}</option>${html}</select>`;
  };

  const renderClearFiltersBtn = () => `<button id="clearfilters" class="button no-arrow tiny hollow expanded u-font-bold">Clear all filters</button>`;

  const renderNoEvents = () => {
    return `<div class="grid-x u-bg-white u-mb-2  u-border-width-5">
                  <div class="cell u-p-2 small-12  ">
                      <p>No events have been found for the criteria selected</p>
                  </div>
              </div>`;
  };

  const renderPaginationBtn = (end, noOfResults) => {
    return end >= noOfResults ? `` : `<div class="loadmorebtn flex-container align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>`;
  };

  const renderPageMeta = (start, end, noOfResults) => {
    return start < 2 ? `` : `<div class="flex-container align-center u-mb-2">Showing ${start + 1}-${end > noOfResults ? noOfResults : end} of ${noOfResults} results</div>`;
  };

  /*
      | 
      |  HELPERS
      |
      */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const appendDOMContent = stir.curry((elem, html) => {
    elem.insertAdjacentHTML("beforeend", html);
    return elem;
  });

  const setDOMDateFilter = setDOMContent(filtersArea);

  const joiner = stir.join("");

  const sortByStartDate = (a, b) => a.startIntFull - b.startIntFull;

  //const sortByStartDateDesc = (a, b) => b.startIntFull - a.startIntFull;

  const mapDates = (item) => {
    return { startIntFull: item.startInt, stirStart: item.stirStart };
  };

  const mapTheme = (item) => {
    return { theme: item.theme };
  };

  const filterThemeEmpties = (item) => item.theme;

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

  const filterByDate = stir.curry((date, item) => {
    if (!date) return true;
    return item.startInt === Number(date);
  });

  const filterByTheme = stir.curry((theme, item) => {
    if (!theme) return true;
    return item.theme === theme;
  });

  const isUpcoming = (item) => item.endIntFull >= getNow();

  const isUpcomingFilter = stir.filter(isUpcoming);

  const paginationFilter = stir.curry((page, itemsPerPage, index) => {
    const start = itemsPerPage * (page - 1);
    const end = start + itemsPerPage;
    return index >= start && index < end;
  });

  const getNow = () => {
    let yourDate = new Date();
    return Number(yourDate.toISOString().split("T")[0].split("-").join("") + ("0" + yourDate.getHours()).slice(-2) + ("0" + yourDate.getMinutes()).slice(-2));
  };

  /* 
        CONTROLLERS
    */
  const doEventsFilter = (date, theme, data) => {
    const page = Number(QueryParams.get("page")) || 1;
    const start = ITEMS_PER_PAGE * (page - 1);
    const end = start + ITEMS_PER_PAGE;

    const setDOMEvents = page === 1 ? setDOMContent(resultsArea) : appendDOMContent(resultsArea);

    const pageFilterCurry = stir.filter((item, index) => {
      if (paginationFilter(page, ITEMS_PER_PAGE, index)) return item;
    });

    const filterByDateCurry = filterByDate(date);
    const filterByThemeCurry = filterByTheme(theme);

    const data2 = stir.compose(stir.filter(filterByThemeCurry), stir.filter(filterByDateCurry), stir.sort(sortByStartDate), isUpcomingFilter)(data);

    const html = stir.compose(joiner, stir.map(renderEvent), pageFilterCurry)(data2);
    const noOfResults = data2.length;

    html.length ? setDOMEvents(renderPageMeta(start, end, noOfResults) + html + renderPaginationBtn(end, noOfResults)) : setDOMEvents(renderNoEvents());
  };

  /*
    | 
    |  ON LOAD
    |
    */

  /* 
        Welcome Events 
     */

  const theme = QueryParams.get("theme") || "";
  const initData = stir.feeds.events.filter((item) => item.id);

  console.log(theme);

  QueryParams.set("page", 1);

  /* default list */
  doEventsFilter("", theme, initData);

  /* 
        Filters 
    */
  const removeDateDups = removeDuplicateObjectFromArray("startIntFull");
  const datesHtml = stir.compose(joiner, stir.map(renderDateFilter), removeDateDups, stir.map(mapDates), stir.sort(sortByStartDate), isUpcomingFilter)(initData);

  const removeFilterDups = removeDuplicateObjectFromArray("theme");

  const renderThemeFilterCurry = renderThemeFilter(theme);
  //selected

  const themesHtml = stir.compose(joiner, stir.map(renderThemeFilterCurry), removeFilterDups, stir.filter(filterThemeEmpties), stir.map(mapTheme))(initData);

  setDOMDateFilter(renderSelectFilter(datesHtml, "Filter by date") + renderSelectFilter(themesHtml, "Filter by theme") + renderClearFiltersBtn());

  /* 
        EVENT LISTENER 
    */

  resultsArea.addEventListener("click", (event) => {
    if (event.target.type === "submit") {
      const dateFilter = stir.node("#filter-by-date");
      const themeFilter = stir.node("#filter-by-theme");
      const page = Number(QueryParams.get("page"));

      setDOMContent(event.target.closest(".loadmorebtn"), "");
      QueryParams.set("page", page + 1);
      doEventsFilter(dateFilter.options[dateFilter.selectedIndex].value, themeFilter.options[themeFilter.selectedIndex].value, initData);
    }
  });

  filtersArea.addEventListener("click", (event) => {
    event.preventDefault();

    const dateFilter = stir.node("#filter-by-date");
    const themeFilter = stir.node("#filter-by-theme");

    /* Clear all */
    if (event.target.nodeName === "BUTTON") {
      QueryParams.set("page", 1);
      QueryParams.remove("theme");
      dateFilter.value = "";
      themeFilter.value = "";
      doEventsFilter(dateFilter.options[dateFilter.selectedIndex].value, themeFilter.options[themeFilter.selectedIndex].value, initData);
    }
  });

  const dateFilter = stir.node("#filter-by-date");
  const themeFilter = stir.node("#filter-by-theme");

  /* Select filters */
  dateFilter.addEventListener("change", (event) => {
    QueryParams.set("page", 1);
    doEventsFilter(dateFilter.options[dateFilter.selectedIndex].value, themeFilter.options[themeFilter.selectedIndex].value, initData);
  });

  themeFilter.addEventListener("change", (event) => {
    QueryParams.set("page", 1);
    QueryParams.set("theme", themeFilter.options[themeFilter.selectedIndex].value);
    doEventsFilter(dateFilter.options[dateFilter.selectedIndex].value, themeFilter.options[themeFilter.selectedIndex].value, initData);
  });
})(stir.node("#welcomeevents"));
