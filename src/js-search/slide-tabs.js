var stir = stir || {};
stir.searchUI = stir.searchUI || {};

/*
  Aside Accordion Transform Helper
  @author: ryankaye
  @version: 1.0
  @description: Transform an aside to an accordion (mobile folding)
*/
stir.searchUI.asideAccordion = (filterNode, index) => {
  console.log("hello");
  const header = filterNode.querySelector("p.c-search-filters-header");
  const body = filterNode.querySelector("div");

  if (header && body) {
    filterNode.setAttribute("data-behaviour", "accordion");

    const button = document.createElement("button");
    button.innerHTML = header.innerHTML;
    button.setAttribute("id", "filteraccordbtn_" + index);
    button.setAttribute("aria-controls", "filteraccordpanel_" + index);
    button.setAttribute("aria-expanded", "false");

    header.innerHTML = "";
    header.appendChild(button);

    body.setAttribute("id", "filteraccordpanel_" + index);
    body.setAttribute("aria-labelledby", "filteraccordbtn_" + index);
    body.setAttribute("role", "region");
    body.classList.add("hide");

    button.addEventListener("click", (e) => {
      body.classList.toggle("hide");
      body.classList.contains("hide") ? button.setAttribute("aria-expanded", "false") : button.setAttribute("aria-expanded", "true");
    });
  }
};

/* 
    Vertical Slider Component
    @author: ryankaye
    @version: 1.0
*/
stir.searchUI.verticalSlider = (item, target) => {
  /* buildNavDiv */
  const buildNavDiv = () => {
    const div = document.createElement("div");

    div.classList.add("tns-controls");
    div.setAttribute("aria-label", "Carousel Navigation");
    div.setAttribute("tabindex", "0");

    return div;
  };

  /* buildNavButton */
  const buildNavButton = (id, text, icon) => {
    const btn = document.createElement("button");

    btn.innerHTML = '<span class="uos-' + icon + ' icon--medium "></span>';
    btn.setAttribute("data-controls", text);
    btn.setAttribute("aria-label", text);
    btn.setAttribute("type", "button");
    btn.setAttribute("tabindex", "-1");
    btn.setAttribute("aria-controls", id);

    return btn;
  };

  /* Build the full Button + wrapper + listener */
  const buildNavElement = (containerId, text, icon) => {
    const div = buildNavDiv();
    const btn = buildNavButton(containerId, text, icon);

    div.insertAdjacentElement("beforeend", btn);

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      verticalSlider.goTo(text);
    });

    return div;
  };

  /* initSlider */
  const initSlider = (container) => {
    if (!container) return;

    const divPrev = buildNavElement(container.id, "prev", "chevron-up");
    const divNext = buildNavElement(container.id, "next", "chevron-down");

    container.parentElement.parentElement.insertAdjacentElement("afterend", divNext);
    container.parentElement.parentElement.insertAdjacentElement("beforebegin", divPrev);

    target.parentElement.setAttribute("data-inittns", "");
  };

  /* Config */
  const verticalSlider = tns({
    container: item,
    controls: false,
    loop: false,
    slideBy: 7,
    items: 7,
    axis: "vertical",
    autoHeight: false,
    touch: true,
    swipeAngle: 30,
    speed: 400,
  });

  verticalSlider && initSlider(verticalSlider.getInfo().container);
};

/* 
  Slider Aria Helper
  @author: ryankaye
  @version: 1.0
  @description: Add Aria Labels to a slider after its initialised 
*/
stir.searchUI.sliderArias = (node) => {
  if (!node) return;

  setTimeout(() => {
    const controlsPrevious = node.querySelector('[data-controls="prev"]');
    const controlsNext = node.querySelector('[data-controls="next"]');

    controlsPrevious && controlsPrevious.setAttribute("aria-label", "Previous");
    controlsNext && controlsNext.setAttribute("aria-label", "Next");

    return true;
  }, 100);
};

/*
   Slide Tab Component
   @author: ryankaye
   @version: 1.0
 */
stir.searchUI.slideTab = (scope) => {
  if (!scope) return;

  const nodes = {
    slideBox: scope,
    slideNavBox: scope.querySelector("[data-searchbtnstns]"),
    slideNavBtns: Array.prototype.slice.call(scope.querySelectorAll("[data-searchbtnstns] h2 button")),
    slideResultTabs: Array.prototype.slice.call(scope.querySelectorAll("#mySlider1 > div")),
    accordions: Array.prototype.slice.call(scope.querySelectorAll("[data-behaviour=accordion]")),
  };

  if (!nodes.slideNavBox || !nodes.slideNavBtns || !nodes.slideResultTabs) return;

  /* initTabs */
  const initTabs = (nodes) => {
    const sliderNav = tns({
      container: "#" + nodes.slideNavBox.id,
      items: calcItemsToShow(stir.MediaQuery.current),
      loop: false,
      slideBy: "page",
      controls: true,
      controlsText: ['<span class="uos-chevron-left icon--medium "></span>', '<span class="uos-chevron-right icon--medium "></span>'],
      touch: true,
      swipeAngle: 30,
      navPosition: "top",
      autoHeight: true,
      autoplay: false,
    });

    nodes.slideNavBox.setAttribute("role", "tablist");
    stir.searchUI.sliderArias(nodes.slideBox);

    nodes.slideNavBtns.forEach((item) => {
      item.closest("h2").style.width = "90px"; // item.offsetWidth + "px";
      //item.setAttribute("role", "tab");
      item.closest("div.tns-item").setAttribute("role", "tab");
      item.setAttribute("tabindex", "-1");
      item.setAttribute("type", "button");
      item.setAttribute("aria-controls", "search_results_panel_" + item.getAttribute("data-open"));
      item.setAttribute("id", "searchtab_" + item.getAttribute("data-open"));
    });

    nodes.slideResultTabs.forEach((item) => {
      item.setAttribute("role", "tabpanel");
      item.setAttribute("tabindex", "0");
      item.setAttribute("id", "search_results_panel_" + item.getAttribute("data-panel"));
      item.setAttribute("aria-labelledby", "searchtab_" + item.getAttribute("data-panel"));
    });

    const open = QueryParams.get("tab") ? QueryParams.get("tab") : "all";
    const btnActive = scope.querySelector("button[data-open=" + open + "]");

    if (nodes.slideNavBox && nodes.slideNavBox.classList.contains("hide-no-js")) nodes.slideNavBox.classList.remove("hide-no-js");

    if (btnActive) {
      btnActive.click();
      if (nodes.slideNavBtns.indexOf(btnActive) >= calcItemsToShow(stir.MediaQuery.current)) sliderNav.goTo(nodes.slideNavBtns.indexOf(btnActive));
    }
  };

  /* calcItemsToShow */
  const calcItemsToShow = (size) => {
    if (size === "small") return 3;
    if (size === "medium") return 4;

    return nodes.slideNavBtns.length;
  };

  /* controlSticky */
  const controlSticky = () => {
    const top = nodes.slideBox.getBoundingClientRect().top;

    top < 0.01 && nodes.slideBox.classList.add("stuck");
    top > 0 && nodes.slideBox.classList.remove("stuck");
  };

  /* handleTabClick */
  const handleTabClick = (e) => {
    const btn = e.target.closest("button[data-open]");

    if (!btn) return;

    const open = btn.getAttribute("data-open") || "null";
    const panel = stir.node('[data-panel="' + open + '"]');

    nodes.slideNavBtns.forEach((item) => {
      item.parentElement.classList.remove("slide-tab--active");
    });

    btn.closest("h2").classList.add("slide-tab--active");

    nodes.slideResultTabs.forEach((el) => {
      el.classList.add("hide");
      el.setAttribute("aria-hidden", "true");

      if (el.getAttribute("data-panel") === open) {
        el.classList.remove("hide");
        el.removeAttribute("aria-hidden");
      }
    });

    panel.classList.remove("hide");
    panel.removeAttribute("aria-hidden");
    stir.scrollToElement && stir.scrollToElement(nodes.slideBox, 0);

    // only set tab on user-clicks, not scripted ones
    if (e.isTrusted) QueryParams.set("tab", open);
  };

  /* throttle */
  function throttle(callback, limit) {
    var wait = false;
    return function () {
      if (!wait) {
        callback.call();
        wait = true;
        setTimeout(function () {
          wait = false;
        }, limit);
      }
    };
  }

  /*
    Event Listeners
  */
  document.addEventListener("scroll", throttle(controlSticky, 200));
  nodes.slideNavBox.addEventListener("click", handleTabClick);
  window.addEventListener("popstate", (ev) => initTabs(nodes)); // reinit tabs on history navigation (back/forward)

  initTabs(nodes);
};

/*
    O N   L O A D   E V E N T S
 */

(function () {
  /* 
    IE Guard Clause 
  */
  if ("undefined" === typeof window.URLSearchParams) return;

  /*
    Find all vertical sliders 
    and initialte them
   */
  const handleAccordionClick = (e) => {
    if (e.target.parentElement.dataset.containtns === "" && e.target.parentElement.dataset.inittns !== "") {
      const item = e.target.parentElement.nextElementSibling.children[0];
      if (item) stir.searchUI.verticalSlider(item, e.target);
    }
  };

  stir.nodes('[data-containtns=""]').forEach((item) => {
    item.children[0].addEventListener("click", handleAccordionClick);
  });

  /*
    Find all Slide Tabs Components 
    and initialise them
   */
  const slideTabs = stir.nodes(".c-search-results-area");

  if (slideTabs.length) slideTabs.forEach((item) => stir.searchUI.slideTab(item));

  /*
    Find all mobile filter accordions 
    and initialise them 
   */
  const filterNodes = stir.nodes(".c-search-results-filters");

  if (stir.MediaQuery.current === "small" || stir.MediaQuery.current === "medium") {
    if (filterNodes.length) {
      filterNodes.forEach((element, index) => stir.searchUI.asideAccordion(element, index));
    }
  }
})();
