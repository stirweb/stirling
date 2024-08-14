/*
 * Country specific entry requirements select box processes
 * @author: Ryan Kaye
 * @date: October 2020 (version 1). October 2021 (version 2)
 * @version: 2
 */

/*
var stir = stir || {};

stir.t4Globals = stir.t4Globals || {};

(function (scope) {
  if (!scope) return;

  /*
      Constants
   *
  const select = scope;

  /*
     Fetch the data
   *
  const initCountryData = stir.t4Globals.countries || [];
  const metaTags = document.getElementsByTagName("meta");

  /*
      Define required constants
   *

  const constants = {
    // DOM elements UG 
    ugYear1Node: stir.node("[data-panel=entryYear1]"),
    ugYear2Node: stir.node("[data-panel=entryYear2]"),
    scotQualsNode: stir.node("[data-panel=otherScotQuals]"),
    otherQualsNode: stir.node("[data-panel=otherQuals]"),
    engReqsNode: stir.node("[data-panel=engReqs]"),
    // DOM elements PG *
    pgReqsNode: stir.node("[data-countryreqs]"),
    // General data items *
    level: select.dataset.level || "",
    faculty: metaTags["stir.course.faculty"] ? metaTags["stir.course.faculty"].content : "",
    defaultCountry: "United Kingdom",
  };

  /* 
    Extract the content from the correct DOM element
  *
  const getDomContent = (el) => {
    if (el) return el.innerHTML;
    return "";
  };

  /* 
    Keep a copy of the UK data in case its reselected
    Store it in a new country object for ease
  *
  const cacheDefaultData = (consts, data) => {
    const defaultItem = [
      {
        name: consts.defaultCountry,
        ugEntryYearOne: getDomContent(consts.ugYear1Node),
        ugEntryYearTwo: getDomContent(consts.ugYear2Node),
        englishRequirements: getDomContent(consts.engReqsNode),
        pgRequirements: getDomContent(consts.pgReqsNode),
        pgRequirementsSMS: "",
      },
    ];
    return [...defaultItem, ...data];
  };

  /* 
      Remove dodgy characters from the data
   *
  const cleanContent = (data) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = data;
    return textArea.value.trim();
  };

  /* 
      Output UG content to the correct nodes
  *
  const setUGContent = (consts, country) => {
    // UG Year 1
    if (consts.ugYear1Node) {
      consts.ugYear1Node.innerHTML = cleanContent(country.ugEntryYearOne);
    }

    // UG Year 2
    if (consts.ugYear2Node) {
      consts.ugYear2Node.parentElement.classList.add("hide");
      consts.ugYear2Node.innerHTML = cleanContent(country.ugEntryYearTwo);

      if (cleanContent(country.ugEntryYearTwo).length) {
        consts.ugYear2Node.parentElement.classList.remove("hide");
      }
    }
    return true;
  };

  /* 
      Output PG content to the correct nodes
  *
  const setPGContent = (consts, country) => {
    if (consts.pgReqsNode) {
      // Mgt School content override hack for China
      if (country.name === "China" && consts.faculty === "Stirling Management School") {
        consts.pgReqsNode.innerHTML = cleanContent(country.pgRequirementsSMS);
        return true;
      }

      consts.pgReqsNode.innerHTML = cleanContent(country.pgRequirements);
      return true;
    }
  };

  /* 
      EVENT - New country selected
   *
  select.onchange = function (e) {
    const selectedCountry = this.options[this.selectedIndex].value;

    // Hide and show nodes as needed
    if (selectedCountry !== constants.defaultCountry) {
      if (constants.scotQualsNode) constants.scotQualsNode.closest(".stir-accordion").classList.add("hide");
      if (constants.otherQualsNode) constants.otherQualsNode.closest(".stir-accordion").classList.add("hide");
    }

    if (selectedCountry === constants.defaultCountry) {
      if (constants.scotQualsNode) constants.scotQualsNode.closest(".stir-accordion").classList.remove("hide");
      if (constants.otherQualsNode) constants.otherQualsNode.closest(".stir-accordion").classList.remove("hide");
    }

    const country = stir.filter((item) => item.name === selectedCountry, countryData);

    constants.level === "ug" && setUGContent(constants, country[0]);
    constants.level === "pg" && setPGContent(constants, country[0]);

    e.preventDefault();
  };

  /*
    ON LOAD EVENTS
   *

  const countryData = cacheDefaultData(constants, initCountryData);
  select.innerHTML = stir.map((el) => `<option  value="${el.name}">${el.name}</option>`, countryData);

  /* End *
})(stir.node("select[name='course-countries-select']"));

*/

var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};

stir.components = stir.components || {};
/* stir.components.html = stir.components.html || {}; */
stir.components.unistats = stir.components.unistats || {};
stir.components.discoveruni = stir.components.discoveruni || {};

stir.components.unistats.widget = function (options) {
  var widget = document.createElement("iframe");
  widget.src = "https://widget.unistats.ac.uk/Widget/10007804/" + kiscode + "/responsive/small/en-GB/" + kismode;
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

/**
 * Favourites buttons
 * 2023-05-10
 */
if (stir.favourites && stir.coursefavs) {
  stir.coursefavs.attachEventHandlers();
  document.querySelectorAll("[data-nodeid=coursefavsbtn]").forEach(stir.coursefavs.doCourseBtn);
}

var stir = stir || {};

stir.dpt = (function () {
  const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
  const _semestersPerYear = 2;
  const viewMoreModulesThreshold = 4;
  const config = {
    css: {
      truncateModuleCollection: "c-course-modules__accordion-content--hide-rows",
    },
    text: {
      fewer: "View fewer choices",
      more: "View all _X_ choices",
    },
  };
  let user = {}, _year=0, _semesterCache=[];
  let routesCurry;
  
  function resetGlobals() {
    _year = 0;
    _semesterCache = [];
  }
  const modulesEndpointParams = {
    UG: "opt=runcode&ct=UG",
    PG: "opt=runpgcode&ct=PG",
  };

  const PORTAL = "https://portal.stir.ac.uk";

  const urls = {
    // Akari module viewer:
    viewer: window.location.hostname != "www.stir.ac.uk" ? "https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/33273" : "/courses/module/",
    // Portal web frontend:
    calendar: `${PORTAL}/calendar/calendar`,
    // Portal data endpoints:
    servlet: `${PORTAL}/servlet/CalendarServlet`,
    route: {
      UG: "?opt=menu&callback=stir.dpt.show.routes", //+ (ver?ver:'')
      PG: "?opt=pgmenu&ct=PG&callback=stir.dpt.show.routes", //+ (ver?ver:'')
    },
    option: (type, roucode) => `?opt=${type.toLowerCase()}-opts&rouCode=${roucode}&ct=${type.toUpperCase()}&callback=stir.dpt.show.options`,
    fees: (type, roucode) => `?opt=${type}-opts&rouCode=${roucode}&ct=${type.toUpperCase()}&callback=stir.dpt.show.fees`,
    modules: (type, roucode, moa, occ) => `?${modulesEndpointParams[type.toUpperCase()]}&moa=${moa}&occ=${occ}&rouCode=${roucode}&callback=stir.dpt.show.modules`,
    module: (mod, year, sem) => stir.akari.get.module([mod, year, sem].join("/")),
  };

  urls.version = {
	  UG: UoS_env.t4_tags ? '<t4 type="media" id="178111" formatter="path/*" />': urls.servlet + "?opt=version-menu&callback=stir.dpt.show.version",
	  PG: UoS_env.t4_tags ? '<t4 type="media" id="178112" formatter="path/*" />': urls.servlet + "?opt=version-menu&ct=PG&callback=stir.dpt.show.version"
  }

  //	const getAllRoutes = type => {
  //		stir.getJSONp(`${urls.servlet}${urls.route[type.toUpperCase()]}`);
  //		user.type=type;
  //	};

  const spitCodes = (csv) => csv.replace(/\s/g, "").split(",");

  const getVersion = (type) => stir.getJSONp(`${urls.version[type]}`);

  const getRoutes = (type, routesCSV, auto) => {
    user.type = type;
    user.auto = auto;
    stir.dpt.show.routes = routesCurry(spitCodes(routesCSV));
    stir.getJSONp(`${urls.servlet}${urls.route[type.toUpperCase()]}`);
  };

  const getOptions = (type, roucode, auto) => {
    user.type = type;
    user.rouCode = roucode;
    user.auto = auto;
    stir.getJSONp(`${urls.servlet}${urls.option(type, roucode)}`);
  };

  const getModules = (type, roucode, moa, occ) => stir.getJSONp(`${urls.servlet}${urls.modules(type.toLowerCase(), roucode, moa, occ)}`);

  //////////////////////////////////////////////

  const getCurrentUri = () => {
    const urlBits = document.querySelector("link[rel='canonical']").getAttribute("href") ? document.querySelector("link[rel='canonical']").getAttribute("href").split("/") : [];

    if (!urlBits.length || urlBits.length < 3) return ``;

    if (UoS_env.name === "preview") return urlBits[urlBits.length - 1];
    return urlBits[urlBits.length - 2];
  };

  const moduleLink = (data) => {
    // LINK TO NEW AKARI MODULE PAGES
    const url = `${urls.viewer}?code=${data.modCode}&session=${data.mavSemSession}&semester=${data.mavSemCode}&occurrence=${data.mavOccurrence}&course=${getCurrentUri()}`;
	return availability(data) ? `<a href="${url}">${data.modName}</a>` : `<span data-dpt-unavailable title="Module details for ${data.modCode} are currently unavailable">${data.modName}</span>`;
	
    // LINK TO OLD DEGREE PROGRAM TABLES
    //return `${urls.calendar}${user.type === "PG" ? "-pg" : ""}.jsp?modCode=${data.modCode}`;
  };

  const template = {
    collection: {
      table: (id, data) => `<table class=c-course-modules__table id="collection_${id}">${data}</table>`,
      notes: (text) => `<p class=c-course-modules__collection-notes>${text}</p>`,
      header: (text) => `<p class=c-course-modules__collection-header>${text}</p>`,
      footer: (text) => `<p class=c-course-modules__pdm-note>${text}</p>`,
    },
    module: (data) =>
      `<tr><td>${moduleLink(data)}
			<span class=c-course-modules__module-code>(${data.modCode})</span>
			</td><td>${data.modCredit} credits</td></tr>`,
    nodata: `<tr><td colspan=2> no data </td></tr>`,
    container: (text) => `<div class="c-wysiwyg-content ${config.css.truncateModuleCollection}" data-collection-container>${text}</div>`,
  };

  const moduleView = (data) => (data.modName ? template.module(data) : template.nodata);

  const getYear = (data, group, option, semester) => {
    if (!user || !user.type) return;
    if (user.type === "UG") return stir.cardinal(Math.ceil(data.semesterCode / _semestersPerYear));
    if (user.type === "PG") {
      if (group === 0 && option === 0 && semester === 0) {
        //first group, first option, first semester
        _year++;
        _semesterCache.push(data.semesterName);
      } else if (_semesterCache.indexOf(data.semesterName) === -1 && option === 0) {
        //new semester and option 1
        _semesterCache.push(data.semesterName);
      } else if (option === 0) {
        //else if repeated semester and still option 1 - only increment year on option 1
        _semesterCache = []; //reset array of semesters
        _semesterCache.push(data.semesterName);
        _year++;
      }
      return stir.cardinal(_year);
    }
    return " <!-- year not defined --> ";
  };

  const getSemesterYearIndex = (semesterCode) => (semesterCode % _semestersPerYear === 0 ? _semestersPerYear : semesterCode % _semestersPerYear);

  const getSemester = (semester) => (semester.semesterName ? semester.semesterName + " semester" : "semester " + stir.cardinal(getSemesterYearIndex(semester.semesterCode)));

  const getOption = (option, options) => (options.length > 1 ? `(option ${stir.cardinal(option + 1)})` : "");

  const getCollectionHeader = (code) => {
    // this was taking from how the calendar JS displays titles
    if (code.indexOf("E") > -1) return "Option module";
    if (code === "D") return "Dissertation";
    return "Compulsory module";
  };

  // hide the module if it's unavailable. (This condition was taken from calendar js).
  const availability = (m) => m.mavSemSemester !== null && m.mavSemSemester.length !== 0 && m.mavSemSemester !== "[n]" && m.mavSemSemester !== "Not Available";

  const collectionView = stir.curry((semesterID, collection, c) => {
    let collectionId = [semesterID, c].join("");
    let header = template.collection.header(getCollectionHeader(collection.collectionStatusCode));
    let notes = collection.collectionType == "LIST" || collection.collectionType == "CHOICE" ? template.collection.notes(collection.collectionNotes) : "";
    let body = template.collection.table(collectionId, collection.mods.map(moduleView).join(""));

    let footer = collection.collectionFootnote ? template.collection.footer(collection.collectionFootnote) : "";
    let more =
      collection.mods.length > viewMoreModulesThreshold
        ? `<p class="text-center c-course-modules__view-more-link">
						<a href="#" data-choices="${collection.mods.length}" aria-expanded="false" aria-controls="collection_${collectionId}">${config.text.more.replace("_X_", collection.mods.length)}</a>
					</p>`
        : "";
    return header + notes + body + footer + more;
  });

  const paragraph = (text) => {
    const p = document.createElement("p");
    p.textContent = text;
    return p;
  };

  //view more behaviour
  function viewMore(e) {
    if (!this.classList) return;

    if (this.classList.toggle(config.css.truncateModuleCollection)) {
      stir.scrollToElement(this, 60); // return the user to the top of list
      e.target.innerText = config.text.more.replace("_X_", e.target.getAttribute("data-choices"));
      e.target.setAttribute("aria-expanded", "false");
    } else {
      e.target.innerText = config.text.fewer;
      e.target.setAttribute("aria-expanded", "true");
    }
    e.preventDefault();
  }

  const versionToSession = (data) => {
    if(!data || !data.length) return;
	// [2024-03-14] rwm2 -- remove DEBUG test to make it live --
    if(debug) {
      try {
        return data.filter(v=>v.versionActive==="Y").sort(compareVersions).pop().versionName;
      } catch (e) {
        console.warn(e);
      }
    }
    return;
  };

  const compareVersions = (a, b) => {
    		if (a.versionId < b.versionId) return -1;
    		if (a.versionId > b.versionId) return 1;
    		return 0;
  };

  const modulesOverview = (data) => {
    let frag = document.createDocumentFragment();
    data.initialText && frag.append(paragraph(data.initialText));

    if (data.pdttRept) {
      let tempNode = document.createElement("p");
      tempNode.appendChild(stir.createDOMFragment(data.pdttRept));
      data.pdttRept && frag.append(tempNode);
    }
    let paths = [],
      years = [];

    data.semesterGroupBeans.forEach((group, g) => {
      group.groupOptions.forEach((option, o, options) => {
        option.semestersInOption.forEach((semester, s) => {
          let div = document.createElement("div");
          let semesterID = [g, o, s].join("");
          let year = getYear(semester, g, o, s);
          div.classList.add("stir-accordion");
          div.insertAdjacentHTML("beforeend", `<h3>Year ${year}: ${getSemester(semester)} ${getOption(o, options)}</h3>`);
          if (options.length > 1 && years.indexOf(year) === -1) {
            years.push(year);
            paths.push(`${stir.cardinal(options.length)} alternative paths in year ${year}`);
          }
          div.insertAdjacentHTML("beforeend", template.container(semester.collections.map(collectionView(semesterID)).join("")));
          frag.append(div);
        });
      });
    });

    if (paths.length > 0) {
      let paths_p = document.createElement("p");
      paths_p.innerHTML = `<span class="uos-shuffle"></span> <strong>There are ${stir.Array.oxfordComma(paths, true)}. Please review all options carefully.</strong>`;
      paths_p.classList.add("c-callout", "info", "rwm2testab1");
      frag.prepend(paths_p);
    }

    // attach behaviour to `view more` links and bind them to the respective table element
    Array.prototype.forEach.call(frag.querySelectorAll("[data-collection-container]"), function (el) {
      var a = el.querySelector(".c-course-modules__view-more-link a");
      a && a.addEventListener("click", viewMore.bind(el));
    });

    return frag;
  };

  ///////////////////////////////////////

  const routeOptionView = (data) => `<option value="${data.join("|")}">Starting ${data[3]}, ${data[1].toLowerCase()} (${data[4]})</option>`;

  const selectView = (data) => {
    if (!data || (data.length && data.length < 2)) {
      return new Comment(data.map(routeOptionView).join(""));
    }
    const wrapper = document.createElement("div");
    wrapper.id = "course-modules-container__options-list";
    wrapper.append(paragraph(`There are ${stir.cardinal(data.length)} options for this course in the current academic year:`));
    const selector = document.createElement("select");
    wrapper.append(selector);
    selector.id = "course-modules-container__routes-select";
    selector.insertAdjacentHTML("afterbegin", data.map(routeOptionView).join(""));
    selector.addEventListener("change", function (e) {
      var value = this.options[this.selectedIndex].value.split("|");
      var moa = value[0];
      var occ = value[2];
      resetGlobals();
      stir.dpt.reset.modules();
      getModules(user.type, user.rouCode, moa, occ);
    });
    return wrapper;
  };

  //	const compare = (a, b) => {
  //		if (a < b) return -1;
  //		if (a > b) return 1;
  //		return 0; // a must be equal to b
  //	};

  //	const routeSort = (a, b) => compare(a.rouName, b.rouName);

  const makeSelector = (data, name) => {
    const label = document.createElement("label");
    const select = document.createElement("select");
    label.append(document.createTextNode("Select a course"));
    label.setAttribute("for", name);
    select.name = name;
    select.id = name;
    label.append(select);

    data.forEach && data.forEach((route) => select.append(makeOption(route)));

    const change = (event) => {
      resetGlobals();
      stir.dpt.reset.modules();
      user.rouCode = select[select.selectedIndex].value;
      user.rouName = select[select.selectedIndex].textContent;
      getOptions(user.type, user.rouCode, user.auto);
    };

    select.addEventListener("change", change);
    change(); // auto load first option
    return label;
  };

  const makeOption = (data, index) => {
    const option = document.createElement("option");
    if (data.rouName && data.rouCode) {
      option.textContent = `${data.rouName}`;
      option.value = data.rouCode;
      return option;
    }
    option.textContent = data; // fallback/debug
    return option;
  };

  ///////////////////////////////////////

  return {
    show: {
      fees: new Function(),
      routes: new Function(),
      options: new Function(),
      modules: new Function(),
      version: new Function()
    },
    get: {
      options: getOptions,
      routes: getRoutes,
      viewer: () => urls.viewer,
      version: getVersion
    },
    reset: {
      modules: new Function(),
    },
    set: {
      viewer: (path) => (urls.viewer = path),
      show: {
        routes: (callback) =>
          (routesCurry = stir.curry((routes, data) =>
            callback(
              makeSelector(
                data.filter((route) => routes.includes(route.rouCode)),
                "rouCode"
              )
            )
          )),
        options: (callback) =>
          (stir.dpt.show.options = (data) => {
            callback(selectView(data));
            if (user.auto && user.type && user.rouCode) {
              getModules(user.type, user.rouCode, data[0][0], data[0][2]);
            }
          }),
        modules: (callback) => (stir.dpt.show.modules = (data) => callback(modulesOverview(data))),
        version: (callback) => (stir.dpt.show.version = (data) => callback(versionToSession(data)))
      },
      reset: {
        modules: (callback) => (stir.dpt.reset.modules = callback),
      },
    },
    debug: {
      version: (data) => {
        console.info(data);
      }
    }
  };
})();

var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};

/**
 * Fees region (e.g. home/eu) selector
 * @param {*} scope DOM element that wraps the fees information (selector and table, etc).
 */
(function (scope) {

    if (!scope) return;

    var select  = scope.querySelector('select');
    var table   = scope.querySelector('table');
	var remotes = Array.prototype.slice.call(scope.querySelectorAll('[data-action="change-region"]'));
    var region;

    function toggle(flag) {
        if (this.nodeType === 1)
            flag ? this.classList.remove('hide') : this.classList.add('hide');
    }

    function show(el) {
        toggle.call(el, true);
    }

    function hide(el) {
        toggle.call(el, false)
    }

    function hideAll() {
        hide(table);
        getRegionals().forEach(hide); // IE Compatible forEach
    }

    function getRegionals(region) {
        // querySelectorAll returns a NodeList, but IE can't use forEach() on
        // a NodeList directly, so this function converts it to a regular
        // Array, which is more compatible.
        return Array.prototype.slice.call(scope.querySelectorAll('[data-region' + (region ? '="' + region + '"' : '') + ']'));
    }

    function handleChanges() {
        // First, hide all region-specific elements:
        hideAll();
        // Then, only reveal the ones that match the selected region.
        if (region = this.options[this.options.selectedIndex].value) {
            show(table);
            getRegionals(region).forEach(show);
        }
    }

    // Initial state: hide the table and all region-specific elements (until
    // the user has selected a region):
    hideAll();

    // Now listen for the user:
	if(!select.id) select.id = 'change-region';
    select.addEventListener('change', handleChanges);

	// Set up any remote controls. Each `remote` should just be
	// a simple <span> with some text:
	remotes.forEach(function(remote, i) {
		var a = document.createElement('a');						// create a new <a> element
		remote.childNodes && a.appendChild(remote.childNodes[0]);	// move the text node (if it exists) into the link
		remote.appendChild(a);										// then move the <a> into the DOM where the text was
		a.setAttribute("tabindex", "0");							//	
		a.setAttribute("href", "#");								//	required attributes for keyboard a11y
		a.setAttribute("aria-controls", select.id);

		a.addEventListener("click", function(event) {
			select.value = this.parentNode.getAttribute('data-value');
			select.dispatchEvent(new Event("change"));
			event.preventDefault();
			select.focus();
		});
	});

})(document.getElementById("course-fees-information"));


/*
 * Handle fees info coming from a json feed 
 * rk8 Oct 2020
 * NO LONGER IN USE - NOW HANDLED IN T4
(function (scope) {

    if (!scope) return;

    var dataFees = stir.t4Globals.dataFees;

    // Use the other data if its available
    if(stir.t4Globals.dataFeesOther )
        dataFees = stir.t4Globals.dataFeesOther ;

    var tbl = scope;
    var tblRow = tbl.querySelectorAll('[data-region]');
    var cachData = []; // Cached data for use by the EU Row
    
    // loop through the table rows and output the currect data
    Array.prototype.forEach.call(tblRow, function (item) {
        var region = item.dataset.region;
        var tds = tbl.querySelectorAll('[data-region="' + region + '"] td');
        var band = tbl.getAttribute('data-' + region);

        for (var i = 0; i < dataFees.length; i++) {
            if (dataFees[i].region === region && dataFees[i].band === band) {
                tds[0].innerHTML = checkVal(dataFees[i].thisYear);
                tds[1].innerHTML = checkVal(dataFees[i].nextYear);
                // Update the cache for EU 
                cachData.push(dataFees[i].thisYear);
                cachData.push(dataFees[i].nextYear);
            }
        }
    })

    // EU data: 2020 = home val; 2021 = overseas val
    var tds = tbl.querySelectorAll('[data-region="eu"] td');
    tds[0].innerHTML = checkVal(cachData[0]);
    tds[1].innerHTML = checkVal(cachData[cachData.length - 1]);

    /* 
    * Make sure we have a value. If not return TBC  
    *
    function checkVal(val){
        return val.length > 0 ? val : '<abbr title="to be confirmed">TBC</abbr>';
    }

})(document.getElementById("feesTblPG"));
*/
/**
 * 
 * This file will replace JS-COURSE/MODULES.JS
 * 
 */

var stir = stir || {};
stir.templates = stir.templates || {};


stir.templates.course = {
	link: (text,href) => `<a href="${href}">${text}</a>`,
	para: content => `<p>${content}</p>`,
	option: option => `Starting ${option[3]}, ${option[1].toLowerCase()} (${option[4]})`,
	div: (id,onclick) => {
		const div = document.createElement('div');
		div.id = id; div.onclick = onclick;
		return div;
	},
	paths: (paths, year) => `<p class="c-callout info"><strong><span class="uos-shuffle"></span> There are ${paths} alternative paths in year ${year}.  Please review all options carefully.</strong></p>`,
	offline: `<p class="text-center c-callout">Module information is temporarily unavailable.</p>`,
};


stir.course = (function() {

	const na = {auto: new Function()};

	if(!stir.dpt) return na;

	const container = document.getElementById('course-modules-container');
	const el = document.querySelector("[data-modules-route-code][data-modules-course-type]");
	if(!container || !el) return na;
	
	const routeChooser = stir.templates.course.div('optionBrowser');
	const optionChooser = stir.templates.course.div('optionBrowser');
	const moduleBrowser = stir.templates.course.div('moduleBrowser');
	const version = document.querySelector('time[data-sits]');

	let initialised = false;

	const parameter = {
		route: el.getAttribute('data-modules-route-code'), // i.e. "UHX11-ACCFIN";
		level: el.getAttribute('data-modules-course-type'), // i.e. "UG";
		auto: true
	};

	// initialise any new accords just added to DOM
	const reflow = () => {
		Array.prototype.forEach.call(container.querySelectorAll(".stir-accordion"), function (accordion) {
			new stir.accord(accordion, true);
		});
	};

	const handle = {
		routes: frag => routeChooser.append(frag),
		options: frag => optionChooser.append(frag),
		modules: frag => {moduleBrowser.append(frag);reflow()},
		version: frag => version && frag && (version.textContent = frag)
	};

	const reset = {
		modules: ()=>moduleBrowser.innerHTML=''
	};
	
	// Set up the DOM
	container.append( routeChooser, optionChooser, moduleBrowser );
	
	// Set up data callback/handlers
	stir.dpt.set.show.routes( handle.routes );
	stir.dpt.set.show.options( handle.options );
	stir.dpt.set.show.modules( handle.modules );
	stir.dpt.set.show.version( handle.version );
	stir.dpt.set.reset.modules( reset.modules );

	const _auto = () => {
		if(!initialised) {
			initialised = true;
			version && stir.dpt.get.version(parameter.level);
			if(parameter.route.indexOf(',')>=0) {
				stir.dpt.get.routes(parameter.level, parameter.route, parameter.auto);
			} else {
				stir.dpt.get.options(parameter.level, parameter.route, parameter.auto);
			}
		}
	};

	// STIR TABS AWARE
	//const panel = container.closest && container.closest('[role=tabpanel]');
	//if(panel && window.location.hash.indexOf(panel.id)===1) _auto();

	// STIR ACCORDION
	//const accordion = container.closest && container.closest('[role=dave]');
	//if(accordion && !accordion.hidden) _auto();

	// CALLBACK QUEUE - replaces the DOM checking above
	if(stir.callback && stir.callback.queue && stir.callback.queue.indexOf("stir.course.auto")>-1) _auto();
	// todo: empty the queue?

	return {
		auto: _auto
	};

})();


// TEMPORARY ONLY UNTIL T4 REPUBLISHES THE COURSE PAGES
// 2024-02-07 r.w.morrison@stir.ac.uk
 
var StirUniModules = StirUniModules || {};
StirUniModules.initialisationRoutine = stir.course.auto;
/*
 * Personalisation for course pages
 */

//(function () {

//    UoS_locationService.do(function (data) {
//        var objSchols = stir.t4Globals.scholarships;
//
//        for (var index in objSchols) {
//
//            if (data.country_code === objSchols[index].country && objSchols[index].show) {
//                var el = document.querySelectorAll("#ug-course-tabs__overview div.c-wysiwyg-content p")[0];
//                var newNode = document.createElement("p");
//
//                newNode.innerHTML = 'Test';
//                el.parentNode.insertBefore(newNode, el);
//
//            }
//        }
//    });

//})();
/*
 * Data parsing and listing moved to T4. Now just the button hack remaining.
 * @author: Ryan Kaye
 * @version: 3
 * @date: March 2022
 */

(function (scope) {
  if (!scope) return;

  /* EVENT Listener for and handle click events */
  const addCourseItemListener = (el) => {
    if (el.children[0] && el.children[0].hasAttribute("href"))
      el.onclick = () => (window.location = el.children[0].attributes.href.value);
  };

  /* Make the related courses <li />s fully clickable */
  stir.each((el) => addCourseItemListener(el), stir.nodes(".c-course-related__buttons ul li"));

  /* End */
})(stir.node(".c-course-related__buttons"));

/*
   Find a content item then animate scroll to it opening any tabs / accords along the way
   @author: Ryan Kaye
   @version: 2
   @date: Oct 2021
 */

(function () {
  /*
    DOM elements
  */

  const applySlideBtns = stir.nodes("[data-applyslidelink]");
  const skipLinks = stir.nodes(".skip-link");
  const buttonsNode = stir.node(".c-course-title__buttons");

  /*
    Vars
  */

  const offsets = { small: 50, medium: 150 };
  const errorMsg = ["WARNING!! Missing apply now button anchor location ID", "Please inform a dev!! "];

  if (!applySlideBtns && !skipLinks) return;

  /* 
    Returns a node that outputs an error message
  */
  const renderErrorNode = (contentId, errorMsg) => `<p class="alert callout">` + errorMsg[0] + ` ` + contentId + ` ` + errorMsg[1] + `</p>`;

  /* 
    Return the node id part from a url (#nodeid)
  */
  const getLinkId = (href) => {
    const contentUris = href.split("#");
    return contentUris.length > 1 ? contentUris[1] : "";
  };

  /* 
    Check if node is within another component (className) and return it or null
  */
  const isInComponent = (className, node) => {
    let found = false,
      tempNode = node;

    while (!found && tempNode !== null) {
      if (tempNode.classList && tempNode.classList.contains(className)) {
        return tempNode;
      }
      tempNode = tempNode.parentNode;
    }
    return null;
  };

  /*
    Find the content item then smooth scroll to it
   */
  const slideToContent = (nodeId, offset) => {
    const node = document.getElementById(nodeId);

    const tab = isInComponent("stir-tabs__content", node);

    // Open the tab if found and closed
    if (tab) {
      const tabBtn = tab.previousElementSibling;
      if (!tabBtn.classList.contains("stir-tabs__tab--active")) tabBtn.click();
    }

    const accord = isInComponent("stir-accordion", node);

    // Open the accord if found and closed
    if (accord) {
      const accordBtn = accord.children[0].children[0];
      if (!accordBtn.hasAttribute("aria-expanded") || accordBtn.getAttribute("aria-expanded") === "false") accordBtn.click();
    }

    node && stir.scrollToElement(node, offset);
    return;
  };

  /*
    Handle click events
   */
  const handleClick = (e) => {
    const contentId = getLinkId(e.target.href);

    if (contentId && document.getElementById(contentId)) {
      const offset = offsets[stir.MediaQuery.current] ? offsets[stir.MediaQuery.current] : 100;

      slideToContent(contentId, offset);
      e.preventDefault();
      return;
    }
  };

  /*
    Listen for click events
   */
  const addClickListener = (btn) => {
    btn.addEventListener("click", handleClick);
    return;
  };

  /* 
    Error handling 
  */
  const handleError = (btn, buttonsNode, errorMsg) => {
    const contentId = getLinkId(btn.getAttribute("href"));
    if (!document.getElementById(contentId)) {
      // No target node so output a message for the content team
      if (UoS_env.name !== "prod") {
        if (buttonsNode) {
          buttonsNode.insertAdjacentHTML("beforeend", renderErrorNode(contentId, errorMsg));
        }
      }
      // Hide the button for live
      if (UoS_env.name === "prod") btn.classList.add("hide");
      return "Error";
    }
    return "No Error";
  };

  /*
    ON LOAD: Apply button actions
   */

  if (applySlideBtns) {
    stir.each((btn) => {
      handleError(btn, buttonsNode, errorMsg);
      addClickListener(btn);
    }, applySlideBtns);
  }

  /*
    ON LOAD: Skiplink actions
   */

  skipLinks && stir.each(addClickListener, skipLinks);

  /* END */
})();

/*
 * Sticky menu show/hide
 * @author: Ryan Kaye / Robert Morrison
 */

(function () {
  /*
   * DOM elements
   */

  var stickyMenu = stir.node(".c-course-title-sticky-menu");
  var stickyCloseBtn = stir.node("#course-sticky-close-btn");
  var buttonBox = stir.node(".c-course-title__buttons"); // Once off screen the sticky kicks in

  /*
   * Vars
   */

  var enableSticky = true; // (MUTATIONS!!)

  /*
   * ON LOAD
   */

  if (!stickyMenu) return;

  var showPosition = buttonBox ? buttonBox.offsetTop + buttonBox.offsetHeight : 0;

  if (stir.MediaQuery.current !== "small") {
    stickyMenu.classList.add("stir__slideup");
    stickyMenu.style.display = "block";

    if (buttonBox) {
      window.addEventListener("scroll", scrollPositionChecker); // listen for scrolling
    }

    if (stickyCloseBtn) {
      stickyCloseBtn.onclick = function (e) {
        enableSticky = false;
        window.removeEventListener("scroll", scrollPositionChecker); // stop listening for scrolling
        stickyMenu.parentNode.removeChild(stickyMenu);
        e.preventDefault();
      };
    }
  }

  /* -----------------------------------------------
   * Decides whether to how or hide the sticky based on scroll position
   * ---------------------------------------------- */
  function showHideSticky() {
    if (enableSticky) {
      if (window.scrollY > showPosition) stickyMenu.classList.add("stir__slidedown");
      if (window.scrollY < showPosition) stickyMenu.classList.remove("stir__slidedown");
    }
  }

  /* -----------------------------------------------
   * Changed this to a named function so we can easily "removeEventListener" when
   * we no longer need it. (Anonymous functions can be added but not removed). [rwm2]
   * ---------------------------------------------- */
  function scrollPositionChecker() {
    window.requestAnimationFrame(showHideSticky);
  }
})();

/*
 * Dynamically insert testimonials based of "Name" id
 * @author: Ryan Kaye
 * @date: Dec 2022 Ho Ho Ho
 * @version: 1
 */

(function (scope) {
  if (!scope) return;

  /*
      VARS
   */

  const DATANODE = scope;

  //const server = 'stir-search.clients.uk.funnelback.com';
  const server = "search.stir.ac.uk";
  const urlBase = `https://${server}`; // ClickTracking
  const JSON_BASE = `${urlBase}/s/search.json?`;

  const scaleImage = stir.curry((server, image) => `https://${server}/s/scale?url=${encodeURIComponent(image)}&width=800&height=800&format=jpeg&type=crop_center`);
  const scaleImageWithFunnelback = scaleImage(server);

  const CONSTS = {
    SF: "[profileDegreeTitle,profileCountry,profileCourse,profileCourse1,profileCourse1Url,profileCourse1Modes,profilecourse1Delivery,profileCourse2,profileCourse2Url,profilecourse2Delivery,profileCourse2Modes,profileFaculty,profileSubject,profileYearGraduated,profileLevel,profileTags,profileSnippet,profileImage,profileMedia]",
    collection: "stir-www",
    sortBy: "metaprofileImage",
    tags: "[student alum]",
    postsPerPage: 9,
    noOfPageLinks: 9,
    urlBase: urlBase,
  };

  /*
      formatName() : @returns String (html)
   */
  const formatName = (name) => name.replace("| Student Stories | University of Stirling", "").trim();

  /*
      renderQuote() : @returns String (html)
   */
  const renderQuote = (item) => {
    return `
      <div id="pullquote-77513" class="pullquote pullquote-pic ">
            <img src="${scaleImageWithFunnelback("https://stir.ac.uk" + item.metaData.profileImage)}" alt="${formatName(item.title)}" loading="lazy"  width="700" height="600">
            <div class="pullquote--text">
              <cite>
                <span class="author">${formatName(item.title)}</span><br>
                <span class="info">${item.metaData.profileCountry}</span><br>
                <span class="info">${item.metaData.profileDegreeTitle}</span>
              </cite>
              <blockquote cite="#">
                <q>${item.metaData.profileSnippet}</q>
              </blockquote>
              <a href="${item.displayUrl}" aria-label="Read ${formatName(item.title)}'s story (${formatName(item.title)})" class="c-link">Read ${formatName(item.title).split(" ")[0]}'s story</a>
            </div>
        </div>
    `;
  };

  /*
      setDOMContent() : @returns boolean
   */
  const setDOMContent = (resultsArea, html) => {
    stir.setHTML(resultsArea, html);

    return true;
  };

  /*
      getTestimonial() : @returns string 
   */
  const getTestimonial = (testimonial, results) => {
    const filtered = results.filter((item) => {
      if (formatName(item.title) === testimonial) return item;
    });

    if (!filtered.length) return "";

    return renderQuote(filtered[0]);
  };

  /*
      main() : @returns boolean
   */
  const main = (dataNode, consts, jsonBase) => {
    const testimonials = dataNode
      .getAttribute("data-testimonials")
      .split("|")
      .filter((el) => el);

    if (!testimonials.length) return false;

    const params = Object.entries(consts)
      .map((item) => item[0] + "=" + item[1])
      .join("&");

    const query = `&query=[${testimonials.map((el) => el).join(" ")}]`;
    const jsonUrl = jsonBase + params + query;

    // Get the data from FunnelBack
    stir.getJSON(jsonUrl, (initialData) => {
      const results = initialData.response.resultPacket.results;
      const html = testimonials.map((item) => getTestimonial(item, results)).join(" ");
      const resultsArea = dataNode.querySelector(".pullquotesbox");

      resultsArea && setDOMContent(resultsArea, html);
    });

    return true;
  };

  /*
      On Load
   */

  const run = DATANODE.map((element) => main(element, CONSTS, JSON_BASE));

  /*
      End
   */
})(stir.nodes("[data-testimonials]"));
