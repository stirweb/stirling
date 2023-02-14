/*
 * @author Ryan Kaye
 *
 */
(function () {
  var resultsArea = document.getElementById('course-subject--listing');
  var applyLink = 'https://portal.stir.ac.uk/student/course-application/pg/application.jsp?crsCode=';
  var applyLinkResearch = 'https://portal.stir.ac.uk/student/course-application/pgr/application.jsp?crsCode=';
  var divider = ' | ';
  /*
   * Function: Config the data and then output it
   */

  var parseData = function parseData(data) {
    var rst = data; // create the subject object

    var objSubCors = {};

    for (var key in rst) {
      val = rst[key];

      if (val.subject) {
        var subs = val.subject;
        var arrSubs = subs.split(", ");

        for (var i = 0; i < arrSubs.length; i++) {
          objSubCors[arrSubs[i]] = [];
        }
      }
    } // assign courses to the correct subject entry


    for (var key in rst) {
      val = rst[key];

      if (val.title) {
        var subs = val.subject;
        var arrSubs = subs.split(", "); // loop through the subjects

        for (var i = 0; i < arrSubs.length; i++) {
          // qualification eg MSc - not needed now. added as an empty string placeholder so as not to mess up the rest of the script
          var qual = divider + ''; // Apply Code eg THX C3PO

          var code = '';
          if (val.code) code = divider + val.code; // Apply Link based on type

          var link = divider + applyLink;
          if (val.type === 'research') link = divider + applyLinkResearch; // Add it to the array unless it doesnt have an Apply Code (should never happen)

          if (code !== '') objSubCors[arrSubs[i]].push(val.title + qual + code + link);
        }
      }
    }

    outputData(objSubCors);
  };
  /*
   * Function: Stick the stuff on the page why not
   */


  function outputData(objSubCors) {
    // order object by keys (subject) A-Z
    var ordered = {};
    Object.keys(objSubCors).sort().forEach(function (key) {
      ordered[key] = objSubCors[key];
    });
    objSubCors = ordered; // holds the html code

    var html = []; // form the anchors list html

    html.push('<ul class="anchorlist">');

    for (var index in objSubCors) {
      if (objSubCors[index].length > 0) html.push('<li><a href="#' + index.split(' ').join('_') + '">' + index + '</a></li>');
    }

    html.push('</ul>'); // form the course lists html

    for (var index in objSubCors) {
      if (objSubCors[index].length > 0) {
        // First the list header (ie subject)
        html.push('<h2 class="u-padding-top" id="' + index.split(' ').join('_') + '">' + index + '</h2 ><ul>'); // now the listing for this subject

        objSubCors[index].sort(); // order the courses in this list

        for (var i = 0; i < objSubCors[index].length; i++) {
          var arrBits = objSubCors[index][i].split(divider); // 0 = title; 1 = Qualification (no longer in use); 2 = Apply Code; 3 = URL

          if (!arrBits[1]) arrBits[1] = '';
          if (arrBits[2]) html.push('<li><a href="' + arrBits[3].trim() + arrBits[2].trim() + '">' + arrBits[1] + ' ' + arrBits[0] + ' (' + arrBits[2].trim() + ')</a></li>');
        }

        html.push('</ul>');
      }
    } // output the html to the page


    resultsArea.innerHTML = html.join("\n");
  }

  ;
  /*
   * On Load
   */

  if (resultsArea && stir.t4Globals.applycodes) parseData(stir.t4Globals.applycodes); // off we go
})();