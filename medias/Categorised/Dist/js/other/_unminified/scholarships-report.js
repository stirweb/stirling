(function () {
  var data = stir.jsonscholarships.scholarships || [];
  var elementReport = stir.node("#report");
  var elementOverdue = stir.node("#overdue");
  if (!data.length || !elementReport) return;
  var today = Number(new Date().toISOString().split("T")[0].replaceAll("-", ""));
  var renderOverdue = function renderOverdue(item) {
    return "\n        <div class=\"u-mb-1\">\n          <strong>".concat(item.title, "</strong>. (Deadline: ").concat(item.deadlineFormatted, "). <a class=\"u-border-bottom-solid\" href=\"https://stiracuk-cms01-production.terminalfour.net/terminalfour/page/section#edit/").concat(item.sid, "\">Edit section</a>\n        </div>");
  };
  var renderReport = function renderReport(item) {
    console.log(item);
    return "\n          <div class=\"u-border-solid u-p-2 u-mt-2\">\n              <p><strong>".concat(item.title, "</strong></p>\n\n              <div><strong>Deadline:</strong> ").concat(item.deadlineFormatted ? item.deadlineFormatted : "N/A", " |  \n                  <a href=\"https://stiracuk-cms01-production.terminalfour.net/terminalfour/page/content#edit/").concat(item.sid, "/").concat(item.cid, "\" class=\"u-border-bottom-solid\" target=\"_blank\">Edit this scholarship</a> | \n                  <a href=\"").concat(item.url, "\" class=\"u-border-bottom-solid\">Preview page</a></div>\n              \n              <div class=\"u-mt-1\"><strong>Last edited:</strong> ").concat(item.lastEditedFormatted, " by ").concat(item.lastEditedBy, "</div>\n              <div class=\"u-mb-1\"><strong>Owner:</strong> ").concat(item.owner, "</div>\n              \n              <div><strong>Metadata:</strong></div> \n              <div>").concat(item.metadata, "</div>\n              <div><strong>Teaser:</strong></div> \n              <div>").concat(item.teaser, "</div>\n\n              <div class=\"u-mt-1\"><strong>Study Level (tag):</strong> ").concat(item.studyLevel, "</div>\n              <div><strong>Fee Status (tag):</strong> ").concat(item.feeStatus, "</div>\n              <div><strong>Nationalities (tag):</strong> ").concat(item.nationality, "</div>\n              <div><strong>Promoted Subjects (Tag):</strong> ").concat(item.promotedSubject, "</div>\n              <div><strong>Value:</strong> ").concat(item.value, "</div>\n              <div><strong>Awards:</strong> ").concat(item.awards, "</div>\n          </div>");
  };
  var getOverdue = function getOverdue(item) {
    if (item.deadline && Number(item.deadline) < today) return item;
  };
  elementReport.innerHTML = data.filter(function (item) {
    return item.title;
  }).map(renderReport).join("");
  elementOverdue.innerHTML = data.filter(function (item) {
    return item.title;
  }).filter(getOverdue).sort(function (a, b) {
    return a.deadline - b.deadline;
  }).map(renderOverdue).join("");
})();