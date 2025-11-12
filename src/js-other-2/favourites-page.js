(function () {
  const resultsArea = document.querySelector("[data-activity]");

  if (!resultsArea) return;

  // Constants
  const CONSTS = {
    //allowedCookieTypes: ["accom", "course", "schol", "page", "event", "webinar"],
    showUrlToFavs: resultsArea.dataset.favsurl || ``,
    activity: resultsArea.dataset.activity || ``,
    view: stir.templates?.view || ``,
  };

  // DOM Elements
  const DOM = {
    resultsArea: resultsArea,
    sharedArea: document.querySelector("[data-activity=shared]"),
    favBtnsNode: document.querySelector("[data-area=favActionBtns]"),
    latestArea: stir.node("[data-activity=latestfavs]"),
  };

  /*
   *
   *   Rendering
   *
   */

  const renderMicro = (item) => {
    if (!item || !item.id) return ``;
    return `<div class="cell large-3 text-sm u-bg-white u-p-1 u-mb-1" id="microfav-${item.custom_fields.sid}">
                <p class="u-text-regular  "><strong><a href="${item.url}">${item.custom_fields.h1_custom}</a></strong></p>
                 <p><strong>${(item.custom_fields.type && stir.capitaliseFirst(item.custom_fields.type)) || ``}</strong></p>
            </div>`;
  };

  /*
   * renderImage
   * @param {string} img - The image URL
   * @param {string} title - The title for alt text
   * @returns {string} - The HTML string for the image container
   */
  const renderImage = (img, title) => {
    if (!img) return ``;
    return `<div class="cell large-3">
                <div><img src="${img}" width="760" height="470" alt="Image of ${title}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
            </div>`;
  };

  /*
   * renderFavBtns
   * @param {boolean} showUrlToFavs - Whether to show the URL to favourites
   * @param {Array} cookie - The favourites cookie array
   * @param {string} id - The ID of the item
   * @returns {string} - The HTML string for the favourite buttons
   */
  const renderFavBtns = (showUrlToFavs, cookie, id) => {
    return cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, showUrlToFavs) : stir.favourites.renderAddBtn(id, showUrlToFavs);
  };

  /*
   * getDataObject
   * @param {string|Array} data - The data to parse
   * @returns {Object} - The parsed data object
   */
  const getDataObject = (data) => {
    if (typeof data === "string") {
      return JSON.parse(decodeURIComponent(data));
    }
    return "object" === typeof data ? Object.assign({}, ...data.map((datum) => JSON.parse(decodeURIComponent(datum)))) : {};
  };

  /*
   * renderItem
   * @param {Object} consts - Configuration constants
   * @returns {Function} - A function that renders an item
   * @param {Object} item - The item to render
   * @returns {string} - The HTML string for the item
   */
  const renderItem = (consts) => (item) => {
    if (!item || !item.id) return ``;

    const cf = item.custom_fields || {};
    const data = getDataObject(cf.data);
    const url = data.register ? data.register : item.url;
    const snippet = cf.snippet ? cf.snippet : item.meta_description;
    const cookie = stir.favourites.getFav(cf.sid, consts.cookieType);
    return `
          <div class="cell" id="fav-${cf.sid}">
            <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
              <div class="grid-x grid-padding-x u-p-2 ">
                <div class="cell u-pt-1">
                  <p class="u-text-regular u-mb-2 "><strong><a href="${url}?origin=favourites">${cf.h1_custom}</a></strong></p>
                </div>
                <div class="cell ${item.img ? `large-9` : `large-12`} text-sm">
                  ${snippet}
                </div>
                ${renderImage(item.img, item.title)}
                <div class="cell text-sm u-pt-2" id="favbtns${cf.sid}" data-type="${cf.type}">
                  ${renderFavBtns(consts.showUrlToFavs, cookie, cf.sid)}
                </div>
              </div>
            </div>
          </div>`;
  };

  const renderShared = (item) => {
    if (!item.id) return ``;

    const cf = item.custom_fields || {};
    const data = getDataObject(cf.data);
    const url = data.register ? data.register : item.url;
    const snippet = cf.snippet ? cf.snippet : item.meta_description;
    return `
          <div class="cell medium-4">
            <div class="u-green-line-top u-margin-bottom">
                <p class="u-text-regular u-pt-1"><strong><a href="${url}?origin=shared">${cf.h1_custom}</a></strong></p>
                <div class="u-mb-1"><strong>${cf.type && stir.capitaliseFirst(cf.type)}</strong></div>
                <div class="u-mb-1">${snippet}</div>
    <div data-type="${cf.type}">${
      stir.favourites.isFavourite(cf.sid) ? `<p class="text-sm u-heritage-green">Already in your favourites</p>` : stir.favourites.renderAddBtn(cf.sid, ``)
    }</div>
            </div>
          </div>`;
  };

  const renderShareDialog = (link) => {
    if (!link) return ``;

    return `<p><strong>Share link</strong></p>  
              ${navigator.clipboard ? '<p class="text-xsm">The following share link has been copied to your clipboard:</p>' : ``}  
            <p class="text-xsm">${link}</p>`;
  };

  const renderNoFavs = () => stir.templates.renderNoFavs;

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

    Helpers

   */

  // function formatDate(date) {
  //   if (!date) return "";
  //   return `<b>${new Date(date)
  //     .toLocaleDateString("en-UK", {
  //       day: "numeric",
  //       month: "short",
  //       year: "numeric",
  //     })
  //     .replace(",", "")}</b><br/>`;
  // }

  /* buildFilterObject
   * @param {Array} sids - An array of SID values
   * @returns {Object} - The filter object for the search query
   */
  const buildFilterObject = (sids) => {
    const filterObj = {
      and: [
        {
          or: [],
        },
      ],
    };
    sids.forEach((sid) => {
      filterObj.and[0].or.push({ "custom_fields.sid": sid });
    });

    return filterObj;
  };

  /*
   *
   *   Controllers
   *
   */

  /*
   * doFavouritesTab
   * @param {Object} consts - Configuration constants
   * @param {Object} node - The DOM node to render into
   * @param {Array} favs - The array of favourite items
   */
  function doFavouritesTab(consts, node, favs) {
    const consts2 = {
      ...consts,
      cookieType: node.dataset.favtype || ``,
    };
    const renderer = renderItem(consts2);

    const html = favs.map(renderer).join(``);
    setDOMContent(node, html || `${stir.templates.renderNoFavs}`);

    // Add event listener for search result favorite button clicks
    node.addEventListener("click", handleFavBtnClicks(consts2, node));
  }

  /*
   *
   * Event Handlers
   *
   */

  const handleFavActionButtonClick = (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    if (target.dataset.action === "clearallfavs") {
      if (!target.dataset.fav) return;

      const cookieType = target.dataset.fav;
      const cookieType2 = cookieType === "accommodation" ? "accom" : cookieType;
      stir.favourites.removeType(cookieType);

      const element = document.querySelector(`[data-favtype="${cookieType2}"]`);
      element.innerHTML = renderNoFavs();
    }

    if (target.dataset.action === "copysharelink") {
      const favsCookie = stir.favourites.getFavsListAll();

      const base64Params = favsCookie.map((item) => item.id).join("I");
      const link = "https://www.stir.ac.uk/share/" + base64Params;

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

  /*
   * handleFavBtnClicks
   */
  const handleFavBtnClicks = (consts, nodes) => (event) => {
    const sharedArea = nodes.dataset.activity === "shared";

    const target = event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    const updateFavButtonDisplay = (id) => {
      const cookie = stir.favourites.getFav(id, consts.cookieType);
      const node = stir.node("#favbtns" + id);

      if (node) setDOMContent(node)(renderFavBtns(consts.showUrlToFavs, cookie, id));

      if (sharedArea) {
        const node = target.parentNode;
        if (node) setDOMContent(node)(renderFavBtns(consts.showUrlToFavs, cookie, id));
      }
    };

    if (target.dataset.action === "addtofavs") {
      stir.favourites.addToFavs(target.dataset.id, consts.cookieType);
      updateFavButtonDisplay(target.dataset.id);
    }

    if (target.dataset.action === "removefav") {
      stir.favourites.removeFromFavs(target.dataset.id);
      const element = document.querySelector("#fav-" + target.dataset.id);
      const microelement = document.querySelector("#microfav-" + target.dataset.id);

      if (microelement) microelement.remove();
      if (element) element.remove();

      if (sharedArea) {
        const node = target.parentNode;
        const cookie = stir.favourites.getFav(target.dataset.id, consts.cookieType);
        if (node) setDOMContent(node)(renderFavBtns(consts.showUrlToFavs, cookie, target.dataset.id));
      }

      // if (consts.activity === "managefavs") {
      //   const node = stir.node("#fav-" + target.dataset.id);
      //   if (node) setDOMContent(node)("");
      //   doFavouritesTab(consts, nodes, "latestfavs");
      // }
    }
  };

  /*
   *
   * Controllers
   *
   */

  /*
   * manageSharePage
   */
  function manageSharePage(sharedArea, consts) {
    const sharedList = SafeQueryParams.get("s") || "";

    if (!sharedList) return setDOMContent(sharedArea, renderNoShared());

    try {
      const list = sharedList.split("I");

      const filters = buildFilterObject(list);

      const searchAPI = "https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de";
      const searchUrl = `${searchAPI}?term=*&limit=100&filter=${encodeURIComponent(JSON.stringify(filters))}&`;

      // Funnelback search
      fetch(searchUrl)
        .then((response) => response.json())
        .then((results) => {
          const arrayResults = results?.hits || [];

          if (!arrayResults.length) return;

          const html = arrayResults.map(renderShared).join(``);
          setDOMContent(sharedArea, html || renderNoShared());

          sharedArea.addEventListener("click", handleFavBtnClicks(consts, sharedArea));
        });
    } catch (e) {
      return null;
    }
  }

  function manageFavouritesPage(consts, nodes, action) {
    // Get all favs from the cookie and sort by date Integer
    const favs = stir.favourites.getFavsListAll().sort((a, b) => b.date - a.date);

    const tabNodes = Array.from(document.querySelectorAll("[data-favtype]"));

    if (!favs || !favs.length) {
      tabNodes.forEach((node) => {
        console.log(node);
        setDOMContent(node, renderNoFavs());
        setDOMContent(nodes.latestArea, `<div class="cell">No favourites saved.</div>`);
      });
      return;
    }

    const filters = buildFilterObject(favs.map((fav) => fav.id));

    const searchAPI = "https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de";
    const searchUrl = `${searchAPI}?term=*&limit=100&filter=${encodeURIComponent(JSON.stringify(filters))}&`;

    // Query AddSearch API
    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        // TABS

        const types = tabNodes.map((typeNode) => {
          return typeNode.dataset.favtype || "";
        });

        types.forEach((type) => {
          const node = tabNodes.find((n) => n.dataset.favtype === type);
          const datafavs = data.hits.filter((item) => {
            return item.custom_fields && item.custom_fields.type && item.custom_fields.type.includes(type);
          });

          doFavouritesTab(consts, node, datafavs);
        });

        // LATEST FAVS
        const latestFavs = favs.slice(0, 4); // only the latest 4
        const latestFavsData = latestFavs.map((fav) => {
          return data.hits.find((item) => Number(item.custom_fields.sid) === Number(fav.id));
        });

        const html = latestFavsData.map(renderMicro).join(``);
        setDOMContent(nodes.latestArea, html || `<div class="cell">No favourites saved.</div>`);
      });
  }

  /*
   * Initialization
   * @param {Object} consts - Configuration constants
   * @param {Object} nodes - DOM elements to interact with
   * @returns {void}
   */
  function init(consts, nodes) {
    if (nodes.favBtnsNode) {
      stir.node("main").addEventListener("click", handleFavActionButtonClick);
    }

    if (consts.activity === "managefavs" || consts.activity === "latestfavs") {
      manageFavouritesPage(consts, nodes, consts.activity);
    }

    if (consts.activity === "shared") {
      manageSharePage(nodes.sharedArea, consts);
      stir.node("main").addEventListener("click", handleFavActionButtonClick);
    }
  }

  /* Run initialization */
  init(CONSTS, DOM);
})();

/*





  FavouritePromos



*/
const FavouritePromos = (data) => {
  if (!data || !data.length) return;

  /* renderPromo */
  const renderPromo = (item) => {
    return `
      <div class="u-flex1-large-up u-bg-heritage-berry u-white--all u-flex-large-up flex-dir-column u-gap align-center u-mt-1">
          <div class="u-py-2 flex-container flex-dir-column u-gap">
              <div class="hook hook-skinny hook-right hook-energy-green u-mr-2">
                  <h2 class="header-stripped text-lg u-uppercase  u-pl-2 u-m-0 u-p-0">${item.head}</h2>
              </div>
              <div class="u-px-2">
                  <p class="text-sm u-mb-1">${item.body}</p>
                  <a class="button heritage-green u-cursor-pointer expanded text-sm " href="${item.link}" aria-label="Book your place">${item.button}</a>
              </div>
          </div>
      </div>`;
  };

  /* doPromos */
  function doPromos(data) {
    const promoTypeNodes = stir.nodes("[data-promos]");

    promoTypeNodes.forEach((node) => {
      const promoType = node.getAttribute("data-promos");
      const promos = data.filter((promo) => promo.type === promoType);

      promoHtml = promos.map(renderPromo).join(``);
      stir.setHTML(node, promoHtml);
    });
  }

  /* on load */
  doPromos(data);
};

// Run the FavouritePromos

stir.promosData = stir.promosData || [];

FavouritePromos(stir.promosData);
