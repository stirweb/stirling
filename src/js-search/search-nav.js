(function () {
  /*
        initCarousel
    */
  const initCarousel = (carousel) => {
    const slidesContainer = carousel.querySelector(".carousel-slides");

    const slideFirst = carousel.querySelector(".carousel-slide h2:first-of-type");
    const slideLast = carousel.querySelector(".carousel-slide h2:last-of-type");

    const prevButton = carousel.querySelector(".slide-arrow-prev");
    const nextButton = carousel.querySelector(".slide-arrow-next");
    const slideDist = slidesContainer.clientWidth + 10;

    if (stir.MediaQuery.current !== "small") {
      const slidePanel = carousel.querySelector(".carousel-slide");

      prevButton.classList.add("hide");
      nextButton.classList.add("hide");
      slidePanel.classList.remove("u-gap-8");
      slidePanel.classList.add("u-gap");
      slidesContainer.removeAttribute("style");
      return;
    }

    const options = {
      root: slidesContainer,
      rootMargin: "0px",
      threshold: 1,
    };

    const disableBtnState = (btnContainer) => {
      btnContainer.setAttribute("disabled", "disabled");
      btnContainer.querySelector("span").classList.add("u-opacity-20");
    };

    const enableBtnState = (btnContainer) => {
      btnContainer.removeAttribute("disabled");
      btnContainer.querySelector("span").classList.remove("u-opacity-20");
    };

    const observerFirst = new IntersectionObserver(
      (entries, observer) =>
        entries.forEach((entry) => {
          entry.isIntersecting ? disableBtnState(prevButton) : enableBtnState(prevButton);
        }),
      options
    );

    const observerLast = new IntersectionObserver(
      (entries, observer) =>
        entries.forEach((entry) => {
          entry.isIntersecting ? disableBtnState(nextButton) : enableBtnState(nextButton);
        }),
      options
    );

    observerFirst.observe(slideFirst);
    observerLast.observe(slideLast);

    nextButton.addEventListener("click", () => (slidesContainer.scrollLeft += slideDist));
    prevButton.addEventListener("click", () => (slidesContainer.scrollLeft -= slideDist));
  };

  /*
        doSearchTabs
    */
  const doSearchTabs = (tabsScope) => {
    if (!tabsScope) return;
    tabsScope.classList.remove("hide");

    const buttons = tabsScope.querySelectorAll("button");
    const tabs = tabsScope.querySelectorAll("#mySlider1 > div");

    /* openTab */
    const openTab = (open, tabs, buttons, tabsScope) => {
      tabs.forEach((tab) => {
        tab.setAttribute("aria-hidden", "true");
        tab.classList.add("hide");
      });

      buttons.forEach((button) => {
        button.closest("h2") ? button.closest("h2").classList.remove("u-white", "u-bg-heritage-green") : null;
      });

      const tabOpen = tabsScope.querySelector('[data-panel="' + open + '"]');
      tabOpen && tabOpen.classList.remove("hide");
      tabOpen && tabOpen.removeAttribute("aria-hidden");

      const btnOpen = tabsScope.querySelector('[data-open="' + open + '"]');
      btnOpen && btnOpen.closest("h2").classList.add("u-white", "u-bg-heritage-green");
    };

    /* Event Listener */
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const btn = event.target.closest("button[data-open]");
        if (!btn) return;

        const open = btn.getAttribute("data-open") || "all";
        openTab(open, tabs, buttons, tabsScope);
        stir.scrollToElement && stir.scrollToElement(tabsScope, 0);

        if (event.isTrusted) QueryParams.set("tab", open);
      });
    });

    /* Initialisation */

    tabs.forEach((item) => {
      item.setAttribute("role", "tabpanel");
      item.setAttribute("tabindex", "0");
      item.setAttribute("id", "search_results_panel_" + item.getAttribute("data-panel"));
      item.setAttribute("aria-labelledby", "searchtab_" + item.getAttribute("data-panel"));
    });

    const open = QueryParams.get("tab") ? QueryParams.get("tab") : "all";
    const btnOpen = tabsScope.querySelector('[data-open="' + open + '"]') || null;
    btnOpen && btnOpen.click();
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
