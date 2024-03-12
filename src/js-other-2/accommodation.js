(function (scope) {
  if (!scope) return;

  const CONSTS = {
    cookieType: "accom",
    urlToFavs: scope.dataset.favsurl ? scope.dataset.favsurl : ``,
    activity: scope.dataset.activity ? scope.dataset.activity : ``,
  };

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const sid = Number(scope.dataset.sid);

  if (!sid) return;

  const isFav = stir.favourites.isFavourite(sid);

  if (isFav) {
    const cookie = stir.favourites.getFav(sid, CONSTS.cookieType);
    const html = stir.favourites.renderRemoveBtn(sid, cookie[0].date, CONSTS.urlToFavs);
    setDOMContent(scope, html);
  } else {
    const html = stir.favourites.renderAddBtn(sid, CONSTS.urlToFavs);

    setDOMContent(scope, html);
  }

  /* Actions: Cookie btn clicks  */
  scope.addEventListener("click", (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    /* Add */
    if (target.dataset.action === "addtofavs") {
      stir.favourites.addToFavs(target.dataset.id, CONSTS.cookieType);
      const cookie = stir.favourites.getFav(target.dataset.id, CONSTS.cookieType);
      setDOMContent(scope, stir.favourites.renderRemoveBtn(sid, cookie[0].date, CONSTS.urlToFavs));
    }

    /* Remove */
    if (target.dataset.action === "removefav") {
      stir.favourites.removeFromFavs(target.dataset.id);
      setDOMContent(scope, stir.favourites.renderAddBtn(sid, ""));
    }
  });
})(stir.node("#favsBtn"));
