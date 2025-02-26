const FavouritesArea = (scope, cookieType) => {
  if (!scope) return;

  const resultsArea = scope.querySelector("[data-activity]");

  if (!resultsArea) return;

  // Constants
  const CONSTS = {
    allowedCookieTypes: ["accom", "course", "schol", "page"],
    cookieType: cookieType,
    showUrlToFavs: resultsArea.dataset.favsurl || ``,
    activity: resultsArea.dataset.activity || ``,
    view: stir.templates?.view || ``,
    fbhost: UoS_env.name === "prod" || UoS_env.name === "dev2" ? "https://search.stir.ac.uk" : "https://stage-shared-15-24-search.clients.uk.funnelback.com",
  };

  // DOM Elements
  const DOM_ELEMENTS = {
    resultsArea: resultsArea,
    sharedArea: scope.querySelector("[data-activity=shared]"),
    favBtnsNode: scope.querySelector("[data-area=favActionBtns]"),
    latestArea: stir.node("[data-activity=latestfavs]"),
  };

  /* 
        Rendering Functions
    */

  const renderMicro = (consts) => (item) => {
    return `<div class="cell large-3 text-sm u-bg-white u-p-1 u-mb-1">
                <p class="u-text-regular  "><strong><a href="${item.url}">${item.title}</a></strong></p>
                 <p><strong>${item.type && stir.capitaliseFirst(item.type)}</strong></p>
            </div>`;
  };

  const renderImage = (img, title) => {
    if (!img) return ``;
    return `<div class="cell large-3">
                <div><img src="${img}" width="760" height="470" alt="Image of ${title}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
            </div>`;
  };

  const renderFavBtns = (showUrlToFavs, cookie, id) => (cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date, showUrlToFavs) : stir.favourites.renderAddBtn(id, showUrlToFavs));

  const renderItem = (consts) => (item) => {
    if (!item) return ``;
    const cookie = stir.favourites.getFav(item.id, consts.cookieType);
    return `
          <div class="cell" id="fav-${item.id}">
            <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
              <div class="grid-x grid-padding-x u-p-2 ">
                <div class="cell u-pt-1">
                  <p class="u-text-regular u-mb-2 "><strong><a href="${item.url}">${item.title}</a></strong></p>
                </div>
                <div class="cell ${item.img ? `large-9` : `large-12`} text-sm">
                  ${item.content}
                </div>
                ${renderImage(item.img, item.title)}
                <div class="cell text-sm u-pt-2" id="favbtns${item.id}" data-type="${item.type}">
                  ${renderFavBtns(consts.showUrlToFavs, cookie, item.id)}
                </div>
              </div>
            </div>
          </div>`;
  };

  const renderShared = (item) =>
    !item.id
      ? ``
      : `
          <div class="cell medium-4">
            <div class="u-green-line-top u-margin-bottom">
                <p class="u-text-regular u-pt-1"><strong><a href="${item.url}">${item.title}</a></strong></p>
                <div class="u-mb-1"><strong>${stir.capitaliseFirst(item.type)}</strong></div>
                <div class="u-mb-1">${item.content}</div>
                <div data-type="${item.type}">${stir.favourites.isFavourite(item.id) ? `<p class="text-sm u-heritage-green">Already in your favourites</p>` : stir.favourites.renderAddBtn(item.id, ``)}</div>
            </div>
          </div>`;

  const renderShareDialog = (link) =>
    !link
      ? ``
      : `
          <p><strong>Share link</strong></p>  
          ${navigator.clipboard ? '<p class="text-xsm">The following share link has been copied to your clipboard:</p>' : ``}   
          <p class="text-xsm">${link}</p>`;

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

  function formatDate(date) {
    if (!date) return "";
    return `<b>${new Date(date)
      .toLocaleDateString("en-UK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(",", "")}</b><br/>`;
  }

  /**
    Generates a URL based on the element type and metadata
    @param {Object} element - The element containing metadata and URL information
    @returns {string} The formatted URL with origin parameter
   */
  function getUrl(element) {
    const ORIGIN_PARAM = "?origin=favourites";
    const { metaData, liveUrl } = element;

    if (!metaData?.type) {
      return liveUrl + ORIGIN_PARAM;
    }

    const elementType = metaData.type.toLowerCase();

    const URL_MAPPINGS = {
      event: () => metaData.page + ORIGIN_PARAM,
      webinar: () => metaData.register + ORIGIN_PARAM,
    };

    return (URL_MAPPINGS[elementType] || (() => liveUrl + ORIGIN_PARAM))();
  }

  /* 

    Controller Functions

  */

  function doFavourites(consts, domElements, action) {
    const favs = stir.favourites.getFavsListAll();

    if (!favs.length) {
      setDOMContent(domElements.resultsArea, `<div class="cell">No favourites saved.</div>`);
      return;
    }

    const view = domElements.resultsArea.dataset.view || ``;
    const renderer = view === "micro" ? renderMicro(consts) : renderItem(consts);

    const query = favs
      .filter((item) => Number(item.id))
      .map((item) => item.id)
      .join("+");

    const fbUrl = `${consts.fbhost}/s/search.json?collection=stir-main&num_ranks=50&SF=[sid,type,award,startDate,endDate,register,page]&query=&meta_sid_or=${query}`;
    console.log(fbUrl);
    // Funnelback search
    stir.getJSON(fbUrl, (results) => {
      const arrayResults = results?.response?.resultPacket?.results || [];

      if (!arrayResults.length) return;

      console.log(arrayResults);

      const favList = query.split("+").map((item) => {
        return arrayResults
          .filter((element) => {
            if (Number(item) === Number(element.metaData.sid)) {
              return item;
            }
          })
          .map((element) => {
            return {
              id: item,
              date: favs.filter((fav) => fav.id === item)[0].date,
              title: (element.metaData.award ? element.metaData.award : "") + " " + element.title.split(" | ")[0],
              content: formatDate(element.metaData.startDate) + element.summary,
              url: getUrl(element),
              type: element.metaData.type ? element.metaData.type : "page",
            };
          });
      });

      // Latest Favs
      if (action === "latestfavs") {
        const recentFavs = stir
          .flatten(favList)
          .sort((a, b) => b.date - a.date)
          .slice(0, 4);

        const html = recentFavs.map(renderMicro(consts)).join(``);
        return setDOMContent(domElements.latestArea)(html || ``);
      }

      //  By Type
      const filteredData = stir
        .flatten(favList)
        .filter((item) => item.type && item.type.toLowerCase().includes(consts.cookieType.toLowerCase()))
        .sort((a, b) => b.date - a.date);

      if (!filteredData.length) {
        setDOMContent(domElements.resultsArea, renderNoFavs());
      } else {
        setDOMContent(domElements.resultsArea, filteredData.map(renderer).join(``));
      }
    });
  }

  /*
    doShared
  */
  function doShared(sharedArea, consts) {
    const sharedListQuery = SafeQueryParams.get("s") || "";
    if (!sharedListQuery) return setDOMContent(sharedArea, renderNoShared());

    try {
      const sharedList = atob(sharedListQuery);
      const query = sharedList.replaceAll(",", "+");

      const fbUrl = `${consts.fbhost}/s/search.json?collection=stir-main&num_ranks=50&SF=[sid,type,award,startDate,endDate,register,page]&query=&meta_sid_or=${query}`;

      // Funnelback search
      stir.getJSON(fbUrl, (results) => {
        const arrayResults = results?.response?.resultPacket?.results || [];
        if (!arrayResults.length) return;

        const sharedList2 = sharedList.split(",").map((item) => {
          return arrayResults
            .filter((element) => {
              if (Number(item) === Number(element.metaData.sid)) {
                return item;
              }
            })
            .map((element) => {
              return {
                id: item,
                date: Date.now(),
                title: (element.metaData.award ? element.metaData.award : "") + " " + element.title.split(" | ")[0],
                content: element.summary,
                url: element.liveUrl + `?orgin=shared`,
                type: element.metaData.type ? element.metaData.type : "page",
              };
            });
        });

        if (!sharedList2) {
          setDOMContent(sharedArea, renderNoShared());
        } else {
          setDOMContent(sharedArea, stir.flatten(sharedList2).map(renderShared).join(``));
        }
      });
    } catch (e) {
      return null;
    }
  }

  /* 
            Event Handlers
        */

  const handleFavActionButtonClick = (consts, domElements) => (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    if (target.dataset.action === "clearallfavs") {
      if (target.dataset.fav !== consts.cookieType) return;

      stir.favourites.removeType(consts.cookieType);
      doFavourites(consts, domElements, target.dataset.action);
      doFavourites(consts, domElements, "latestfavs");
    }

    if (target.dataset.action === "copysharelink") {
      const favsCookie = stir.favourites.getFavsListAll();

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

  /* handleSearchResultFavClick */
  const handleSearchResultFavClick = (consts, domElements) => (event) => {
    const target = event.target.closest("button");
    if (!target || !target.dataset || !target.dataset.action) return;

    const updateFavButtonDisplay = (id) => {
      const cookie = stir.favourites.getFav(id, consts.cookieType);
      const node = stir.node("#favbtns" + id);
      if (node) setDOMContent(node)(renderFavBtns(consts.showUrlToFavs, cookie, id));
      if (domElements.sharedArea) doShared(domElements.sharedArea, consts);
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
        doFavourites(consts, domElements, "latestfavs");
      }
    }
  };

  /* 
      Initialization
   */
  function init(consts, domElements) {
    if (consts.activity === "managefavs" || consts.activity === "latestfavs") {
      doFavourites(consts, domElements, consts.activity);
    }

    if (consts.activity === "shared") {
      doShared(domElements.sharedArea, consts);
    }

    // Add event listeners for favorites
    if (domElements.favBtnsNode) {
      stir.node("main").addEventListener("click", handleFavActionButtonClick(consts, domElements));
    }

    // Add event listener for search result favorite button clicks
    domElements.resultsArea.addEventListener("click", handleSearchResultFavClick(consts, domElements));
  }

  /* Run initialization */
  init(CONSTS, DOM_ELEMENTS);
};

// Run the FavouritesArea
FavouritesArea(stir.node("#acccomArea"), "accommodation");
FavouritesArea(stir.node("#courseArea"), "course");
FavouritesArea(stir.node("#scholArea"), "scholarship");
FavouritesArea(stir.node("#pageArea"), "page");
FavouritesArea(stir.node("#eventArea"), "event");
FavouritesArea(stir.node("#webinarArea"), "webinar");
FavouritesArea(stir.node("#latestFavs"), "all");

const FavouritePromos = () => {
  const renderPromo = (item) => {
    return `
      <div class="u-flex1-large-up u-bg-heritage-berry u-white--all u-flex-large-up flex-dir-column u-gap align-center u-mt-1">
          <div class="u-py-2 flex-container flex-dir-column u-gap">
              <div class=" hook hook-right hook-energy-green u-mr-2">
                  <h2 class=" text-lg u-uppercase  u-pl-2 u-m-0 u-p-0">${item.head}</h2>
              </div>
              <div class="u-px-2">
                  <p class="text-sm u-mb-1">${item.body}</p>
                  <a class="button heritage-green u-cursor-pointer expanded text-sm " href="${item.link}" aria-label="Book your place">${item.button}</a>
              </div>
          </div>
      </div>`;
  };

  /* doPromos */
  function doPromos(promosData) {
    const promoTypeNodes = stir.nodes("[data-promos]");

    promoTypeNodes.forEach((node) => {
      const promoType = node.getAttribute("data-promos");
      const promos = promosData.filter((promo) => promo.type === promoType);

      promoHtml = promos.map(renderPromo).join(``);
      stir.setHTML(node, promoHtml);
    });
  }

  doPromos(promosData);
};

FavouritePromos();
