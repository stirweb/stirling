var stir = stir || {};

stir.coursefavs = (() => {
  if (!stir.favourites) return console.error("[Course Favourites] stir.favourites library not loaded");

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
      RENDERERS
  */

  // renderMiniFav - used on the share page
  const renderMiniFav = (item) =>
    !item.metaData
      ? ``
      : `<p class="text-sm">
            <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title} ${item.metaData.ucas ? " - " + item.metaData.ucas : ""}</a></strong>
        </p>`;

  const getHeaderItem = (header, content, classes) => (!content ? `` : `<div class="cell medium-4"><strong class="u-heritage-green">${header}</strong><p class="${classes}">${content.split("|").join(", ")}</p></div>`);

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

  const renderMicro = stir.curry((item) => {
    return !item.metaData
      ? ``
      : `<div class="cell large-4  "  data-sid="${item.metaData.sid}" > 
            <div class="u-green-line-top">
                  <div class="flex-container flex-dir-column u-gap u-mt-1">
                    <p class=" u-m-0">
                      <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title} ${item.metaData.ucas ? " - " + item.metaData.ucas : ""}</a></strong>
                    </p>
                    <p class="u-m-0 text-sm">${item.metaData.c}</p>
                  </div>
                  <div class="flex-container align-middle u-gap-8 u-mt-1">
                  ${stir.favourites.renderRemoveBtn(item.metaData.sid, item.dateSaved, "")}
                  </div>
            </div>
          </div>`;
  });

  const renderNoFavs = () => stir.templates.renderNoFavs;

  const renderLinkToFavs = () => stir.templates.renderLinkToFavs;

  const renderFavActionBtns = () => stir.templates.renderFavActionBtns;

  const renderNoShared = () => stir.templates.renderNoShared;

  const renderShared = (item) =>
    !item.metaData
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

  const renderShareDialog = (link) =>
    !link
      ? ``
      : ` <p><strong>Share link</strong></p>  
          ${navigator.clipboard ? '<p class="text-xsm">The following share link has been copied to your clipboard:</p>' : ""}   
          <p class="text-xsm">${link}</p>`;

  /*
      HELPERS
  */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const cleanQueryParam = (param) => {
    if (typeof param !== "string") return "";
    return param.replace(/[^a-zA-Z0-9-_]/g, ""); // Remove any non-alphanumeric characters except hyphen and underscore
  };

  const SafeQueryParams = {
    get: (key) => cleanQueryParam(QueryParams.get(key)),
    set: (key, value) => QueryParams.set(key, cleanQueryParam(value)),
    remove: QueryParams.remove,
  };

  const getfavsCookie = () => stir.favourites.getFavsList(COOKIE_TYPE);

  const isInCookie = (courseId) => stir.favourites.isFavourite(courseId);

  const getFavsList = (data) => {
    const favsCookie = getfavsCookie();
    if (!favsCookie.length) return null;

    const sortedCookie = favsCookie.sort((a, b) => b.date - a.date);
    return sortedCookie.map((item) => ({
      ...data.find((element) => element.metaData && element.metaData.sid === item.id),
      id: item.id,
      dateSaved: item.date,
    }));
  };

  const getShareList = (data) => {
    const sharedListQuery = SafeQueryParams.get("c") || "";
    if (!sharedListQuery) return null;

    try {
      const sharedList = atob(sharedListQuery);
      return sharedList.split(",").map((item) => ({
        ...data.find((element) => element.metaData && element.metaData.sid === item),
        id: item,
      }));
    } catch (e) {
      return null;
    }
  };

  /*
       CONTROLLERS
   */

  const doFavsCurry = stir.curry((nodes, data) => {
    if (!nodes || !nodes.favsArea) return;
    const list = getFavsList(data);

    const view = stir.templates && stir.templates.view ? stir.templates.view : ``;
    const renderer = view === `micro` ? renderMicro : renderFav;

    if (!list) return !setDOMContent(nodes.favsArea, renderNoFavs());

    nodes.favBtns && setDOMContent(nodes.favBtns, renderFavActionBtns());
    return setDOMContent(nodes.favsArea, list.map(renderer).join(""));
  });

  const doFavs = doFavsCurry(NODES);

  const doSharedCurry = stir.curry((nodes, data) => {
    if (!nodes) return;

    if (nodes.sharedArea) {
      const shareList = getShareList(data);
      setDOMContent(nodes.sharedArea, shareList ? shareList.map(renderShared).join("") : renderNoShared());
    }

    if (nodes.sharedfavArea) {
      const list = getFavsList(data);
      setDOMContent(nodes.sharedfavArea, list ? list.map(renderMiniFav).join("") + renderLinkToFavs() : renderNoFavs());
    }
  });

  const doShared = doSharedCurry(NODES);

  const doCourseBtn = (el) => {
    const container = el.closest("[data-nodeid=coursefavsbtn]") || el;
    if (!container) return;

    const fav = getfavsCookie().find((item) => item.id === el.dataset.id);
    const urlToFavs = container.dataset.favsurl || "";

    setDOMContent(container, fav ? stir.favourites.renderRemoveBtn(fav.id, fav.date, urlToFavs) : stir.favourites.renderAddBtn(el.dataset.id, urlToFavs));
  };

  // Container for functions that will be defined after the data callback
  const async = {};

  // Event Handlers
  const clickHandler = (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    const actions = {
      addtofavs: () => {
        if (!isInCookie(target.dataset.id)) {
          stir.favourites.addToFavs(target.dataset.id, COOKIE_TYPE);
        }
        async.doShared && async.doShared();
        async.doFavs && async.doFavs();
        doCourseBtn(target);
      },
      removefav: () => {
        const id = target.dataset.id;
        if (id) {
          stir.favourites.removeFromFavs(id);
          async.doFavs && async.doFavs();
          doCourseBtn(target.parentElement);
        }
      },
      clearallfavs: () => {
        stir.favourites.removeType(COOKIE_TYPE);
        async.doFavs && async.doFavs();
      },
      copysharelink: () => {
        const favsCookie = getfavsCookie();
        const base64Params = btoa(favsCookie.map((item) => item.id).join(","));
        const link = "https://www.stir.ac.uk/share/" + base64Params;
        navigator.clipboard && navigator.clipboard.writeText(link);

        const dialog = stir.t4Globals.dialogs.find((item) => item.getId() === "shareDialog");
        if (dialog) {
          dialog.open();
          dialog.setContent(renderShareDialog(link));
        }
      },
    };

    const action = actions[target.dataset.action];
    if (action) action();
  };

  const createCourseBtnHTML = (sid, url) => {
    const el = document.createElement("div");
    el.setAttribute("data-id", sid);
    el.setAttribute("data-favsurl", url);
    doCourseBtn(el);
    return el.innerHTML;
  };

  const fetchData = (url) => {
    stir.getJSON(url, (data) => {
      const results = data.response.resultPacket.results || [];
      async.doFavs = () => doFavs(results);
      async.doShared = () => doShared(results);

      async.doShared();
      async.doFavs();

      stir.node("main").addEventListener("click", clickHandler);
    });
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
const shouldAutoInit = [() => stir.node("#coursefavsarea"), () => stir.node("#coursesharedarea"), () => stir.nodes("#coursefavsbtn").length].some((fn) => fn());

if (shouldAutoInit) stir.coursefavs.auto();
