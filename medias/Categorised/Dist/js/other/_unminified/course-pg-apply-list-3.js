/* ------------------------------------------------
 * @author: Ryan Kaye
 * @version: 2
 * ------------------------------------------------ */

(function (scope) {
  if (!scope) return;

  /*
   * CONSTANTS
   */
  var applyLinks = {
    taught: "https://portal.stir.ac.uk/student/course-application/pg/application.jsp?crsCode=",
    research: "https://portal.stir.ac.uk/student/course-application/pgr/application.jsp?crsCode="
  };

  /*
   * DOM: Main elements
   */
  var resultsArea = scope;

  /*
   * RENDERERS
   */

  /* ------------------------------------------------
   * Build html for anchor links
   * ------------------------------------------------ */
  var renderAnchors = function renderAnchors(_subjects) {
    if (!_subjects.length) return "";
    return "\n      <ul class=\"anchorlist\">\n          ".concat(stir.map(function (item) {
      return "<li><a href=\"#".concat(item.split(" ").join("_"), "\">").concat(item, "</a></li>");
    }, _subjects).join(""), "\n      </ul>");
  };

  /* ------------------------------------------------
   * Build html for all course links
   * ------------------------------------------------ */
  var renderCourses = function renderCourses(_data, _subjects, _applyLinks) {
    return "".concat(stir.map(function (element) {
      return "".concat(renderCourseList(_data, element, _applyLinks));
    }, _subjects).join(""));
  };

  /* ------------------------------------------------
   * Build html for subject list section
   * ------------------------------------------------ */
  var renderCourseList = function renderCourseList(_data, _subject, _applyLinks) {
    var courses = getSubjectCourses(_data, _subject);
    if (!courses.length) return "";
    return "\n      <h2 class=\"u-padding-top\" id=\"".concat(_subject.split(" ").join("_"), "\">").concat(_subject, "</h2> \n      <ul>\n        ").concat(stir.map(function (element) {
      return "<li>\n                <a href=\"".concat(_applyLinks[element.type]).concat(element.code, "\">").concat(element.title, " (").concat(element.code, ")</a>\n              </li>");
    }, courses).join(""), "\n      </ul>");
  };

  /*
   * HELPERS
   */

  /* ------------------------------------------------
   * Returns course list that match a specific course
   * ------------------------------------------------ */
  var getSubjectCourses = function getSubjectCourses(_data, _subject) {
    return stir.filter(function (element) {
      if (element.subject && element.subject.includes(_subject)) return element;
    }, _data);
  };

  /*
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * Output html content to the page
   * ------------------------------------------------ */
  var setDOMContent = stir.curry(function (_node, html) {
    _node.innerHTML = html;
    return _node;
  });

  /*
   * EVENTS: INPUT (!!SIDE EFFECTS!!)
   */

  var initialSubjects = stir.t4Globals.subjects.subjects || [];
  var initialData = stir.t4Globals.applycodes || [];
  if (!initialSubjects.length || !initialData.length) return;

  /*
   * CONTROLLER / STATE
   */

  // Subjects
  var subjects = stir.clone(initialSubjects);
  var mappedSubjects = stir.map(function (element) {
    return element.value;
  }, subjects).sort();

  // Courses
  var data = stir.clone(initialData);
  var results = setDOMContent(resultsArea, renderAnchors(mappedSubjects).concat(renderCourses(data, mappedSubjects, applyLinks)));
})(stir.node("#course-subject--listing"));