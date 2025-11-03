var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};

stir.components = stir.components || {};
stir.components.html = stir.components.html || {};
stir.components.unistats = stir.components.unistats || {};
stir.components.discoveruni = stir.components.discoveruni || {};

stir.components.unistats.widget = function (options) {
  var widget = document.createElement("iframe");
  widget.src = "https://widget.unistats.ac.uk/Widget/10007804/" + kiscode + "/responsive/small/en-GB/" + kismode;
  widget.setAttribute("title", "Unistats widget for " + kiscode + " (" + kismode + ")");
  widget.classList.add("c-course-unistats-widget");
  return widget;
};

stir.components.id = (function () {
  var _universalId = 0;

  function _getNewId() {
    return ++_universalId;
  }
  return {
    getNewId: _getNewId,
  };
})();

stir.components.discoveruni.widget = function (options) {
  var widget = document.createElement("div");
  //add this class if we want DiscoverUniWidget to trigger automatically:
  //widget.classList.add('kis-widget');
  widget.setAttribute("data-institution", 10007804);
  widget.setAttribute("data-course", options.kiscode);
  widget.setAttribute("data-kismode", options.kismode);
  widget.setAttribute("data-orientation", "responsive");
  widget.setAttribute("data-language", "en-GB");
  return widget;
};
stir.components.html.details = function (options) {
  var widget = document.createElement("details");
  options.summary && (widget.innerHTML = "<summary>" + options.summary + "</summary>");
  return widget;
};

stir.components.accordion = function (options) {
  var id = stir.components.id.getNewId();
  var widget = document.createElement("div");
  var label = document.createElement("h2");
  var anchor = document.createElement("a");
  var content = document.createElement("div");

  if (options.id) widget.setAttribute("id", options.id);

  widget.classList.add("stir-accordion");

  anchor.innerText = options.title || "Show more";
  anchor.id = "accordion-js-" + id;
  anchor.setAttribute("class", "stir-accordion--btn");
  anchor.setAttribute("aria-controls", "panel-js-" + id);

  content.id = "panel-js-" + id;
  content.setAttribute("data-tab-content", "");
  content.setAttribute("role", "region");
  content.setAttribute("aria-labelledby", "accordion-js-" + id);
  content.setAttribute("class", "stir__slideup stir__slidedown");

  label.appendChild(anchor);
  widget.appendChild(label);
  widget.appendChild(content);

  return widget;
};

stir.renderKISWidgets = function (kiscodes, kiswidget) {
  var debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
  var kiswidget = kiswidget || document.querySelector("#kis-widget");
  var frag = document.createDocumentFragment();
  var useUnistats = false;
  var pattern = /^U\d{2}-[A-Z]{2,3}([A-Z]{3})?$/;
  var widgets = [];

  if (debug) {
    console.info("[Course] kiscodes:", kiscodes, kiscodes.length);
    console.info("[Course] kiswidget:", kiswidget);
  }

  if (kiswidget && kiscodes) {
    kiswidget.setAttribute("data-initialised", true);
    kiswidget.innerHTML = ""; // remove loading spinner
    kiswidget.classList.remove("grid-x");

    useUnistats = kiswidget.hasAttribute("data-unistats");

    for (var i = 0; i < kiscodes.length; i++) {
      var kiscode = kiscodes[i].split(":")[0].trim();
      var kismode = kiscodes[i].split(":")[1] ? "parttime" : "fulltime";
      if (kiscode === "") {
        debug && console.info("[Discover Uni] Empty kiscode", i);
      } else if (!pattern.test(kiscode)) {
        console.error("Invalid KIS code: " + kiscode);
      } else {
        var widget;
        if (useUnistats) {
          widget = stir.components.unistats.widget({
            kiscode: kiscode,
            kismode: kismode,
          });
        } else {
          widget = stir.components.discoveruni.widget({
            kiscode: kiscode,
            kismode: kismode,
          });
        }
        widgets.push(widget);
      }

      widget && frag.appendChild(widget);
    }

    kiswidget.appendChild(frag);

    (function (d) {
      if (useUnistats || d.getElementById("unistats-widget-script")) {
        return;
      }
      var widgetScript = d.createElement("script");

      widgetScript.id = "unistats-widget-script";
      widgetScript.src = "https://widget.discoveruni.gov.uk/widget/embed-script/";
      widgetScript.addEventListener("load", function (event) {
        if (widgets.length > 1 && window.DiscoverUniWidget) {
          var widgetStylesAdded = false;
          var widgetsReady = 0;
          var contentInsertionNode = new stir.components.html.details({
            id: "morewidgets",
            summary: "View more Discover Uni information",
          });

          contentInsertionNode.classList.add("u-my-2", "u-cursor-pointer", "u-header--secondary-font", "text-larger");
          kiswidget.insertAdjacentElement("afterend", contentInsertionNode);
          //new stir.accord(contentInsertionNode);
          //contentInsertionNode = contentInsertionNode.querySelector("[data-tab-content]");

          // patch DiscoverUniWidget's addCss() function so it only runs once per page (not once per widget!)
          DiscoverUniWidget.prototype._addCss = DiscoverUniWidget.prototype.addCss;
          DiscoverUniWidget.prototype.addCss = function () {
            widgetStylesAdded || this._addCss(), (widgetStylesAdded = true);
          };

          // patch DiscoverUniWidget's renderWidget() function so that we can manipulate
          // widgets *after* they've been initialised
          DiscoverUniWidget.prototype._renderWidget = DiscoverUniWidget.prototype.renderWidget;
          DiscoverUniWidget.prototype.renderWidget = function () {
            // pass-through call to the original renderWidget function
            this._renderWidget.apply(this, arguments);

            // if the widget has no data we'll do nothing further
            if (this.targetDiv.classList.contains("no-data")) return;

            // skip the first widget but put the rest into a <details> accordion
            if (++widgetsReady > 1) {
              contentInsertionNode.appendChild(this.targetDiv);
            }
          };

          // this replaces (rather than patches) DiscoverUniWidget's init()
          // which is called as soon as the script is loaded. But since
          // we've interrupted that, we need to manually initialise the widgets:
        }

        for (var i = 0; i < widgets.length; i++) {
          widgets[i].classList.add("kis-widget");
          widgets[i].id = "kis-widget_" + (i + 1);
          new DiscoverUniWidget(widgets[i]);
        }
      });

      document.head.appendChild(widgetScript);
    })(document);
  }
};

var KISWidgetCaller = function () {
  return false;
};

/*
 * Clearing
 */
(function () {
  const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;

  function swapCourseNavForClearingBannerSticky() {
    var clearingBannerTemplate = document.getElementById("clearing-banner-template");
    var courseStickyNav = document.querySelector(".c-course-title-sticky-menu");
    var promoAnchorElement = document.querySelector(".c-course-datasheet");
    if (promoAnchorElement && clearingBannerTemplate && clearingBannerTemplate.innerHTML) {
      promoAnchorElement.insertAdjacentHTML("afterend", clearingBannerTemplate.innerHTML);
      courseStickyNav && courseStickyNav.parentElement.removeChild(courseStickyNav);
    }
  }

  function addCoursePageAdvert(template) {
    var promoAnchorElement = document.querySelector(".c-course-datasheet");
    if (promoAnchorElement && template && template.innerHTML) {
      promoAnchorElement.insertAdjacentHTML("afterend", template.innerHTML);
    }
  }

  function relocateCTA() {
    var callstoact = document.getElementById("course-ctas");
    var whatnext = document.querySelector(".c-whats-next");
    if (callstoact && whatnext) {
      whatnext.insertAdjacentElement("beforebegin", callstoact);
    }
  }

  function unshiftStirTabsOverlap() {
    var tabs = document.getElementById("c-course-tabs");
    if (tabs) {
      tabs.style.top = "-1px";
    }
  }

  function activateLiveChat() {
    window.__lc = window.__lc || {};
    window.__lc.license = 9913300;
    window.__lc.integration_name = "manual_channels";
    window.__lc.product_name = "livechat";
    (function (n, t, c) {
      function i(n) {
        return e._h ? e._h.apply(null, n) : e._q.push(n);
      }
      var e = {
        _q: [],
        _h: null,
        _v: "2.0",
        on: function () {
          i(["on", c.call(arguments)]);
        },
        once: function () {
          i(["once", c.call(arguments)]);
        },
        off: function () {
          i(["off", c.call(arguments)]);
        },
        get: function () {
          if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
          return i(["get", c.call(arguments)]);
        },
        call: function () {
          i(["call", c.call(arguments)]);
        },
        init: function () {
          var n = t.createElement("script");
          (n.async = !0), (n.type = "text/javascript"), (n.src = "https://cdn.livechatinc.com/tracking.js"), t.head.appendChild(n);
        },
      };
      !n.__lc.asyncInit && e.init(), (n.LiveChatWidget = n.LiveChatWidget || e);
    })(window, document, [].slice);
  }

  if (self.stir && stir.t4Globals && stir.t4Globals.clearing) {
    // If we are in Clearing AND promos may be shown, then swap-out sticky nav:
    if (stir.t4Globals.clearing.open && stir.t4Globals.clearing.showPromos) {
      debug && console.info("[Course] Clearing is open");
      swapCourseNavForClearingBannerSticky();
      addCoursePageAdvert(document.getElementById("clearing-advert-template"));
      new UoS_StickyWidget(document.querySelector(".u-sticky"));
      relocateCTA(); // During Clearing, shunt normal CTAs to the bottom of the page so they are out of the way.
      unshiftStirTabsOverlap(); // stylistic tab ovelap not compatible with sticky/z-index etc. disable it during clearing.
      activateLiveChat();
    }
  }
})();

/*
 * DiscoverUni (Formerly Unistats (formerly KIS))
 */
(function () {
  if (!stir.t4Globals.unistats) return;
  var kisccordion = document.querySelector(".ug-overview-accordion__kis-widget");
  var kiscodes = stir.t4Globals.unistats.split("|").pop().split(",");
  if (kiscodes.length > 0) {
    stir.renderKISWidgets(kiscodes);
    kisccordion && (kisccordion.style.display = "block");
  }
})();

/*
 * Favourites buttons
 * 2023-05-10
 */
if (stir.favourites && stir.coursefavs) {
  stir.coursefavs.attachEventHandlers();
  document.querySelectorAll("[data-nodeid=coursefavsbtn]").forEach(stir.coursefavs.doCourseBtn);
}

/*
 * Webinars button fetch and render
 * Uses AddSearch to find upcoming webinars for this course
 * November 2025
 */

(function () {
  /*
   *  Fetch and render webinar button
   */
  const renderButton = (item, colour) => {
    const data = JSON.parse(decodeURIComponent(item.custom_fields.data) || "{}");
    if (!data.url) return ``;
    return `<a href="${data.url}" id="cta-pg-webinar" class="button ${colour}"><span class="u-font-bold u-text-regular">Join our webinar</span></a>`;
  };

  /*
   *  Build search object
   */
  const getSearchObject = (from, to, filter) => {
    const obj = {
      and: [
        { "custom_fields.tag": filter },
        {
          range: { "custom_fields.d": { gt: from, lt: to } },
        },
      ],
    };
    return obj;
  };

  /*
   * Initiate fetch
   */

  const breadcrumb = document.querySelector("meta[name='stir.breadcrumb']").getAttribute("content");
  const colour = breadcrumb.includes("Undergraduate") ? "energy-turq" : breadcrumb.includes("Postgraduate") ? "heritage-berry" : "";

  const sid = document.querySelector("meta[name='sid']").getAttribute("content");
  const suggestedNode = document.getElementById("course-suggested-actions");

  if (!sid || !suggestedNode) return;

  const now = new Date().toISOString();
  const searchAPI = "https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de";
  const searchUrl = `${searchAPI}?term=*&filter=${encodeURIComponent(JSON.stringify(getSearchObject(now, "2099-12-31", "sid" + sid)))}&limit=3`;

  fetch(searchUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.total_hits > 0) {
        // get the number of a elements already in suggested actions
        const existingButtons = suggestedNode.querySelectorAll("a.button");
        // if more then 2 buttons remove the last one then add the webinar button
        if (existingButtons.length > 2) {
          suggestedNode.removeChild(existingButtons[existingButtons.length - 1]);
        }
        suggestedNode.insertAdjacentHTML("afterbegin", renderButton(data.hits[0], colour));
      }
    })
    .catch((error) => {
      console.error("Error fetching search data:", error);
    });
})();
