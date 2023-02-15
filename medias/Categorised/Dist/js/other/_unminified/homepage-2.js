function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/*


  Video Banner


*/

(function () {
  var elem;
  if (elem = document.querySelector("[data-videoId]")) {
    elem.addEventListener("ended", function (e) {
      // check elem has a parent before trying to remove it from the DOM
      // just in case this gets called more than once!
      if (!elem.parentNode) return;
      if (fallback = elem.getAttribute("data-fallback-html")) {
        //elem.style.display = 'none';
        /* var suoty = document.createElement('div');
                var suotyH1 = document.createElement('h1');
                var badge = new Image();
                badge.src = 'https://www.stir.ac.uk/webcomponents/dist/images/accreditations/sport-accolade-times-gug.svg';
                badge.alt = 'Good University Guide 2020 Sports University of the Year';
                badge.classList.add('portrait')
                suoty.classList.add('show-for-medium');
                suoty.classList.add('masthead_suoty');
                suotyH1.innerHTML = 'Sports University<br>of&nbsp;the&nbsp;Year <span>2020</span>'
                suoty.appendChild(suotyH1);
                suoty.appendChild(badge);
                elem.insertAdjacentElement("beforebegin", suoty);*/
        //elem.parentNode.removeChild(elem);
      } else if (fallback = elem.getAttribute("data-fallback-image")) {
        var image = new Image();
        (function (elem) {
          image.addEventListener("load", function (event) {
            elem.insertAdjacentElement("beforebegin", image);
            elem.parentNode.removeChild(elem);
          });
        })(elem);
        image.src = fallback;
      }

      // if neither; do nothing!
    });
  }

  // Animate on Scroll. This checks AOS is available before making changes to the DOM.
  if (AOS) {
    var fast = 1000;
    var slow = 2000;
    var right = "fade-right";
    var left = "fade-left";
    var up = "fade-up";

    /*
     * Helper function to set AOS attributes.
     * @param {string} action the name of an AOS animation
     * @param {number} duration the duration of the animation
     */
    var applyAOS = function applyAOS(action, duration) {
      if (!this.setAttribute) return;
      this.setAttribute("data-aos", action);
      this.setAttribute("data-aos-duration", duration);
    };
    var animatedDOMElements = [{
      element: ".c-promo-area--homepage .c-promo-area__content",
      action: right,
      duration: fast
    }, {
      element: ".c-promo-area--homepage .c-promo-area__image",
      action: left,
      duration: fast
    }, {
      element: ".c-research-promo__wrapper",
      action: up,
      duration: slow
    }, {
      element: ".c-international-section .c-bleed-feature__text-container",
      action: left,
      duration: fast
    }, {
      element: ".c-international-section .c-bleed-feature__image",
      action: right,
      duration: fast
    }, {
      element: ".c-homepage-news-events",
      action: up,
      duration: slow
    }];
    for (var i = 0; i < animatedDOMElements.length; i++) {
      var element = document.querySelector(animatedDOMElements[i].element);
      var action = animatedDOMElements[i].action || left;
      var duration = animatedDOMElements[i].duration || fast;
      if (element) applyAOS.call(element, action, duration);
    }

    // this must be run after attaching data-* attributes:
    AOS.init({
      once: true,
      // only animate once per page-load (i.e. not on every scroll-by)
      disable: "phone" // disabled for phone breakpoint
    });
  }
})();

/*


   News and Events JSON Loader

   
 */

var stir = stir || {};
(function (scope) {
  if (!scope) return;
  var getFeedUrl = function getFeedUrl(host, cacheBuster, globals) {
    if (host === "localhost" || host === "stirweb.github.io") return "homepage.json" + cacheBuster;
    if (host === "stiracuk-cms01-production.terminalfour.net" || host === "stiracuk-cms01-test.terminalfour.net") return globals.preview.homepagefeed;
    return globals.homepagefeed + cacheBuster;
  };

  /*
    Filter data helper functions
  */

  var filterEmpties = stir.filter(function (item) {
    if (item.id && item.id !== 0) return item;
  });
  var filterDuplicates = function filterDuplicates(first, second, item) {
    if (item.id !== first && item.id !== second) return item;
  };
  var filterLimit = function filterLimit(max, item, index) {
    if (index < max) return item;
  };
  var getAdditionalNews = function getAdditionalNews(items, news1id, news2id) {
    return stir.filter(function (item) {
      return filterDuplicates(news1id, news2id, item);
    }, items);
  };

  /*
    Extract the news data needed and process it to html
  */
  var getNews = function getNews(noOfNews, data) {
    var newsItems1 = filterEmpties(data.news.primary);
    var newsItems2 = filterEmpties(data.news.secondary);
    var news1 = newsItems1[0] ? newsItems1[0] : {
      id: 0
    };
    var news2 = newsItems2[0] ? newsItems2[0] : {
      id: 0
    };

    // Form a single array ordered by Primary, Seconardy, Other Primaries, Other Secondaries
    var newsComined = [news1, news2].concat(_toConsumableArray(getAdditionalNews(newsItems1, news1.id, news2.id)), _toConsumableArray(getAdditionalNews(newsItems2, news1.id, news2.id)));
    var gridClasses = noOfNews === 3 ? "medium-12 " : "large-8 medium-6 ";
    var cellClasses = noOfNews === 3 ? "large-4 medium-6" : "large-6 medium-12";

    // Curry set ups
    var renderItems = stir.map(renderItem(cellClasses, "article"));
    var limiterer = stir.filter(function (item, index) {
      return filterLimit(noOfNews, item, index);
    }); // limit to number we need

    // Run the data through the various processes
    return stir.compose(renderNews(noOfNews, gridClasses), stir.join(""), renderItems, limiterer, filterEmpties)(newsComined);
  };

  /*
    Extract the events data needed and process it to html
  */
  var getEvents = function getEvents(noOfEvents, data) {
    var limterer = stir.filter(function (item, index) {
      return filterLimit(noOfEvents, item, index);
    }); // Curry
    var renderer = renderItem("", "div"); // Curry

    var events = stir.compose(limterer, filterEmpties)(data.events);
    if (!events.length) return "";
    return stir.compose(renderEvents, stir.join(""), stir.map(renderer))(events);
  };

  /*
    Renderers
  */

  var renderEvents = stir.curry(function (events) {
    return "\n      <!-- All Events -->\n      <div class=\"cell large-4 medium-6 small-12\">\n          <div class=\"flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small\">\n              <h2 class=\"header-stripped u-header--margin-stripped\">Events</h2>\n              <span class=\"flex-container u-gap-16 align-middle\"><span class=\"uos-calendar u-icon h5 show-for-small-only\"></span><a href=\"/events/\" class=\"c-link\">See all events</a></span>\n          </div>\n          <div class=\"grid-x grid-padding-x\" >".concat(events, "</div>\n      </div>");
  });
  var renderNews = stir.curry(function (noOfNews, classes, news) {
    return "\n        <!-- All News -->\n        <div class=\"cell small-12 ".concat(classes, "\" >\n            <div class=\"flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small\">\n                <h2 class=\"header-stripped u-header--margin-stripped\">News</h2>\n                <span class=\"u-flex1 flex-container u-gap-16 align-middle\"><span class=\"uos-radio-waves u-icon h5 show-for-small-only\"></span><a href=\"/news/\" class=\"c-link\">See all articles</a></span>\n                ").concat(noOfNews === 3 ? "<span class=\"flex-container u-gap-16 align-middle\"><span class=\"uos-calendar u-icon h5\"></span><a href=\"/events/\" class=\"c-link\">See our events</a></span>" : "", "\n            </div>\n            <div class=\"grid-x grid-padding-x \" >").concat(news, "</div>\n        </div>");
  });
  var renderItem = stir.curry(function (classes, node, item) {
    return "\n      <".concat(node, " class=\"small-12 cell ").concat(classes, "\">\n        <a href=\"").concat(item.url, "\"><img class=\"show-for-medium\" src=\"").concat(item.image, "\" alt=\"").concat(item.imagealt, "\" loading=\"lazy\"></a>\n        <h3 class=\"header-stripped u-my-1 u-font-normal u-compress-line-height\">\n        <a href=\"").concat(item.url, "\" class=\"c-link u-inline\">").concat(item.title, "</a>\n      </h3>\n        ").concat(item._uos.location ? "<strong>".concat(item._uos.location, "</strong>") : "", "\n        ").concat(renderTime(item._uos), " \n        <p class=\"text-sm\">").concat(item.summary, "</p>\n      </").concat(node, " >");
  });
  var renderTime = function renderTime(meta) {
    if (!meta.startDate) return "";
    var endDate = meta.endDate === meta.startDate ? "" : " until ".concat(meta.endDate);
    return "<time class=\"u-block u-my-1 u-grey--dark\">".concat(meta.startDate).concat(endDate, "</time>");
  };
  var render = function render(news, events) {
    return "<div class=\"grid-x grid-padding-x c-news-event__news\">".concat(news).concat(events, "</div>");
  };

  /*
      EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  var setDOMContent = stir.curry(function (node, html) {
    stir.setHTML(node, html);
    return true;
  });

  /*
    On Load
  */

  var noOfEvents = 1;
  var noOfItems = 3;
  var cacheBuster = "?v=" + new Date().getTime();
  var url = getFeedUrl(window.location.hostname, cacheBuster, stir.t4Globals);

  /* 
    Get the JSON data and process it 
  */
  stir.getJSON(url, function (data) {
    if (typeof data == "undefined" || !data.news) return;
    var events = getEvents(noOfEvents, data);
    var noOfNews = !events.length ? noOfItems : noOfItems - noOfEvents;
    var news = getNews(noOfNews, data);
    setDOMContent(scope, render(news, events));
  });
})(stir.node(".c-news-event"));
(function () {
  var placeholder = document.querySelector("[data-placeholder-mobile]");
  if (placeholder) {
    //save the original placeholder value
    placeholder.setAttribute("data-placeholder", placeholder.placeholder);

    // function to handle toggling the value
    var placeholderchanger = function placeholderchanger(event) {
      if (stir.MediaQuery.current === "small") {
        placeholder.placeholder = placeholder.getAttribute("data-placeholder-mobile");
      } else {
        placeholder.placeholder = placeholder.getAttribute("data-placeholder");
      }
    };

    // do an immediate check
    placeholderchanger();

    // listen for MediaQueryChange events so we can check again
    window.addEventListener("MediaQueryChange", placeholderchanger);
  }
})();