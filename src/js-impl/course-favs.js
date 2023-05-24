var stir = stir || {};

stir.favs = (() => {
  // NODES
  const NODES = {
    coursefavsbtns: stir.nodes('[data-nodeid="coursefavsbtn"]'),
    favsArea: stir.node("#coursefavsarea"),
    favBtns: stir.node("#coursefavbtns"),
    sharedArea: stir.node("#coursesharedarea"),
    sharedfavArea: stir.node("#coursesharedfavsarea"),
  };

  // VARS
  const cookieId = "favs=";
  const cookieExpiryDays = 365;
  const host = "https://search.stir.ac.uk";
  const sf = ["c", "award", "code", "delivery", "faculty", "image", "level", "modes", "pathways", "sid", "start", "subject", "ucas"];
  const url = host + "/s/search.json?collection=stir-courses&query=!nullpadre&fmo=true&num_ranks=2000&SF=[" + sf.join(",") + "]&";

  /*
      |
      |   RENDERERS
      |
      */

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
      : `
          <div class="c-search-result" data-rank="" data-sid="${item.metaData.sid}" data-result-type="course">
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
             ${renderRemoveBtn(item.metaData.sid, item.dateSaved)}
            </div>
          </div>`;
  });

  const renderRemoveBtn = (sid, dateSaved) => {
    return ` 
          <button id="removefavbtn-${sid}" class="u-heritage-green  u-cursor-pointer flex-container u-gap-8 align-middle" aria-label="Remove from favourites" data-action="removefav" data-id="${sid}">
            ${renderActiveIcon()}
          </button>
          <span>Favourited ${getDaysAgo(new Date(dateSaved))}</span>`;
  };

  const renderAddBtn = (sid) => {
    return ` 
          <button
              class="u-heritage-green u-cursor-pointer u-line-height-default flex-container u-gap-8 align-middle"
              data-action="addtofavs" aria-label="Add to your favourites" data-id="${sid}" id="addfavbtn-${sid}">
              ${renderInactiveIcon()}
              <span class="u-heritage-green u-underline u-inline-block u-pb-1">Add
                  to your favourites</span>
          </button>`;
  };

  const renderNoFavs = () => `<p>Nothing saved here yet. <a href="/courses/">View courses</a> and add them to your favourites. </p>`;
  const renderNoShared = () => `<div class="cell"><p>No courses have been shared with you.</p><p><a href="/courses/">Main course search</a></p></div>`;
  const renderLinkToFavs = () => `<hr><p class="text-sm u-arrow"><a href="/courses/favourites/">Manage my favourites</a></p>`;

  const renderFavActionBtns = () => {
    return `
          <button class="button no-arrow button--left-align  expanded u-m-0 text-left  u-white--all u-mt-1" data-opendialog="shareDialog" aria-label="Generate share link" data-action="copysharelink" >
              <div class="flex-container align-middle u-gap-16">
                  <span class="u-flex1 text-sm">Generate share link</span>
                  <span class="uos-chevron-right u-icon"></span>
              </div>
          </button>

          <button class="button no-arrow button--left-align  expanded u-m-0 text-left u-bg-black u-white--all u-mt-1" aria-label="Clear favourites"  data-action="clearallfavs" >
              <div class="flex-container align-middle u-gap-16">
                  <span class="u-flex1 text-sm">Clear favourites</span>
                  <span class="uos-chevron-right u-icon"></span>
              </div>
          </button>`;
  };

  const renderInactiveIcon = () => {
    return `<svg version="1.1" data-stiricon="heart-active" fill="currentColor"
              viewBox="0 0 50 50" style="width:22px;height:22px;" >
              <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2c0,0-0.1,0-0.1,0c-3,0-5.8,1.2-7.9,3.4
               c-4.3,4.5-4.2,11.7,0.2,16l18.1,18.1c0.5,0.5,1.6,0.5,2.1,0l17.9-17.9c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
               C47.5,15,46.3,12.2,44.1,10.1z M42,24.2l-17,17l-17-17c-3.3-3.3-3.3-8.6,0-11.8c1.6-1.6,3.7-2.4,5.9-2.4c2.2-0.1,4.4,0.8,6,2.5
               l4.1,4.1c0.6,0.6,1.5,0.6,2.1,0l4.2-4.2c3.4-3.2,8.5-3.2,11.8,0C45.3,15.6,45.3,20.9,42,24.2z"/>
            </svg>`;
  };

  const renderActiveIcon = () => {
    return `<svg version="1.1" data-stiricon="heart-inactive"  fill="currentColor" 
             viewBox="0 0 50 50" style="width:22px;height:22px;" >
            <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2h-0.1c-3,0-5.8,1.2-7.9,3.4
        c-4.3,4.5-4.2,11.7,0.2,16L24,44.4c0.5,0.5,1.6,0.5,2.1,0L44,26.5c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
        C47.5,15,46.3,12.2,44.1,10.1z"/>
           </svg> `;
  };

  const renderShared = (item) => {
    return !item.metaData
      ? ``
      : `<div class="cell small-6">
            <div class="u-green-line-top u-margin-bottom">
              <p class="u-text-regular u-py-1">
              <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title}</a></strong>
              </p>
              <div class="u-mb-1">${item.metaData.c}</div>
              <${isInCookie(item.metaData.sid) ? `div` : `button`}  class="u-w-full u-heritage-green ${isInCookie(item.metaData.sid) ? `` : `u-heritage-green u-cursor-pointer `}u-mt-1 flex-container u-gap-8 align-middle" data-action="${isInCookie(item.metaData.sid) ? `` : `addtofavs`}" data-id="${item.metaData.sid}">
              ${isInCookie(item.metaData.sid) ? renderActiveIcon() : renderInactiveIcon()}
              <span class="u-heritage-green${isInCookie(item.metaData.sid) ? `` : ` u-underline u-line-height-default`}">
              ${isInCookie(item.metaData.sid) ? `Already in my favourites` : `Add to my favourites`}
              </span>
              </${isInCookie(item.metaData.sid) ? `div` : `button`}>
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
      |   HELPERS
      |
      */

  /* 
      |
      |    getDaysAgo : Returns a String  
      |
      */
  const getDaysAgo = (createdOn) => {
    const today = new Date();
    const msInDay = 24 * 60 * 60 * 1000;

    createdOn.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = Math.floor((+today - +createdOn) / msInDay);
    const dayText = diff > 1 ? `days` : `day`;

    return diff === 0 ? `today` : `${diff} ${dayText} ago`;
  };

  /* 
      |
      |   setDOMContent : Returns a Boolean  
      |
      */
  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /* 
      |
      |    getExpiryDate: Returns a String (cookie expiry date)  
      |
      */
  const getExpiryDate = (days) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);

    return ";expires=" + d.toUTCString();
  };

  /* 
      |
      |    getfavsCookie: Returns an array of course objects
      |
      */
  const _getfavsCookie = (cookieId) => {
    const favCookie = document.cookie
      .split(";")
      .filter((i) => i.includes(cookieId))
      .map((i) => i.replace(cookieId, ""));
    return favCookie.length ? JSON.parse(favCookie) : [];
  };
  const getfavsCookie = () => _getfavsCookie(cookieId);

  /*
      |
      |     isInCookie: Returns a boolean
      |
      */
  const isInCookie = (courseId) => {
    return getfavsCookie()
      .map((item) => item.id)
      .includes(courseId);
  };

  /*
      |
      |    getFavsList: Returns an array of course objects 
      |
      */
  const getFavsList = (data) => {
    //curry so we don't need to pass data
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
      |
      |   Returns an array of course objects 
      |
      */
  const getShareList = (data) => {
    const sharedListQuery = QueryParams.get("c") || "";
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
      |
      |   doFavs : Returns null 
      |
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
      |
      |    doShared : Returns null 
      |
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
    if (!el || !el.dataset || !el.dataset.id) return;

    const fav = getfavsCookie().filter((item) => item.id === el.dataset.id);

    if (fav.length) {
      setDOMContent(el, renderRemoveBtn(fav[0].id, fav[0].date));
      return;
    }

    setDOMContent(el, renderAddBtn(el.dataset.id));
    return;
  };
  /*
       |
       |  createCourseBtnHTML : returns String (HTML)
       | 
       */
  const createCourseBtnHTML = (sid) => {
    const el = document.createElement("div"); // temporary element
    el.setAttribute("data-id", sid); // attribute needed for doCourseBtn() validation
    doCourseBtn(el); // generate the button

    return el.innerHTML; // pass back to course template
  };

  /**
   *
   * Container for functions that will be defined after the data callback
   */
  const async = {};

  /* 
      |
      |   fetchData : Returns null 
      |
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

  const fetchData = () => _fetchData(url);

  /* EVENT LISTENER */
  function clickHandler(event) {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");
    if (!target || !target.dataset || !target.dataset.action) return;

    /* ACTION: ADD a FAV */
    if (target.dataset.action === "addtofavs") {
      if (!isInCookie(target.dataset.id)) {
        const favsCookie2 = [...getfavsCookie(), { id: target.dataset.id, date: Date.now() }];
        document.cookie = cookieId + JSON.stringify(favsCookie2) + getExpiryDate(cookieExpiryDays) + ";path=/";
      }

      async.doShared && async.doShared();
      async.doFavs && async.doFavs();
      doCourseBtn(target.parentElement);
    }

    /* ACTION: REMOVE a FAV */
    if ("removefav" === target.dataset.action) {
      const id = target.dataset.id ? target.dataset.id : null;

      if (id && id.length) {
        const favsCookie = JSON.stringify(getfavsCookie().filter((item) => item.id !== id));
        document.cookie = cookieId + favsCookie + getExpiryDate(cookieExpiryDays) + ";path=/";
        async.doFavs && async.doFavs();
        doCourseBtn(target.parentElement);
      }
    }

    /* ACTION: REMOVE ALL FAVS */
    if ("clearallfavs" === target.dataset.action) {
      document.cookie = cookieId + JSON.stringify([]) + getExpiryDate(0) + ";path=/";
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

  /**
   * attachEventHandlers : public, returns null
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

/**
 * Automatically intitalise if the following nodes are detected:
 */
if (stir.node("#coursefavsarea") || stir.node("#coursesharedarea") || stir.nodes("#coursefavsbtn").length) {
  stir.favs.auto(); // `.auto()` replaces `new stir.Favs()`
}
