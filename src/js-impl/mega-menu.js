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

    case "app-preview":
      url = "https://t4appdev.stir.ac.uk/terminalfour/preview/1/en/2834";
      break;

    case "appdev-preview":
      url = "https://t4appdev.stir.ac.uk/terminalfour/preview/1/en/2834";
      break;

    case "qa":
      url = "/stirling/pages/data/awd/megamenu.html";
      break;

    case "preview":
      url = "https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/2834";
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
      const el = document.querySelector(`[aria-controls="${id}"],[data-menu-id=${id}]`);
      console.info("return focus", el);
      if (!el) return;
      el.focus();
    };

    primaryNav.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var id, mm;
      id = e.target.getAttribute("aria-controls") || e.target.getAttribute("data-menu-id");
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
    });

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
