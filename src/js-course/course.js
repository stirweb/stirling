var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};

stir.components = stir.components || {};
/* stir.components.html = stir.components.html || {}; */
stir.components.unistats = stir.components.unistats || {};
stir.components.discoveruni = stir.components.discoveruni || {};

stir.components.unistats.widget = function (options) {
  var widget = document.createElement("iframe");
  widget.src =
    "https://widget.unistats.ac.uk/Widget/10007804/" + kiscode + "/responsive/small/en-GB/" + kismode;
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
/* stir.components.html.details = function (options) {
    var widget = document.createElement('details');
    options.summary && (widget.innerHTML = '<summary>' + options.summary + '</summary>');
    return widget;
}; */

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
    console.info("[Discover Uni] kiscodes:", kiscodes, kiscodes.length);
    console.info("[Discover Uni] kiswidget:", kiswidget);
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
      widgetScript.src = "https://discoveruni.gov.uk/widget/embed-script/";
      widgetScript.addEventListener("load", function (event) {
        if (widgets.length > 1 && window.DiscoverUniWidget) {
          var widgetStylesAdded = false;
          var widgetsReady = 0;
          var contentInsertionNode = new stir.components.accordion({
            id: "morewidgets",
            title: "View more Discover Uni information",
          });

          kiswidget.insertAdjacentElement("afterend", contentInsertionNode);
          new stir.accord(contentInsertionNode);
          contentInsertionNode = contentInsertionNode.querySelector("[data-tab-content]");

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
      whatnext.classList.remove("u-margin-top");
      callstoact.classList.add("u-margin-top");
    }
  }

  function unshiftStirTabsOverlap() {
    var tabs = document.getElementById("c-course-tabs");
    if (tabs) {
      tabs.style.top = "-1px";
    }
  }

  if (self.stir && stir.t4Globals && stir.t4Globals.clearing) {
    // If we are in Clearing AND promos may be shown, then swap-out sticky nav:
    if (stir.t4Globals.clearing.open && stir.t4Globals.clearing.showPromos) {
      swapCourseNavForClearingBannerSticky();
      addCoursePageAdvert(document.getElementById("clearing-advert-template"));
      new UoS_StickyWidget(document.querySelector(".u-sticky"));
      relocateCTA(); // During Clearing, shunt normal CTAs to the bottom of the page so they are out of the way.
      unshiftStirTabsOverlap(); // stylistic tab ovelap not compatible with sticky/z-index etc. disable it during clearing.
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
