var stir = stir || {};

stir.coursefavs = (() => {

  if(!stir.favourites) return console.error('[Course Favourites] stir.favourites library not loaded');

  // NODES
  const NODES = {
    favsArea: stir.node("#coursefavsarea"),
    favBtns: stir.node("#coursefavbtns"),
    sharedArea: stir.node("#coursesharedarea"),
    sharedfavArea: stir.node("#coursesharedfavsarea"),
  };

  // VARS
  const COOKIE_TYPE = "course";

  const host = "https://search.stir.ac.uk";
  const sf = ["c", "award", "code", "delivery", "faculty", "image", "level", "modes", "pathways", "sid", "start", "subject", "ucas"];
  const URL = host + "/s/search.json?collection=stir-courses&query=!nullpadre&fmo=true&num_ranks=2000&SF=[" + sf.join(",") + "]&";

  /*
    |
    |   RENDERERS
    |
  */

  /* renderMiniFav - used on the share page */
  const renderMiniFav = (item) => {
    return !item.metaData
      ? ``
      : `<p class="text-sm">
            <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title} ${item.metaData.ucas ? " - " + item.metaData.ucas : ""}</a></strong>
        </p>`;
  };

  const getHeaderItem = (header, content, classes) => {
    return !content ? `` : `<div class="cell medium-4"><strong class="u-heritage-green">${header}</strong><p class="${classes}">${content.split("|").join(", ")}</p></div>`;
  };

  const renderFav = stir.curry((item) => {
    return !item.metaData
      ? ``
      : `<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank="" data-sid="${item.metaData.sid}" data-result-type="course">
            <div class=" c-search-result__tags">
              <span class="c-search-tag">${item.metaData.level.replace("module", "CPD and short courses")}</span>
            </div>
            <div class="flex-container flex-dir-column u-gap u-mt-1">
              <p class="u-text-regular u-m-0">
                <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title} ${item.metaData.ucas ? " - " + item.metaData.ucas : ""}</a></strong>
              </p>
              <p class="u-m-0">${item.metaData.c}</p>
              <div class="c-search-result__meta grid-x u-mt-1">
                ${getHeaderItem("Start dates", item.metaData.start, "")}
                ${getHeaderItem("Study modes", item.metaData.modes, "u-sentence-case")}
                ${getHeaderItem("Delivery", item.metaData.delivery, "u-sentence-case")}
             </div>
            </div>
            <div class="flex-container align-middle u-gap-8 u-mt-1">
             ${stir.favourites.renderRemoveBtn(item.metaData.sid, item.dateSaved, "")}
            </div>
          </div>`;
  });

  const renderNoFavs = () => stir.templates.renderNoFavs;
  const renderLinkToFavs = () => stir.templates.renderLinkToFavs;
  const renderFavActionBtns = () => stir.templates.renderFavActionBtns;
  const renderNoShared = () => stir.templates.renderNoShared;

  const renderShared = (item) => {
    return !item.metaData
      ? ``
      : `<div class="cell small-6">
            <div class="u-green-line-top u-margin-bottom">
              <p class="u-text-regular u-py-1">
                <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title}</a></strong>
              </p>
              <div class="u-mb-1">${item.metaData.c}</div>
              <div>${stir.favourites.isFavourite(item.metaData.sid) ? `<p class="text-sm u-heritage-green">Already in my favourites</p>` : stir.favourites.renderAddBtn(item.metaData.sid, "")}</div>
            </div>
          </div>`;
  };

  const renderShareDialog = (link) => {
    return !link
      ? ``
      : ` <p><strong>Share link</strong></p>  
          ${navigator.clipboard ? '<p class="text-xsm">The following share link has been copied to your clipboard:</p>' : ""}   
          <p class="text-xsm">${link}</p>`;
  };

  /*
  |
  |  HELPERS
  |
  */

  /*
     createCourseBtnHTML : returns String (HTML)
   */
  const createCourseBtnHTML = (sid) => {
    const el = document.createElement("div"); // temporary element
    el.setAttribute("data-id", sid); // attribute needed for doCourseBtn() validation
    doCourseBtn(el); // generate the button

    return el.innerHTML; // pass back to course template
  };

  /* 
      setDOMContent : Returns a Boolean  
  */
  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /* 
      getfavsCookie: Returns an array of course objects
  */
  const _getfavsCookie = () => stir.favourites.getFavsList(COOKIE_TYPE);

  const getfavsCookie = () => _getfavsCookie();

  /*
      isInCookie: Returns a boolean
  */
  const isInCookie = (courseId) => stir.favourites.isFavourite(courseId);

  /*
      getFavsList: Returns an array of course objects 
  */
  const getFavsList = (data) => {
    const favsCookie = getfavsCookie();

    if (!favsCookie.length || favsCookie.length < 1) {
      return null;
    }

    const favsCookieSorted = favsCookie.sort((a, b) => b.date - a.date);
    // Maintain ordering by merging FB result into cookie object
    return favsCookieSorted.map((item) => {
      return {
        ...data.filter((element) => {
          if (item.id === element.metaData.sid) return element;
        })[0],
        ...{ id: item.id, dateSaved: item.date },
      };
    });
  };

  /* 
    Returns an array of course objects 
  */
  const getShareList = (data) => {
    const sharedListQuery = QueryParams.get("c") || "";

    if (!sharedListQuery) return null;

    try {
      // wrap in a try{} to catch any Base64 errors
      const sharedList = atob(sharedListQuery);
      // Maintain ordering by merging FB result into cookie object
      return sharedList.split(",").map((item) => {
        return {
          ...data.filter((element) => {
            if (item === element.metaData.sid) return element;
          })[0],
          ...{ id: item },
        };
      });
    } catch (e) {
      /* URL param not Base64? */ return;
    }
  };

  /*
    |
    |   CONTROLLERS
    |
   */

  /* 
      doFavs : Returns null 
  */
  const doFavsCurry = stir.curry((nodes, data) => {
    if (!nodes || !nodes.favsArea) return;
    const list = getFavsList(data);

    if (!list) {
      return !setDOMContent(nodes.favsArea, renderNoFavs());
    }

    nodes.favBtns && setDOMContent(nodes.favBtns, renderFavActionBtns());
    return setDOMContent(nodes.favsArea, list.map(renderFav).join(""));
  });

  const doFavs = doFavsCurry(NODES);

  /* 
       doShared : Returns null 
   */
  const doSharedCurry = stir.curry((nodes, data) => {
    if (!nodes) return;

    if (nodes.sharedArea) {
      const shareList = getShareList(data);

      if (!shareList) {
        setDOMContent(nodes.sharedArea, renderNoShared());
      } else {
        setDOMContent(nodes.sharedArea, shareList.map(renderShared).join(""));
      }
    }

    if (nodes.sharedfavArea) {
      const list = getFavsList(data);
      if (!list) {
        setDOMContent(nodes.sharedfavArea, renderNoFavs());
      } else {
        setDOMContent(nodes.sharedfavArea, list.map(renderMiniFav).join("") + renderLinkToFavs());
      }
    }
    return;
  });

  const doShared = doSharedCurry(NODES);

  /* 
      |
      |   doCourseBtn : Returns null
      |   [now using the private member `cookieId` instead of
      |   a passed-in value to make it easier to reuse this
      |   function from an external call.] 2023-05-02
      |
  */
  const doCourseBtn = (el) => {
    const container = el.closest("[data-id]");

    if (!container) return;

    const fav = getfavsCookie().filter((item) => item.id === el.dataset.id);
    const urlToFavs = container.dataset.favsurl ? container.dataset.favsurl : "";

    if (fav.length) {
      setDOMContent(container, stir.favourites.renderRemoveBtn(fav[0].id, fav[0].date, urlToFavs));
      return;
    }

    setDOMContent(container, stir.favourites.renderAddBtn(el.dataset.id, urlToFavs));
    return;
  };

  /**
   *
   * Container for functions that will be defined after the data callback
   */
  const async = {};

  /* 
    fetchData : Returns null 
  */
  const _fetchData = (url) => {
    stir.getJSON(url, (data) => {
      /* Curry-in the course data now so that these functions can be called again later */
      async.doFavs = () => {
        doFavs(data.response.resultPacket.results || []);
      };
      async.doShared = () => {
        doShared(data.response.resultPacket.results || []);
      };

      /* On Load */
      async.doShared();
      async.doFavs();

      attachEventHandlers();
    });
  };

  const fetchData = () => _fetchData(URL);

  /* 

    EVENT LISTENER 
  
    */
  function clickHandler(event) {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");
    if (!target || !target.dataset || !target.dataset.action) return;

    /* ACTION: ADD a FAV */
    if (target.dataset.action === "addtofavs") {
      if (!isInCookie(target.dataset.id)) {
        stir.favourites.addToFavs(target.dataset.id, COOKIE_TYPE);
      }

      async.doShared && async.doShared();
      async.doFavs && async.doFavs();
      doCourseBtn(target);
    }

    /* ACTION: REMOVE a FAV */
    if ("removefav" === target.dataset.action) {
      const id = target.dataset.id ? target.dataset.id : null;

      if (id && id.length) {
        stir.favourites.removeFromFavs(id);
        async.doFavs && async.doFavs();
        doCourseBtn(target.parentElement);
      }
    }

    /* ACTION: REMOVE ALL FAVS */
    if ("clearallfavs" === target.dataset.action) {
      stir.favourites.removeType(COOKIE_TYPE);
      async.doFavs && async.doFavs();
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
  }

  /*
      attachEventHandlers : public, returns null
   */
  function attachEventHandlers() {
    stir.node("main").addEventListener("click", clickHandler);
  }

  /*
      | 
      |  PUBLIC METHODS
      |
  */
  return {
    auto: () => fetchData(),
    isFavourite: isInCookie,
    doCourseBtn: doCourseBtn,
    createCourseBtnHTML: createCourseBtnHTML,
    attachEventHandlers: attachEventHandlers,
  };
})();

stir.favs = stir.coursefavs;

/**
 *
 * Automatically intitalise if the following nodes are detected:
 *
 */
if (stir.node("#coursefavsarea") || stir.node("#coursesharedarea") || stir.nodes("#coursefavsbtn").length) {
  stir.coursefavs.auto();
}
