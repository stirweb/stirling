function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * @title: Course Combinations Listing
 * @author: Ryan Kaye
 * @date: October 2021
 * @version: 1.0
 * @description: Builds listings of course apply links grouped by faculty and including combinations
 */
(function (scope) {
  if (!scope) return;
  var resultsArea = scope;
  var applyUrl = "https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=";
  /*
   * STATE HELPERS
   */

  /* ------------------------------------------------
   * Returns array of course objects (mapped from given array) with related combinations included
   * ------------------------------------------------ */

  var getCoursesCombos = stir.curry(function (_combos, _courses) {
    return stir.map(function (course) {
      var courseCombos = {
        combinations: getIndividualCourseCombos(_combos, course)
      };
      return _objectSpread(_objectSpread({}, course), courseCombos);
    }, _courses);
  });
  /* ------------------------------------------------
   * Returns an array of combination course data (based on url) for a given parent course
   * ------------------------------------------------ */

  var getIndividualCourseCombos = function getIndividualCourseCombos(_combos, parentCourse) {
    /* Fn: Helper curry: Map the combos courses.url vals to an array */
    var comboUrlFetcher = stir.map(function (parentCourse) {
      return parentCourse.url;
    });
    /* Fn: Helper curry: Match combos to parent based on url */

    var matchData = stir.filter(function (combo) {
      if (comboUrlFetcher(combo.courses).includes(parentCourse.url)) return combo;
    });
    /* Fn: Fugly! Returns a new reformated and cleaned up title String with parent course prepended */

    var cleanTitle = function cleanTitle(comboTitle, parentTitle) {
      var title = comboTitle.replace(parentTitle, "").replace(parentTitle + " and ", "").replace(" and " + parentTitle, "");
      var titles = stir.filter(function (t) {
        return t !== "";
      }, title.split(" and ")); // Convert to array and remove empties

      return (parentTitle + " and " + titles.join(" and ")).replace("and  with", "with");
    };
    /* Fn: Helper curry: Return required cleaned up combo data */


    var cleanData = stir.map(function (combo) {
      return {
        prefix: combo.prefix,
        title: cleanTitle(combo.title, parentCourse.title),
        applycode: combo.codes.apply
      };
    });
    var sortData = stir.sort(function (a, b) {
      return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
    }); // Run the data through the curry helper functions and return the result

    return stir.compose(sortData, cleanData, matchData)(_combos);
  };
  /*
   * RENDERERS
   */

  /* ------------------------------------------------
   * Returns the html for a faculty section
   * ------------------------------------------------ */


  var render = function render(data) {
    var renderCourseItemCurry = renderCourseItem(data);
    return "\n        <h2 class=\"u-margin-top\">".concat(data.faculty, "</h2>\n        ").concat(stir.map(renderCourseItemCurry, data.courses).join(""), " ");
  };
  /* ------------------------------------------------
   * Returns the html for a course + releated combos
   * ------------------------------------------------ */


  var renderCourseItem = stir.curry(function (data, course) {
    return "\n        <div data-behaviour=accordion>\n            <h3>".concat(course.prefix, " ").concat(course.title, "</h3>\n            <div>\n                <ul>\n                    <li>\n                        <a href=\"").concat(data.applyUrl).concat(course.applyCode.split(", ")[0], "\">\n                          ").concat(course.prefix, " ").concat(course.title, "\n                        </a>\n                    </li>\n                    ").concat(stir.map(function (combo) {
      return "<li>\n                            <a href=\"".concat(data.applyUrl).concat(combo.applycode, "\">").concat(combo.prefix, " ").concat(combo.title, "</a>\n                          </li>");
    }, course.combinations).join(""), " \n                </ul>\n              </div>\n          </div>");
  });
  /*
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * Output the html content to the page
   * ------------------------------------------------ */

  var setDOMContent = stir.curry(function (elem, html) {
    elem.innerHTML = html;
    return elem;
  });
  /*
   * EVENTS: INPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * On load
   * ------------------------------------------------ */
  // Import the data

  var initialCourses = stir.t4globals.courses || [];
  var initialCombos = stir.t4globals.combos || [];
  if (!initialCourses.length || !initialCombos.length) return; // Helper curry functions for faculty array

  var removeDuplicates = stir.reduce(function (unique, item) {
    return unique.includes(item) ? unique : [].concat(_toConsumableArray(unique), [item]);
  }, []);
  var mapFaculty = stir.map(function (el) {
    return el.faculty;
  });
  var filterEmpties = stir.filter(function (item) {
    return item;
  }); // Form the faculty array

  var faculties = stir.compose(stir.sort(null), filterEmpties, removeDuplicates, mapFaculty, stir.clone)(initialCourses); // Courses data

  var courses = stir.clone(initialCourses); // Combos data - clean up

  var combos = stir.compose(stir.filter(function (item) {
    return item.title;
  }), stir.clone)(initialCombos); // Pass in the combos data beforehand to clean things up

  var getCombosCurry = getCoursesCombos(combos); // Group the data by faculty; send it off to be htmlifed; Output to the page

  var results = setDOMContent(resultsArea, stir.map(function (faculty) {
    return render({
      applyUrl: applyUrl,
      faculty: faculty,
      courses: getCombosCurry(stir.filter(function (item) {
        return item.faculty === faculty;
      }, courses))
    });
  }, faculties).join("")); // Finally get the accordions working

  Array.prototype.forEach.call(resultsArea.querySelectorAll('[data-behaviour="accordion"]'), function (accordion) {
    new stir.accord(accordion, false);
  });
})(stir.node(".courselisting"));