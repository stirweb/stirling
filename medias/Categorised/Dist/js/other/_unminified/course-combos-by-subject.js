function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/*
 * @title: Course Combinations Listing
 * @author: Ryan Kaye
 * @author: Robert Morrison
 * @date: October 2021
 * @version: 1.1
 * @description: Builds listings of course apply links grouped by subject and including combinations
 */

(function (scope) {
  if (!scope) return;
  var resultsArea = scope;
  var courseTitles = {
    'UDX16-PSY': 'BSc (Hons) Psychology',
    'UDX12-PSY': 'BA (Hons) Psychology'
  };

  /*
   * STATE HELPERS
   */

  /* ------------------------------------------------
   * Returns an array of course objects with their respective combinations appended
   * ------------------------------------------------ */
  var getCoursesCombos = stir.curry(function (_combos, _courses) {
    return stir.map(function (course) {
      return _objectSpread(_objectSpread({}, course), {
        combinations: getCombosForCourse(_combos, course)
      });
    }, _courses);
  });
  var courseMatchesSubject = stir.curry(function (_subject, _course) {
    return _course.subject.indexOf(_subject) !== -1;
  });
  var filterBySubject = stir.curry(function (_courses, _subject) {
    return stir.filter(courseMatchesSubject(_subject), _courses);
  });

  /* ------------------------------------------------
   * Returns an array of combination course data (based 
   * on the URL) for a given parent course.
   * ------------------------------------------------ */

  var getCombosForCourse = function getCombosForCourse(_combos, _course) {
    return _combos.filter(function (combo) {
      return combo.courses && combo.courses.filter(function (course) {
        return course.url === _course.url;
      }).length;
    });
  };

  /*
   * RENDERERS
   */

  /* ------------------------------------------------
   * Returns the html for a course + releated combos
   * ------------------------------------------------ */
  var renderCourse = function renderCourse(course) {
    return "\t<div data-behaviour=accordion>\n\t\t<h3>".concat([course.prefix, course.title].join(' ').trim(), "</h3>\n\t\t<div> <p>Apply now for:</p>\n\t\t\t<ul>\n\t\t\t\t").concat(singleApplyLinksList(course), "\n\t\t\t\t").concat(comboApplyLinksList(course.combinations), "\n\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n");
  };

  /* ------------------------------------------------
   * Returns the html for a group of courses
   * (unless the group is empty)
   * ------------------------------------------------ */
  var renderCourseGroup = function renderCourseGroup(subject, courses) {
    return courses.length ? "<h2 class=\"u-margin-top\">".concat(subject, "</h2> ").concat(courses.map(renderCourse).join("")) : null;
  };
  var makeLink = stir.curry(function (host, path, text) {
    return path ? "<a href=\"".concat(host + path, "\">").concat(text, "</a>") : text;
  });
  var makeLinkPortalApply = makeLink('https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=');
  var singleApplyLinksList = function singleApplyLinksList(course) {
    return course.applyCode && course.applyCode.split(", ").map(function (code, index, codes) {
      return code ? "<li>".concat(makeLinkPortalApply(code.trim(), courseTitles[code.trim()] || [course.prefix, course.title].join(' ').trim()), " <small>").concat(codes.length > 1 ? ' (' + code + ')' : '', "</small></li>") : "<!-- ".concat(course.title, " -->");
    }).join("\n");
  };
  var comboApplyLinksList = function comboApplyLinksList(combos) {
    return combos ? combos.map(function (combo) {
      return "<li>".concat(makeLinkPortalApply(combo.codes.apply, [combo.prefix, combo.title].join(' ').trim()), "</li>");
    }).join("\n") : null;
  };

  /*
   * EVENTS: INPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * On load
   * ------------------------------------------------ */

  // Import the data
  var initialCourses = stir.t4globals.courses || [];
  var initialCombos = stir.t4globals.combos || [];
  if (!initialCourses.length || !initialCombos.length) return;

  // Helper curry functions for faculty array
  var removeDuplicates = stir.reduce(function (unique, item) {
    return unique.includes(item) ? unique : [].concat(_toConsumableArray(unique), [item]);
  }, []);
  var extractCourseSubjects = stir.map(function (el) {
    return el.subject && el.subject.split(/,\s+/g);
  });
  var filterEmpties = stir.filter(function (item) {
    return item;
  });

  /* Flatten nested array. E.g. [1,2,[3,4]] becomes [1,2,3,4] */
  var flatten = function flatten(array) {
    return [].concat.apply([], array);
  };
  var hasCode = function hasCode(course) {
    return course.applyCode ? true : false;
  };

  /* A sorted, unique Array of course subjects */
  var subjects = stir.compose(stir.sort(null), filterEmpties, removeDuplicates, flatten,
  //some courses have multiple subjects
  extractCourseSubjects,
  //so we'll need to flatten the array
  stir.clone)(initialCourses);

  // Courses data - remove any with no apply codes:
  var courses = stir.filter(hasCode, initialCourses);

  // Combos data - clean up:
  var combos = stir.filter(function (item) {
    return item.title;
  }, initialCombos);

  // Curry-in the combos now; we'll use this function later to
  // match the combos to (a filterd list of) courses:
  var expandCoursesWithCombos = getCoursesCombos(combos);

  // Curry-in the courses now, then later we'll selectivly pass subjects we want to filter on:
  var filterCoursesBySubject = filterBySubject(courses);
  resultsArea.innerHTML = stir.map(function (subject) {
    return renderCourseGroup(subject, expandCoursesWithCombos(filterCoursesBySubject(subject)));
  }, subjects).join("");

  /**
   * Select all H2s in the results area, and create a skip-link index at the top
   */
  (function (headings) {
    var nav = document.createElement('nav');
    resultsArea.insertAdjacentElement("afterbegin", nav);
    headings.forEach(function (heading) {
      var link = document.createElement('a');
      nav.appendChild(link);
      link.innerText = heading.innerText;
      link.href = '#' + (heading.id = heading.innerText.replace(/[^a-zA-Z]/g, "-").toLowerCase());
    });
  })(Array.prototype.slice.call(resultsArea.querySelectorAll('h2')));

  // Finally get the accordions working
  Array.prototype.forEach.call(resultsArea.querySelectorAll('[data-behaviour="accordion"]'), function (accordion) {
    new stir.accord(accordion, false);
  });
})(stir.node(".courselisting"));