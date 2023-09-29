var stir = stir || {};

stir.capitaliseFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/*
 * Function: Ajax Helper Function
 **/
stir.load = function (url, callback) {
  if (typeof url == "undefined") return;
  if (typeof callback != "function") callback = function () {};

  var request = new XMLHttpRequest();
  request.open("GET", url, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      callback.call(null, request.responseText);
    } else {
      callback.call(null, {
        error: {
          status: request.status,
          statusText: request.statusText,
        },
      });
    }
  };

  request.onerror = function (event) {
    callback.call(null, {
      error: event,
    });
  };

  request.ontimeout = function (event) {
    callback.call(null, {
      error: event,
    });
  };

  request.send();
  return request;
};

stir.getJSONp = function (url, onload, onerror) {
  if (typeof url == "undefined") return;
  const script = document.createElement("script");
  if ("function" === typeof onload) script.onload = onload;
  if ("function" === typeof onerror) script.onerror = onerror;
  script.src = url;
  document.head.appendChild(script);
};

stir.loadAuthenticated = function (url, callback) {
  if (typeof url == "undefined") return;
  if (typeof callback != "function") callback = function () {};

  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.withCredentials = true;

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      callback.call(null, request.responseText);
    } else {
      callback.call(null, {
        error: {
          status: request.status,
          statusText: request.statusText,
        },
      });
    }
  };

  request.onerror = function (event) {
    callback.call(null, {
      error: event,
    });
  };

  request.ontimeout = function (event) {
    callback.call(null, {
      error: event,
    });
  };

  request.send();

  return request;
};

stir.getJSON = function (url, callback) {
  return stir.load(url, function (data) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      data = {
        error: error,
      };
    }
    callback.call(null, data);
  });
};

stir.getJSONAuthenticated = function (url, callback) {
  stir.loadAuthenticated(url, function (data) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      data = {
        error: error,
      };
    }
    callback.call(null, data);
  });
};

stir.Math = {
  fileSize: (bytes, fixedPoint) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(isNaN(fixedPoint) ? 2 : fixedPoint) * 1 + ["B", "kB", "MB", "GB", "TB"][i];
  },
  random: (max) => Math.floor(Math.random() * max),
};

stir.Number = {
  clamp: function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  },
  formatMoney: function formatMoney(c, d, t) {
    var n = this,
      c = isNaN((c = Math.abs(c))) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
      j = (j = i.length) > 3 ? j % 3 : 0;
    return (
      s +
      (j ? i.substr(0, j) + t : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
      (c
        ? d +
          Math.abs(n - i)
            .toFixed(c)
            .slice(2)
        : "")
    );
  },
};

/**
 * Library functions for Strings
 */
stir.String = {
  rot: function rot(s, i) {
    // modified for general rot# from
    // http://stackoverflow.com/a/617685/987044
    return s.replace(/[a-zA-Z]/g, function (c) {
      return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + i) ? c : c - 26);
    });
  },
  slug: (input) =>
    String(input)
      .toLowerCase()
      .replace(/[^a-z]+/g, "-"),
  embolden: function boldicise(haystack, needle) {
    return haystack.replace(new RegExp(needle, "gi"), "<b>" + needle + "</b>"); //legit use of <b> not <strong>
  },
  truncate: function truncate(n, useWordBoundary) {
    if (this.length <= n) {
      return this;
    }
    var subString = this.substr(0, n - 1);
    return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "&hellip;";
  },
  htmlEntities: function htmlEntities(str) {
    //return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&"+"quot;");
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, ["&", "quot;"].join(""));
  },
  stripHtml: function stripHtml(dirtyString) {
    var doc = new DOMParser().parseFromString(dirtyString, "text/html");
    return doc.body.textContent || "";
  },
  getFirstFromSplit: function getFirstFromSplit(delimiter) {
    if (this.indexOf(delimiter) > -1) {
      return this.split(delimiter)[0].trim();
    }
    return this;
  },
  domify: (HTMLString) => new DOMParser().parseFromString(HTMLString, "text/html").body,
};

/**
 * Additional String function
 * Created separately because it refers to other stir.String helper functions.
 */
stir.String.fixHtml = (function () {
  /**
   * fixHtml() is intended to fix broken/partial HTML strings coming from the
   * Degree Program Tables (SSoCI) and possibly other short snippets of HTML.
   * As a side-effect it could be used to strip out non-text content such as
   * <script> tags, for example. Relies on three internal helper functions,
   * domify(), wrapRawNodes() and removeEmptyElements().
   */

  /**
   * Use the browser's DOM parser to make sense of the HTMLString, but away from the
   * main DOM so we can make further adjustments. Returns an HTMLDocument's body element.
   */
  const domify = stir.String.domify;

  /**
   * Wrap any raw (i.e. text content) nodes into <p> tags. This is immediate
   * children only, not recursive.
   */
  function wrapRawNodes(DomEl) {
    if (!DomEl || !DomEl.childNodes) return;
    Array.prototype.forEach.call(DomEl.childNodes, function (node) {
      if (3 === node.nodeType || "A" === node.nodeName) {
        var p = document.createElement("p");
        node.parentNode.insertBefore(p, node);
        p.appendChild(node);
      }
    });
    return DomEl;
  }

  /**
   * SSoCI entries tend to have mismatched </p> tags which leads to
   * empty <p></p> tag pairs. We'll strip them out:
   */
  function removeEmptyElements(DomEl) {
    if (!DomEl || !DomEl.childNodes) return;
    Array.prototype.forEach.call(DomEl.childNodes, function (node) {
      if (1 === node.nodeType && "" === node.innerText) {
        DomEl.removeChild(node);
      }
    });
    return DomEl;
  }

  /**
   * This is the only exposed function within fixHTML.
   * @param dirtyString {String} This is the input HTML in string format.
   * @param returnDomFrag {Boolean} return a DOM fragment instead of a string. Defaults to string.
   */
  return function fixHtml(dirtyString, returnDomFrag) {
    var domNodes = removeEmptyElements(wrapRawNodes(domify(dirtyString)));
    var frag = stir.DOM.frag(domNodes);
    return returnDomFrag ? frag : frag.textContent;
  };
})();

/**
 * Library functions for working with the DOM
 */
stir.DOM = {
  frag: (nodes) => {
    const frag = document.createDocumentFragment();
    while (nodes.firstChild) {
      frag.appendChild(nodes.firstChild);
    }
    return frag;
  },
};

/**
 * Library functions for working with Arrays
 */
stir.Array = {
  oxfordComma: function oxfordComma(items, oxford, adjoiner) {
    var nonEmptyItems = items.filter((item) => item);
    return nonEmptyItems.length > 1 ? [nonEmptyItems.slice(0, -1).join(", "), nonEmptyItems.slice(-1)].join((oxford ? "," : "") + (adjoiner ? " " + adjoiner + " " : " and ")) : nonEmptyItems.slice(-1).toString();
  },
  getRandomVal: function () {
    return this[Math.floor(Math.random() * this.length)];
    // example usage: var randomItem = stir.Array.getRandomVal.call( arrayOfItems );
  },
};

/**
 * Library functions for working with Objects
 */
stir.Object = {
  extend: function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
      }
    }

    return out;
  },
};

// e.g. stir.Object.extend({}, objA, objB);

/**
 * DATE HANDLING
 */

stir.Date = (() => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  //const abrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const abrDay = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

  const newsDate = (date) => `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  const galleryDate = (date) => `${abrDay[date.getDay()]} ${date.getDate()} ${months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
  const funnelbackDate = (date) => `${date.getDate()}${months[date.getMonth()].slice(0, 3)}${date.getFullYear()}`;
  const timeElementDatetime = (date) => `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
  const time24 = (date) => `${date.getHours()}:${(date.getMinutes() + "0").slice(0, 2)}`;
  const swimTimetable = (date) => `${days[date.getDay()]}: ${date.getDate()} ${months[date.getMonth()]}`;

  return {
    newsDate: newsDate,
    galleryDate: galleryDate,
    funnelbackDate: funnelbackDate,
    time24: time24,
    timeElementDatetime: timeElementDatetime,
    swimTimetable: swimTimetable,
  };
})();

stir.formatStirDate = stir.Date.galleryDate;

/*
 * Function: Determine if a date is BST or GMT
 * Parameter should be a JavaScript Date Object
 */
stir.BSTorGMT = function (d) {
  var objBST = [
    { year: 2021, start: 20210328, end: 20211031 },
    { year: 2022, start: 20220327, end: 20221030 },
    { year: 2023, start: 20230326, end: 20231029 },
    { year: 2024, start: 20240331, end: 20241027 },
    { year: 2025, start: 20250330, end: 20251026 },
    { year: 2026, start: 20260329, end: 20261025 },
    { year: 2027, start: 20270328, end: 20271031 },
    { year: 2028, start: 20280326, end: 20281029 },
    { year: 2029, start: 20290325, end: 20291028 },
  ];

  if (Object.prototype.toString.call(d) === "[object Date]") {
    var start, end;
    var year = String(d.getFullYear());
    var month = String(d.getMonth() + 1);
    var day = String(d.getDate());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var date = parseInt(year + month + day);

    for (var i = 0; i < objBST.length; i++) {
      item = objBST[i];
      if (item.year === parseInt(year)) {
        start = item.start;
        end = item.end;
        break;
      }
    }

    if (date >= start && date <= end) return "BST";

    return "GMT";
  }
  console.error("Parameter one of stir.BSTorGMT() should be a JavaScript Date Object");
  return "";
};

stir.createDOMFragment = function (htmlStr) {
  if (!htmlStr) return;

  return document.createRange().createContextualFragment(htmlStr);

  //var frag = document.createDocumentFragment();
  //var temp = document.createElement("div");
  //temp.innerHTML = htmlStr;

  // while (temp.firstChild) {
  //   frag.appendChild(temp.firstChild);
  // }

  //return frag;
};

stir.createDOMElement = function (htmlStr) {
  if (!htmlStr) {
    return;
  }
  var temp = document.createElement("div");
  temp.innerHTML = htmlStr;
  return temp;
};

stir.addScript = function (src) {
  var script = document.createElement("script");
  script.src = src;
  document.body.insertAdjacentElement("beforeend", script);
};

stir.addStyle = function (href) {
  var link = document.createElement("link");
  link.href = href;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.insertAdjacentElement("beforeend", link);
};

stir.animate = function (el, animation) {
  if (!el) return;
  if ("undefined" == el.classList) return;

  switch (animation) {
    case "slideDown":
      el.classList.add("animation__show");
      el.classList.add("animation__slidedown");
      el.classList.remove("animation__hide");
      break;
  }
};

/*
 * Observe a DOM element, and trigger a function when it
 * scrolls (past a given threshold) into view.
 *
 * @param options object properties:
 * element – the element we want to observe
 * threshold – how far into the viewport it must scroll to trigger the function
 * callback – the function to be triggered
 */
stir.createIntersectionObserver = function (options) {
  if (!options) return;
  var thresholds = options.threshold || [0.7]; //set a default threshold
  var callbacks = [];

  if (typeof thresholds != "object") thresholds = [thresholds];

  if ("function" != typeof options.callback) {
    options.callback = function (intersectionObserverEntry) {
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].call(options.element, intersectionObserverEntry);
      }
    };
  }

  // just trigger the callback now if IntObs not available…
  if (!("IntersectionObserver" in window)) {
    return options.callback.call(options.element, {
      intersectionRatio: -1,
    });
  }

  // …otherwise we'll queue it up to be triggered on-scroll:
  var observer = new IntersectionObserver(
    function (entries) {
      for (var id in entries) {
        if (entries.hasOwnProperty(id)) {
          options.callback.call(entries[id].target, entries[id]);
        }
      }
    },
    {
      root: options.root || null,
      threshold: thresholds,
    }
  );

  // attach the observer to the observee
  options.element && observer.observe(options.element);

  var _setClassAdd = function (classname) {
    callbacks.push(function (intersectionObserverEntry) {
      for (var i = 0; i < thresholds.length; i++) {
        if (intersectionObserverEntry.intersectionRatio >= thresholds[i]) {
          options.element.classList.add(classname);
        }
      }
    });
    return this;
  };
  var _setClassRemove = function (classname) {
    callbacks.push(function (intersectionObserverEntry) {
      for (var i = 0; i < thresholds.length; i++) {
        if (intersectionObserverEntry.intersectionRatio >= thresholds[i]) {
          options.element.classList.remove(classname);
        }
      }
    });
    return this;
  };
  var _setClassToggle = function (classname) {
    callbacks.push(function () {
      if (options.element.classList.contains(classname)) {
        options.element.classList.remove(classname);
      } else {
        options.element.classList.add(classname);
      }
    });
    return this;
  };

  // return a reference to the observer in case we want to
  // do something else with it, e.g. add more observees:
  return {
    observer: observer,
    setClassToggle: _setClassToggle,
    setClassAdd: _setClassAdd,
    setClassRemove: _setClassRemove,
  };
};

stir.lazyJS = (nodes, file, t4MediaId, env) => {
  const nodesInUse = nodes.filter((item) => stir.node(item));
  if (!nodesInUse.length) return;

  const scriptSrc = env.includes("preview") ? `<t4 type="media" id="${t4MediaId}" formatter="path/*" />` : UoS_env.wc_path + "js/other/" + file;

  nodesInUse.forEach((item) => {
    let observer = stir.createIntersectionObserver({
      element: stir.node(item),
      threshold: [0.001],
      callback: function (entry) {
        if (entry.isIntersecting) {
          stir.addScript(scriptSrc);
          observer && observer.observer.unobserve(this);
        }
      },
    });
  });
};

stir.cardinal = (function () {
  var numberWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  return function cardinal(ordinal) {
    return numberWords[parseInt(ordinal)] || "";
  };
})();

// is an element currently visible or not
stir.elementIsHidden = function (el) {
  var style = window.getComputedStyle(el);
  return style.display === "none" || style.visibility === "hidden";
};

/* 
  Feedback message used by various scripts
*/
stir.getMaintenanceMsg = function () {
  var node = document.createElement("div");

  node.appendChild(
    stir.createDOMFragment(`
      <div class="callout">
        <h3 class="header-stripped">Offline for maintenance</h3>
        <p>We are carrying out some essential maintenance work on our website today, which means that 
        some of our web pages are currently unavailable. We&rsquo;re sorry for any inconvenience and we 
        hope to restore full service as soon as possible.</p>
        <p>See how to <a href="https://www.stir.ac.uk/about/contact-us/">contact us</a></p>
      </div>`)
  );

  return node.firstElementChild;
};

// Scroll the window to the element's position
// Offset is optional.
stir.scrollToElement = function (el, offsetUp) {
  offsetUp = offsetUp || 0;
  stir.scrollTo(el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offsetUp, 0);
};

// Detects browser then use the supported method of window.scroll()
stir.scroll = (function () {
  if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident/7.0") != -1 || navigator.userAgent.indexOf("Edge") != -1) {
    return function (y, x) {
      if (this.scroll) {
        this.scroll(x, y);
      } else {
        this.scrollLeft = x;
        this.scrollTop = y;
      }
    };
  }
  return function (top, left) {
    this.scroll({
      top: top,
      left: left,
      behavior: "smooth",
    });
  };
})();

stir.scrollTo = stir.scroll.bind(null);

stir.research = {
  hub: (() => {
    const orgUnitFacultyMap = {
      "Faculty of Arts and Humanities": ["Arts", "Communications, Media and Culture", "English Studies", "History and Politics", "Literature and Languages", "Law and Philosophy", "Philosophy", "French", "History", "Law", "Politics", "Religion", "Spanish"],
      "Faculty of Health Sciences and Sport": ["Health Sciences Stirling", "Sport", "Institute for Social Marketing", "NMAHP"],
      "Faculty of Natural Sciences": ["Computing Science", "Institute of Aquaculture", "Biological and Environmental Sciences", "Psychology", "Computing Science and Mathematics", "Machrihanish"],
      "Faculty of Social Sciences": ["Education", "Sociology, Social Policy & Criminology", "Social Work", "Dementia and Ageing", "Dementia Services Development Centre"],
      "Stirling Management School": ["Accounting & Finance", "Economics", "Management, Work and Organisation", "Marketing & Retail"],
    };
    const getFacultyFromOrgUnitName = (oUName) => {
      const name = oUName.replace(" - Division", "");
      for (const faculty in orgUnitFacultyMap) {
        if (name == faculty || orgUnitFacultyMap[faculty].indexOf(name) >= 0) {
          return faculty;
        }
      }
      return "University of Stirling";
    };

    return { getFacultyFromOrgUnitName: getFacultyFromOrgUnitName };
  })(),
};

/*
 * Manager class for loading activity indicator.
 */
stir.Spinner = function Spinner(el) {
  this.element = document.createElement("div");
  this.element.classList.add("c-search-loading__spinner");
  this.element.classList.add("show-for-medium");
  this.element.classList.add("hide");

  if (el && el.nodeType === 1) {
    el.appendChild(this.element);
  }
  this.show = function () {
    this.element.classList.remove("hide");
  };
  this.hide = function () {
    this.element.classList.add("hide");
  };
};

/*
 * Manager class for "togglable widgets" i.e. the search box and results panel.
 */
stir.ToggleWidget = function ToggleWidget(el, showClass, hideClass) {
  this.show = function show() {
    el.removeAttribute("aria-hidden");
    el.removeAttribute("tabindex");
    showClass && el.classList.add(showClass);
    hideClass && el.classList.remove(hideClass);
  };
  this.hide = function hide() {
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("tabindex", "-1"); //  Firefox needs this if the element has overflow
    hideClass && el.classList.add(hideClass);
    showClass && el.classList.remove(showClass);
  };
  this.hidden = function visible() {
    return el.hasAttribute("aria-hidden") ? true : false;
  };
  /* this.toggle = function toggle() {
        if(this.hidden) {
            this.show();
        } else {
            this.hide();
        }
    } */
};

/*
 * Debounce function from Underscore.js (via David Walsh blog).
 * Creates and returns a new debounced version of the passed function
 * which will postpone its execution until after `wait` milliseconds
 * have elapsed since the last time it was invoked. Useful for implementing
 * behavior that should only happen after the input has stopped arriving.
 * Pass true for the immediate argument to cause debounce to trigger the
 * function on the *leading* instead of the trailing edge of the wait
 * interval. Useful in circumstances like preventing accidental
 * double-clicks on a "submit" button from firing a second time.
 * Examples: wait until the user stops typing before launching a
 * search query. Wait until the user has stopped scrolling before
 * triggering (an expensive) layout repaint.
 * @param {*} func expensive or slow function to call
 * @param {*} wait length of time in miliseconds to wait
 * @param {*} immediate trigger with first rather than last event
 */
stir.debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

stir.lazy = function (targets) {
  if (!targets) return;

  var observer;

  // The action to be carried out when lazy-loading is triggered.
  function lazyAction(element) {
    // (i) image src-swap method:
    if (element.hasAttribute("data-img-src")) {
      return element.setAttribute("src", element.getAttribute("data-img-src"));
      // (Using `.getAttribute()` here instead of `.dataset` for better browser support.)
    }
    // (ii) noscript content-import method:
    Array.prototype.forEach.call(element.querySelectorAll('noscript[data-load="lazy"]'), function (item) {
      // Extract dormant HTML code from inside the noscript, and append it to the DOM:
      item.insertAdjacentHTML("beforebegin", item.innerText.trim().toString());
      // …then remove the noscript tag:
      item.parentNode.removeChild(item);
    });
  }

  // Only initialise the lazy-load observer if (i) we have lazy elements on
  // this page and (ii) if IntersectionObserver is supported.
  if (targets.length > 0) {
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.intersectionRatio > 0) {
            lazyAction(entry.target); // trigger lazy action
            observer.unobserve(entry.target); // stop observing this target once the action has been triggered
          }
        });
      });
    }
    for (var i = 0; i < targets.length; i++) {
      // Cue-up lazy-loading for each target, if observer is available.
      // If there's no observer (i.e. IE etc) just allow images to load non-lazily.
      if (observer) {
        // wait and observe
        observer.observe(targets[i]);
      } else {
        // trigger immediately
        lazyAction(targets[i]);
      }
    }
  }
};

stir.truncate = function truncate(options) {
  var wrapper = document.querySelector(options.selector);
  if (!wrapper) return;

  var modern = "open" in document.createElement("details");
  var elements = Array.prototype.slice.call(wrapper.children, options.start || 3);
  var trigger, accordion;

  trigger = (function () {
    return modern ? document.createElement("summary") : document.createElement("button");
  })();
  accordion = (function () {
    return modern ? document.createElement("details") : document.createElement("div");
  })();

  trigger.innerText = "Read more";
  accordion.classList.add("stir-content-expand");
  trigger.classList.add("stir-content-expander");

  if (elements.length > 1) {
    var last = options.offset ? elements.pop() : null;

    if (modern) {
      accordion.appendChild(trigger);
    } else {
      wrapper.appendChild(trigger);
    }
    wrapper.appendChild(accordion);
    last && wrapper.appendChild(last);

    for (var i = 0; i < elements.length; i++) {
      accordion.appendChild(elements[i]);
    }
  }

  if (modern) return;

  accordion.classList.add("show-for-sr");

  var toggleHandlerForIe = function (event) {
    accordion.classList.remove("show-for-sr");
    trigger.removeEventListener("click", toggleHandlerForIe);
    trigger.parentNode.removeChild(trigger);
  };

  trigger.addEventListener("click", toggleHandlerForIe);
};

stir.indexBoard = (function () {
  var CHAR_CODE_RANGE = {
    start: 65,
    end: 90,
  };
  var index = {};

  function reset() {
    for (var cc = CHAR_CODE_RANGE.start; cc <= CHAR_CODE_RANGE.end; cc++) {
      index[String.fromCharCode(cc)] = false;
    }
  }

  return function (element) {
    this.element = element || document.createElement("div");
    this.reset = reset;

    this.enable = function (key) {
      if (index.hasOwnProperty(key)) index[key] = true;
    };
    this.disable = function (key) {
      if (index.hasOwnProperty(key)) index[key] = false;
    };
    this.hide = function () {
      this.element.classList.remove("stir__slidedown");
      this.element.classList.add("stir__slideup");
    };
    this.show = function () {
      this.element.classList.remove("stir__slideup");
      this.element.classList.add("stir__slidedown");
    };
    this.update = function () {
      for (var key in index) {
        if (index.hasOwnProperty(key)) {
          var el = this.element.querySelector('[data-letter="' + key + '"]');
          if (index[key]) {
            el && el.removeAttribute("data-disabled");
          } else {
            el && el.setAttribute("data-disabled", true);
          }
        }
      }
    };
  };
})();

/*
   Helpers for document.querySelector / document.querySelectorAll
 */

stir.node = (identifier) => document.querySelector(identifier);
stir.nodes = (identifier) => Array.prototype.slice.call(document.querySelectorAll(identifier));

/*
  Safely replace the inner html of a node with new html
*/
stir.setHTML = (node, html) => {
  Array.prototype.slice.call(node.childNodes).forEach((node) => node.remove());

  if (!html) return;
  node.appendChild(stir.createDOMFragment(html));
};

/*
  Create a DOM node from a html string
*/
stir.stringToNode = (htmlString) => stir.createDOMFragment(htmlString).firstElementChild;

/* 
   FUNCTIONAL PROGRAMMING HELPERS
   ---
   Mostly obtained from Functional-Light-JS
   github.com/getify/Functional-Light-JS
   See FP Tests document for how to use
 */

const _isArray = Array.isArray;
const _keys = Object.keys;

/*
   Clone helper function
 */
stir.clone = function (input) {
  const out = _isArray(input) ? Array(input.length) : {};
  if (input && input.getTime) return new Date(input.getTime());

  for (const key in input) {
    const v = input[key];
    out[key] = typeof v === "object" && v !== null ? (v.getTime ? new Date(v.getTime()) : stir.clone(v)) : v;
  }

  return out;
};

/*
   Identity helper function
 */
stir.identity = function (input) {
  return input;
};

/*
   Not helper function
 */
stir.not = function not(predicate) {
  return function negated(...args) {
    return !predicate(...args);
  };
};

/*
   Partial helper function
 */
stir.partial = function (fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
};

/*
   Compose helper function
 */
stir.compose = function (...fns) {
  return fns.reduceRight(function reducer(fn1, fn2) {
    return function composed(...args) {
      return fn2(fn1(...args));
    };
  });
};

/*
   Curry helper function
 */
stir.curry = function (fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(...nextArgs) {
      var args = [...prevArgs, ...nextArgs];

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
};

/*
   Sort version that returns a new list
 */
stir.sort = stir.curry(function (fn, list) {
  if (typeof fn === "function") return stir.clone(list).sort(fn);

  return stir.clone(list).sort();
});

/*
   Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP etc)
 */
stir.range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

/*
   Deeply flattens an array. 
   eg [1, 2, [3, 30, [300]], [4] => [ 1, 2, 3, 30, 300, 4 ]
 */
stir.flatten = function (list, input) {
  const willReturn = input === undefined ? [] : input;

  for (let i = 0; i < list.length; i++) {
    if (_isArray(list[i])) {
      stir.flatten(list[i], willReturn);
    } else {
      willReturn.push(list[i]);
    }
  }

  return willReturn;
};

stir.removeDuplicates = stir.curry((data) => {
  return data.filter((c, index) => {
    return data.indexOf(c) === index;
  });
});

/*
   Helper - More readable than doing !isNaN double negative shenanigans
 */
stir.isNumeric = function (input) {
  return !isNaN(input);
};

/*
   Unbound and curried map filter reduce each etc functions
 */

stir.map = unboundMethod("map", 2);
stir.filter = unboundMethod("filter", 2);
stir.reduce = unboundMethod("reduce", 3);
stir.each = unboundMethod("forEach", 2);
stir.all = unboundMethod("every", 2);
stir.any = unboundMethod("some", 2);
stir.join = unboundMethod("join", 2);

function unboundMethod(methodName, argCount = 2) {
  return stir.curry((...args) => {
    var obj = args.pop();
    return obj[methodName](...args);
  }, argCount);
}

/**
 * Google Analytics helpers
 */

stir.ga = (() => {
  const trackingId = "UA-340900-19";

  const getClientId = () => {
    if (typeof window.ga == "undefined") return false;
    const trackers = ga.getAll ? ga.getAll() : [];
    for (let i = 0, len = trackers.length; i < len; i += 1) {
      if (trackers[i].get("trackingId") === trackingId) {
        return trackers[i].get("clientId");
      }
    }
    return false;
  };

  return {
    getClientId: getClientId,
  };
})();
