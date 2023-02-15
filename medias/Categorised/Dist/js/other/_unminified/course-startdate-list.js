/*
 * @description: Output courses based on start month eg "January"
 * @author: Ryan Kaye
 * @version: 2
 * @notes: This version does NOT use FunnelBack or XML - it now uses a JSON feed embedded in html
 */

(function (scope) {
  if (!scope) return;

  /*
   * DOM: Main elements
   */
  var resultsArea = scope;

  /*
   * GLOBAL CONSTANTS
   */

  var constants = {
    applyLink: "https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=",
    month: resultsArea.getAttribute("data-startmonth")
  };
  Object.freeze(constants);

  /*
   *
   * RENDERERS
   *
   */

  /* ------------------------------------------------
   * Render the course table html
   * ------------------------------------------------ */
  var renderTable = stir.curry(function (consts, data) {
    var renderer = renderItem(consts);
    return "\n        <table>\n            <caption>Courses starting in ".concat(consts.month, "</caption>\n            <thead>\n                <tr><td>Course</td><td>Application link</td><td>Year of entry</td></tr>\n            </thead>\n            <tbody>\n                ").concat(data.map(function (el) {
      return renderer(el);
    }).join(""), "\n            </tbody>\n        </table>");
  });

  /* ------------------------------------------------
   * Render the html for each course as a table row
   * ------------------------------------------------ */
  var renderItem = stir.curry(function (consts, item) {
    var renderApply = renderApplyLink(consts);
    return "\n        <tr>\n            <td>\n              ".concat(item.url ? "<a href=\"".concat(item.url, "\">") : "", "\n              ").concat(item.award, "  ").concat(item.title, "\n              ").concat(item.url ? "</a>" : "", "\n            </td>\n            <td>").concat(renderApply(item), "</td>\n            <td>").concat(getYears(item, consts.month), "</td>\n        </tr>");
  });

  /* ------------------------------------------------
   * Return the Apply Link HTML
   * ------------------------------------------------ */
  var renderApplyLink = stir.curry(function (consts, item) {
    // Helper function to form award text
    var getAward = function getAward(code) {
      if (code.includes("UDX12")) return " Apply for BA (Hons)";
      if (code.includes("UDX16")) return " Apply for BSc (Hons)";
      return "Apply";
    };
    if (item.portalapply && item.portalapply !== "") {
      return item.portalapply.split(",").map(function (element) {
        return '<a aria-label="' + getAward(element) + " " + item.title + '" href="' + consts.applyLink + element.trim() + '">' + getAward(element) + "</a>";
      }).join(" / ");
    }
    return "";
  });

  /* ------------------------------------------------
   * Return the years for this item as an html string
   * ------------------------------------------------ */
  var getYears = function getYears(item, month) {
    if (item.startdates) {
      return stir.compose(stir.join(", "), stir.map(function (element) {
        return element.split(" ")[1];
      }), stir.filter(function (element) {
        return element.includes(month);
      }))(item.startdates.split(", "));
    }
    return "";
  };

  /*
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * Outputs html content to the page
   * ------------------------------------------------ */
  var setDOMContent = stir.curry(function (elem, html) {
    // !!SIDE EFFECTS!!
    elem.innerHTML = html;
    return elem;
  });

  /*
   * EVENTS: INPUT (!!SIDE EFFECTS!!)
   */

  var initialData = stir.t4Globals.ugstartdates || [];
  if (!initialData.length) return;

  // Helper and curried functions
  var filterMonth = stir.filter(function (item) {
    return item.startdates && item.startdates.includes(constants.month);
  });
  var filterApplyless = stir.filter(function (item) {
    return item.portalapply;
  });
  var sortByTitle = stir.sort(function (a, b) {
    return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
  });
  var setResult = setDOMContent(resultsArea);
  var render = renderTable(constants);

  // Run the data through the functions until it hits the page
  var results = stir.compose(setResult, render, sortByTitle, filterApplyless, filterMonth, stir.clone)(initialData);
})(stir.node("#course-list"));