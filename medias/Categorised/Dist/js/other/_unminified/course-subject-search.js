/*
 * @author Ryan Kaye
 *
 */
(function () {
  var postsPerPage = 300;
  var jsonUrl = "https://www.stir.ac.uk/s/search.json?";
  var collection = "stir-courses";
  var resultsArea = document.getElementById("course-subject-listing");
  var resultsAreaUG = document.getElementById("panel-subject-listing-ug");
  var resultsAreaPG = document.getElementById("panel-subject-listing-pg");
  var query = "!padrenullquery";
  var subject = ""; //var year = '2020';
  // object to hold the search config data with default values

  var searchFacets = {
    query: query,
    start_rank: 1,
    num_ranks: postsPerPage,
    sort: "title",
    meta_S_and: subject,
    collection: collection
  };
  /*
   * Function: Configure the search depending on params and then query FunnelBack
   */

  var doSearch = function doSearch() {
    var jsonUrl1 = jsonUrl;

    for (var key in searchFacets) {
      if (searchFacets.hasOwnProperty(key)) {
        jsonUrl1 += key + "=" + searchFacets[key] + "&";
      }
    }

    stir.getJSON(jsonUrl1, parseData);
  };
  /*
   * Function: Config the data returned and then output it
   */


  var parseData = function parseData(data) {
    if (!data.error) {
      var rst = data.response.resultPacket.results;
      var htmlUG = [];
      var htmlPG = []; //var html = [];

      var tabHeads = '<tr><th>Course</th><th style="width: 30%">Start date</th></tr>'; // loop throught the data

      for (var key in rst) {
        if (rst[key].metaData) {
          var level = rst[key].metaData.L;
          var prefix = rst[key].metaData.B || "";
          var mode = rst[key].metaData.M || "";
          var starts = rst[key].metaData.sdt || "";
          var title = rst[key].metaData.t || "";
          var url = rst[key].displayUrl || "";
          var row = '<tr><td><a href="' + url + '" data-mode="' + mode + '">' + prefix + " " + title + "</a></td><td>" + starts + "</td></tr>";

          if (level.indexOf("Undergraduate") > -1) {
            htmlUG.push(row);
          }

          if (level.indexOf("Postgraduate") > -1) {
            htmlPG.push(row);
          }
        }
      }

      if (htmlUG.length > 0) {
        htmlUG.unshift("<table><caption>Undergraduate courses</caption>", tabHeads);
        htmlUG.push("</table>"); // output the content

        if (resultsAreaUG) resultsAreaUG.innerHTML = htmlUG.join("\n");
      } else {
        // remove the wrapper - its not needed
        resultsAreaUG.parentElement.remove();
      }

      if (htmlPG.length > 0) {
        htmlPG.unshift("<table><caption>Postgraduate courses</caption>", tabHeads);
        htmlPG.push("</table>"); // output the content

        if (resultsAreaPG) resultsAreaPG.innerHTML = htmlPG.join("\n");
      } else {
        // remove the wrapper - its not needed
        resultsAreaPG.parentElement.remove();
      }
    } else {
      resultsArea.appendChild(stir.getMaintenanceMsg());
      console.log(data.error);
    }
  };
  /*
      On Load
     */


  if (resultsArea) {
    searchFacets.meta_S_and = resultsArea.dataset.subject || "adssaddad"; //year = resultsArea.dataset.year;

    doSearch(); // off we go
  }
})();