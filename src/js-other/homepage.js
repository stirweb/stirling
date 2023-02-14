(function () {
  var elem;
  if ((elem = document.querySelector("[data-videoId]"))) {
    elem.addEventListener("ended", function (e) {
      // check elem has a parent before trying to remove it from the DOM
      // just in case this gets called more than once!
      if (!elem.parentNode) return;

      if ((fallback = elem.getAttribute("data-fallback-html"))) {
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
      } else if ((fallback = elem.getAttribute("data-fallback-image"))) {
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

  /*
    Animate the Map Pin
   *
  var pindrop = stir.createIntersectionObserver({
    element: document.querySelector(".info-map"),
    threshold: 0.1,
    callback: function (entry) {
      if ((entry.intersectionRatio === -1 || entry.intersectionRatio > 0) && this.nodeType === 1) {
        this.classList.add("pinned");
        if (pindrop && pindrop.observer) pindrop.observer.unobserve(this);
      }
    },
  });
  */

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

    var animatedDOMElements = [
      { element: ".c-promo-area--homepage .c-promo-area__content", action: right, duration: fast },
      { element: ".c-promo-area--homepage .c-promo-area__image", action: left, duration: fast },
      { element: ".c-research-promo__wrapper", action: up, duration: slow },
      { element: ".c-international-section .c-bleed-feature__text-container", action: left, duration: fast },
      { element: ".c-international-section .c-bleed-feature__image", action: right, duration: fast },
      { element: ".c-homepage-news-events", action: up, duration: slow },
    ];

    for (var i = 0; i < animatedDOMElements.length; i++) {
      var element = document.querySelector(animatedDOMElements[i].element);
      var action = animatedDOMElements[i].action || left;
      var duration = animatedDOMElements[i].duration || fast;
      if (element) applyAOS.call(element, action, duration);
    }

    // this must be run after attaching data-* attributes:
    AOS.init({
      once: true, // only animate once per page-load (i.e. not on every scroll-by)
      disable: "phone", // disabled for phone breakpoint
    });
  }
})();

/**
 * If location is China (where Vimeo is blocked) show image instead of video
 */
/* (function() {
    //UoS_locationService.do( function(data) {
        
        if (data.country_code === "CN") { // China
            
            var elem, fallback;
            if(elem = document.querySelector("#video-masthead-wrapper .responsive-embed")) {
                if(fallback = elem.getAttribute('data-fallback-image')) {
                    var image = new Image();
                    image.src = fallback;
                    elem.insertAdjacentElement("beforebegin", image);
                }
                elem.parentNode.removeChild(elem);
            };
            
            // ensure that the image is showing in desktop (remove the hide-for-* Foundation class)
            var elem = document.querySelector("#video-masthead-wrapper .c-video-masthead__image")
            elem && elem.classList.remove("hide-for-medium");
        }
    } );
})(); */

/*
   Create a top edge callout div
    @param html {string}
   @param backgroundColor {string}
 */

// var UoS_createTopEdgeCallout = function(html, backgroundColor) {
//     var container = document.getElementById("top-edge-callouts-container");
//     if(!container) return;
//     var backgroundColor = backgroundColor || "heritage-green";
//     var html = '<div class="callout ' + backgroundColor + ' c-top-edge-callout" data-closable id="top-edge-callout"><button class="close-button" aria-label="Dismiss alert" type="button" data-close><span aria-hidden="true">&times;</span></button>' + html + '</div>';
//     container.innerHTML = html; // this will destroy and replace any previous callouts
//     $ && $("#top-edge-callout").slideDown(); // use jQuery for animation
// }

/*:::   ::: :::::::::: :::       :::  ::::::::            :::     ::::    ::: :::::::::        :::::::::: :::     ::: :::::::::: ::::    ::: ::::::::::: :::::::: 
     :+:+:   :+: :+:        :+:       :+: :+:    :+:         :+: :+:   :+:+:   :+: :+:    :+:       :+:        :+:     :+: :+:        :+:+:   :+:     :+:    :+:    :+: 
    :+:+:+  +:+ +:+        +:+       +:+ +:+               +:+   +:+  :+:+:+  +:+ +:+    +:+       +:+        +:+     +:+ +:+        :+:+:+  +:+     +:+    +:+         
   +#+ +:+ +#+ +#++:++#   +#+  +:+  +#+ +#++:++#++       +#++:++#++: +#+ +:+ +#+ +#+    +:+       +#++:++#   +#+     +:+ +#++:++#   +#+ +:+ +#+     +#+    +#++:++#++   
  +#+  +#+#+# +#+        +#+ +#+#+ +#+        +#+       +#+     +#+ +#+  +#+#+# +#+    +#+       +#+         +#+   +#+  +#+        +#+  +#+#+#     +#+           +#+    
 #+#   #+#+# #+#         #+#+# #+#+#  #+#    #+#       #+#     #+# #+#   #+#+# #+#    #+#       #+#          #+#+#+#   #+#        #+#   #+#+#     #+#    #+#    #+#     
###    #### ##########   ###   ###    ########        ###     ### ###    #### #########        ##########     ###     ########## ###    ####     ###     #######*/

/*
   News and Events JSON Loader
 */
var stir = stir || {};

stir.loadingProgress = function (el, show) {
  //YOLO enable a queing system with references?
  if (el && show) {
    return (el.innerHTML = '<p class="cell" data-indicator="load">Loading…</p>');
  }
  if (el && !show) {
    var load = el.querySelector('[data-indicator="load"]');
    load && el.removeChild(load);
  }
};

(function () {
  init(); // GO GO GO!

  /**
   * Callback function should be bound to the context of the DOM element
   * we want it to operate on. (i.e. called with `callback.call(el, item)`).
   * @param {Object} item An object representing a news item or an event.
   */
  function callback(item) {
    var type = this.parentNode.getAttribute("data-promo-type");
    this.insertAdjacentHTML("afterbegin", renderNewsEventItem(item, type));
  }

  /**
   * Just a failsafe/fallback in case there are no news (or event) items.
   * The content is hard-coded. Changes to the text can be made here.
   */
  function failsafe() {
    var prefix = "https://www.stir.ac.uk/";
    var type = this.parentNode.getAttribute("data-promo-type");
    var isnews = type && type == "news";
    this.insertAdjacentHTML(
      "beforeend",
      renderNewsEventItem(
        {
          linktext: isnews ? "Read more" : "University events",
          url: prefix + (isnews ? "news/" : "events/"),
          title: isnews ? "University news centre" : "Events at the University of Stirling",
          image: prefix + "/webcomponents/dist/images/homepage/default-" + (isnews ? "news" : "event") + ".jpg",
          summary: isnews ? "Visit our news centre to find out more about our top stories." : "",
          _uos: {
            location: isnews ? "" : "Many events at the University are open to the public and free of charge. View more information on our public lectures, exhibitions and other events.",
          },
        },
        type
      )
    );
  }

  /**
   * Initialisation for loading news and events
   */
  function init() {
    var newsContainer = document.querySelector('.promo-container[data-promo-type="news"]');
    var eventsContainer = document.querySelector('.promo-container[data-promo-type="events"]');
    doFeeds({ news: newsContainer, events: eventsContainer });
  }

  /**
   * Controller function to initiate the work of loading the JSON feeds.
   * @param {object} container contains references to our news and events DOM elements.
   */
  function doFeeds(container) {
    if (!container["news"] && !container["events"]) return; // just quit if no containers (one or other is allowed).

    stir.loadingProgress(container["news"], true);
    stir.loadingProgress(container["events"], true);

    var url;
    var now = new Date();
    var cacheBuster = "?v=" + now.getTime(); // Who ya gonna call?

    /**
     * A wee helper function since we'll call this code for each
     * container (i.e. 2x news and 1x event).
     * @param {array} items news or event items from the feed
     * @param {DOM element} container the parent container in the DOM
     * @param {string} position "primary" or "secondary" priority for ordering on-page
     */
    var processItems = function (items, container, position) {
      if (false === items instanceof Array) return;
      items.pop(); // discard the last element (it will be empty because of the t4 formatting issue);

      // create an empty scaffold element into which we'll inject the
      // dynamic content (it also gives us somewhere to add the "loading"
      // placeholder while we wait for the Ajax response).
      var scaffold = document.createElement("div");
      scaffold.classList.add("small-12", "cell", "c-news-events__article");
      if ("news" == container.getAttribute("data-promo-type")) scaffold.classList.add("large-6", "medium-12");

      // primary items will be *pre*pended (so they appear first) and non-primary
      // items will be *ap*pended (so they appear last).
      container.insertAdjacentElement(position, scaffold);

      testNewsEventItem(items, scaffold);
    };

    switch (window.location.hostname) {
      case "localhost":
        url = "/pages/data/homepage/homepage.json";
        break;
      case "t4appdev.stir.ac.uk": // Dev Preview
      case "t4cms.stir.ac.uk": // Preview
        url = stir.t4Globals.preview.homepagefeed;
        break;
      case "www-stir.t4appdev.stir.ac.uk": // Dev pre-transfer publish
        url = stir.t4Globals.homepagefeed + cacheBuster;
        break;
      case "mediadev.stir.ac.uk":
        url = "data/homepage/homepage.json";
        break;
      default: // live
        url = stir.t4Globals.homepagefeed + cacheBuster; // doodle-ooh-doo doo-doo
    }

    stir.getJSON(url, function (data) {
      if (typeof data == "undefined" || !data.news) {
        return;
      }

      stir.loadingProgress(container["news"], false);
      container["news"] && data.news.primary && processItems(data.news.primary, container["news"], "afterbegin");
      container["news"] && data.news.secondary && processItems(data.news.secondary, container["news"], "beforeend");

      stir.loadingProgress(container["events"], false);
      container["events"] && data.events && processItems(data.events, container["events"], "afterbegin");
    });
  }

  /*
   * Test a news/event item's URL is live (so we can decide whether to render it yet)
   *
   * @param item {array} An array of objects (representing news or event items) to be tested.
   * @param targetElementSelector {DOM element} The parent node into which to inject the result.
   */
  function testNewsEventItem(items, el) {
    // Check: callback must be a function
    if (typeof callback != "function") return console.error("callback is not a function");

    // Check: items must be an array, and not empty
    if (!items instanceof Array || items.length < 1) {
      stir.loadingProgress(el, false);
      return failsafe.call(el);
    }

    // Pop the first item off the list, leave the remainder (if any).
    // This will be done recursively so the array acts like a queue.
    var item = items.shift();

    stir.loadingProgress(el, true); // indicate to the user that loading is underway

    var request = new XMLHttpRequest();
    request.open("HEAD", item.url, true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        stir.loadingProgress(el, false); // remove the loading indicator
        // The callback is called in the context of the element, so it
        // intrinsically knows which element to update.
        callback.call(el, item);
      } else {
        // request failed so we'll try again with the (modified, see above) items array:
        testNewsEventItem(items, el);
      }
    };
    request.onerror = function () {
      /* There was a connection error so (recursively) try next item */
      testNewsEventItem(items, el);
    };
    request.send();
  }

  /*
   * Render an HTML news/event item for the homepage. Events differ from news only slightly.
   * If you need to change the HTML markup for news/events, you can do that here.
   * @param {object} item
   * @param {string} type
   */
  function renderNewsEventItem(item, type) {
    item._uos = item._uos || {}; // prevent a Type error if the _uos JSON Feed extention is not present

    var html = [];
    var endDate = (item._uos.startDate !== item._uos.endDate ? " until " + item._uos.endDate : "") + "<br>";
    var loc = item._uos.location ? '<span class="u-block u-my-1 u-grey--dark">' + item._uos.location + "</span>" : "";
    var time = item._uos.startDate ? '<time class="u-block u-my-1 u-grey--dark>' + item._uos.startDate + endDate + "</time>" : "";
    //var linktext = item.linktext || "Read more";
    var isnews = type == "news";
    var isevent = type == "events";

    item.image && html.push('<a href="' + item.url + '" ><img class="show-for-medium" src="' + item.image + '" alt="' + item.imagealt + '" loading="lazy"></a>');
    isevent && html.push('<h3 class="header-stripped u-my-1 u-font-normal u-compress-line-height"><a href="' + item.url + '" class="c-link u-inline">' + item.title + "</a></h3>" + '<div class="u-my-1">' + time + loc + "</div>");
    isnews && html.push('<h3 class="header-stripped u-my-1 u-font-normal u-compress-line-height"><a href="' + item.url + '" class="c-link u-inline">' + item.title + "</a></h3>");
    isnews && html.push('<p class="text-sm">' + item.summary + "</p>");
    //item.url     && html.push('<a href="' + item.url + '" class="c-link">' + linktext + '</a>');

    return html.join("\n");
  }
})();
