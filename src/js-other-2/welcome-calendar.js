(function (scope) {
  if (!scope) return;

  const filtersArea = stir.node("#welcomeeventfilters");

  /*
      | 
      |  RENDERERS
      |
      */

  const renderEvent = (item) => {
    console.log(item);
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
                          
                      <!-- div class="flex-container u-gap-16 align-middle">
                              <span class="u-icon h5 uos-discounts"></span><a href="${item.link}">Booking required</a></ -->
                      </div>
                      <p class="text-sm">${item.description}</p>
                      <p class="u-m-0 text-sm">Theme: ${item.theme} <br />Attendance: ${item.attendance}</p>
                  </div>
              </div>`;
  };

  const renderDateFilter = (item) => {
    return `<option value="${item.startInt}">${item.stirStart}</option>`;
  };

  const renderThemeFilter = (item) => {
    return `<option value="${item.theme}">${item.theme}</option>`;
  };

  const renderSelectFilter = (html, title) => {
    return `<select id="${title.toLowerCase().replaceAll(" ", "-")}"><option value="">${title}</option>${html}</select>`;
  };

  const renderNoEvents = () => {
    return `<div class="grid-x u-bg-white u-mb-2  u-border-width-5">
                  <div class="cell u-p-2 small-12  ">
                      <p>No events have been found for the criteria selected</p>
                  </div>
              </div>`;
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

  const setDOMEvents = setDOMContent(scope);

  const setDOMDateFilter = setDOMContent(filtersArea);

  const joiner = stir.join("");

  const sortByStartDate = (a, b) => a.startInt - b.startInt;

  //const sortByStartDateDesc = (a, b) => b.startInt - a.startInt;

  const mapDates = (item) => {
    return { startInt: item.startInt, stirStart: item.stirStart };
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

  /*
      | 
      |  ON LOAD
      |
      */

  /* 
        Welcome Events 
     */
  const initData = stir.feeds.events.filter((item) => item.id);

  console.log(initData);

  /* 
        Filters 
    */
  const removeDateDups = removeDuplicateObjectFromArray("startInt");
  const datesHtml = stir.compose(joiner, stir.map(renderDateFilter), removeDateDups, stir.map(mapDates), stir.sort(sortByStartDate))(initData);

  const removeFilterDups = removeDuplicateObjectFromArray("theme");
  const themesHtml = stir.compose(joiner, stir.map(renderThemeFilter), removeFilterDups, stir.filter(filterThemeEmpties), stir.map(mapTheme))(initData);

  setDOMDateFilter(renderSelectFilter(datesHtml, "Filter by date") + renderSelectFilter(themesHtml, "Filter by theme"));

  /* 
        CONTROLLER 
    */
  const doEventsFilter = (date, theme, data) => {
    const filterByDateCurry = filterByDate(date);
    const filterByThemeCurry = filterByTheme(theme);

    const html = stir.compose(joiner, stir.map(renderEvent), stir.filter(filterByThemeCurry), stir.filter(filterByDateCurry), stir.sort(sortByStartDate))(data);

    html.length ? setDOMEvents(html) : setDOMEvents(renderNoEvents());
  };

  doEventsFilter("", "", initData);

  /* 
        EVENT LISTENER 
    */
  filtersArea.addEventListener("click", (event) => {
    if (event.target.nodeName === "OPTION") {
      const dateFilter = stir.node("#filter-by-date");
      const themeFilter = stir.node("#filter-by-theme");

      doEventsFilter(dateFilter.options[dateFilter.selectedIndex].value, themeFilter.options[themeFilter.selectedIndex].value, initData);
    }
  });
})(stir.node("#welcomeevents"));
