var stir = stir || {};

stir.coursefavs = (() => {
  if (!stir.favourites) return console.error("[Course Favourites] stir.favourites library not loaded");

  // GLOBAL VARS
  const COOKIE_TYPE = "course";
  const URL_TO_FAVS = "/favourites/";

  /*
      HELPERS
  */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const isInCookie = (courseId) => stir.favourites.isFavourite(courseId);

  /*
       CONTROLLERS
   */

  const doCourseBtn = (el) => {
    const container = el.closest("[data-nodeid=coursefavsbtn]") || el;
    if (!container) return;

    const fav = stir.favourites.getFavsListAll().find((item) => item.id === el.dataset.id);

    setDOMContent(container, fav ? stir.favourites.renderRemoveBtn(fav.id, fav.date, URL_TO_FAVS) : stir.favourites.renderAddBtn(el.dataset.id, URL_TO_FAVS));
  };

  // Container for functions that will be defined after the data callback
  //const async = {};

  /* 
    Event Handlers
  */
  const clickHandler = (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    const actions = {
      addtofavs: () => {
        if (!isInCookie(target.dataset.id)) {
          //const el = target.closest(".c-search-result");
          stir.favourites.addToFavs(target.dataset.id, COOKIE_TYPE);
        }

        doCourseBtn(target);
      },
      removefav: () => {
        const id = target.dataset.id;
        if (id) {
          stir.favourites.removeFromFavs(id);
          doCourseBtn(target.parentElement);
        }
      },
    };

    const action = actions[target.dataset.action];
    if (action) action();
  };

  /*
    createCourseBtnHTML
  */
  const createCourseBtnHTML = (sid, url) => {
    const el = document.createElement("div");
    el.setAttribute("data-id", sid);
    el.setAttribute("data-favsurl", url);
    doCourseBtn(el);
    return el.innerHTML;
  };

  /*
    fetchData
  */
  const fetchData = (url) => {
    //   stir.getJSON(url, (data) => {
    //     const results = data.response.resultPacket.results || [];
    //     async.doFavs = () => doFavs(results);
    //     async.doShared = () => doShared(results);
    //     async.doShared();
    //     async.doFavs();
    //     stir.node("main").addEventListener("click", clickHandler);
    //   });
  };

  // Public API
  return {
    auto: () => fetchData(URL),
    isFavourite: isInCookie,
    doCourseBtn,
    createCourseBtnHTML,
    attachEventHandlers: () => stir.node("main").addEventListener("click", clickHandler),
  };
})();

// Auto-initialization
//const shouldAutoInit = [() => stir.node("#coursefavsarea"), () => stir.node("#coursesharedarea"), () => stir.nodes("#coursefavsbtn").length].some((fn) => fn());

//if (shouldAutoInit) stir.coursefavs.auto();
