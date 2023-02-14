var stir = stir || {};

stir.widgets = stir.widgets || {};

/**
 * @name New Accordion
 * @author Ryan Kaye <ryan.kaye@stir.ac.uk>
 * @author Robert Morrison <r.w.morrison@stir.ac.uk>
 * @description example usage: myAccord = new stir.accord(el, true);
 * @param {Element} el is the element to be turned into an accordion
 * @param {Boolean} doDeepLink  true to allow deeplinking (off by default)
 **/

stir.accord = (function () {
  /**
   * Just some housekeeping, not essential
   * 1) quick fixes: clen up any aria-expanded="false" attrs.
   * 2) check for Unique IDs
   */

  HOUSEKEEPING: {
    var debug = UoS_env.name !== "prod" ? true : false;
    var accordionIDs = [];

    Array.prototype.forEach.call(document.querySelectorAll(".stir-accordion"), function (item) {
      Array.prototype.forEach.call(item.querySelectorAll("[aria-controls]"), function (a) {
        accordionIDs.push(a.getAttribute("aria-controls"));
      });
      Array.prototype.forEach.call(item.querySelectorAll(".stir-accordion--inactive"), function (b) {
        b.classList.remove("stir-accordion--inactive");
      });
      Array.prototype.forEach.call(item.querySelectorAll(".stir__slideup,.stir__slidedown"), function (c) {
        c.classList.remove("stir__slideup");
        c.classList.remove("stir__slidedown");
      });
    });

    debug &&
    accordionIDs.length >
      accordionIDs.filter(function (v, i, s) {
        return s.indexOf(v) === i;
      }).length
      ? console.warn("[Accordion] Duplicate IDs found!")
      : null;
  }

  /**
   * Links elsewhere on the page that link-to and automatically open an accordion item.
   * If the accordion is already open, leave it open (don't click() again or it will toggle closed).
   * Links must have:
   * 	- an href that matches the accordion ID
   *  - a data-attribute of `remote` with the value `accordion`
   */
  REMOTECONTROL: {
    var remotes = document.querySelectorAll('[data-remote="accordion"]');
    Array.prototype.forEach.call(remotes, function (remote) {
      remote.addEventListener("click", function (event) {
        var el = this.hasAttribute("href") && document.querySelector(this.getAttribute("href"));
        /* if the accordion exists, scroll to it; if it's not already expanded then do so */
        el && (stir.scrollToElement(el, 20), !el.hasAttribute("aria-expanded") && el.click());
        if (history.pushState) history.pushState(null, null, this.getAttribute("href"));
        else location.hash = "#" + this.getAttribute("href");
        event.preventDefault();
      });
    });
  }

  var _id = 0;

  var Accordion = function (element, enableDeeplink) {
    if (typeof this.init === "undefined") return console.error("Please call stir.accord() with `new`.");

    this.id = ++_id;

    this.settings = {
      deeplinked: false,
      doDeepLink: enableDeeplink ? true : false,
    };

    if (!element) return;
    this.element = element;
    this.control = element.querySelector("[aria-controls]");
    this.panel = element.querySelector('[role="region"]');
    this.init();
  };

  Accordion.prototype.getHeading = function getHeading() {
    var heading;
    Array.prototype.forEach.call(this.element.children, function (child) {
      if (child.matches("h1,h2,h3,h4,h5,h6,accordion-summary")) {
        heading = child;
      }
      if (heading) return;
    });
    return heading;
  };
  Accordion.prototype.init = function () {
    var cid = "accordion-control-" + this.id;
    var pid = "accordion-panel-" + this.id;

    if (!this.control) {
      var h2 = this.getHeading();
      if (!h2) return;
      this.control = document.createElement("button");
      this.control.innerText = h2.innerText;
      this.control.classList.add("stir-accordion--btn");
      this.control.setAttribute("aria-controls", pid);
      this.control.setAttribute("aria-expanded", "false");
      this.control.id = cid;
      h2.innerHTML = "";
      h2.appendChild(this.control);
    }

    if (!this.panel) {
      this.panel = this.element.querySelector("div");
      if (!this.panel) return;
      this.panel.setAttribute("role", "region");
      this.panel.setAttribute("aria-labelledby", cid);
      this.panel.id = pid;
    }

    this.element.classList.add("stir-accordion");

    this.element.addEventListener("click", this.handleClick.bind(this));
    if (this.element.getAttribute("data-deeplink") === "false") {
      this.settings.doDeepLink = false;
      // Deeplinks forced off: this takes priority over
      // the more general `enableDeeplinks` setting.
    }

    // Activate the deeplink if
    // (a) deeplinks are allowed, and…
    if (this.settings.doDeepLink) {
      // (b) this accordion matches the current URL hash, and…
      if (this.panel.id == window.location.hash.slice(1)) {
        // (c) only toggle (i.e. open) the accordion if it's NOT already expanded
        if (!this.control.hasAttribute("aria-expanded") || this.control.getAttribute("aria-expanded") === "false");
        this.toggle();
      }
    }
  };

  /**
   * Toggle accordion open/closed:
   * The container element needs a CSS class.
   * The button control needs an aria attribute.
   */
  Accordion.prototype.toggle = function () {
    this.element && this.element.classList.toggle("stir-accordion--active");
    this.control && this.control.setAttribute("aria-expanded", this.control.getAttribute("aria-expanded") === "true" ? "false" : "true");
  };

  Accordion.prototype.handleClick = function (e) {
    if (!e.target) return;

    // capture clicks on CONTROL directly (<a>) or its
    // parent element (e.g. <h2> or <h3>) or a child
    // element (e.g. <span>). Ignore any other clicks and
    // just let those bubble on through.
    if (e.target == this.control || e.target == this.control.parentNode || e.target.parentNode == this.control) {
      this.toggle();

      if (this.settings.doDeepLink) {
        if (history.replaceState) history.replaceState(null, null, "#" + this.panel.id);
        else location.hash = "#" + this.panel.id;
      }

      e.preventDefault();
    }
  };

  return Accordion;
})();

/**
 * On load: Set up the accordions
 **/
(function () {
  var debug = UoS_env.name !== "prod" ? true : false;
  // Loop through all stir-accordion elements on the page, and
  // initialise each one as an Accordion widget.
  Array.prototype.forEach.call(document.querySelectorAll(".stir-accordion"), function (accordion) {
    debug && console.warn('[Accordion] Deprecated. Use data-behaviour="accordion" instead of .stir-accordion', accordion);
    new stir.accord(accordion, false);
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-behaviour="accordion"]'), function (accordion) {
    new stir.accord(accordion, false);
  });
})();
