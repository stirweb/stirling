/**
 * BREADCRUMBS
 * @param trail the DomElement for the breadcrumb trail
 * @param useSchemaDotOrg boolean whether to use Schema.org or not
 * @param collapse boolean whether to collapse or not
 *
 */
(function (trail, useSchemaDotOrg, collapse) {
  if (!trail) return; // just bail out now if there is no breadcrumb trail
  var schemaData = [];
  var hierarchyLevel = 0; // track the depth as we move through the hierarchy
  var hierarchyMax = trail.getAttribute("data-hierarchy-max") || 4;
  var TRUNC_THRESHOLD = 25;
  // Max level befor collapsing kicks in. Default to 4 levels, but can be
  // changed by setting the data-* attribute in the HTML/template.

  // loop through all the "crumbs" in the breadcrumb trail, looking for
  // DOM elements only (element type "1") i.e. not a whitespace text node etc.
  // Todo: consider using newer API `firstElementChild` as that would simplify things.
  for (var crumb = trail.firstChild; crumb; crumb = crumb.nextSibling) {
    if (1 === crumb.nodeType) {
      // t4 adds empty breadcrumbs so we'll remove them:
      if ("" === crumb.textContent.trim()) {
        crumb = crumb.previousSibling; // move pointer back a step
        crumb.parentNode.removeChild(crumb.nextSibling); // remove the empty crumb
      } else {
        var link = crumb.querySelector("a");
        var subMenu = crumb.querySelector("ul");

        if (subMenu) {
          crumb.classList.add("breadcrumbs__item--has-submenu");
          // make a copy the breadcrumb link in the submenu so we can still navigate
          // to that page. The original link will be used instead to toggle submenu open/closed.
          var subMenuHomeItem = document.createElement("li");
          subMenuHomeItem.appendChild(link.cloneNode(true));
          subMenu.insertAdjacentElement("afterbegin", subMenuHomeItem);

          /**
           * Add a click-listener to each crumb to toggle the submenu open/close.
           * Passing `link` into the function-scope closure so we don't have to do a
           * querySelect() to reaquire it on every click event. Without a closure
           * the `link` would be unpredictable.
           */
          applyCrumbClickListener(crumb, link);
        }

        // Add the data for Schema.org JSON-LD
        if (useSchemaDotOrg) {
          schemaData.push({
            "@type": "ListItem",
            position: Array.prototype.indexOf.call(trail.children, crumb) + 1,
            item: {
              "@id": link.href,
              name: link.textContent,
            },
          });
        }

        if (collapse) {
          crumb.setAttribute("data-hierarchy-level", hierarchyLevel++);
        }
      }
    }
  }

  if (collapse) {
    if (hierarchyLevel > hierarchyMax) {
      // Out of all the crumbs, select just the ones we want to collapse
      // and transform the resulting NodeList into a regular Array:
      var crumbsToCollapse = Array.prototype.slice.call(trail.querySelectorAll("[data-hierarchy-level]")).slice(0, 0 - hierarchyMax);

      // Just return early if there are too few crumbs:
      if (1 === crumbsToCollapse.length) return;

      // Remove the first crumb (i.e. never hide "home"), but store it
      // as 'home' for reference later.
      var home = crumbsToCollapse.shift();

      // Create the ellipsis drop-down menu to contain the collapsed breadcrumbs
      var ellipsis = document.createElement("li");
      var ellipsisLink = document.createElement("a");
      var ellipsisMenu = document.createElement("ul");

      ellipsis.appendChild(ellipsisLink);
      ellipsis.appendChild(ellipsisMenu);

      // add the ellipsis just after 'home' breadcrumb
      home.insertAdjacentElement("afterend", ellipsis);
      ellipsisLink.innerText = "…";
      ellipsis.classList.add("breadcrumbs__item--has-submenu");
      ellipsis.setAttribute("data-collapse", "");

      // Collapse the breadcrumbs and append them to the new ellipsis menu:
      crumbsToCollapse.forEach(function (value, index) {
        var li = document.createElement("li"); //create a fresh <li>
        li.appendChild(value.querySelector("a")); //recycle the <a> from the crumb
        ellipsisMenu.appendChild(li); //append to the new ellipsis menu
        value.parentNode.removeChild(value); //destroy the old breadcrum
        // Note: destroying the old crumb will also destroy any listeners and sub-menus
        // that were attached to it.
      });

      // Set the ellipsis to have the same behaviour as the other breadcrumbs
      // i.e. click to show the drop-down menu
      applyCrumbClickListener(ellipsis, ellipsisLink);
    }

    // Truncate the remaining links, except the first (home) and last (current page):
    Array.prototype.slice.call(trail.querySelectorAll("li[data-hierarchy-level] > a"), 1, -1).forEach(function (link) {
      if (link.innerText.length > TRUNC_THRESHOLD) {
        link.setAttribute("title", link.innerText);
        link.innerHTML = stir.String.truncate.apply(link.innerText, [TRUNC_THRESHOLD, true]);
      }
    });
  }

  // Add the attributes/markup for Schema.org microdata
  // See: https://schema.org/BreadcrumbList
  if (useSchemaDotOrg && window.JSON) {
    var schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: schemaData,
    });
    trail.insertAdjacentElement("beforebegin", schema);
  }

  function applyCrumbClickListener(crumb, link) {
    console.log(crumb.children[0]);
    console.log(link);

    crumb.addEventListener("click", function (event) {
      // Here we'll prevent the click event on the crumb (or any of its child elements) bubbling up.
      // Elsewhere we've set a click handler (on the document body) which will trigger
      // the menu (or any other widgets) to close. By trapping the clicks within the crumb
      // it prevents the user accidentally closing the dropdown by e.g. clicking in the margin
      // around the links.
      event.stopPropagation();

      // Now we will deal specifically with click events on the crumb (<li> element, i.e. `this`)
      // and the main breadcrumb link (<a> element, `link`), or any direct children of the <a>
      // such as <span>. The links's default action will be prevented, but any other child elements
      // of the <li> (such as submenu links) will not be affected. (We prevent default navigation
      //so that we can use the main link to toggle the dropdown instead).
      if (event.target === link || event.target.parentElement === link) {
        event.preventDefault();

        /**
         * This will toggle the `is-active` class on/off.
         * We can simplify this in the future and just use `classList.toggle()`
         * …when we drop IE support.
         */
        var wasActive = trail.querySelector(".is-active");
        if (this.classList.contains("is-active")) {
          this.classList.remove("is-active");
        } else {
          this.classList.add("is-active");
        }
        wasActive && wasActive.classList.remove("is-active");

        // close all other on-screen widgets
        if (self.UoS_closeAllWidgetsExcept) UoS_closeAllWidgetsExcept("breadcrumbs");
      }
    });
  }
})(
  document.querySelector(".breadcrumbs"), // {HTMLElement} DOM element to use
  true, // {boolean}     Use Schema.org markup?
  true // {boolean}     Collapse breadcrumbs?
);
