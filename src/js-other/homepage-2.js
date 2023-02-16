/*


  Video Banner


*/

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

/*


   News and Events JSON Loader

   
 */

var stir = stir || {};

(function (scope) {
  if (!scope) return;

  const getFeedUrl = (host, cacheBuster, globals) => {
    if (host === "localhost" || host === "stirweb.github.io") return "homepage.json" + cacheBuster;

    if (globals) {
      if (host === "stiracuk-cms01-production.terminalfour.net" || host === "stiracuk-cms01-test.terminalfour.net") {
        return globals.preview && globals.preview.homepagefeed ? globals.preview.homepagefeed : null;
      }
      return globals.homepagefeed ? globals.homepagefeed + cacheBuster : null;
    }
    return null;
  };

  /*
    Filter data helper functions
  */

  const filterEmpties = stir.filter((item) => {
    if (item.id && item.id !== 0) return item;
  });

  const filterDuplicates = (first, second, item) => {
    if (item.id !== first && item.id !== second) return item;
  };

  const filterLimit = (max, item, index) => {
    if (index < max) return item;
  };

  const getAdditionalNews = (items, news1id, news2id) => stir.filter((item) => filterDuplicates(news1id, news2id, item), items);

  /*
    Extract the news data needed and process it to html
  */
  const getNews = (noOfNews, data) => {
    const newsItems1 = filterEmpties(data.news.primary);
    const newsItems2 = filterEmpties(data.news.secondary);

    const news1 = newsItems1[0] ? newsItems1[0] : { id: 0 };
    const news2 = newsItems2[0] ? newsItems2[0] : { id: 0 };

    // Form a single array ordered by Primary, Seconardy, Other Primaries, Other Secondaries
    const newsComined = [...[news1, news2], ...getAdditionalNews(newsItems1, news1.id, news2.id), ...getAdditionalNews(newsItems2, news1.id, news2.id)];

    const gridClasses = noOfNews === 3 ? "medium-12 " : "large-8 medium-6 ";
    const cellClasses = noOfNews === 3 ? "large-4 medium-6" : "large-6 medium-12";

    // Curry set ups
    const renderItems = stir.map(renderItem(cellClasses, "article"));
    const limiterer = stir.filter((item, index) => filterLimit(noOfNews, item, index)); // limit to number we need

    // Run the data through the various processes
    return stir.compose(renderNews(noOfNews, gridClasses), stir.join(""), renderItems, limiterer, filterEmpties)(newsComined);
  };

  /*
    Extract the events data needed and process it to html
  */
  const getEvents = (noOfEvents, data) => {
    const limterer = stir.filter((item, index) => filterLimit(noOfEvents, item, index)); // Curry
    const renderer = renderItem("", "div"); // Curry

    const events = stir.compose(limterer, filterEmpties)(data.events);

    if (!events.length) return "";

    return stir.compose(renderEvents, stir.join(""), stir.map(renderer))(events);
  };

  /*
    Renderers
  */

  const renderEvents = stir.curry((events) => {
    return `
      <!-- All Events -->
      <div class="cell large-4 medium-6 small-12">
          <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
              <h2 class="header-stripped u-header--margin-stripped">Events</h2>
              <span class="flex-container u-gap-16 align-middle"><span class="uos-calendar u-icon h5 show-for-small-only"></span><a href="/events/" class="c-link">See all events</a></span>
          </div>
          <div class="grid-x grid-padding-x" >${events}</div>
      </div>`;
  });

  const renderNews = stir.curry((noOfNews, classes, news) => {
    return `
        <!-- All News -->
        <div class="cell small-12 ${classes}" >
            <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
                <h2 class="header-stripped u-header--margin-stripped">News</h2>
                <span class="u-flex1 flex-container u-gap-16 align-middle"><span class="uos-radio-waves u-icon h5 show-for-small-only"></span><a href="/news/" class="c-link">See all articles</a></span>
                ${noOfNews === 3 ? `<span class="flex-container u-gap-16 align-middle"><span class="uos-calendar u-icon h5"></span><a href="/events/" class="c-link">See our events</a></span>` : ``}
            </div>
            <div class="grid-x grid-padding-x " >${news}</div>
        </div>`;
  });

  const renderItem = stir.curry((classes, node, item) => {
    return `
      <${node} class="small-12 cell ${classes}">
        <a href="${item.url}"><img class="show-for-medium" src="${item.image}" alt="${item.imagealt}" loading="lazy"></a>
        <h3 class="header-stripped u-my-1 u-font-normal u-compress-line-height">
        <a href="${item.url}" class="c-link u-inline">${item.title}</a>
      </h3>
        ${item._uos.location ? `<strong>${item._uos.location}</strong>` : ``}
        ${renderTime(item._uos)} 
        <p class="text-sm">${item.summary}</p>
      </${node} >`;
  });

  const renderTime = (meta) => {
    if (!meta.startDate) return "";

    const endDate = meta.endDate === meta.startDate ? `` : ` until ${meta.endDate}`;
    return `<time class="u-block u-my-1 u-grey--dark">${meta.startDate}${endDate}</time>`;
  };

  const render = (news, events) => `<div class="grid-x grid-padding-x c-news-event__news">${news}${events}</div>`;

  /*
      EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /*
    On Load
  */

  const noOfEvents = 1;
  const noOfItems = 3;

  const cacheBuster = "?v=" + new Date().getTime();
  const url = getFeedUrl(window.location.hostname, cacheBuster, stir.t4Globals);

  if (!url) return;

  /* 
    Get the JSON data and process it 
  */
  stir.getJSON(url, function (data) {
    if (typeof data == "undefined" || !data.news) return;

    const events = getEvents(noOfEvents, data);
    const noOfNews = !events.length ? noOfItems : noOfItems - noOfEvents;
    const news = getNews(noOfNews, data);

    setDOMContent(scope, render(news, events));
  });
})(stir.node(".c-news-event"));

(function () {
  const placeholder = document.querySelector("[data-placeholder-mobile]");
  if (placeholder) {
    //save the original placeholder value
    placeholder.setAttribute("data-placeholder", placeholder.placeholder);

    // function to handle toggling the value
    const placeholderchanger = (event) => {
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
