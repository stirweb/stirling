/**
 * BREADCRUMBS
 * @param trail the DomElement for the breadcrumb trail
 * @param useSchemaDotOrg boolean whether to use Schema.org or not
 * @param collapse boolean whether to collapse or not
 *
 */
(function (trail, useSchemaDotOrg, collapse) {
  if (!trail) return; // just bail out now if there is no breadcrumb trail

  const compact = "small"===stir.MediaQuery.current;


  var schemaData = [];
  var hierarchyLevel = 0; // track the depth as we move through the hierarchy
  //var hierarchyMax = trail.getAttribute("data-hierarchy-max") || (compact?1:4);
  const hierarchyMax = {
    small: 1,
    medium: 2,
    large:3
  };
  var TRUNC_THRESHOLD = 25;
  // Max level befor collapsing kicks in. Default to 4 levels, but can be
  // changed by setting the data-* attribute in the HTML/template.
  
	// Here we'll prevent the click event on the crumb (or any of its child elements) bubbling up.
	// Elsewhere we've set a click handler (on the document body) which will trigger
	// the menu (or any other widgets) to close. By trapping the clicks within the crumb
	// it prevents the user accidentally closing the dropdown by e.g. clicking in the margin
	// around the links.
  trail.addEventListener("click", event=>event.stopPropagation());

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

		  link.addEventListener("click", crumbListener);
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
    if (hierarchyLevel > hierarchyMax.small) {
      // Out of all the crumbs, select just the ones we want to collapse
      // and transform the resulting NodeList into a regular Array:
      var crumbsToCollapse = Array.prototype.slice.call(trail.querySelectorAll("[data-hierarchy-level]")).slice(0, 0 - hierarchyMax.small);
      
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
      if(crumbsToCollapse.length<hierarchyMax.medium) {
        ellipsis.classList.add("show-for-small-only");
      }
      ellipsis.setAttribute("data-collapse", "");

      // Collapse the breadcrumbs and append them to the new ellipsis menu:
      crumbsToCollapse.forEach((crumb,index) => {
        var li = document.createElement("li");
        var a = crumb.querySelector("a").cloneNode(true);
        li.appendChild(a); 
        ellipsisMenu.appendChild(li);
        if(index>crumbsToCollapse.length-hierarchyMax.medium){
          crumb.classList.add("show-for-medium");
          a.classList.add("show-for-small-only");
        } else if(index>crumbsToCollapse.length-hierarchyMax.large) {
          crumb.classList.add("show-for-large");
          a.classList.add("hide-for-large");
        } else {
          crumb.remove();
        }
      });

      // Set the ellipsis to have the same behaviour as the other breadcrumbs
      // i.e. click to show the drop-down menu
      //applyCrumbClickListener(ellipsis, ellipsisLink);
	  ellipsisLink.addEventListener("click", crumbListener);
    }

    // Truncate the remaining links…
	const remaining = Array.prototype.slice.call(trail.querySelectorAll("li[data-hierarchy-level] > a"));
	
	// Just set this to -1 to NOT truncate the last item
	// otherwise this will truncate it on small screens
	const truncateLastItem = compact?remaining.length:-1;

    remaining.slice(1,truncateLastItem).forEach(function (link) {
      if (link.textContent.length > TRUNC_THRESHOLD) {
        link.setAttribute("title", link.textContent);
        link.innerHTML = stir.String.truncate.apply(link.textContent, [TRUNC_THRESHOLD, true]);
		// must use innerHTML to properly encode the ellipsis!
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
  function crumbListener (event) {
	  event.preventDefault();
	  var wasActive = trail.querySelector(".is-active");
	  event.target.parentElement.classList.toggle("is-active");
	  wasActive && wasActive.classList.remove("is-active");

	  // close all other on-screen widgets
	  if (self.UoS_closeAllWidgetsExcept) UoS_closeAllWidgetsExcept("breadcrumbs");
	}
})(
  document.querySelector(".breadcrumbs"), // {HTMLElement} DOM element to use
  true, // {boolean}     Use Schema.org markup?
  true // {boolean}     Collapse breadcrumbs?
);
