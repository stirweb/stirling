var stir = stir || {};

stir.dpt = (function () {
  const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
  const _semestersPerYear = 2;
  const viewMoreModulesThreshold = 5;
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
  let _moduleCache=[],_mcPointer=0;
  let routesCurry;
  
  function resetGlobals() {
    _year = 0;
    _semesterCache = [];
  }
  const modulesEndpointParams = {
    UG: "opt=runcode&ct=UG",
    PG: "opt=runpgcode&ct=PG",
  };
  const currentVersion = {
    UG: 436, //362
    PG: 417  //357
  };

  const PORTAL = "https://portal.stir.ac.uk";

  const urls = {
    // Akari module viewer:
    viewer: window.location.hostname.indexOf("stiracuk-cms01") !== -1 ? `/terminalfour/preview/1/en/33273` : "/courses/module/",
    // Portal web frontend:
    calendar: `${PORTAL}/calendar/calendar`,
    // Portal data endpoints:
    servlet: `${PORTAL}/servlet/CalendarServlet`,
    route: {
      UG: `?opt=menu&ver=${currentVersion["UG"]}&callback=stir.dpt.show.routes`,//+ (ver?ver:'')
      PG: `?opt=pgmenu&ver=${currentVersion["PG"]}&ct=PG&callback=stir.dpt.show.routes`, //+ (ver?ver:'')
    },
    option: (type, roucode) => `?opt=${type.toLowerCase()}-opts&rouCode=${roucode}&ct=${type.toUpperCase()}&ver=${currentVersion[type.toUpperCase()]}&callback=stir.dpt.show.options`,
    fees: (type, roucode) => `?opt=${type}-opts&rouCode=${roucode}&ct=${type.toUpperCase()}&ver=${currentVersion[type.toUpperCase()]}&callback=stir.dpt.show.fees`,
    modules: (type, roucode, moa, occ) => `?${modulesEndpointParams[type.toUpperCase()]}&moa=${moa}&occ=${occ}&rouCode=${roucode}&ver=${currentVersion[type.toUpperCase()]}&callback=stir.dpt.show.modules`,
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

  const splitCodes = (csv) => csv.replace(/\s/g, "").split(",");

  const getVersion = (type) => stir.getJSONp(`${urls.version[type]}`);

  const getRoutes = (type, routesCSV, auto) => {
    user.type = type;
    user.auto = auto;
    stir.dpt.show.routes = routesCurry(splitCodes(routesCSV));
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

  const moduleUrl = data => `${urls.viewer}?code=${data.modCode}&session=${data.mavSemSession}&semester=${data.mavSemCode}&occurrence=${data.mavOccurrence}&course=${getCurrentUri()}`;
  const moduleIdentifier = data => `${data.modCode}/${data.mavSemSession}/${data.mavSemCode}`;

  const moduleLink = (data,index) => {
    // LINK TO NEW AKARI MODULE PAGES
    const link = `<a href="${moduleUrl(data)}" data-index=${index} data-spa="${moduleIdentifier(data)}">${data.modName}</a>`;
    const fallback = `<span data-dpt-unavailable title="Module details for ${data.modCode} are currently unavailable">${data.modName}</span>`;
	  return availability(data) ? link : fallback;
	
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
    module: (data) => {
      // stash a list of modules to facilitate prev/next navigation among them
      _moduleCache.push({
          modName:data.modName,
          modCode:data.modCode,
          mavSemSession:data.mavSemSession,
          mavSemCode:data.mavSemCode,
          mavOccurrence:data.mavOccurrence});

      return `<tr><td>${moduleLink(data,_moduleCache.length)}
			<span class=c-course-modules__module-code>(${data.modCode})</span>
			</td><td>${data.modCredit} credits</td></tr>`;
    },
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

  // hide the module if it's unavailable. (This logic was taken from Portal calendar.js).
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
    p.innerHTML = stir.String.stripHtml(text.replace(/<\/?(br|p)>/g,"__br__")).replaceAll("__br__","<br>");
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

  function viewModule(e) {
    e.preventDefault();
    _mcPointer = parseInt(this.getAttribute('data-index'))-1;
    stir.dpt.show.module( this.getAttribute('data-spa'), this.getAttribute('href') );
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
      paths_p.classList.add("c-callout", "info");
      frag.prepend(paths_p);
    }

    // attach behaviour to `view more` links and bind them to the respective table element
    Array.prototype.forEach.call(frag.querySelectorAll("[data-collection-container]"), function (el) {
      var a = el.querySelector(".c-course-modules__view-more-link a");
      a && a.addEventListener("click", viewMore.bind(el));
    });
    
    Array.prototype.forEach.call(frag.querySelectorAll("a[data-spa]"), el => {
      el.addEventListener("click", viewModule.bind(el));
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
      stir.dpt.reset.options();
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

  const na = new Function();

  return {
    show: {
      fees:     na,
      routes:   na,
      options:  na,
      modules:  na,
      module:   na,
      version:  na,
      next: function(e) {
        if(_mcPointer===_moduleCache.length-1) return;
        stir.dpt.show.module( moduleIdentifier(_moduleCache[++_mcPointer]), moduleUrl(_moduleCache[_mcPointer]));
      },
      previous: function(e) {
        if(_mcPointer<=0) return;
        stir.dpt.show.module( moduleIdentifier(_moduleCache[--_mcPointer]), moduleUrl(_moduleCache[_mcPointer]));
      }
    },
    get: {
      options: getOptions,
      routes: getRoutes,
      viewer: () => urls.viewer,
      version: getVersion
    },
    reset: {
      module:  na,
      modules: na,
      options: na
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
        module:  (callback) => (stir.dpt.show.module  =  (a,b) => callback(a,b)),
        version: (callback) => (stir.dpt.show.version = (data) => callback(versionToSession(data)))
      },
      reset: {
        module:  (callback) => (stir.dpt.reset.module = callback),
        modules: (callback) => (stir.dpt.reset.modules = callback),
        options: (callback) => (stir.dpt.reset.options = callback),
      },
    },
    debug: {
      version: (data) => {
        console.info(data);
      }
    }
  };
})();
