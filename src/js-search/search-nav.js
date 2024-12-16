/*
  onscrollend Pollyfill for Safari
*/

if ("undefined" != typeof window && !("onscrollend" in window)) {
  const i = new Event("scrollend"),
    s = new Set();
  document.addEventListener(
    "touchstart",
    (e) => {
      for (let t of e.changedTouches) s.add(t.identifier);
    },
    { passive: !0 }
  ),
    document.addEventListener(
      "touchend",
      (e) => {
        for (let t of e.changedTouches) s.delete(t.identifier);
      },
      { passive: !0 }
    ),
    document.addEventListener(
      "touchcancel",
      (e) => {
        for (let t of e.changedTouches) s.delete(t.identifier);
      },
      { passive: !0 }
    );
  let l = new WeakMap();
  function e(e, t, n) {
    let o = e[t];
    e[t] = function () {
      let e = Array.prototype.slice.apply(arguments, [0]);
      o.apply(this, e), e.unshift(o), n.apply(this, e);
    };
  }
  function t(e, t, n, o) {
    if ("scroll" != t && "scrollend" != t) return;
    let r = this,
      d = l.get(r);
    if (void 0 === d) {
      let t = 0;
      (d = {
        scrollListener: (e) => {
          clearTimeout(t),
            (t = setTimeout(() => {
              s.size ? setTimeout(d.scrollListener, 100) : (r && r.dispatchEvent(i), (t = 0));
            }, 100));
        },
        listeners: 0,
      }),
        e.apply(r, ["scroll", d.scrollListener]),
        l.set(r, d);
    }
    d.listeners++;
  }
  function n(e, t, n) {
    if ("scroll" != t && "scrollend" != t) return;
    let o = this,
      i = l.get(o);
    void 0 !== i && (--i.listeners > 0 || (e.apply(o, ["scroll", i.scrollListener]), l.delete(o)));
  }
  e(Element.prototype, "addEventListener", t), e(window, "addEventListener", t), e(document, "addEventListener", t), e(Element.prototype, "removeEventListener", n), e(window, "removeEventListener", n), e(document, "removeEventListener", n);
}
var scrollend = { __proto__: null };

/*
      
  Search Tabs Component

*/
(function () {
  console.log("hello");
  /*
        Debounce
  */
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  /*
        Carousel Tab Btns initialisation and events
    */
  const initCarousel = (carousel) => {
    /*
      Nodes
    */
    const slidesContainer = carousel.querySelector(".carousel-slides");
    const slideFirst = carousel.querySelector(".carousel-slides h2:first-of-type button");
    const slideLast = carousel.querySelector(".carousel-slides h2:last-of-type button");
    const prevButton = carousel.querySelector(".slide-arrow-prev");
    const nextButton = carousel.querySelector(".slide-arrow-next");

    /*
      Helpers
    */
    const calculateSlideDist = () => slidesContainer.clientWidth + 10;

    const disableBtnState = (btnContainer) => {
      btnContainer.setAttribute("disabled", "disabled");
      btnContainer.querySelector("span")?.classList.add("u-opacity-0");
    };

    const enableBtnState = (btnContainer) => {
      btnContainer.removeAttribute("disabled");
      btnContainer.querySelector("span")?.classList.remove("u-opacity-0");
    };

    const toogleFull = (state) => {
      state ? slidesContainer.classList.add("align-center") : slidesContainer.classList.remove("align-center");
      state ? prevButton.classList.remove("u-border-right-solid") : prevButton.classList.add("u-border-right-solid");
      state ? nextButton.classList.remove("u-border-left-solid") : nextButton.classList.add("u-border-left-solid");
    };

    const updateControlsVisibility = () => {
      let firstInView = false;
      let lastInView = false;

      enableBtnState(prevButton);
      enableBtnState(nextButton);

      const firstSlideRect = slideFirst.getBoundingClientRect();
      const containerRect = slidesContainer.getBoundingClientRect();

      if (firstSlideRect.left >= containerRect.left) {
        disableBtnState(prevButton);
        firstInView = true;
      }

      const lastSlideRect = slideLast.getBoundingClientRect();
      if (lastSlideRect.right <= containerRect.right) {
        disableBtnState(nextButton);
        lastInView = true;
      }

      firstInView && lastInView ? toogleFull(true) : toogleFull(false);
    };

    // Debounce
    const debouncedUpdateControls = debounce(updateControlsVisibility, 250);

    const scrollCarousel = (direction) => {
      const slideDist = calculateSlideDist();
      slidesContainer.scrollLeft += direction === "prev" ? -slideDist : slideDist;
      slidesContainer.addEventListener("scrollend", debouncedUpdateControls);
    };

    /*
      Initialisation
    */

    updateControlsVisibility();

    const scrollEvents = ["wheel", "touchend"];
    scrollEvents.forEach((event) => {
      slidesContainer.addEventListener(event, debouncedUpdateControls);
    });

    prevButton.addEventListener("click", () => scrollCarousel("prev"));
    nextButton.addEventListener("click", () => scrollCarousel("next"));

    // Debounced resize listener
    window.addEventListener("resize", debouncedUpdateControls);
  };

  /*
        
      Search Tabs 
  
  */
  const doSearchTabs = (tabsScope) => {
    // Early return if no tabsScope provided
    if (!tabsScope) return;

    // Show the tabs container
    tabsScope.classList.remove("hide");

    // Select buttons and tab panels
    const buttons = tabsScope.querySelectorAll("button");
    const tabs = tabsScope.querySelectorAll("#mySlider1 > div");

    /*
     * Open a specific tab and update UI accordingly
     * @param {string} openTabId - The ID of the tab to open
     * @param {NodeList} tabs - All tab panels
     * @param {NodeList} buttons - All tab buttons
     * @param {Element} tabsScope - The container element
     */
    const openTab = (openTabId, tabs, buttons, tabsScope) => {
      // Hide all tabs and remove active states
      tabs.forEach((tab) => {
        tab.setAttribute("aria-hidden", "true");
        tab.classList.add("hide");
      });

      // Remove active states from all buttons
      buttons.forEach((button) => {
        if (button) {
          button.classList.remove("u-white", "u-bg-heritage-green");
        }
      });

      // Find and show the selected tab
      const tabToOpen = tabsScope.querySelector(`[data-panel="${openTabId}"]`);
      if (tabToOpen) {
        tabToOpen.classList.remove("hide");
        tabToOpen.removeAttribute("aria-hidden");
      }

      // Activate the corresponding button
      const buttonToActivate = tabsScope.querySelector(`[data-open="${openTabId}"]`);
      if (buttonToActivate) {
        buttonToActivate.classList.add("u-white", "u-bg-heritage-green");
      }
    };

    // Add click event listeners to tab buttons
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const btn = event.target.closest("button[data-open]");
        if (!btn) return;

        const openTabId = btn.getAttribute("data-open") || "all";
        openTab(openTabId, tabs, buttons, tabsScope);

        // Update URL query parameter if event is user-initiated
        if (event.isTrusted) {
          QueryParams.set("tab", openTabId);
        }
      });
    });

    // Initialize tab panel attributes for accessibility
    tabs.forEach((tab) => {
      const panelId = tab.getAttribute("data-panel");
      tab.setAttribute("role", "tabpanel");
      tab.setAttribute("tabindex", "0");
      tab.setAttribute("id", `search_results_panel_${panelId}`);
      tab.setAttribute("aria-labelledby", `searchtab_${panelId}`);
    });

    // Determine initial open tab from URL or default to 'all'
    const initialTabId = QueryParams.get("tab") || "all";
    const initialButton = tabsScope.querySelector(`[data-open="${initialTabId}"]`);

    // Open and scroll to the initial tab
    if (initialButton) {
      initialButton.click();
      initialButton.scrollIntoView({ block: "end" });
    }
  };

  /*
  
      ON LOAD
      
    */

  // IE Guard Clause
  if ("undefined" === typeof window.URLSearchParams) return;

  const searchTabs = stir.nodes(".c-search-results-area");
  searchTabs.forEach((element) => doSearchTabs(element));

  const carousels = stir.nodes(".carousel");
  carousels.forEach((element) => initCarousel(element));
})();
