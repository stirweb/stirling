/*
 * MOBILE MENU


(function (scope) {
  if (!scope) return;

  let start, end;

  var mobMenu = scope; // main container for the mobile nav
  var menuOpenBtn = document.getElementById("open_mobile_menu");
  var menuCloseBtn = document.getElementById("close_mobile_menu");
  var menuRootUL = document.querySelector(".sitemenu");
  var menuInitItems = document.querySelectorAll(".sitemenu ul.visible > li");
  var menuLoading = document.querySelector(".mobMenuLoading");

  var sectLinks = document.querySelectorAll(".sitemenu > li > ul > li > a");
  var otherLinks = document.querySelector(".slidemenu__other-links");

  var hideEls = [".wrapper-content", "footer", "#layout-header", ".breadcrumbs-container"];
  var currHref,
    loadSect,
    curClickedEl,
    arrLoaded = [];

  /*
   * Function: work out from the url which section the user is currently browsing
   /
  function getUsersCurrentSection() {
    currHref = window.location.pathname;
    loadSect = currHref.split("/")[1];

    if (UoS_env.name === "dev" || UoS_env.name === "qa") {
      loadSect = "about";
      currHref = "https://t4cms.stir.ac.uk/terminalfour/preview/1/en/10872";
    }
  }

  /*
   * Function: work out from the section what the url of the ajax content is
   /
  function getMenuAjaxUrl(sect) {
    var menuUrl = "";
    var rootUrl = "/developer-components/includes/template-external/mobile-nav/"; // live

    // Reconfig for dev
    if (UoS_env.name === "dev" || UoS_env.name === "qa") rootUrl = "../data/awd/mobilenavs/";

    menuUrl = rootUrl + sect + "/index.html"; // live & dev/qa

    // Reconfig for preview
    if (UoS_env.name === "preview" || UoS_env.name === "appdev-preview") {
      var t4Prevs = {
        study: "21257",
        about: "21258",
        international: "21259",
        research: "21260",
        "student-life": "21261",
        courses: "21373",
        clearing: "21374",
        coronavirus: "24355",
        "internal-students": "24799",
        "internal-staff": "24798",
      };
      menuUrl = "/terminalfour/preview/1/en/" + t4Prevs[sect];
    }

    return menuUrl;
  }

  /*
   * Function: add or remove the visibility clases for the panel
   /
  function togglePanelClasses(el, dowhich) {
    if (dowhich === "remove") {
      el.classList.remove("visible");
      el.classList.remove("fixed");
    }
    if (dowhich === "add") {
      el.classList.add("visible");
      el.classList.add("fixed");
    }
  }

  /*
   * Function: Ajax loads the menu html
   /
  function fetchMenu(url) {
    // show the loading message
    menuLoading && menuLoading.classList.remove("hide");

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", outputMenu);
    oReq.open("GET", url);
    oReq.send();
  }

  /*
   * Function: take the ajax'd content and append it to the correct ul
   /
  function outputMenu() {
    for (var i = 0; i < sectLinks.length; i++) {
      if (sectLinks[i].dataset.sectid === loadSect) {
        var node = document.createElement("span");
        node.innerHTML = this.responseText;
        var newNode = node.querySelector("ul > li > ul");
        sectLinks[i].insertAdjacentElement("afterend", newNode);
      }
    }
    showPanel();
  }

  /*
   * Function: display the correct panel of links
   /
  function showPanel() {
    if (curClickedEl) panelReload();

    if (!curClickedEl) initPanelLoad();
  }

  /*
   * Function: Panel is already open and user has interacted with it
   /
  function panelReload() {
    // if no submenu ul beside it
    if (curClickedEl.nextElementSibling === null) {
      // Clicked the Home btn
      if (curClickedEl.classList.contains("mobMenuHomeBtn")) {
        // Home btn
        // remove the visible class for the cur panel
        if (curClickedEl.closest("ul.visible")) {
          togglePanelClasses(curClickedEl.closest("ul.visible"), "remove"); // remove the visible tags
        }
        // add the visible class for the new panel
        togglePanelClasses(menuRootUL.querySelector("li > ul"), "add");
        configPanel(curClickedEl);
      }

      // Clicked the Prev level link btn
      if (curClickedEl.classList.contains("mobMenuPrevBtn")) {
        // remove the visible class for the cur panel
        if (curClickedEl.closest("ul.visible")) {
          togglePanelClasses(curClickedEl.closest("ul.visible"), "remove");
        }

        var parEl = getNextUlUp(curClickedEl); // a < li < ul < li < ul
        if (parEl) {
          // add the visible class for the new panel
          togglePanelClasses(parEl, "add");
        }

        if (parEl.previousElementSibling) {
          configPanel(parEl.previousElementSibling); // show the new panel
        }
      }

      // Clicked an actual page link - go to the requested page
      if (!curClickedEl.classList.contains("mobMenuPrevBtn") && !curClickedEl.classList.contains("mobMenuHomeBtn")) {
        window.location.href = curClickedEl.getAttribute("href");
      }

      return;
    }

    // if submenu ul beside it
    if (curClickedEl.nextElementSibling !== null && curClickedEl.nextElementSibling.nodeName === "UL") {
      // element has a submenu so show it after hiding the current one
      if (curClickedEl.closest("ul.visible")) {
        togglePanelClasses(curClickedEl.closest("ul.visible"), "remove");
      }

      togglePanelClasses(curClickedEl.nextElementSibling, "add");
      configPanel(curClickedEl);

      return;
    }
  }

  /*
   * Function: Ajax menu is loading for the first time so need to set it up
   /
  function initPanelLoad() {
    if (currHref !== "") {
      var classAdded = false;
      var siteMenuRoot = document.querySelectorAll(".sitemenu a");

      // 1st loop - remove visibility classes
      for (var i = 0; i < siteMenuRoot.length; i++) {
        var el1 = siteMenuRoot[i].parentElement.parentElement;
        if (el1) togglePanelClasses(el1, "remove");
      }

      // 2nd loop (need to be 2 loops so they dont cancel each other out) add visibility classes
      for (var i = 0; i < siteMenuRoot.length; i++) {
        if (siteMenuRoot[i].getAttribute("href") === currHref) {
          // if the cur link has a submenu then show this panel
          if (siteMenuRoot[i].nextElementSibling) {
            togglePanelClasses(siteMenuRoot[i].nextElementSibling, "add"); // ul
            configPanel(siteMenuRoot[i]); // a
            classAdded = true;
          }

          // if the cur link has a submenu
          if (!siteMenuRoot[i].nextElementSibling) {
            // otherwise use the parent panel id if it exists
            var el2 = siteMenuRoot[i].parentElement.parentElement;
            if (el2) {
              togglePanelClasses(el2, "add"); // ul
              configPanel(el2.previousElementSibling); // a
              classAdded = true;
            }
          }
        }
      }

      // if the page isnt found in the above loop add the home panel
      if (!classAdded) {
        togglePanelClasses(menuRootUL.children[0].children[1], "add");
        configPanel(menuRootUL.children[0].children[0]);
      }
    }

    end = Date.now();

    console.log(end - start);
  }

  /*
   * Function: Return the parent list ul (a < li < ul < li < ul) of el
   /
  function getNextUlUp(el) {
    if (el.parentElement.parentElement.parentElement.parentElement) return el.parentElement.parentElement.parentElement.parentElement;

    return undefined;
  }

  /*
   * Function: Determine what extra links and styles need added
   /
  function configPanel(currEl) {
    var isHomePanel = false;

    // this should never be the case should always be an 'A'
    if (currEl.nodeName === "UL") currEl = currEl.children[0];

    if (currEl.getAttribute("href") === "/" || currEl.classList.contains("mobMenuHomeBtn")) isHomePanel = true;

    // add the breadcrumb class for items that have a submenu
    if (currEl.nextElementSibling) {
      var meunLinks = currEl.nextElementSibling.children;
      for (var i = 0; i < meunLinks.length; i++) {
        if (meunLinks[i].children[1]) {
          meunLinks[i].children[0].classList.add("mobMenuBreadcrumb");
        }
      }
    }

    // config as section panel
    if (!isHomePanel) configSectionPanel(currEl);

    // config as home panel - add the home header to the home panel if not already there
    if (isHomePanel) configHomePanel();

    // remove duplicate Home backlinks if found
    if (currEl.nextElementSibling) {
      if (currEl.nextElementSibling.children[1].children[0].innerText === "Home") {
        currEl.nextElementSibling.children[1].remove();
      }
    }

    // append the Other links to the bottom - myportal etc
    appendOtherLinks(currEl, isHomePanel);

    // animate scroll back to the top of the menu
    scrollToMenuTop(isHomePanel);

    // hide the loading graphic
    menuLoading && menuLoading.classList.add("hide");

    // show the panel root ul
    Array.prototype.forEach.call(menuInitItems, function (item) {
      item.classList.remove("hide");
    });
  }

  /*
   * Function: animate scroll back to the top of the menu
   /
  function scrollToMenuTop(isHomePanel) {
    var scrollEl = document.querySelector(".sitemenu ul.visible li a.mobMenuHomeBtn");

    if (isHomePanel) scrollEl = document.querySelector(".sitemenu ul.visible li a.mobMenuHomeLink");

    if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Edge") != -1) {
      scrollEl.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      scrollEl.scrollIntoView();
    }
  }

  /*
   * Function: append the "Other" links to the bottom of main menu - myportal etc
   /
  function appendOtherLinks(currEl, isHomePanel) {
    var otherEl = currEl.nextElementSibling;

    if (isHomePanel) otherEl = menuRootUL.children[0].children[1];

    if (otherEl.lastElementChild.innerHTML !== "") {
      // only add it if its not already there
      if (!otherEl.lastElementChild.children[0].classList.contains("slidemenu__other-links")) {
        var nodeOtherLinks = document.createElement("li");
        nodeOtherLinks.insertAdjacentElement("beforeend", otherLinks);
        otherEl.lastElementChild.insertAdjacentElement("afterend", nodeOtherLinks);
      }
    }

    if (otherEl.lastElementChild.innerHTML === "") {
      // if the user has been on this panel before there will already be an empty li from last time it was inserted
      otherEl.lastElementChild.insertAdjacentElement("beforeend", otherLinks);
    }
  }

  /*
   * Function: Set up non Home panel
   /
  function configSectionPanel(currEl) {
    // Home back-link - add to the top of the menu if not already there
    if (!currEl.nextElementSibling.children[0].children[0].classList.contains("mobMenuHomeBtn")) {
      var node1 = document.createElement("li");
      node1.innerHTML = '<a href="#" class="mobMenuHomeBtn">Home</a>';
      currEl.nextElementSibling.insertAdjacentElement("afterbegin", node1);
    }

    // Previous panel link - add to the to the 2nd position if not already there
    if (!currEl.nextElementSibling.children[1].children[0].classList.contains("mobMenuPrevBtn")) {
      var node3 = document.createElement("li");
      node3.innerHTML = '<a href="#" class="mobMenuPrevBtn">' + currEl.parentElement.parentElement.previousElementSibling.innerText + "</a>";
      currEl.nextElementSibling.children[0].insertAdjacentElement("afterend", node3);
    }

    // Menu header - add to the 3rd position if not already there
    if (!currEl.nextElementSibling.children[2].children[0].classList.contains("mobMenuHeader")) {
      var node4 = document.createElement("li");
      node4.innerHTML = '<span class="mobMenuHeader">' + currEl.innerText + "</span>";
      currEl.nextElementSibling.children[1].insertAdjacentElement("afterend", node4);
    }

    // Link to panels parent page - add to the 4th position if not already there
    if (!currEl.nextElementSibling.children[3].children[0].classList.contains("mobMenuMainBtn")) {
      var node2 = document.createElement("li");
      node2.innerHTML = '<a href="' + currEl.getAttribute("href") + '" class="mobMenuMainBtn" >' + currEl.innerText + " home</a>";
      currEl.nextElementSibling.children[2].insertAdjacentElement("afterend", node2);
    }
  }

  /*
   * Function: Set up Home panel - add the home header link to the panel if not already there
   /
  function configHomePanel() {
    // check the header link is not already there - then add it
    if (!menuRootUL.children[0].children[1].children[0].children[0].classList.contains("mobMenuHomeLink")) {
      var node = document.createElement("li");
      node.innerHTML = '<a href="/" class="mobMenuHomeLink">Home</a>';
      menuRootUL.children[0].children[1].insertAdjacentElement("afterbegin", node);
    }
  }

  /*
   * Event: Section link has been clicked
   /
  function doMenuItemClick(ev) {
    curClickedEl = ev.target;

    if (curClickedEl.dataset.sectid) {
      if (curClickedEl.nextSibling.nodeName !== "UL") {
        loadSect = curClickedEl.dataset.sectid;
        var url = getMenuAjaxUrl(curClickedEl.dataset.sectid);
        fetchMenu(url);
        return;
      }
    }

    showPanel();
  }

  /*
   * Event: Menu Click
   /
  function doMenuClick(e) {
    // Event: Menu item has been clicked
    if (e.target.matches(".sitemenu a")) {
      doMenuItemClick(e);
      e.preventDefault();
    }

    // Event: Menu close request
    if (e.target.matches("#close_mobile_menu")) {
      // unhide the stuff underneath
      Array.prototype.forEach.call(hideEls, function (item) {
        if (document.querySelector(item)) document.querySelector(item).classList.remove("hide");
      });

      menuCloseBtn.classList.add("hide");
      mobMenu.classList.remove("c-mobile-menu-visible");

      var sectLinksVisible = document.querySelectorAll(".sitemenu ul.visible");
      for (var i = 0; i < sectLinksVisible.length; i++) {
        togglePanelClasses(sectLinksVisible[i], "remove");
      }

      e.preventDefault();
    }
  }

  /*
   * Event: Open mobile menu request
   /
  function openMenuClick(e) {
    start = Date.now();

    // Hide the initial static page menu
    Array.prototype.forEach.call(menuInitItems, function (item) {
      item.classList.add("hide");
    });

    // show the menu container and close button
    mobMenu.classList.add("c-mobile-menu-visible");
    menuCloseBtn.classList.remove("hide");

    // Get the menu for the section the user is currently on if its not already loaded in
    getUsersCurrentSection();

    // Shrink all the main content blocks to prevent scrolling
    Array.prototype.forEach.call(hideEls, function (item) {
      if (document.querySelector(item)) document.querySelector(item).classList.add("hide");
    });

    // now get the url for the menu panel, load it, then display it
    var menuUrl = getMenuAjaxUrl(loadSect);

    if (menuUrl !== "") {
      if (arrLoaded.indexOf(menuUrl) < 0) {
        fetchMenu(menuUrl);
        arrLoaded.push(menuUrl);
      }

      // we have already loaded it so no need to fetch it
      if (arrLoaded.indexOf(menuUrl) > -1) {
        showPanel();
      }
    }

    // no menu panel for this url eg within /unimportant-area/...
    if (menuUrl === "") configPanel(menuRootUL.querySelector("a"));

    e.preventDefault();
  }

  /*
   * Listener: Open mobile menu request
   /
  if (menuOpenBtn) menuOpenBtn.addEventListener("click", openMenuClick);

  /*
   * Listener: Menu Click Events
   /
  mobMenu.addEventListener("click", doMenuClick);
})(document.getElementById("mobile-menu"));
*/
