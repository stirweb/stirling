/*
   Environment object so we don't have to repeat switch commands with hostnames etc
 */

var UoS_env = (function () {
  var hostname = window.location.hostname;

  const funnelback = {
    stirling: "search.stir.ac.uk", // CNAME alias
    public: "stir-search.clients.uk.funnelback.com", // Public alias
    shared: "shared-15-24-search.clients.uk.funnelback.com", // FQDN
    staging: "stage-shared-15-24-search.clients.uk.funnelback.com", // Staging server
  };

  var env_name = "prod";
  var wc_path = "/media/dist/";
  var t4_tags = false;
  var search = funnelback.stirling;

  switch (hostname) {
    case "localhost":
      env_name = "dev";
      wc_path = "/medias/Categorised/Dist/";
      search = funnelback.staging;
      break;

    case "stiracuk-cms01-production.terminalfour.net":
      env_name = "preview";
      wc_path = "";
      t4_tags = true;
      break;

    case "stiracuk-cms01-test.terminalfour.net":
      env_name = "appdev-preview";
      wc_path = "";
      t4_tags = true;
      search = funnelback.staging;
      break;

    case "stir.ac.uk":
      env_name = "pub";
      break;

    case "stirweb.github.io":
      env_name = "qa";
      wc_path = "/medias/Categorised/Dist/";
      search = funnelback.staging;
      break;
  }

  switch (window.location.port) {
    case "3000":
    case "8000":
      env_name = "dev";
      wc_path = "/medias/Categorised/Dist/";
  }

  return {
    name: env_name,
    wc_path: wc_path,
    t4_tags: t4_tags,
    search: search,
  };
})();

/*
    This is a function to called when opening a widget, and contains handlers
    to close other widgets. So we don't have to go through the entire site adding
    widget close instructions everywhere, we can do it with a single call and just
    update here
    @param exception {string} The name here of the widget to ignore, but close others
   */

var UoS_closeAllWidgetsExcept = (function () {
  var widgetRequestClose = document.createEvent("Event");
  widgetRequestClose.initEvent("widgetRequestClose", true, true);

  var handlers = {
    breadcrumbs: function () {
      var bcItems = document.querySelectorAll(".breadcrumbs > li");
      if (bcItems)
        Array.prototype.forEach.call(bcItems, function (item) {
          item.classList.remove("is-active");
        });
    },
    courseSearchWidget: function () {
      var cs = document.getElementById("course-search-widget__wrapper");
      if (cs) {
        cs.classList.remove("stir__slidedown");
        cs.classList.add("stir__slideup");
      }
    },
    megamenu: function () {
      var hnp = document.querySelector(".c-header-nav--primary a");
      hnp && hnp.classList.remove("c-header-nav__link--is-active");
    },
    internalDropdownMenu: function () {
      var idm = document.getElementById("internal-dropdown-menu");
      idm && idm.classList.remove("is-active");
    },
    internalSignpost: function () {
      var isds = document.getElementById("internal-signpost-dropdown__submenu");
      isds && isds.classList.add("hide");
      var isdl = document.getElementById("internal-signpost-dropdown__link");
      isdl && isdl.classList.remove("is-active");
    },
  };

  return function (exception) {
    // new way: dispatch a close request to any open (listening) widgets:
    document.dispatchEvent(widgetRequestClose);

    // old way: cycle through each close handler and close any widgets
    // other than the exception. Exception will be undefined if all widgets
    // are supposed to close.
    for (var name in handlers) {
      if (handlers.hasOwnProperty(name) && name !== exception) {
        handlers[name]();
      }
    }
  };
})();
document.body.addEventListener("click", UoS_closeAllWidgetsExcept);

/*
    Helper object to let us do adaptive page loading (e.g. megamenu, mobile menu)
    UoS_AWD is framework agnostic, so we'll pass in values from Foundation here
   */
/*
    Replaces the object from Foundation.util.MediaQuery.js
    https://get.foundation/sites/docs/media-queries.html
    eg Foundation.MediaQuery.current & Foundation.MediaQuery.get (not in use)
    Just migrating what we use ie stir.MediaQuery.current and the dispatch event
   */

var stir = stir || {};

stir.MediaQuery = (function () {
  var MediaQueryChangeEvent;

  var breakpoints = {
    small: 640,
    medium: 1024,
    large: 1240,
    xlarge: 1440,
    xxlarge: Infinity,
  };

  /*
       Get the current breakpoint eg "small", "medium" ...
     */
  function getCurrent() {
    var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    for (var index in breakpoints) {
      if (breakpoints.hasOwnProperty(index) && vw <= breakpoints[index]) break;
    }
    return index;
  }

  /*
       Check viewport size and dispatch an event if it has changed since last time.
     */
  function checkCurrent() {
    var size = getCurrent();
    if (size !== stir.MediaQuery.current) {
      stir.MediaQuery.current = size;
      window.dispatchEvent(MediaQueryChangeEvent);
    }
  }

  /*
       Set up custom event "MediaQueryChange".
     */
  if (typeof Event === "function") {
    MediaQueryChangeEvent = new Event("MediaQueryChange"); // Event API version
  } else {
    MediaQueryChangeEvent = document.createEvent("Event"); // IE version
    MediaQueryChangeEvent.initEvent("MediaQueryChange", true, true);
  }

  /*
       Listen for (debounced) resize events and re-check the viewport against the named breakpoints.
     */
  window.addEventListener("resize", stir.debounce(checkCurrent, 150));

  return {
    current: getCurrent(),
  };
})();
