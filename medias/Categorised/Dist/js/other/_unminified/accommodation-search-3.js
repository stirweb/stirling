/*
 * @author: Ryan Kaye
 * @version: 3
 */

(function (scope) {
  if (!scope) return;

  // VARS
  const COOKIE_TYPE = "accom";

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
  const searchPriceNode = stir.node("#search-price-value");

  const favBtnsNode = stir.node("#accomfavbtns");
  const sharedArea = stir.node("[data-activity=shared]");
  const sharedfavArea = stir.node("#accomsharedfavsarea");

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

  /* renderStudentTypes */
  const renderStudentTypes = (rooms) => {
    if (!rooms) return ``;

    const allTypes = rooms
      .map((item) => item.studType)
      .join(",")
      .split(",")
      .map((item) => item.trim());

    return stir.removeDuplicates(allTypes).join("<br />");
  };

  /* renderFavBtns */
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
            </div>`;
  });

  /* renderMiniFav - used on the share page */
  const renderMiniFav = (item) => {
    return !item.id ? `` : `<p class="text-sm"><strong><a href="${item.url}" >${item.title} </a></strong></p>`;
  };

  /* renderShareDialog */
  const renderShareDialog = (link) => {
    return !link
      ? ``
      : ` <p><strong>Share link</strong></p>  
          ${navigator.clipboard ? '<p class="text-xsm">The following share link has been copied to your clipboard:</p>' : ""}   
          <p class="text-xsm">${link}</p>`;
  };

  /* renderShared */
  const renderShared = (item) => {
    return !item.id
      ? ``
      : `<div class="cell small-6">
            <div class="u-green-line-top u-margin-bottom">
              <p class="u-text-regular u-py-1"><strong><a href="${item.url}" >${item.title}</a></strong></p>
              <div class="u-mb-1">${item.location} accommodation.</div>
              <div>${stir.favourites.isFavourite(item.id) ? `<p class="text-sm u-heritage-green">Already in my favourites</p>` : stir.favourites.renderAddBtn(item.id, "")}</div>
            </div>
          </div>`;
  };

  /* renderNumItems */
  const renderNumItems = (num) => `<div class="cell u-mb-3">Results based on filters - <strong>${num} ${num === 1 ? `property` : `properties`}</strong></div>`;

  const renderFavActionBtns = () => stir.templates.renderFavActionBtns;
  const renderNoFavs = () => stir.templates.renderNoFavs;
  const renderLinkToFavs = () => stir.templates.renderLinkToFavs;
  const renderNoShared = () => stir.templates.renderNoShared;

  /*
      Data Processing
    */

  const getfavsCookie = () => stir.favourites.getFavsList(COOKIE_TYPE);

  /* getFavsList: Returns an array of course objects */
  const getFavsList = (data) => {
    const favsCookie = getfavsCookie();

    if (!favsCookie.length || favsCookie.length < 1) {
      return null;
    }

    const favsCookieSorted = favsCookie.sort((a, b) => b.date - a.date);
    // Maintain ordering by merging data into cookie object
    return favsCookieSorted.map((item) => {
      return {
        ...data.filter((element) => {
          if (item.id === element.id) return element;
        })[0],
        ...{ id: item.id, dateSaved: item.date },
      };
    });
  };

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

  /* getShareList */
  const getShareList = (data) => {
    const sharedListQuery = QueryParams.get("a") || "";

    if (!sharedListQuery) return null;

    try {
      // wrap in a try{} to catch any Base64 errors
      const sharedList = atob(sharedListQuery);

      // Maintain ordering by merging FB result into cookie object
      return sharedList.split(",").map((item) => {
        return {
          ...data.filter((element) => {
            if (item === element.id) return element;
          })[0],
          ...{ id: item },
        };
      });
    } catch (e) {
      /* URL param not Base64? */ return;
    }
  };

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

  /* doFavourites */
  const doFavourites = (consts, data) => {
    const favs = stir.favourites.getFavsList(consts.cookieType);

    const mapItemCurry = stir.map(mapItem(data));
    const renderer = stir.map(renderAccom(consts));
    const setDOM = setDOMContent(resultsArea);

    const filteredData = stir.compose(filterEmpties, mapItemCurry)(favs);
    const html = stir.compose(joiner, renderer)(filteredData);

    return html ? setDOM(html) : setDOM(stir.templates.renderNoFavs);
  };

  /* doSearch */
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

  /* doShared */
  const doShared = (sharedArea, sharedfavArea, data) => {
    if (sharedArea) {
      const shareList = getShareList(data);
      if (!shareList) {
        setDOMContent(sharedArea, renderNoShared());
      } else {
        setDOMContent(sharedArea, shareList.map(renderShared).join(""));
      }
    }

    if (sharedfavArea) {
      const list = getFavsList(data);
      if (!list) {
        setDOMContent(sharedfavArea, renderNoFavs());
      } else {
        setDOMContent(sharedfavArea, list.map(renderMiniFav).join("") + renderLinkToFavs());
      }
    }
    return;
  };

  /*
     On load
   */

  const initialData = accommodationData ? accommodationData.filter((item) => item.id && item.id.length) : [];

  /*  Init Page Manage Favs */
  if (CONSTS.activity === "managefavs") {
    doFavourites(CONSTS, initialData);
  }

  /*  Init Page Shared */
  if (CONSTS.activity === "shared") {
    doShared(sharedArea, sharedfavArea, initialData);
  }

  /*  Init Page Search */
  if (CONSTS.activity === "search") {
    // Min and max prices for the range slider
    const allRooms = stir.flatten(initialData.map((item) => item.rooms));
    const prices = allRooms.map((item) => Number(item.cost)).sort((a, b) => a - b);

    const min = Math.ceil(prices[0]);
    const roundedMin = Math.ceil(min / 10) * 10;
    const max = Math.ceil(prices[prices.length - 1]);
    const roundedMax = Math.ceil(max / 10) * 10;

    searchPrice.min = roundedMin;
    searchPrice.max = roundedMax;

    searchPrice.value = QueryParams.get("price") ? QueryParams.get("price") : roundedMax;
    searchLocation.value = QueryParams.get("location") ? QueryParams.get("location") : "";
    searchStudentType.value = QueryParams.get("student") ? QueryParams.get("student") : "";
    searchBathroom.value = QueryParams.get("bathroom") ? QueryParams.get("bathroom") : "";

    setDOMContent(searchPriceNode, searchPrice.value);

    const filters = {
      price: searchPrice.value,
      location: searchLocation.value,
      studentType: searchStudentType.value,
      bathroom: searchBathroom.value,
    };

    doSearch(CONSTS, filters, initialData);

    /* 
      Actions: Form changes 
    */
    searchForm &&
      searchForm.addEventListener("input", (event) => {
        const filters = {
          price: searchPrice.value,
        };
        setDOMContent(searchPriceNode, filters.price);
      });

    searchForm &&
      searchForm.addEventListener("change", (event) => {
        QueryParams.set("price", searchPrice.value);
        QueryParams.set("location", searchLocation.value);
        QueryParams.set("student", searchStudentType.value);
        QueryParams.set("bathroom", searchBathroom.value);

        const filters = {
          price: searchPrice.value,
          location: searchLocation.value,
          studentType: searchStudentType.value,
          bathroom: searchBathroom.value,
        };
        doSearch(CONSTS, filters, initialData);
      });
  }

  /* 
    ACTIONS: FAVS ASIDE
   */
  if (favBtnsNode) {
    stir.node("main").addEventListener("click", (event) => {
      const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

      /* ACTION: REMOVE ALL FAVS */
      if ("clearallfavs" === target.dataset.action) {
        stir.favourites.removeType(COOKIE_TYPE);
        doFavourites(CONSTS, initialData);
      }

      /* ACTION: COPY SHARE LINK */
      if ("copysharelink" === target.dataset.action) {
        const favsCookie = getfavsCookie();
        const base64Params = btoa(favsCookie.map((item) => item.id).join(","));

        const link = "https://www.stir.ac.uk/share/" + base64Params;
        navigator.clipboard && navigator.clipboard.writeText(link);

        const dialog = stir.t4Globals.dialogs.filter((item) => item.getId() === "shareDialog");

        if (!dialog.length) return;
        dialog[0].open();
        dialog[0].setContent(renderShareDialog(link));
      }
    });

    setDOMContent(favBtnsNode, renderFavActionBtns());
  }

  /* 
    ACTIONS: Search result fav btn clicks  
  */
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
})(stir.node("#acccomfinder"));
