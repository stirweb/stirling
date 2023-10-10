/*
 * Stirling uni modules
 */

StirUniModules.getAPIModuleLink = (code,session,semester,occurrence) => {

	if("pub"===UoS_env.name) {
		return StirUniModules.getDPTModuleLink(code);
	}
//	if(UoS_env.name.indexOf("preview")>-1){
		const sid = document.querySelector('meta[name="sid"]') ? document.querySelector('meta[name="sid"]').getAttribute('content') : 'error_sid-not-found';
		return `https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/33273?code=${code}&session=${session}&semester=${semester}&occurrence=${occurrence}&course=${sid}`;
//	}
};

/*
 * Function setShowRoutesRenderer
 */
StirUniModules.setShowRoutesRenderer(function (routesData) {
  var rouList = StirUniModules.DOM["routes-list"];
  var selector = document.createElement("select");

  selector.id = "course-modules-container__routes-select";

  for (var i = 0; i < routesData.length; i++) {
    if (typeof routesData[i] === "undefined") {
      console.error("Error with module code " + (i + 1));
    } else {
      selector.insertAdjacentHTML("beforeend", '<option value="' + routesData[i].rouCode + "," + StirUniModules.getCourseType() + '">' + routesData[i].rouName + "</option>");
    }
  }

  rouList.insertAdjacentHTML("afterbegin", "<p>Please choose a course:</p>");
  rouList.appendChild(selector);

  selector.addEventListener("change", function (e) {
    var value = this.options[this.selectedIndex].value.split(",");
    var routeCode = value[0];
    var courseType = value[1];

    // Reset various DOM elements
    StirUniModules.reset(true);

    StirUniModules.loadCourseOptions(routeCode, courseType);
  });
});

/*
 * Function setShowOptionsRenderer
 */
StirUniModules.setShowOptionsRenderer(function (optionsData) {
  var optList = StirUniModules.DOM["options-list"];
  var selector = document.createElement("select");

  selector.id = "course-modules-container__options-select";

  for (var i = 0; i < optionsData.length; i++) {
    var value = StirUniModules.getSelectedRoute() + "," + optionsData[i][0] + "," + optionsData[i][2];
    var innerText =
      "Starting " +
      optionsData[i][3] +
      // " " +
      // StirUniModules.option.getYearFromMonth(optionsData[i][3]) +
      ", " +
      optionsData[i][1].toLowerCase();
    if (optionsData[i][4] !== "Stirling") innerText += " (" + optionsData[i][4] + ")";
    selector.insertAdjacentHTML("beforeend", '<option value="' + value + '">' + innerText + "</option>");
  }

  optList.innerHTML = "<p>There are " + stir.cardinal(optionsData.length) + " options for this course:</p>";
  optList.appendChild(selector);

  // set behaviour of each select
  selector.addEventListener("change", function (e) {
    var value = this.options[this.selectedIndex].value.split(",");
    var rou = value[0];
    var moa = value[1];
    var occ = value[2];

    StirUniModules.reset(false);

    // this will load and display the modules:
    StirUniModules.loadCourseModules(rou, moa, occ);
  });
});

/*
 * Function setShowModulesRenderer
 */
StirUniModules.setShowModulesRenderer(function (data) {
  var container = document.querySelector(StirUniModules.getOption("container"));
  if (!container) return;

  var debug = window.location.hostname != "www.stir.ac.uk" ? true : false;

  var accordion = StirUniModules.DOM["accordion"],
    html = [],
    initialText = StirUniModules.DOM["initial-text"],
    autoExpandFirstAccordion = StirUniModules.getOption("auto_expand_first_accordion") ? true : false; //
  (viewMoreModulesThreshold = 4), (viewMoreLinkText = "View all _X_ choices"), (viewLessLinkText = "View fewer choices"); //greater than 4 modules will show "show more" link (see css class for display property)

  var module,
    collection,
    year = 0,
    yearsWithOptions = [],
    semester,
    semesterCache = [],
    semesterNameText, //e.g. "Semester 1" / "Speing semester"
    semesterOptionIdText, //if multiple options exist (e.g. " (Option A)")
    showCollectionNotes, // boolean
    collectionId, //string
    collectionHeaderTextChanged,
    collectionlist_html, //array
    collectionNotEmpty, //boolean
    showModule; // boolean

  if (initialText && data.initialText) {
    initialText.appendChild(stir.String.fixHtml(data.initialText, true));
  }

  /**
   * get header text for collection
   **/
  var getCollectionHeaderText = function (collectionStatusCode) {
    var collectionHeaderText;

    // this was taking from how the calendar JS displays titles
    if (collectionStatusCode.indexOf("E") > -1) {
      collectionHeaderText = "Option module";
    } else if (collectionStatusCode === "D") {
      collectionHeaderText = "Dissertation";
    } else {
      collectionHeaderText = "Compulsory module";
    }

    return collectionHeaderText;
  };

  // generate a checksum so we can compare and output collection header if
  // neccessary
  var getCollectionHeaderChecksum = function (code, notes) {
    return getCollectionHeaderText(code) + notes;
  };

  var multi = false;

  if (data.pdttRept) {
    StirUniModules.DOM["pdttRept"].appendChild(stir.String.fixHtml(data.pdttRept, true));
  }

  // look-ahead: do any groups have multiple options?
  for (var g = 0; g < data.semesterGroupBeans.length; g++) {
    // groups loop
    if (data.semesterGroupBeans[g].groupOptions.length > 1) {
      multi = true;
      break;
    }
  }

  // Loop through the nested Groups and Options to get to the modules…
  for (var g = 0; g < data.semesterGroupBeans.length; g++) {
    // groups loop
    for (var o = 0; o < data.semesterGroupBeans[g].groupOptions.length; o++) {
      // options in group
      for (var s = 0; s < data.semesterGroupBeans[g].groupOptions[o].semestersInOption.length; s++) {
        // semesters in option

        semester = data.semesterGroupBeans[g].groupOptions[o].semestersInOption[s];
        collections = semester.collections;
        semesterId = [g, o, s].join("");

        // first, we'll work out which academic year we are in
        // this code is based on academic-calendar.js from the
        // Portal Degree Programme Tables.
        if ("PG" == StirUniModules.getCourseType()) {
          /**
           * Use this logic for PG courses
           */
          if (g === 0 && o === 0 && s === 0) {
            //first group, first option, first semester
            year++;
            semesterCache.push(semester.semesterName);
          } else if (semesterCache.indexOf(semester.semesterName) === -1 && o === 0) {
            //new semester and option 1
            semesterCache.push(semester.semesterName);
          } else if (o === 0) {
            //else if repeated semester and still option 1 - only increment year on option 1
            semesterCache = []; //reset array of semesters
            semesterCache.push(semester.semesterName);
            year++;
          }
        } else {
          /**
           * Use this for UG courses
           */
          year = StirUniModules.semester.getYear(parseInt(semester.semesterCode));
        }

        // next, we'll put the modules in the correct order
        // i.e. the same order in which they appear in
        // the calendar
        collections.sort(StirUniModules.moduleSort);

        // now we have all the info we need to render the HTML:

        semesterNameText = "Year " + year + ", " + (semester.semesterName ? semester.semesterName + " semester" : "Semester " + StirUniModules.semester.getSemesterYearIndex(semester.semesterCode));
        //multi-option year
        if (multi) {
          semesterOptionIdText = " (Option " + (o + 1) + ")"; // use numeric `o` instead of alphabetical `optionId` for consistency with DPT
          yearsWithOptions.push({
            year: year,
            options: data.semesterGroupBeans[g].groupOptions.length,
          });
        } else {
          semesterOptionIdText = "";
        }

        // build the accordion HTML:
        html.push('<div class="stir-accordion ' + (autoExpandFirstAccordion ? " stir-accordion--active" : "") + ' ">');
        html.push('<h3><a href="#" class="stir-accordion--btn" aria-expanded="' + (autoExpandFirstAccordion ? "true" : "false") + '" aria-controls="panel_modules_' + semesterId + '" id="accord_modules_' + semesterId + '">' + semesterNameText + semesterOptionIdText + "</a></h3>");
        html.push('<div class="c-wysiwyg-content c-course-modules__collection ' + StirUniModules.css.truncateModuleCollection + '" id="panel_modules_' + semesterId + '" role="region" aria-labelledby="accord_modules_' + semesterId + '">');

        // reset this to ensure on the next semester block title is output
        collectionHeaderChecksum = null;

        // insert accordion content
        for (var c = 0; c < collections.length; c++) {
          // collections in semester (e.g. COMP)

          collection = collections[c];
          collectionlist_html = [];
          collectionId = [g, o, s, c].join("");

          collectionlist_html.push('<table class="text-left c-course-modules__table" id="course-modules__table_' + collectionId + '">');
          collectionlist_html.push('<tr class="show-for-sr">');
          collectionlist_html.push("    <th>Module</th>");
          collectionlist_html.push("    <th>Credits</th>");
          collectionlist_html.push("</tr>");

          collectionNotEmpty = false;

          for (var m = 0; m < collection.mods.length; m++) {
            module = collection.mods[m];

            // hide the module if it's unavailable. (This condition was taken from calendar js).
            if (StirUniModules.getOption("hide_modules_if_not_available") && (module.mavSemSemester === null || module.mavSemSemester.length === 0 || module.mavSemSemester === "[n]" || module.mavSemSemester === "Not Available")) {
              showModule = false;
            } else {
              showModule = true;
              collectionNotEmpty = true;
            }

            if (showModule || debug) {
              collectionlist_html.push("<tr" + (showModule ? "" : ' data-availability="false" data-modcode="' + module.modCode + '"') + ">");
//              collectionlist_html.push('    <td><a href="' + StirUniModules.getDPTModuleLink(module.modCode) + '" data-modalopen="course__description" data-module-code="' + module.modCode + '" data-semester-code="' + module.mavSemCode + '" data-occurrence="' + module.mavOccurrence + '" data-year-session="' + module.mavSemSession + '">' + module.modName + '</a> <span class="c-course-modules__module-code">(' + module.modCode + ")</span></td>");
              collectionlist_html.push('    <td><a href="' + StirUniModules.getAPIModuleLink(module.modCode,module.mavSemSession,module.mavSemCode,module.mavOccurrence) + '">' + module.modName + '</a> <span class="c-course-modules__module-code">(' + module.modCode + ")</span></td>");
              collectionlist_html.push("    <td>" + module.modCredit + " credits</td>");
              collectionlist_html.push("</tr>");
            }
          } // end of module loop

          collectionlist_html.push("    </table>");

          if (collectionNotEmpty || debug) {
            // in accordance with calendar js, we only show notes on this condition
            showCollectionNotes = collection.collectionType == "LIST" || collection.collectionType == "CHOICE";

            // we'll show the header if there are collection notes, if header text has changed,
            // and if collapse_collection_headers option says to do so
            collectionHeaderTextChanged = getCollectionHeaderChecksum(collection.collectionStatusCode, collection.collectionNotes) !== collectionHeaderChecksum;
            if (!StirUniModules.getOptions().collapse_collection_headers || showCollectionNotes || collectionHeaderTextChanged) html.push('<p class="c-course-modules__collection-header">' + getCollectionHeaderText(collection.collectionStatusCode, collection.collectionNotes) + "</p>");
            if (showCollectionNotes) {
              html.push('<p class="c-course-modules__collection-notes">' + collection.collectionNotes + "</p>");
            }

            // update the checksum so we can compare with next collection
            // of this semester
            collectionHeaderChecksum = getCollectionHeaderChecksum(collection.collectionStatusCode, collection.collectionNotes);

            // now output the table we created earlier
            html.push(collectionlist_html.join(""));

            if (collection.mods.length > viewMoreModulesThreshold) {
              html.push('<p class="text-center c-course-modules__view-more-link">');
              html.push('<a href="#" data-choices="' + collection.mods.length + '" aria-expanded="false" aria-controls="course-modules__table_' + collectionId + '">');
              html.push(viewMoreLinkText.replace("_X_", collection.mods.length));
              html.push("</a></p>");
            }

            if (collection.collectionFootnote) {
              html.push('<p class="c-course-modules__pdm-note">' + collection.collectionFootnote + "</p>");
            }
          }
        } // end of collection loop

        // close accordion item
        html.push("  </div><!-- end .accordion-content -->");
        html.push("</div>");

        autoExpandFirstAccordion = false;
      } // end of semester loop
    } // end of options in group loop
  } // end of group loop

  if (initialText) {
    var done = [];
    var paths_html = [];
    if (yearsWithOptions.length > 0) {
      yearsWithOptions.forEach(function (item) {
        if (item.options > 1 && done.indexOf(item.year) === -1) {
          done.push(item.year);
          paths_html.push(stir.cardinal(item.options) + " alternative paths in year " + stir.cardinal(item.year));
        }
      });
      initialText.insertAdjacentHTML("afterbegin", '<p class="c-callout info"><strong><span class="uos-shuffle"></span> There are ' + stir.Array.oxfordComma(paths_html, true) + ".  Please review all options carefully.</strong></p>");
    }
  }

  accordion.insertAdjacentHTML("beforeEnd", html.join("\n"));

  // initialise any new accords just added to DOM
  Array.prototype.forEach.call(accordion.querySelectorAll(".stir-accordion"), function (accordion) {
    new stir.accord(accordion, true);
  });

  function resetModuleModal() {
    var header = document.getElementById("course-modules-description__header");
    var body = document.getElementById("course-modules-description__body");
    var loading = document.getElementById("course-modules-description__loading");
    var content = document.getElementById("course-modules-description__content");

    header && (header.innerHTML = "");
    body && (body.innerHTML = "");

    // show loading, hide content
    //$(loading).show();
    //$(content).hide();
    loading.style.display = "block";
    content.style.display = "none";
  }

  /**
   * fetch data from api then show to modal
   * @param {*} el the modal-opener element that was clicked
   */
  function insertModuleData(el) {
    resetModuleModal();
    StirUniModules.loadModule(el.getAttribute("data-module-code"), el.getAttribute("data-semester-code"), el.getAttribute("data-occurrence"), el.getAttribute("data-year-session"));
  }

  //view more behaviour
  function viewMore(e) {
    if (!this.classList) return;

    if (this.classList.toggle(StirUniModules.css.truncateModuleCollection)) {
      stir.scrollToElement(this, 60); // return the user to the top of list
      e.target.innerText = viewMoreLinkText.replace("_X_", e.target.getAttribute("data-choices"));
    } else {
      e.target.innerText = viewLessLinkText;
    }
    e.preventDefault();
  }

  // attach behaviour to `view more` links and bind them to the respective table element
  Array.prototype.forEach.call(container.querySelectorAll(".c-course-modules__collection"), function (el) {
    var a = el.querySelector(".c-course-modules__view-more-link a");
    a && a.addEventListener("click", viewMore.bind(el));
  });

  function modClickHandler(event) {
    insertModuleData(this);
    StirUniModules.getOptions()["modal"].open();
    event.preventDefault();
  }

  // assign click-handlers to all the new module links:
//  Array.prototype.forEach.call(document.querySelectorAll('[data-modalopen="course__description"]'), function (el) {
//    el.addEventListener("click", modClickHandler);
//  });

});

/*
 * Function setShowModuleRenderer
 */
StirUniModules.setShowModuleRenderer(function (data) {
  var options = StirUniModules.getOptions();
  /**
   * will extract a detail by name safely without error;
   * */
  function getDetail(name) {
    return data && data[0] && data[0].details && data[0].details[name]; // return last item, or first to fail
  }

  function detailsButton() {
    if (!options["data_modules_show_details_link"]) return "";
    var modCode = getDetail("Module Code");
    var link = modCode ? StirUniModules.getDPTModuleLink(modCode) : "";
    return link ? '<a href="' + link + '" class="button tiny" target="_blank">View full details of module ' + modCode + "</a>" : "";
  }

  var name = getDetail("Module Name");
  var header = document.getElementById("course-modules-description__header");
  var body = document.getElementById("course-modules-description__body");

  var desc = getDetail("Brief (marketing) description") || getDetail("Summary of Module"); // set desc as marketing description, otherwise fall back to summary

  if (desc) {
    desc = desc.replace(/<[font|u][^><]*>|<.[font|u][^><]*>/g, "").replace(/ style="([^"]+)"/gi, ""); // remove inline styles
    // $("#course-modules-description__header")
    //   .html('<h3 class="c-section-heading">' + name + "</h3>")
    //   .show();
    // $("#course-modules-description__body")
    //   .html(desc + detailsButton())
    //   .show();
    header.innerHTML = '<h3 class="c-section-heading">' + name + "</h3>";
    header.style.display = "block";
    body.innerHTML = desc + detailsButton();
    body.style.display = "block";
  } else {
    //$("#course-modules-description__header").hide();
    // $("#course-modules-description__body")
    //   .html("Module information coming soon")
    //   .show();
    header.style.display = "none";
    body.innerHTML = "Module information coming soon";
    body.style.display = "block";
  }

  // show content
  //$("#course-modules-description__loading").hide();
  //$("#course-modules-description__content").show();

  var loading = document.getElementById("course-modules-description__loading");
  var content = document.getElementById("course-modules-description__content");

  loading.style.display = "none";
  content.style.display = "block";
});

/*
 * Function setShowModuleErrorRenderer
 */
StirUniModules.setShowModuleErrorRenderer(function (data) {
  // $("#course-modules-description__header").html(
  //   '<h3 class="c-section-heading">Error</h3>'
  // );
  // $("#course-modules-description__body").html("Module information not found");

  // show content
  //$("#course-modules-description__loading").hide();
  //$("#course-modules-description__content").show();

  var header = document.getElementById("course-modules-description__header");
  var body = document.getElementById("course-modules-description__body");
  var loading = document.getElementById("course-modules-description__loading");
  var content = document.getElementById("course-modules-description__content");

  header.innerHTML = '<h3 class="c-section-heading">Error</h3>';
  body.innerHTML = "Module information not found";

  loading.style.display = "none";
  content.style.display = "block";
  console.error("Module information not found", data);
});

/*
 * Function setShowOptionsErrorRenderer
 */
StirUniModules.setShowOptionsErrorRenderer(function (data) {
  // $("#course-modules-container__loading").hide();
  // $("#course-modules-container__error").html( "Modules list not available at this time" );
  //$("#course-modules-container").hide();
  // $("#course-modules-container").append(
  //   '<p><a href="' +
  //     StirUniModules.getDPTCourseLink(data.rouCode) +
  //     '" class=c-link>View module information for this course</a></p>'
  // );

  var html = '<p><a href="' + StirUniModules.getDPTCourseLink(data.rouCode) + '" class=c-link>View module information for this course</a></p>';

  var container = document.getElementById("course-modules-container");
  container.insertAdjacentHTML("beforeend", html);
});

/*
 * Function setShowRoutesErrorRenderer
 */
StirUniModules.setShowRoutesErrorRenderer(function (data) {
  var container = document.getElementById("course-modules-container");
  if (data.routeCodes && data.routeCodes.length) {
    data.routeCodes.forEach(function (route) {
      var html = '<p><a href="' + StirUniModules.getDPTCourseLink(route) + '" class="c-link">' + route + "</a></p>";
      container.insertAdjacentHTML("beforeend", html);
      // $("#course-modules-container").append(
      //   '<p><a href="' +
      //     StirUniModules.getDPTCourseLink(route) +
      //     '" class=c-link>' +
      //     route +
      //     "</a></p>"
      // );
    });
  }
});

/*
 * Function setShowLoadingRenderer
 */
StirUniModules.setShowLoadingRenderer(function (label) {
  StirUniModules.loading.queue++;
  StirUniModules.loading.el.style.display = "block";
});

/*
 * Function setHideLoadingRenderer
 */
StirUniModules.setHideLoadingRenderer(function (label) {
  if (StirUniModules.loading.queue > 0) {
    StirUniModules.loading.queue--;
  }
  if (0 === StirUniModules.loading.queue) {
    StirUniModules.loading.el.style.display = "none";
  }
});

/*
 * Function initialisationRoutine
 */
StirUniModules.initialisationRoutine = (function () {
  /**
   * Downtime stuff
   * To enable downtime message, uncomment the
   * following and set `downtime` variable to TRUE
   **/

  //var downtime = false;
  //var downtimeText = "Module information is temporarily unavailable (last updated: Monday 25th October 2021)";
  //var modContainer = document.getElementById("course-modules-container");
  //if (modContainer && downtime) {
  //  var el = document.createElement("p");
  //  el.classList.add("text-center");
  //  el.classList.add("c-callout");
  //  el.textContent = downtimeText;
  //  modContainer.insertAdjacentElement("beforeend", el);
  //  return new Function();
  //}

  var isModulesLoaded = false; // flag to prevent loading modules with every click

  return function (event) {
    if (isModulesLoaded) {
      return;
    }
    var courseType, rouCode, data_modules_show_details_link;
    var el = document.querySelector("[data-modules-route-code][data-modules-course-type]");
    if (!el) return;
    rouCode = el.getAttribute("data-modules-route-code"); // i.e. "UHX11-ACCFIN";
    courseType = el.getAttribute("data-modules-course-type"); // i.e. "UG";
    data_modules_show_details_link = null === el.getAttribute("data-modules-show-details-link") ? false : true;
    if (!rouCode || !courseType) {
      //return;
    }

    /* Initialise the Modal popup for displaying detailed module information */
    var html = [];
    var modal = new stir.Modal();
    html.push('<div id="course-modules-description__loading"><div class="loader"></div></div>');
    html.push('<div id="course-modules-description__content">');
    html.push('<div id="course-modules-description__header"></div>');
    html.push('<div id="course-modules-description__body"></div>');
    html.push("</div>");
    modal.render("course__description", "Module summary");
    modal.setContent(html.join("\n"));

    StirUniModules.init({
      container: "#course-modules-container",
      autoload_first_route: true,
      autoload_first_option: true,
      use_cache: true,
      collapse_collection_headers: false,
      hide_modules_if_not_available: true,
      data_modules_show_details_link: data_modules_show_details_link,
      modal: modal,
    });

    /**
     * Use DPT versioning? (Needed for Dev/QA)
     * If yes, call getVersions() then callback to loadCourseRoutes().
     * If no, just call loadCourseRoutes().
     */
    //StirUniModules.getVersions( function() {
    //	StirUniModules.loadCourseRoutes(rouCode, courseType)
    //} );
    StirUniModules.loadCourseRoutes(rouCode, courseType);

    // flag to suppress loading modules again
    isModulesLoaded = true;
  };
})();

/**
 * ON LOAD ROUTINE
 *
 * If the tab is already open (hash in URL) we can just load the modules now.
 * Otherwise, the stir-tabs click handler will call the initialisationRoutine().
 *
 * [Note]: `course-tabs__course-details` was the original tab ID, `panel_1_3` is
 * the newer ID.
 *
 * [Note]: we used to do the tab-click handler here but for simplicity it's now
 * part of the tabclick handler instead. (and it can handle other callbacks if
 * we need it to).
 */
(function () {
  const elem = stir.node("#course-modules-container");

  if (elem && !elem.parentElement.hasAttribute("aria-hidden")) {
    StirUniModules.initialisationRoutine();
  }

  // var url = window.location.href;
  // if (url.indexOf("#") && (url.split("#")[1] === "course-tabs__course-details" || url.split("#")[1] === "panel_1_3")) {
  //   StirUniModules.initialisationRoutine();
  // }
})();
