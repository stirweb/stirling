(function (scope) {
  if (!stir.favourites) return console.error("[Course Favourites] stir.favourites library not loaded!");

  // GLOBAL VARS
  const COOKIE_TYPE = "page";
  const URL_TO_FAVS = "";

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

  const doFavouriteBtn = (el) => {
    const container = el.closest("[data-nodeid=favbtn]") || null;

    if (!container) return;

    const fav = stir.favourites.getFavsListAll().find((item) => item.id === container.dataset.id);
    setDOMContent(container, fav ? stir.favourites.renderRemoveBtn(fav.id, fav.date, URL_TO_FAVS) : stir.favourites.renderAddBtn(container.dataset.id, URL_TO_FAVS));
  };

  /* 
    Event Handlers
  */
  const clickHandler = (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    const id = scope.dataset.id;
    const cookieType = scope.dataset.type ? scope.dataset.type : COOKIE_TYPE;

    const actions = {
      addtofavs: () => {
        if (id) {
          if (!isInCookie(id)) {
            stir.favourites.addToFavs(id, cookieType);
          }
        }
        doFavouriteBtn(target);
      },
      removefav: () => {
        if (id) {
          stir.favourites.removeFromFavs(id);
          doFavouriteBtn(target.parentElement);
        }
      },
    };

    const action = actions[target.dataset.action];
    if (action) action();
  };

  /*
    On Load
  */

  doFavouriteBtn(scope);
  scope.addEventListener("click", clickHandler);
})(stir.node("[data-nodeid=favbtn]"));
