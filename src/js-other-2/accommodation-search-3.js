/*
 * @author: Ryan Kaye
 * @version: 3
 */

(function (scope) {
  if (!scope) return;

  const CONSTS = {
    cookieType: "accom",
    urlToFavs: scope.dataset.favsurl ? scope.dataset.favsurl : ``,
    activity: scope.dataset.activity ? scope.dataset.activity : ``,
  };

  const resultsArea = scope;
  const searchForm = stir.node("#search-form");
  const searchPrice = stir.node("#search-price");
  const searchLocation = stir.node("#search-location");
  const searchStudentType = stir.node("#search-student-type");
  const searchBathroom = stir.node("#search-bathroom");
  const searchPriceValue = stir.node("#search-price-value");

  /*
     Renderers
   */

  /* renderPrice */
  const renderPrice = (rooms) => {
    if (!rooms) return ``;
    const allPrices = rooms.map((item) => parseFloat(item.cost)).sort((a, b) => a - b);
    const matches = stir.removeDuplicates(rooms.map((item) => item.title));

    return `<p>From £${allPrices[0].toFixed(2)} to £${allPrices[allPrices.length - 1].toFixed(2)} per week</p>
            <ul>${matches.map((item) => `<li>${item}</li>`).join(``)}</ul>`;
  };

  /* renderStudentType */
  const renderStudentType = (rooms) => {
    if (!rooms) return ``;
    const allTypes = rooms
      .map((item) => item.studType)
      .join(",")
      .split(",");

    return stir.removeDuplicates(allTypes).join("<br />");
  };

  const renderFavBtns = (urlToFavs, cookie, id) => {
    return cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, urlToFavs) : stir.favourites.renderAddBtn(id, urlToFavs);
  };

  /* renderAccom */
  const renderAccom = stir.curry((consts, item) => {
    if (!item) return ``;

    const cookie = stir.favourites.getFav(item.id, consts.cookieType);
    return `<div class="cell" id="fav-${item.id}">
              <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
                <div class="grid-x grid-padding-x u-p-2 ">
                  <div class="cell u-pt-2">
                      <p class="u-text-regular u-mb-2 "><strong><a href="${item.url}">${item.title}</a></strong></p>
                    </div>
                    <div class="cell large-5 text-sm">
                      <p><strong>Price</strong></p> 
                      ${renderPrice(item.rooms)}
                    </div>
                    <div class="cell large-4 text-sm">
                        <p><strong>Facilities</strong></p>
                        <p>${item.facilities}</p>
                        <p><strong>Location</strong></p> 
                        <p>${item.location}</p>
                        <p><strong>Student type</strong></p>
                        <p>${renderStudentType(item.rooms)}</p>
                    </div>
                    <div class="cell large-3 ">
                        <div ><img src="${item.img}" width="760" height="470" alt="Image of ${item.title}" /></div>
                    </div>
                    <div class="cell text-sm u-pt-2" id="favbtns${item.id}">
                      ${renderFavBtns(consts.urlToFavs, cookie, item.id)}
                    </div>
                  </div>
              </div>
            </div>`;
  });

  /* renderNumItems */
  const renderNumItems = (num) => `<div class="cell u-mb-3">Results based on filters - <strong>${num} properties</strong></div>`;

  /*
      Data Processing
    */

  /* filterByBathroom */
  const filterByBathroom = stir.curry((filterValue, item) => {
    if (filterValue === "" || !item.rooms) return item;

    const matches2 = stir.filter((entry) => entry.bathroom === filterValue, item.rooms);

    if (matches2.length) {
      item.rooms = matches2;
      return item;
    }
    return {};
  });

  /* filterByLocation */
  const filterByLocation = stir.curry((filterValue, item) => {
    if (filterValue === "" || !item.location) return item;

    if (filterValue === item.location) return item;
  });

  /* filterByStudType */
  const filterByStudType = stir.curry((filterValue, item) => {
    if (filterValue === "" || !item.rooms) return item;

    const matches2 = stir.filter((entry) => entry.studType.includes(filterValue), item.rooms);

    if (matches2.length) {
      item.rooms = matches2;
      return item;
    }
    return {};
  });

  /* filterByPrice */
  const filterByPrice = stir.curry((filterValue, item) => {
    if (filterValue === "" || !item.rooms) return item;

    const matches2 = stir.filter((entry) => parseFloat(filterValue) > parseFloat(entry.cost), item.rooms);

    if (matches2.length) {
      item.rooms = matches2;
      return item;
    }

    return {};
  });

  /* filterEmpties */
  const filterEmpties = stir.filter((item) => {
    if (item && item.title) return item;
  });

  /*
      Helpers
    */

  const joiner = stir.join(``);

  const mapItem = stir.curry((alldata, fav) => {
    if (!fav) return [];

    return alldata.filter((entry) => Number(entry.id) === Number(fav.id))[0];
  });

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /*
     Controllers
  */

  const doFavourites = (consts, data) => {
    const favs = stir.favourites.getFavsList(consts.cookieType);

    console.log(favs);

    const mapItemCurry = stir.map(mapItem(data));
    const renderer = stir.map(renderAccom(consts));
    const setDOM = setDOMContent(resultsArea);

    const filteredData = stir.compose(filterEmpties, mapItemCurry)(favs);
    const html = stir.compose(joiner, renderer)(filteredData);

    return html ? setDOM(html) : setDOM(stir.templates.renderNoFavs);
  };

  const doSearch = (consts, filters, data) => {
    const renderer = stir.map(renderAccom(consts));

    const filterByPriceCurry = stir.map(filterByPrice(filters.price));
    const filterByStudTypeCurry = stir.map(filterByStudType(filters.studentType));
    const filterByBathroomCurry = stir.map(filterByBathroom(filters.bathroom));
    const filterByLocationCurry = stir.filter(filterByLocation(filters.location));

    const filteredData = stir.compose(filterEmpties, filterByBathroomCurry, filterByLocationCurry, filterByStudTypeCurry, filterByPriceCurry, stir.clone)(data);
    const html = stir.compose(joiner, renderer)(filteredData);

    return setDOMContent(resultsArea, renderNumItems(filteredData.length) + html);
  };

  /*
     On load
   */

  const initialData = accommodationData.filter((item) => item.id && item.id.length);
  //const params = QueryParams.getAllArray();

  //console.log(initialData);

  if (!initialData.length) return;

  /* 
    Page : Manage Favs 
  */
  if (CONSTS.activity === "managefavs") {
    doFavourites(CONSTS, initialData);
  }

  /* 
    Page : Search 
  */
  if (CONSTS.activity === "search") {
    const filters = {
      price: "",
      location: "",
      bathroom: "",
      studentType: "",
    };

    doSearch(CONSTS, filters, initialData);

    searchPrice.value = 300;
    searchLocation.value = "";
    searchStudentType.value = "";
    searchBathroom.value = "";

    /* Actions: Form changes */
    searchForm &&
      searchForm.addEventListener("change", (event) => {
        const filters = {
          price: searchPrice.value,
          location: searchLocation.value,
          bathroom: searchBathroom.value,
          studentType: searchStudentType.value,
        };

        setDOMContent(searchPriceValue, filters.price);
        doSearch(CONSTS, filters, initialData);
      });
  }

  /* Actions: Cookie btn clicks  */
  resultsArea.addEventListener("click", (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    /* Add */
    if (target.dataset.action === "addtofavs") {
      stir.favourites.addToFavs(target.dataset.id, CONSTS.cookieType);

      const cookie = stir.favourites.getFav(target.dataset.id, CONSTS.cookieType);
      const node = stir.node("#favbtns" + target.dataset.id);

      if (node) setDOMContent(node, renderFavBtns(CONSTS.urlToFavs, cookie, target.dataset.id));
    }

    /* Remove */
    if (target.dataset.action === "removefav") {
      stir.favourites.removeFromFavs(target.dataset.id);

      const cookie = stir.favourites.getFav(target.dataset.id, CONSTS.cookieType);

      if (CONSTS.activity === "searchfavs") {
        const node = stir.node("#favbtns" + target.dataset.id);
        if (node) setDOMContent(node, renderFavBtns(CONSTS.urlToFavs, cookie, target.dataset.id));
      }

      if (CONSTS.activity === "managefavs") {
        const node = stir.node("#fav-" + target.dataset.id);
        if (node) setDOMContent(node, "");
      }
    }
  });
})(stir.node("#search-results"));
