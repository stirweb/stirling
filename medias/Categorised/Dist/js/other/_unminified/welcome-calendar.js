(function (scope) {
  if (!scope) return;

  const GLOBALS = {
    filtersArea: stir.node("#welcomeeventfilters"),
    resultsArea: scope,
    itemsPerPage: 9,
  };

  /* 
      Rendering
  */
  const renderLink = (link) =>
    link
      ? `
      <div class="flex-container u-gap-16 align-middle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px; height: 20px; color: #006938 ">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <a href="${link}">More information</a>
        </div>`
      : ``;

  const renderEvent = (item) => `
    <div class="grid-x u-bg-white u-mb-2 u-energy-line-left u-border-width-5">
      <div class="cell u-p-2 small-12">
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

  const renderDateFilter = (item) => `<option value="${item.startIntFull}">${item.stirStart}</option>`;

  const renderThemeFilter = (selected) => (item) => `<option value="${item.theme}" ${selected === item.theme ? "selected" : ""}>${item.theme}</option>`;

  const renderSelectFilter = (html, title) => `<select id="${title.toLowerCase().replaceAll(" ", "-")}"><option value="">${title}</option>${html}</select>`;

  const renderClearFiltersBtn = () => `<button id="clearfilters" class="button no-arrow tiny hollow expanded u-font-bold">Clear all filters</button>`;

  const renderNoEvents = () =>
    `<div class="grid-x u-bg-white u-mb-2  u-border-width-5">
      <div class="cell u-p-2 small-12  ">
        <p>No events have been found for the criteria selected</p>
      </div>
    </div>`;

  const renderPaginationBtn = (end, noOfResults) =>
    end >= noOfResults
      ? ``
      : `<div class="loadmorebtn flex-container align-center u-mb-2">
           <button class="button hollow tiny">Load more results</button>
         </div>`;

  const renderPageMeta = (start, end, noOfResults) =>
    start < 2
      ? ``
      : `<div class="flex-container align-center u-mb-2">
           Showing ${start + 1}-${Math.min(end, noOfResults)} of ${noOfResults} results
         </div>`;

  /*
      Helper functions
  */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const appendDOMContent = stir.curry((elem, html) => {
    elem.insertAdjacentHTML("beforeend", html);
    return elem;
  });

  const joiner = stir.join("");

  const sortByStartDate = (a, b) => a.startIntFull - b.startIntFull;

  const mapDates = (item) => ({ startIntFull: item.startInt, stirStart: item.stirStart });

  const mapTheme = (item) => ({ theme: item.theme });

  const filterThemeEmpties = (item) => item.theme;

  const removeDuplicateObjectFromArray = stir.curry((key, array) =>
    array.reduce((acc, curr) => {
      if (!acc.some((item) => item[key] === curr[key])) {
        acc.push(curr);
      }
      return acc;
    }, [])
  );

  const filterByDate = stir.curry((date, item) => !date || item.startInt === Number(date));

  const filterByTheme = stir.curry((theme, item) => !theme || item.theme === theme);

  const getNow = () => {
    const now = new Date();
    return parseInt(now.getFullYear() + ("0" + (now.getMonth() + 1)).slice(-2) + ("0" + now.getDate()).slice(-2) + ("0" + now.getHours()).slice(-2) + ("0" + now.getMinutes()).slice(-2));
  };

  const isUpcoming = stir.curry((now, item) => item.endIntFull >= now);

  const cleanQueryParam = (param) => {
    if (typeof param !== "string") return "";
    // Remove any non-alphanumeric characters except hyphen and underscore
    return param.replace(/[^a-zA-Z0-9-_]/g, "");
  };

  // Updated QueryParams object with cleaning
  const SafeQueryParams = {
    get: (key) => cleanQueryParam(QueryParams.get(key)),
    set: (key, value) => QueryParams.set(key, cleanQueryParam(value)),
    remove: QueryParams.remove,
  };

  /* 
      Controller
  */
  function doEventsFilter(globals, page_, now, date, theme, data) {
    const page = Number(page_) || 1;
    const start = globals.itemsPerPage * (page - 1);
    const end = start + globals.itemsPerPage;

    // Curry's
    const setDOMEvents = page === 1 ? setDOMContent(globals.resultsArea) : appendDOMContent(globals.resultsArea);

    const isUpcomingFilter = stir.filter(isUpcoming(now));
    const themeFilterer = stir.filter(filterByTheme(theme));
    const dateFilterer = stir.filter(filterByDate(date));
    const dateSorterer = stir.sort(sortByStartDate);
    const renderer = stir.map(renderEvent);

    // Data processing
    const filteredData = stir.compose(themeFilterer, dateFilterer, dateSorterer, isUpcomingFilter)(data);
    const paginatedData = filteredData.slice(start, end);

    const html = stir.compose(joiner, renderer)(paginatedData);
    const noOfResults = filteredData.length;

    const content = html.length ? renderPageMeta(start, end, noOfResults) + html + renderPaginationBtn(end, noOfResults) : renderNoEvents();
    setDOMEvents(content);
  }

  /*
      Event listeners
  */
  function setupEventListeners(globals) {
    const dateFilter = stir.node("#filter-by-date");
    const themeFilter = stir.node("#filter-by-theme");

    globals.resultsArea.addEventListener("click", (event) => {
      if (event.target.type === "submit") {
        setDOMContent(event.target.closest(".loadmorebtn"), "");
        const page = Number(SafeQueryParams.get("page")) + 1;
        SafeQueryParams.set("page", String(page));
        doEventsFilter(globals, page, getNow(), dateFilter.value, themeFilter.value, initData);
      }
    });

    globals.filtersArea.addEventListener("click", (event) => {
      if (event.target.nodeName === "BUTTON") {
        const page = 1;
        SafeQueryParams.set("page", String(page));
        SafeQueryParams.remove("theme");
        dateFilter.value = "";
        themeFilter.value = "";
        doEventsFilter(globals, page, getNow(), "", "", initData);
        event.preventDefault();
      }
    });

    const handleFilterChange = () => {
      const page = 1;
      SafeQueryParams.set("page", String(page));
      SafeQueryParams.set("theme", themeFilter.value);
      doEventsFilter(globals, page, getNow(), dateFilter.value, themeFilter.value, initData);
    };

    dateFilter.addEventListener("change", handleFilterChange);
    themeFilter.addEventListener("change", handleFilterChange);
  }

  /*
      Initialize
  */

  const initData = stir.feeds.events.filter((item) => item.id);
  const theme = SafeQueryParams.get("theme") || "";
  const page = 1;

  SafeQueryParams.set("page", String(page));
  doEventsFilter(GLOBALS, page, getNow(), "", theme, initData);

  // Set up date filter
  const isUpcomingFilter = stir.filter(isUpcoming(getNow()));
  const dateFilter = stir.map(renderDateFilter);
  const dateSorter = stir.sort(sortByStartDate);
  const dateMapper = stir.map(mapDates);

  const datesFilterHtml = stir.compose(joiner, dateFilter, removeDuplicateObjectFromArray("startIntFull"), dateMapper, dateSorter, isUpcomingFilter)(initData);

  // Set up theme filter
  const themeMapper = stir.map(mapTheme);
  const themeEmptiesFilter = stir.filter(filterThemeEmpties);
  const themeRenderer = stir.map(renderThemeFilter(theme));

  const themesFilterHtml = stir.compose(joiner, themeRenderer, removeDuplicateObjectFromArray("theme"), themeEmptiesFilter, themeMapper)(initData);

  const setDOMFilters = setDOMContent(GLOBALS.filtersArea);

  setDOMFilters(renderSelectFilter(datesFilterHtml, "Filter by date") + renderSelectFilter(themesFilterHtml, "Filter by theme") + renderClearFiltersBtn());

  setupEventListeners(GLOBALS);
})(stir.node("#welcomeevents"));
