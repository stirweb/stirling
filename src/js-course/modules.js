/**
 *
 *
 */

var stir = stir || {};

stir.course = (function () {
  const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
  const na = { auto: new Function() };

  if (!stir.dpt) return na;
  if (!stir.akari) return na;
  if (!stir.templates.course) return na;

  const container = document.getElementById("course-modules-container");
  const el = document.querySelector("[data-modules-route-code][data-modules-course-type]");
  if (!container || !el) return na;

  const navManager = stir.templates.course.nav(stir.dpt.show.previous, stir.dpt.show.next);

  // DOM references
  const moduleViewer = stir.templates.course.dialogue("moduleViewer", navManager.el);
  const moduleInfo = stir.templates.course.div("moduleInfo");
  const routeChooser = stir.templates.course.div("routeBrowser");
  const optionChooser = stir.templates.course.div("optionBrowser");
  const moduleBrowser = stir.templates.course.div("moduleBrowser");
  const version = document.querySelector("time[data-sits]");
  const spinner = new stir.Spinner(moduleViewer);

  // used to track modal/url changes
  const status = {
    uid: 0,
    total: 0,
  };

  let initialised = false;

  const parameter = {
    route: el.getAttribute("data-modules-route-code"), // i.e. "UHX11-ACCFIN";
    level: el.getAttribute("data-modules-course-type"), // i.e. "UG";
    auto: true,
  };

  // initialise any accordions newly added to the DOM
  const reflow = () => {
    Array.prototype.forEach.call(container.querySelectorAll(".stir-accordion"), function (accordion) {
      new stir.accord(accordion, true);
    });
  };

  const render = (data) => {
    // Boilerplate text necessary for module "page" popup
    if (!boilerplates) return console.error("Boilerplate text not loaded!");

    spinner.hide();

    // Render module information HTML:
    moduleInfo.innerHTML = stir.templates.course.module(boilerplates, status.total, data);

    // Find and activate any animated bar graphs:
    stir.templates.course.barcharts(moduleInfo.querySelectorAll(".barchart"));
  };

  /**
   * External "handler" functions that will be called by
   * the API wrapper (i.e. DPT, Akari).
   */

  // DOM Reset functions
  const reset = {
    modules: () => (moduleBrowser.innerHTML = ""),
    module: () => (moduleInfo.innerHTML = ""),
    options: () => (optionChooser.innerHTML = ""),
  };

  // DOM display/callback functions
  const handle = {
    routes: (frag) => routeChooser.append(frag),
    options: (frag) => optionChooser.append(frag),
    modules: (frag, count) => {
      status.total = count;
      moduleBrowser.append(frag);
      reflow();
    },
    module: (id, url, index) => {
      reset.module();
      spinner.show();
      stir.dpt.set.pointer(index);
      navManager.el.setAttribute("data-mc",index);
      stir.akari.get.module(id, render);
      moduleViewer.showModal();
      if (url) {
        try {
          // Error will be thrown if the URL is not of the same origin:
          history.pushState({ uid: ++status.uid }, "", url); 
        } catch(e) { }
      }
    },
    version: (frag) => version && frag && (version.textContent = frag),
    fallback: {
      options: () => {
        // FALLBACK if DPT OPTIONS fails to load
        // 1. Get all links in this tab. (Assumption: parent element).
        const modLinks = Array.prototype.slice.call( container.parentElement.querySelectorAll('a') )
          // 2. filter for hard-coded module links
          .filter(a=>a.pathname==="/courses/module/");
          
        // 3. examine each remaining link:
        modLinks.forEach( (a,i,o)=>{
          // 3a. Get module details from query parameters
          const p = new URLSearchParams(a.search)
          const moduleIdentifier = `${p.get("code")}/${p.get("session")}/${p.get("semester")}`;
          // 3b. recreate cache and data attributes needed for prev/next action
          a.setAttribute("data-index",i);
          a.setAttribute("data-spa",moduleIdentifier);
          stir.dpt.addToCache({modName:a.textContent, modCode:p.get("code"), mavSemSession:p.get("session"), mavSemCode:p.get("semester"), mavOccurrence:""});
          //3c. intercept clicks and show modal
          a.addEventListener("click", e => {
            e.preventDefault();
            handle.module(moduleIdentifier,a.href,i);
          });
        });
        status.total = modLinks.length - 1;
      }
    }
  };
  /** **/

  // Set up the DOM:
  container.insertAdjacentHTML("beforeend", stir.templates.course.disclaimer);
  container.append(routeChooser, optionChooser, moduleBrowser);
  document.body.append(moduleViewer);
  moduleViewer.append(moduleInfo);

  // Hook up the data callback handlers:
  stir.dpt.set.show.routes(handle.routes);
  stir.dpt.set.show.options(handle.options);
  stir.dpt.set.show.modules(handle.modules);
  stir.dpt.set.show.module(handle.module);
  stir.dpt.set.show.version(handle.version);
  stir.dpt.set.reset.modules(reset.modules);
  stir.dpt.set.reset.module(reset.module);
  stir.dpt.set.reset.options(reset.options);
  
  stir.dpt.set.fallback.options(handle.fallback.options);

  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.uid) {
      status.uid = e.state.uid;
    }

    let params = new URLSearchParams(document.location.search);
    let modurl = params.has("code") && params.has("session") && params.has("semester") && params.has("occurrence");

    if (modurl) {
      handle.module(`${params.get("code")}/${params.get("session")}/${params.get("semester")}`, null);
    } else {
      if (moduleViewer.open) {
        status.uid = 0; // reset counter
        moduleViewer.close();
      }
    }
  });

  moduleViewer.addEventListener("close", (e) => {
    if (status.uid > 0) {
      history.go(0 - status.uid);
      status.uid = 0; // reset prev/next counter
    }
  });

  function _auto() {
    if (!initialised) {
      initialised = true;
      version && stir.dpt.get.version(parameter.level);
      if (parameter.route.indexOf(",") >= 0) {
        stir.dpt.get.routes(parameter.level, parameter.route, parameter.auto);
      } else {
        stir.dpt.get.options(parameter.level, parameter.route, parameter.auto);
      }
    }
  }

  function _init(data) {
    boilerplates = data;
  }

  // STIR TABS AWARE
  //const panel = container.closest && container.closest('[role=tabpanel]');
  //if(panel && window.location.hash.indexOf(panel.id)===1) _auto();

  // STIR ACCORDION
  //const accordion = container.closest && container.closest('[role=dave]');
  //if(accordion && !accordion.hidden) _auto();

  // CALLBACK QUEUE - replaces the DOM checking above
  if (stir.callback && stir.callback.queue && stir.callback.queue.indexOf("stir.course.auto") > -1) _auto();
  // todo: empty the queue?

  return {
    init: _init, // get module boilerplate text
    auto: _auto, // initialise and begin
  };
})();

// Get boilerplate text first, then initialise the course page scripts:
stir.getJSON("https://www.stir.ac.uk/data/modules/boilerplate/", (data) => stir.course.init(data));

// TEMPORARY ONLY UNTIL T4 REPUBLISHES THE COURSE PAGES
// 2024-02-07 r.w.morrison@stir.ac.uk

var StirUniModules = StirUniModules || {};
StirUniModules.initialisationRoutine = stir.course.auto;
