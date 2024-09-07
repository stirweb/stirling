const AccommodationFinder = (scope) => {
  if (!scope) return;

  // Constants
  const CONSTS = {
    cookieType: "accom",
    urlToFavs: scope.dataset.favsurl || ``,
    activity: scope.dataset.activity || ``,
    view: stir.templates?.view || ``,
  };

  // DOM Elements
  const DOM_ELEMENTS = {
    resultsArea: scope,
    searchForm: stir.node("#search-form"),
    searchPrice: stir.node("#search-price"),
    searchLocation: stir.node("#search-location"),
    searchStudentType: stir.node("#search-student-type"),
    searchBathroom: stir.node("#search-bathroom"),
    searchPriceNode: stir.node("#search-price-value"),
    favBtnsNode: stir.node("#accomfavbtns"),
    sharedArea: stir.node("[data-activity=shared]"),
    sharedfavArea: stir.node("#accomsharedfavsarea"),
  };

  /* 
      Rendering Functions
  */

  const renderPrice = (rooms) => {
    if (!rooms) return ``;
    const allPrices = rooms.map((item) => parseFloat(item.cost)).sort((a, b) => a - b);
    const matches = stir.removeDuplicates(rooms.map((item) => item.type));

    return allPrices[0].toFixed(2) === allPrices[allPrices.length - 1].toFixed(2)
      ? `<p>£${allPrices[0].toFixed(2)} per week</p>
         <ul>${matches.map((item) => `<li>${item}</li>`).join(``)}</ul>`
      : `<p>From £${allPrices[0].toFixed(2)} to £${allPrices[allPrices.length - 1].toFixed(2)} per week</p>
         <ul>${matches.map((item) => `<li>${item}</li>`).join(``)}</ul>`;
  };

  const renderStudentTypes = (rooms) => (rooms ? stir.removeDuplicates(rooms.flatMap((item) => item.studType.split(",")).map((item) => item.trim())).join("<br />") : ``);

  const renderFavBtns = (urlToFavs, cookie, id) => (cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, urlToFavs) : stir.favourites.renderAddBtn(id, urlToFavs));

  const renderAccom = (consts) => (item) => {
    if (!item) return ``;
    const cookie = stir.favourites.getFav(item.id, consts.cookieType);
    return `
      <div class="cell" id="fav-${item.id}">
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
              <p><strong>Location</strong></p> 
              <p>${item.location}</p>
              <p><strong>Student type</strong></p>
              <p>${renderStudentTypes(item.rooms)}</p>
            </div>
            <div class="cell large-3 ">
              <div><img src="${item.img}" width="760" height="470" alt="Image of ${item.title}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
            </div>
            <div class="cell text-sm u-pt-2" id="favbtns${item.id}">
              ${renderFavBtns(consts.urlToFavs, cookie, item.id)}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderShared = (item) =>
    !item.id
      ? ``
      : `
      <div class="cell small-6">
        <div class="u-green-line-top u-margin-bottom">
          <p class="u-text-regular u-py-1"><strong><a href="${item.url}">${item.title}</a></strong></p>
          <div class="u-mb-1">${item.location} accommodation.</div>
          <div>${stir.favourites.isFavourite(item.id) ? `<p class="text-sm u-heritage-green">Already in my favourites</p>` : stir.favourites.renderAddBtn(item.id, ``)}</div>
        </div>
      </div>`;

  const renderShareDialog = (link) =>
    !link
      ? ``
      : `
      <p><strong>Share link</strong></p>  
      ${navigator.clipboard ? '<p class="text-xsm">The following share link has been copied to your clipboard:</p>' : ``}   
      <p class="text-xsm">${link}</p>`;

  const renderMiniFav = (item) => (!item.id ? "" : `<p class="text-sm"><strong><a href="${item.url}">${item.title}</a></strong></p>`);

  const renderNumItems = (num) => `<div class="cell u-mb-3">Results based on filters - <strong>${num} ${num === 1 ? `property` : `properties`}</strong></div>`;

  const renderFavActionBtns = () => stir.templates.renderFavActionBtns;
  const renderNoFavs = () => stir.templates.renderNoFavs;
  const renderLinkToFavs = () => stir.templates.renderLinkToFavs;
  const renderNoShared = () => stir.templates.renderNoShared;

  /*
      Handle Inputs and Outputs
  */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const cleanQueryParam = (param) => {
    if (typeof param !== "string") return ``;
    // Remove any non-alphanumeric characters except hyphen and underscore
    return param.replace(/[^a-zA-Z0-9-_]/g, ``);
  };

  const SafeQueryParams = {
    get: (key) => cleanQueryParam(QueryParams.get(key)),
    set: (key, value) => QueryParams.set(key, cleanQueryParam(value)),
    remove: QueryParams.remove,
  };

  /* 
      Data Processing Functions
  */
  const getfavsCookie = () => stir.favourites.getFavsList(CONSTS.cookieType);

  const getShareList = (data) => {
    const sharedListQuery = SafeQueryParams.get("a") || "";
    if (!sharedListQuery) return null;

    try {
      const sharedList = atob(sharedListQuery);
      return sharedList.split(",").map((item) => ({
        ...data.find((element) => item === element.id),
        id: item,
      }));
    } catch (e) {
      return null;
    }
  };

  const getFavsList = (data) => {
    const favsCookie = getfavsCookie();
    if (favsCookie.length < 1) return null;

    return favsCookie
      .sort((a, b) => b.date - a.date)
      .map((item) => ({
        ...data.find((element) => item.id === element.id),
        id: item.id,
        dateSaved: item.date,
      }));
  };

  const filterByBathroom = (filterValue) => (item) => {
    if (filterValue === `` || !item.rooms) return item;
    const matches = item.rooms.filter((entry) => entry.bathroom.toLowerCase().includes(filterValue.toLowerCase()));
    return matches.length ? { ...item, rooms: matches } : {};
  };

  const filterByLocation = (filterValue) => (item) => filterValue === `` || !item.location || filterValue === item.location ? item : null;

  const filterByStudType = (filterValue) => (item) => {
    if (filterValue === `` || !item.rooms) return item;
    const matches = item.rooms.filter((entry) => entry.studType.includes(filterValue));
    return matches.length ? { ...item, rooms: matches } : {};
  };

  const filterByPrice = (filterValue) => (item) => {
    if (filterValue === `` || !item.rooms) return item;
    const matches = item.rooms.filter((entry) => parseFloat(filterValue) > parseFloat(entry.cost));
    return matches.length ? { ...item, rooms: matches } : {};
  };

  const filterEmpties = (item) => item && item.title;

  /* 
    Controller Functions
  */

  function doFavourites(consts, data, domElements) {
    const favs = stir.favourites.getFavsList(consts.cookieType);
    const filteredData = favs.map((fav) => data.find((entry) => Number(entry.id) === Number(fav.id))).filter(filterEmpties);

    const renderer = consts.view === "micro" ? renderMicro(consts) : renderAccom(consts);
    const html = filteredData.map(renderer).join(``);

    return setDOMContent(domElements.resultsArea)(html || stir.templates.renderNoFavs);
  }

  function doSearch(consts, filters, data, domElements) {
    const filteredData = data.map(filterByPrice(filters.price)).map(filterByStudType(filters.studentType)).map(filterByBathroom(filters.bathroom)).filter(filterByLocation(filters.location)).filter(filterEmpties);

    const html = filteredData.map(renderAccom(consts)).join(``);
    return setDOMContent(domElements.resultsArea)(renderNumItems(filteredData.length) + html);
  }

  function doShared(sharedArea, sharedfavArea, data) {
    if (sharedArea) {
      const shareList = getShareList(data);
      if (!shareList) {
        setDOMContent(sharedArea, renderNoShared());
      } else {
        setDOMContent(sharedArea, shareList.map(renderShared).join(``));
      }
    }

    if (sharedfavArea) {
      const list = getFavsList(data);
      if (!list) {
        setDOMContent(sharedfavArea, renderNoFavs());
      } else {
        setDOMContent(sharedfavArea, list.map(renderMiniFav).join(``) + renderLinkToFavs());
      }
    }
    return;
  }

  /* 
        Event Handlers
    */
  const handleSearchFormInput = (domElements) => (event) => {
    const filters = {
      price: domElements.searchPrice.value,
    };
    setDOMContent(domElements.searchPriceNode)(filters.price);
  };

  const handleSearchFormChange = (consts, initialData, domElements) => (event) => {
    const filters = {
      price: domElements.searchPrice.value,
      location: domElements.searchLocation.value,
      studentType: domElements.searchStudentType.value,
      bathroom: domElements.searchBathroom.value,
    };

    Object.entries(filters).forEach(([key, value]) => SafeQueryParams.set(key, value));
    doSearch(consts, filters, initialData, domElements);
  };

  const handleFavButtonClick = (consts, initialData, domElements) => (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    if (target.dataset.action === "clearallfavs") {
      stir.favourites.removeType(consts.cookieType);
      doFavourites(consts, initialData, domElements);
    }

    if (target.dataset.action === "copysharelink") {
      const favsCookie = getfavsCookie();
      const base64Params = btoa(favsCookie.map((item) => item.id).join(","));
      const link = "https://www.stir.ac.uk/shareaccommodation/" + base64Params;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(link);
      }

      const dialog = stir.t4Globals.dialogs.find((item) => item.getId() === "shareDialog");
      if (dialog) {
        dialog.open();
        dialog.setContent(renderShareDialog(link));
      }
    }
  };

  const handleSearchResultFavClick = (consts, domElements) => (event) => {
    const target = event.target.closest("button");
    if (!target || !target.dataset || !target.dataset.action) return;

    const updateFavButtonDisplay = (id) => {
      const cookie = stir.favourites.getFav(id, consts.cookieType);
      const node = stir.node("#favbtns" + id);
      if (node) setDOMContent(node)(renderFavBtns(consts.urlToFavs, cookie, id));
    };

    if (target.dataset.action === "addtofavs") {
      stir.favourites.addToFavs(target.dataset.id, consts.cookieType);
      updateFavButtonDisplay(target.dataset.id);
    }

    if (target.dataset.action === "removefav") {
      stir.favourites.removeFromFavs(target.dataset.id);
      updateFavButtonDisplay(target.dataset.id);

      if (consts.activity === "managefavs") {
        const node = stir.node("#fav-" + target.dataset.id);
        if (node) setDOMContent(node)("");
      }
    }
  };

  /* 
        Initialization
    */
  function init(initialData, consts, domElements) {
    if (consts.activity === "managefavs") {
      doFavourites(consts, initialData, domElements);
    }

    if (consts.activity === "shared") {
      doShared(domElements.sharedArea, domElements.sharedfavArea, initialData);
    }

    if (consts.activity === "search") {
      // Initialize search form
      const allRooms = initialData.flatMap((item) => item.rooms);
      const prices = allRooms.map((item) => Number(item.cost)).sort((a, b) => a - b);
      const min = Math.ceil(prices[0]);
      const max = Math.ceil(prices[prices.length - 1]);

      domElements.searchPrice.min = Math.ceil(min / 10) * 10;
      domElements.searchPrice.max = Math.ceil(max / 10) * 10;
      domElements.searchPrice.value = SafeQueryParams.get("price") || Math.ceil(max / 10) * 10;
      domElements.searchLocation.value = SafeQueryParams.get("location") || ``;
      domElements.searchStudentType.value = SafeQueryParams.get("student") || ``;
      domElements.searchBathroom.value = SafeQueryParams.get("bathroom") || ``;

      setDOMContent(domElements.searchPriceNode)(domElements.searchPrice.value);

      const filters = {
        price: domElements.searchPrice.value,
        location: domElements.searchLocation.value,
        studentType: domElements.searchStudentType.value,
        bathroom: domElements.searchBathroom.value,
      };

      doSearch(consts, filters, initialData, domElements);

      // Add event listeners
      domElements.searchForm?.addEventListener("input", handleSearchFormInput(domElements));
      domElements.searchForm?.addEventListener("change", handleSearchFormChange(consts, initialData, domElements));
    }

    // Add event listeners for favorites
    if (domElements.favBtnsNode) {
      stir.node("main").addEventListener("click", handleFavButtonClick(consts, initialData, domElements));
      setDOMContent(domElements.favBtnsNode)(renderFavActionBtns());
    }

    // Add event listener for search result favorite button clicks
    domElements.resultsArea.addEventListener("click", handleSearchResultFavClick(consts, domElements));
  }

  /* Run initialization */
  const initialData = accommodationData?.filter((item) => item.id && item.id.length) || [];
  init(initialData, CONSTS, DOM_ELEMENTS);
};

// Run the AccommodationFinder
AccommodationFinder(stir.node("#acccomfinder"));
