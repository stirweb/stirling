const FavouritesArea = (scope, cookieType, data) => {
  if (!scope) return;

  const resultsArea = scope.querySelector('[data-activity="managefavs"]');

  // Constants
  const CONSTS = {
    cookieType: cookieType,
    urlToFavs: resultsArea.dataset.favsurl || ``,
    activity: resultsArea.dataset.activity || ``,
    view: stir.templates?.view || ``,
  };

  // DOM Elements
  const DOM_ELEMENTS = {
    resultsArea: resultsArea,
    favBtnsNode: scope.querySelector('[data-area="favActionBtns"]'),
  };

  /* 
        Rendering Functions
    */

  const renderImage = (img, title) => {
    if (!img) return ``;
    return `<div class="cell large-3">
                <div><img src="${img}" width="760" height="470" alt="Image of ${title}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
            </div>`;
  };

  const renderFavBtns = (urlToFavs, cookie, id) => (cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, urlToFavs) : stir.favourites.renderAddBtn(id, urlToFavs));

  const renderItem = (consts) => (item) => {
    if (!item) return ``;
    const cookie = stir.favourites.getFav(item.id, consts.cookieType);
    return `
        <div class="cell" id="fav-${item.id}">
          <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
            <div class="grid-x grid-padding-x u-p-2 ">
              <div class="cell u-pt-2">
                <p class="u-text-regular u-mb-2 "><strong><a href="${item.url}">${item.title}</a></strong></p>
              </div>
              <div class="cell ${item.img ? `large-9` : `large-12`}  text-sm">
                <p><strong>Content</strong></p> 
                ${item.content}
              </div>
              ${renderImage(item.img, item.title)}
              <div class="cell text-sm u-pt-2" id="favbtns${item.id}">
                ${renderFavBtns(consts.urlToFavs, cookie, item.id)}
              </div>
            </div>
          </div>
        </div>`;
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

  const filterEmpties = (item) => item && item.title;

  /* 
      Controller Functions
    */

  function doFavourites(consts, data, domElements) {
    const favs = stir.favourites.getFavsList(consts.cookieType);
    const filteredData = favs.map((fav) => data.find((entry) => Number(entry.id) === Number(fav.id))).filter(filterEmpties);

    const renderer = consts.view === "micro" ? renderMicro(consts) : renderItem(consts);

    const html = filteredData.map(renderer).join(``);

    return setDOMContent(domElements.resultsArea)(html || stir.templates.renderNoFavs);
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

  const handleFavActionButtonClick = (consts, initialData, domElements) => (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    if (target.dataset.action === "clearallfavs") {
      console.log(consts.cookieType);

      if (target.dataset.fav !== consts.cookieType) return;

      stir.favourites.removeType(consts.cookieType);
      doFavourites(consts, initialData, domElements);
    }

    if (target.dataset.action === "copysharelink") {
      const favsCookie = getfavsCookie();
      const base64Params = btoa(favsCookie.map((item) => item.id).join(","));
      const link = "https://www.stir.ac.uk/sharefavs/" + base64Params;

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

  const handleSearchResultFavClick = (consts, domElements, data) => (event) => {
    const target = event.target.closest("button");
    if (!target || !target.dataset || !target.dataset.action) return;

    const updateFavButtonDisplay = (id) => {
      const cookie = stir.favourites.getFav(id, consts.cookieType);
      const node = stir.node("#favbtns" + id);
      if (node) setDOMContent(node)(renderFavBtns(consts.urlToFavs, cookie, id));
      if (domElements.sharedArea) doShared(domElements.sharedArea, domElements.sharedfavArea, data);
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

    // Add event listeners for favorites
    if (domElements.favBtnsNode) {
      stir.node("main").addEventListener("click", handleFavActionButtonClick(consts, initialData, domElements));
      //setDOMContent(domElements.favBtnsNode)(renderFavActionBtns());
    }

    // Add event listener for search result favorite button clicks
    domElements.resultsArea.addEventListener("click", handleSearchResultFavClick(consts, domElements, initialData));
  }

  /* Run initialization */
  const initialData = data?.filter((item) => item.id && item.id.length) || [];

  init(initialData, CONSTS, DOM_ELEMENTS);
};

// Run the FavouritesArea
FavouritesArea(stir.node("#acccomArea"), "accom", accommodationData);
FavouritesArea(stir.node("#courseArea"), "course", courseData);
