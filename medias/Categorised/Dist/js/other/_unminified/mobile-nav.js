/*
   MOBILE MENU 
 */

(function (scope) {
  if (!scope) return;

  const menuContainer = scope; // #mobile-menu-2
  const menuOpenBtn = stir.node("#open_mobile_menu");
  const menuCloseBtn = stir.node("#close_mobile_menu");
  const menu = stir.node("ul.sitemenu-2");
  const hideNodes = ["main", "footer", "#layout-header", ".breadcrumbs-container"];

  /* On load */
  const menusCache = { default: menu.innerHTML };

  /*
        Renderers
  */

  const renderHome = () => {
    return `<li><a class="button button--left-align expanded button--back secondary u-m-0 text-left" href="/">Home</a>`;
  };

  const renderUpLevel = (item) => {
    return item
      ? `<li class="u-bg-heritage-green">
            <a class="button button--left-align heritage-green expanded button--back u-m-0 text-left" href="${item.p}">
                ${item.t}
            </a>
        </li>`
      : ``;
  };

  const renderLanding = (item) => {
    return item
      ? `<li class="u-underline u-energy-teal--40 ">
            <a class="button no-arrow button--left-align subtle expanded u-m-0 text-left " href="${item.p}" data-action="go">
              <div class="flex-container align-middle u-gap-16">  
                <span class="u-flex1">${item.t} home</span>
                <span class="uos-chevron-right u-icon"></span>
                </div>
            </a>
        </li>`
      : ``;
  };

  const renderLoading = () => `<li><span class="button expanded no-arrow">Loading...</span></li>`;

  const renderLink = (item) => {
    const link = item.u ? item.u : item.p;
    return item
      ? `
        <li class="u-underline u-energy-teal--40 flex-container align-middle">
            <a class="button no-arrow button--left-align clear expanded u-m-0 text-left" href="${link}">
              <div class="flex-container align-middle u-gap-16"> 
                <span class="u-flex1">${item.t}</span>
                <span class="uos-chevron-right u-icon"></span>
              </div>
            </a>
        </li>`
      : ``;
  };

  const renderMenu = (links) => links.map(renderLink).join("");

  /*
      State Helpers   
   */

  const getMenuAjaxUrl = (sect) => {
    if (UoS_env.name === "dev" || UoS_env.name === "qa") {
      return "/pages/data/awd/mobilenavs/" + sect + "/index.json";
    }
    return "/developer-components/includes/template-external/mobile-nav-json/" + sect + "/index.json"; // live
  };

  /* getCurrentUrl */
  const getCurrentUrl = () => {
    if (UoS_env.name === "dev" || UoS_env.name === "qa") {
      return "/about/professional-services/";
    }
    return window.location.pathname; // live
  };

  /* getParentSection */
  const getParentSection = (url) => url.split("/")[1];

  /* getPreviousLevelPath */
  const getPreviousLevelPath = (currentUrl) => {
    const to = currentUrl.slice(0, -1).lastIndexOf("/");
    const to_ = to == -1 ? currentUrl.length : to + 1;
    return currentUrl.substring(0, to_);
  };

  /* getCurrentMenu */
  const getCurrentMenu = (initialData, currentUrl, evnt) => {
    const currentLevel = currentUrl.split("/").length + 1;
    const links = initialData.filter((item) => {
      if (item.p && item.p.split("/").length === currentLevel && item.p.includes(currentUrl)) return item;
    });

    if (!links.length && evnt === "click") return "";

    const landing = initialData.filter((item) => {
      if (item.p === currentUrl) return item;
    });

    const upUrl = getPreviousLevelPath(currentUrl);

    const upLevel = initialData.filter((item) => {
      if (item.p === upUrl) return item;
    });

    return renderHome() + renderUpLevel(upLevel[0]) + renderLanding(landing[0]) + renderMenu(links);
  };

  /*
      Controller: Fetch the menu data, render to html and output or href if its a link
   */
  const fetchData = (currentUrl, menusCache, evnt) => {
    const baseSection = getParentSection(currentUrl);
    const ajaxUrl = getMenuAjaxUrl(baseSection);

    console.log(currentUrl);

    if (currentUrl.includes("https://")) {
      window.location = currentUrl;
      return { action: "go " };
    }

    if (baseSection === "") {
      menu.innerHTML = menusCache.default;
      return { action: "navigate" };
    }

    if (menusCache[baseSection]) {
      const html = getCurrentMenu(menusCache[baseSection], currentUrl, evnt);

      if (!html) {
        window.location = currentUrl;
        return { action: "go " };
      }

      stir.setHTML(menu, html);
      return { action: "navigate" };
    }

    stir.setHTML(menu, renderLoading());

    stir.getJSON(ajaxUrl, (initialData) => {
      if (initialData.error) {
        stir.setHTML(menu, menusCache.default);
        return { action: "navigate" };
      }

      menusCache[baseSection] = initialData; // cache the data
      const html2 = getCurrentMenu(initialData, currentUrl, evnt);
      if (!html2) {
        window.location = currentUrl;
        return { action: "go" };
      }
      stir.setHTML(menu, html2);
      return { action: "navigate" };
    });

    return { action: "null" };
  };

  /*
     Events / Listeners
   */

  /* Open */
  menuOpenBtn &&
    menuOpenBtn.addEventListener("click", (e) => {
      hideNodes.forEach((element) => {
        stir.node(element) && stir.node(element).classList.add("hide");
      });

      menuContainer.classList.add("c-mobile-menu-visible");

      fetchData(getCurrentUrl(), menusCache, "open");

      e.preventDefault();
    });

  /* Close */
  menuCloseBtn &&
    menuCloseBtn.addEventListener("click", (e) => {
      hideNodes.forEach((element) => {
        stir.node(element) && stir.node(element).classList.remove("hide");
      });

      menuContainer.classList.remove("c-mobile-menu-visible");
      e.preventDefault();
    });

  /* Menu link clicks */
  menu &&
    menu.addEventListener("click", (e) => {
      const el = e.target.closest("a");

      if (el.getAttribute("data-action") === "go") {
        window.location = el.getAttribute("href");
        return;
      }

      const { action } = fetchData(el.getAttribute("href"), menusCache, "click");

      if (action && action === "navigate") {
        menu.scrollIntoView();
      }

      e.preventDefault();
    });

  /* Fin */
})(document.getElementById("mobile-menu-2"));
