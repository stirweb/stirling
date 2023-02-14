/*
 * ************** DO NOT USE ************** 
 * Superceded by version 3 which is now live
 * RK8 21/06/2021
 * Keeping around as a back up for now
 * ************** DO NOT USE ************** 
 */
(function () {
  // dataSafeList eg data-series="" only the ones we want to compare
  var dataSafeList = ["countries", "series", "subjects", "studylevels", "faculties"];
  var dataWebinars = stir.t4Globals.webinars || [];
  var component = 'webinar';
  var els = document.querySelectorAll('[data-' + component + ']');
  var webinarSectionData = stir.t4Globals.webinarSectionData || {};
  var euCountries = stir.t4Globals.eu || [];
  var commonwealthCountries = stir.t4Globals.commonwealth || [];
  var subSaharanAfrica = stir.t4Globals.subSaharanAfrica || [];
  var strEU = 'All EU';
  var strCW = 'All Commonwealth';
  var strSSA = 'All Sub-Saharan Africa';
  /* 
   * On Load
   */

  for (var i = 0; i < els.length; i++) {
    els[i].innerHTML = '<div class="cell"><p>Loading webinars...</p></div>';
    outputElData(els[i]);
  }
  /* 
   * Function: Output the webinars for this element
   */


  function outputElData(myel) {
    var objExcludes = [];
    var html = []; //var objDataTags = myel.dataset;

    var webinarId = myel.dataset.webinar;
    var objDataTags = webinarSectionData[webinarId].params;
    var objHTMLDataCounts = {};
    var objWebinarCounts = {}; // 1) loop the els html data-xxx attributes

    for (var index in objDataTags) {
      var arrObjDataTags = objDataTags[index].split(',');

      if (dataSafeList.indexOf(index) > -1) {
        objHTMLDataCounts[index] = arrObjDataTags.length; // 2) loop the individual tags within the data-xxx

        arrObjDataTags.forEach(function (tag) {
          var param = tag.trim(); // 3) loop the webinars json data looking for tag matches

          dataWebinars.forEach(function (webinar) {
            if (webinar.id) {
              objWebinarCounts[webinar.id] = objWebinarCounts[webinar.id] || {};
              objWebinarCounts[webinar.id][index] = objWebinarCounts[webinar.id][index] || 0;
              var arrTags = webinar[index].split(', '); // 4) loop an the json element values (tags) and keep a count of matches

              for (var t = 0; t < arrTags.length; t++) {
                var item = arrTags[t]; // item = webinar data 
                // param = html data to be matched

                if (item) {
                  // a direct match eg France = France
                  if (item.trim() === param) {
                    objWebinarCounts[webinar.id][index]++;
                  } else {
                    // Country Macros
                    if (index === 'countries') {
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


                      if (item.trim() === 'All nationalities') {
                        objWebinarCounts[webinar.id][index]++;
                        break;
                      }

                      if (param === 'All nationalities') {
                        objWebinarCounts[webinar.id][index]++;
                        break;
                      }
                    }

                    if (index === 'faculties' && param === 'All Faculties') {
                      objWebinarCounts[webinar.id][index]++;
                      break;
                    }
                  }
                }
              } //end of json loop

            }
          }); // end of webinar loop
        });
      } else {
        if (index.indexOf('Exclude') > -1) {
          objExcludes.push({
            "cat": index,
            "val": objDataTags[index]
          });
        }
      }
    }

    var objMatches = []; // now get the webinars that match the els data-xx requirements by comparing objects

    for (var index in objWebinarCounts) {
      if (paramsHaveMatch(objHTMLDataCounts, objWebinarCounts[index])) {
        objMatches.push(addWebinar(index));
      }
    } // sort by date


    objMatches.sort(function (a, b) {
      var valA = parseInt(a.datetime);
      var valB = parseInt(b.datetime);
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    }); // negate any excluded items (eg data-series-exclude="foo") by removing its id

    for (var i in objExcludes) {
      if (objExcludes[i].cat) {
        var indexExclude = objExcludes[i].cat.replace("Exclude", "");
        var arrValExcludes = objExcludes[i].val.split(", ");

        for (var index in objMatches) {
          if (objMatches[index][indexExclude] && arrValExcludes.indexOf(objMatches[index][indexExclude]) > -1) objMatches[index].id = '';
        }
      }
    } // form the html for each webinar item


    for (var index in objMatches) {
      if (objMatches[index] && objMatches[index].id) html.push(renderComponent(objMatches[index]));
      ;
    }

    if (objMatches.length > 0) {
      // add the headers then output html to the page
      html.unshift('<div class="cell"><h2>' + webinarSectionData[webinarId].head + '</h2>' + webinarSectionData[webinarId].intro + '</div>');
      html.push('<div class="cell"><hr /></div>');
      myel.innerHTML = html.join("\n");
    } else {
      // remove the node as its empty after removing the loading message
      myel.innerHTML = '';
      if (Element.prototype.remove) myel.closest('section.c-wrapper-webinar').remove();
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

    for (var _i = 0, _keys = keys1; _i < _keys.length; _i++) {
      var key = _keys[_i];
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

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (var _i = 0, _keys = keys1; _i < _keys.length; _i++) {
      var key = _keys[_i];

      if (object1[key] !== object2[key]) {
        return false;
      }
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
    html.push('<h2 class="c-promo-box__header header-stripped">' + item.title + '</h2>');
    if (item.countries !== '') html.push('<p>' + item.countries + '</p>');
    html.push('<p><strong>' + item.faculties + '</strong></p>');
    html.push('<p><strong>' + item.date + '</strong></p>');
    html.push('<p>Start time: ' + item.time + ' (' + stir.BSTorGMT(date) + ')</p>');
    html.push('</div></div>');
    html.push('<div class="c-promo-box__link"><a href="' + item.link + '" aria-label="Register for webinar: ' + item.title + '" class="c-link">Register now</a></div>');
    html.push('</div></div></div>');
    return html.join("\n");
    ;
  }
})();