/*
 * Webinars - output required ones based on set of supplied parametres
 * @author: Ryan Kaye
 * @version: 3
 * @date: 17 June 2021
 */
(function () {
  // Variable dataSafeList ensures we only use params we def want to compare from data-series="" and nothing else
  var dataSafeList = ["countries", "series", "subjects", "studylevels", "faculties"];
  var dataWebinars = stir.t4Globals.webinars || [];
  var webinarSectionData = stir.t4Globals.webinarSectionData || {};
  var component = "webinar";
  var webinarList = stir.nodes("[data-" + component + "]");
  var euCountries = stir.t4Globals.eu || [];
  var commonwealthCountries = stir.t4Globals.commonwealth || [];
  var subSaharanAfrica = stir.t4Globals.subSaharanAfrica || [];
  var strEU = "All EU";
  var strCW = "All Commonwealth";
  var strSSA = "All Sub-Saharan Africa"; // Objects to hold various data we will need for matching / counting / comparing etc

  var objHTMLDataCounts, objWebinarCounts, objMatches, objExcludes;
  /*
   * On Load - away we go
   */

  init();
  /*
   * Loop all Webinar components on the page and do what needs doing for each open
   * Controller function
   */

  function init() {
    webinarList.forEach(function (component) {
      component.innerHTML = '<div class="cell"><p>Loading webinars...</p></div>'; // initialse empty data objects

      objHTMLDataCounts = {};
      objWebinarCounts = {};
      objMatches = [];
      objExcludes = [];
      examineData(component);
      matchWebinars();
      cleanData();
      outputHtml(component);
    });
  }
  /*
   * Function: Loop all the data objects looking for matches
   */


  function examineData(element) {
    var webinarId = element.dataset.webinar;
    var objDataTags = webinarSectionData[webinarId].params; // 1) loop the els html data-xxx attributes

    for (var index in objDataTags) {
      var arrObjDataTags = objDataTags[index].split(","); // In the safe list?

      if (dataSafeList.indexOf(index) > -1) {
        objHTMLDataCounts[index] = arrObjDataTags.length; // 2) loop the individual tags within the data-xxx

        arrObjDataTags.forEach(function (tag) {
          var param = tag.trim(); // 3) loop the webinars json data looking for tag matches

          dataWebinars.forEach(function (webinar) {
            if (webinar.id) {
              objWebinarCounts[webinar.id] = objWebinarCounts[webinar.id] || {};
              objWebinarCounts[webinar.id][index] = objWebinarCounts[webinar.id][index] || 0;
              var arrTags = webinar[index].split(", ");
              matchTags(arrTags, param, webinar, index);
            }
          }); // end of webinar loop
        });
      } // Not in the safe list so add it to the excludes object


      if (dataSafeList.indexOf(index) < 0) {
        if (index.indexOf("Exclude") > -1) {
          objExcludes.push({
            cat: index,
            val: objDataTags[index]
          });
        }
      }
    } // end data-xxx loop

  }
  /*
   * Function: Get the webinars that match the els data-xx requirements by comparing objects
   */


  function matchWebinars() {
    for (var index in objWebinarCounts) {
      if (paramsHaveMatch(objHTMLDataCounts, objWebinarCounts[index])) {
        objMatches.push(addWebinar(index));
      }
    }
  }
  /*
   * Function: Sort the data and remove unwanted item
   */


  function cleanData() {
    // Sort by date
    objMatches.sort(function (a, b) {
      var valA = parseInt(a.datetime);
      var valB = parseInt(b.datetime);
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    }); // Negate any excluded items (eg data-series-exclude="foo") by removing its id

    for (var i in objExcludes) {
      if (objExcludes[i].cat) {
        var indexExclude = objExcludes[i].cat.replace("Exclude", "");
        var arrValExcludes = objExcludes[i].val.split(", ");

        for (var index in objMatches) {
          if (objMatches[index][indexExclude] && arrValExcludes.indexOf(objMatches[index][indexExclude]) > -1) objMatches[index].id = "";
        }
      }
    }
  }
  /*
   * Function: Form the HTML to by output
   */


  function outputHtml(element) {
    var html = [];
    var webinarId = element.dataset.webinar; // Form the html for each webinar item

    for (var index in objMatches) {
      if (objMatches[index] && objMatches[index].id) html.push(renderComponent(objMatches[index]));
    } // We have matches so add the headers then output html to the page


    if (objMatches.length > 0) {
      html.unshift('<div class="cell"><h2>' + webinarSectionData[webinarId].head + "</h2>" + webinarSectionData[webinarId].intro + "</div>");
      html.push('<div class="cell"><hr /></div>');
      element.innerHTML = html.join("\n");
    } // No matches so remove the node as its empty after removing the loading message


    if (objMatches.length <= 0) {
      element.innerHTML = "";
      if (Element.prototype.remove) element.closest("section.c-wrapper-webinar").remove();
    }
  }
  /*
   * Function: loop the json element values (tags) and keep a count of matches
   * item = webinar data
   * param = html data to be matched
   */


  function matchTags(arrTags, param, webinar, index) {
    for (var t = 0; t < arrTags.length; t++) {
      var item = arrTags[t];

      if (item) {
        // check for a direct match eg France = France
        if (item.trim() === param) {
          objWebinarCounts[webinar.id][index]++;
        } // check for non direct match eg France = 'All EU' and vise versa


        if (item.trim() !== param) {
          // Country Macros
          if (index === "countries") {
            // eg param = France so match 'All EU'
            if (euCountries.indexOf(param) > -1 && item.trim() === strEU) {
              objWebinarCounts[webinar.id][index]++;
              break;
            }

            if (commonwealthCountries.indexOf(param) > -1 && item.trim() === strCW) {
              objWebinarCounts[webinar.id][index]++;
              break;
            }

            if (subSaharanAfrica.indexOf(param) > -1 && item.trim() === strSSA) {
              objWebinarCounts[webinar.id][index]++;
              break;
            } // eg param = 'All EU' so match France


            if (euCountries.indexOf(item.trim()) > -1 && param === strEU) {
              objWebinarCounts[webinar.id][index]++;
              break;
            }

            if (commonwealthCountries.indexOf(item.trim()) > -1 && param === strCW) {
              objWebinarCounts[webinar.id][index]++;
              break;
            }

            if (subSaharanAfrica.indexOf(item.trim()) > -1 && param === strSSA) {
              objWebinarCounts[webinar.id][index]++;
              break;
            } // All Nationalities


            if (item.trim() === "All nationalities") {
              objWebinarCounts[webinar.id][index]++;
              break;
            }

            if (param === "All nationalities") {
              objWebinarCounts[webinar.id][index]++;
              break;
            }
          } // All Faculties matching


          if (index === "faculties" && param === "All Faculties") {
            objWebinarCounts[webinar.id][index]++;
            break;
          }
        }
      }
    }
  }
  /*
   * Function: Find the webinar object and return it
   */


  function addWebinar(itemId) {
    for (var index in dataWebinars) {
      if (dataWebinars[index].id && dataWebinars[index].id == itemId) {
        item = dataWebinars[index];
        return dataWebinars[index];
      }
    }
  }
  /*
   * Function: Check if 2nd object has at least one match for each key in first
   * Use this if script requires only 1 match per param - OR rather than AND
   */


  function paramsHaveMatch(object1, object2) {
    var keys1 = Object.keys(object1);
    var keys2 = Object.keys(object2); // return false as we dont have all params required

    if (keys1.length !== keys2.length) return false; // Loop the object and make sure we have at least one match per key (ie value is not 0)

    for (var i = 0, _keys = keys1; i < _keys.length; i++) {
      var key = _keys[i];
      if (object2[key] < 1) return false;
    }

    return true;
  }
  /*
   * Function: Check if 2 objects are the same (keys and values)
   * Use this if script requires complete matching of params - AND rather than OR
   */


  function paramsTotalMatch(object1, object2) {
    var keys1 = Object.keys(object1);
    var keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) return false;

    for (var i = 0, _keys = keys1; i < _keys.length; i++) {
      var key = _keys[i];
      if (object1[key] !== object2[key]) return false;
    }

    return true;
  }
  /*
   * Function: Build the HTML for the component
   */


  function renderComponent(item) {
    var html = [];
    var date = new Date(item.date);
    html.push('<div class="cell small-12 c-promo-box large-3 medium-6 u-padding-bottom" ><div><div class="c-promo-box__layout-container">');
    html.push('<div class="c-promo-box__content"><div>');
    html.push('<h2 class="c-promo-box__header header-stripped">' + item.title + "</h2>");
    if (item.countries !== "") html.push("<p>" + item.countries + "</p>");
    html.push("<p><strong>" + item.faculties + "</strong></p>");
    html.push("<p><strong>" + item.date + "</strong></p>");
    html.push("<p>Start time: " + item.time + " (" + stir.BSTorGMT(date) + ")</p>");
    html.push("</div></div>");
    html.push('<div class="c-promo-box__link"><a href="' + item.link + '" aria-label="Register for webinar: ' + item.title + '" class="c-link">Register now</a></div>');
    html.push("</div></div></div>");
    return html.join("\n");
  }
})();