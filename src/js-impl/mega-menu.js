/**
 * MEGAMENU
 * Load megamenu only if above certain breakpoint
 * If the megamenu html fails to load the links will just do their default behaviour
 * e.g. goto /study landing page
 *  REMOVE JQUERY
 */

(function () {
  var url;
  var KEY_ESC = 27;
  var mm = document.getElementById("megamenu__container__dev") || document.getElementById("megamenu__container");

  if (!mm) return;

  switch (UoS_env.name) {
    case "dev":
      url = "/pages/data/awd/megamenu.html";
      break;

    case "qa":
      url = "/stirling/pages/data/awd/megamenu.html";
      break;

    case "preview":
    case "production":
      url = "https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/2834";
      break;

    case "app-preview":
    case "appdev-preview":
    case "test":
      url = "https://stiracuk-cms01-test.terminalfour.net/terminalfour/preview/1/en/2834";
      break;

    default: // live
      url = "/developer-components/includes/template-external/mega-menu/";
      break;
  }

  function initMegamenu() {
    var primaryNav = document.querySelector("#layout-header .c-header-nav--primary");
    var mainSections = document.querySelectorAll(".megamenu__links > ul > li > a");

    for (var i = 0; i < mainSections.length; i++) {
      mainSections[i].insertAdjacentText("afterbegin", "Visit ");
      mainSections[i].insertAdjacentText("beforeend", " home");
    }

    /**
     * @var active_class The CSS class name to use to style the active megamenu
     */
    var active_class = "c-header-nav__link--is-active";

    // prevent click propagating up through to body (which will close the mm)
    mm.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    Array.prototype.forEach.call(document.querySelectorAll(".megamenu"), function (el) {
      el.classList && el.classList.add("animation-slide");
      el.setAttribute("tabindex", -1);
      manageTabIndex(el, false);
    });

    const mm_clicked = function (e) {
      e.preventDefault();
      e.stopPropagation();

      var id, mm;
      id = e.target.getAttribute("aria-controls");
      id && (mm = document.querySelector("#" + id));

      // if related megamenu found, prevent defaults and apply behaviour
      if (mm) {
        /**
         * If the megamenu related to this link item is already open, close it.
         * If it is not already open, close any that are, then open this one.
         */
        if (mm.classList && mm.classList.contains("animation-slide__down")) {
          mmSlideUp(mm);
        } else {
          mmSlideUpAll();
          mmSlideDown(mm);
        }

        e.target.classList && e.target.classList.toggle(active_class);
      } else {
        UoS_closeAllWidgetsExcept();
      }
    };

    function mmSlideDown(el) {
      if (!el || !el.classList) return;
      el.classList.remove("animation-slide__up");
      el.classList.add("animation-slide__down");
      manageTabIndex(el, true);
      mmFocusFirstElement(el);
      // listen for 'close' requests
      document.addEventListener("widgetRequestClose", closing);
      document.addEventListener("keyup", escaping);
    }
    function mmSlideUp(el) {
      if (!el || !el.classList) return;
      el.classList.add("animation-slide__up");
      el.classList.remove("animation-slide__down");
      manageTabIndex(el, false);
      // stop listening for 'close' requests
      document.removeEventListener("keyup", escaping);
      document.removeEventListener("widgetRequestClose", closing);
      el.id && returnFocus(el.id);
    }
    function mmSlideUpAll() {
      unhighlight();
      Array.prototype.forEach.call(document.querySelectorAll(".megamenu.animation-slide__down"), function (el) {
        mmSlideUp(el);
      });
    }
    function mmFocusFirstElement(el) {
      const focusable = el.querySelector("a,button,input");
      focusable && focusable.focus();
    }
    function unhighlight() {
      Array.prototype.forEach.call(primaryNav.querySelectorAll("." + active_class), function (el) {
        el.classList && el.classList.remove(active_class);
      });
    }
    function manageTabIndex(mm, state) {
      Array.prototype.forEach.call(mm.querySelectorAll("a"), function (el) {
        state ? el.removeAttribute("tabindex") : el.setAttribute("tabindex", -1);
      });
    }
    const returnFocus = (id) => {
      const el = document.querySelector(`[aria-controls="${id}"]`);
      el && el.focus();
    };

    primaryNav.querySelectorAll("[data-menu-id]").forEach((nav) => {
      const mmid = nav.getAttribute("data-menu-id");
      const mmel = mm.querySelector(`#${mmid}`);
      if (mmid && mmel) {
        nav.setAttribute("aria-controls", mmid);
      }
    });

    primaryNav.addEventListener("click", mm_clicked);

    function escaping(event) {
      if (event.keyCode === KEY_ESC) mmSlideUpAll();
    }

    function closing() {
      unhighlight();
      mmSlideUp(document.querySelector(".megamenu.animation-slide__down"));
    }

    {
      /* Megamenu "subpage" scrolling behaviour */
      var megalinks = document.querySelectorAll(".megamenu .megamenu__links");

      function pan(sibling, positive, event) {
        var dollyTrack = this.parentNode.querySelector("ul > li > ul");
        var distance = positive ? dollyTrack.scrollWidth - dollyTrack.clientWidth : 0;
        stir.scroll.call(dollyTrack, 0, distance);
        this.style.display = "none";
        sibling && (sibling.style.display = "block");
        event.preventDefault();
      }

      for (var i = 0; i < megalinks.length; i++) {
        var prev = megalinks[i].querySelector(".megamenu__prev-button");
        var next = megalinks[i].querySelector(".megamenu__next-button");
        if (prev && next) {
          prev.onclick = pan.bind(prev, next, false);
          next.onclick = pan.bind(next, prev, true);
        }
      }
    }

    loaded = true;
  }

  /**
   * Only load the MegaMenu if the viewport is (currently) larger than 1240px.
   */
  var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  if (vw >= 1240) {
    stir.load(url, function (data) {
      if (data && !data.error) {
        mm.innerHTML = data;
        initMegamenu();
      } else {
        console.error("Unable to load MegaMenu");
      }
    });
  }
})();

/*
  Tempate Favourites
*/

const TempateFavs = () => {
  const COOKIE_ID = "favs=";
  const FB_URL = "https://search.stir.ac.uk/s/search.json?collection=stir-main&SF=[sid,type,award]&query=&meta_sid_or=";

  /* 
      renderCourseLink: Returns an array of html strings 
  */
  const renderCourseLink = (item) => `<li><a href="${item.url}">${item.title}</></li>`;

  /* 
      renderIcon: Returns a html strings 
  */
  const renderIcon = () => {
    return `<svg version="1.1" data-stiricon="heart-active" fill="currentColor" viewBox="0 0 50 50" >
                  <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2h-0.1c-3,0-5.8,1.2-7.9,3.4 c-4.3,4.5-4.2,11.7,0.2,16L24,44.4c0.5,0.5,1.6,0.5,2.1,0L44,26.5c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
C47.5,15,46.3,12.2,44.1,10.1z"></path>
              </svg>`;
  };

  /* 
      getfavsCookie: Returns an array of objects 
  */
  function getfavsCookie(cookieId) {
    const favCookie = document.cookie
      .split(";")
      .filter((i) => i.includes(cookieId))
      .map((i) => i.replace(cookieId, ""));

    return favCookie.length ? JSON.parse(favCookie) : [];
  }

  /* 
      getFavsList: Returns an array of objects. PARAM: cookieType = accomm, course etc 
  */
  function getFavsList(cookieType, cookieId) {
    const favsCookieAll2 = getfavsCookie(cookieId);

    const favsCookieAll = favsCookieAll2.map((item) => {
      if (!item.type) item.type = "course";
      return item;
    });

    const favsCookie = favsCookieAll.filter((item) => item.type === cookieType);

    if (!favsCookie.length || favsCookie.length < 1) return [];
    return favsCookie.sort((a, b) => b.date - a.date);
  }

  /*
      Controller
  */
  function initMega(cookieId, fbUrl) {
    const favCourses = getFavsList("course", cookieId);

    if (!favCourses.length) return;

    const query = favCourses
      .filter((item) => Number(item.id))
      .map((item) => item.id)
      .join("+");
    const fbUrlFull = fbUrl + query;

    stir.getJSON(fbUrlFull, (results) => {
      const arrayResults = results?.response?.resultPacket?.results || [];
      if (!arrayResults.length) return;

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
              date: favCourses.filter((fav) => fav.id === item)[0].date,
              title: (element.metaData.award ? element.metaData.award : "") + " " + element.title.split(" | ")[0],
              url: element.liveUrl + `?orgin=datacoursefavs`,
            };
          });
      });

      const courses = stir.flatten(favList).sort((a, b) => b.date - a.date);

      // Make sure Megamenu has loaded then insert the links
      stir.nodes("[data-coursefavs]").forEach((element) => {
        element.insertAdjacentHTML("beforeend", `<ul class="no-bullet text-sm">${courses.map(renderCourseLink).join("")}</ul>`);
      });
    });
  }

  /*
      Controller
  */
  function initHeader(cookieId, iconNodes) {
    const favs = getfavsCookie(cookieId);

    if (!iconNodes.length || !favs.length) return;

    iconNodes.forEach((element) => {
      stir.setHTML(element, renderIcon());
    });
  }

  /*
      On Load
  */

  const iconNodes = stir.nodes("[data-stiricon=heart-inactive]");

  initHeader(COOKIE_ID, iconNodes);

  const callbackMegaMenu = (mutationList, observer) => {
    for (const mutation of mutationList) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.id == "mm__study") {
          initMega(COOKIE_ID, FB_URL);
        }
      }
    }
  };

  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(callbackMegaMenu);

  observer.observe(stir.node("#megamenu__container"), config);
};

TempateFavs();
