/*
    @title: Course Combinations Listing
    @author: Ryan Kaye
    @author: Robert Morrison
    @date: October 2021
    @version: 1.1
    @description: Builds listings of course apply links grouped by subject and including combinations

 */

(function (scope) {
  if (!scope) return;

  const resultsArea = scope;

  const courseTitles = {
    "UDX16-PSY": "BSc (Hons) Psychology",
    "UDX12-PSY": "BA (Hons) Psychology",
  };

  /*
    
         RENDERERS
    
       */

  const renderJumpLinkNav = (links) => {
    return `<nav class="u-columns-2 u-bg-grey u-bleed bg-grey u-padding-y">${links}</nav>`;
  };

  const renderJumpLink = (item) => {
    return `<a href="#${renderJumpURI(item)}" class="u-block u-py-tiny">${item}</a>`;
  };

  const renderCourse = (course) => {
    return `<div data-behaviour=accordion>
                  <h3>${[course.prefix, course.title].join(" ").trim()}</h3>
                  <div><p>Apply now for:</p>
                    <ul>
                      ${singleApplyLinksList(course)}
                      ${comboApplyLinksList(course.combinations)}
                    </ul>
                  </div>
                </div>`;
  };

  /*  Returns the html for a group of courses (unless the group is empty) */
  const renderCourseGroup = (subject, courses) => {
    return !courses.length ? `` : `<h2 id="${renderJumpURI(subject)}" class="u-margin-top">${subject}</h2>${courses.map(renderCourse).join("")}`;
  };

  const makeLink = stir.curry((host, path, text) => (path ? `<a href="${host + path}">${text}</a>` : text));

  const makeLinkPortalApply = makeLink("https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=");

  const singleApplyLinksList = (course) => {
    return (
      course.applyCode &&
      course.applyCode
        .split(", ")
        .map((code, index, codes) => (code ? `<li>${makeLinkPortalApply(code.trim(), courseTitles[code.trim()] || [course.prefix, course.title].join(" ").trim())} <small>${codes.length > 1 ? " (" + code + ")" : ""}</small></li>` : `<!-- ${course.title} -->`))
        .join("\n")
    );
  };

  const comboApplyLinksList = (combos) => (combos ? combos.map((combo) => `<li>${makeLinkPortalApply(combo.codes.apply, [combo.prefix, combo.title].join(" ").trim())}</li>`).join("\n") : null);

  const renderJumpURI = (text) => text.replace(/[^a-zA-Z]/g, "-").toLowerCase();

  /*
    
        HELPERS
    
       */

  /* Returns an array of course objects with their respective combinations appended */
  const getCoursesCombos = stir.curry((_combos, _courses) =>
    stir.map((course) => {
      return { ...course, ...{ combinations: getCombosForCourse(_combos, course) } };
    }, _courses)
  );

  const courseMatchesSubject = stir.curry((_subject, _course) => _course.subject.indexOf(_subject) !== -1);

  const filterBySubject = stir.curry((_courses, _subject) => stir.filter(courseMatchesSubject(_subject), _courses));

  /* Returns an array of combination course data (based on the URL) for a given parent course. */
  const getCombosForCourse = (_combos, _course) => _combos.filter((combo) => combo.courses && combo.courses.filter((course) => course.url === _course.url).length);

  const removeDuplicates = stir.reduce((unique, item) => (unique.includes(item) ? unique : [...unique, item]), []);

  const extractCourseSubjects = stir.map((el) => el.subject && el.subject.split(/,\s+/g));

  const filterEmpties = stir.filter((item) => item);

  const flatten = (array) => [].concat.apply([], array);

  const hasCode = (course) => (course.applyCode ? true : false);

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /* 
    
        ON LOAD
    
       */

  const initialCourses = stir.t4globals.courses || [];
  const initialCombos = stir.t4globals.combos || [];

  /* A sorted, unique Array of course subjects */
  const subjects = stir.compose(
    stir.sort(null),
    filterEmpties,
    removeDuplicates,
    flatten, //some courses have multiple subjects
    extractCourseSubjects,
    stir.clone
  )(initialCourses);

  /* Courses data - remove any with no apply codes: */
  const courses = stir.filter(hasCode, initialCourses);

  /* Combos data - clean up: */
  const combos = stir.filter((item) => item.title, initialCombos);

  /* Curry-in the combos now; we'll use this function later to match the combos to (a filterd list of) courses:*/
  const expandCoursesWithCombos = getCoursesCombos(combos);

  /* Curry-in the courses now, then later we'll selectivly pass subjects we want to filter on:*/
  const filterCoursesBySubject = filterBySubject(courses);

  const html = stir.map((subject) => renderCourseGroup(subject, expandCoursesWithCombos(filterCoursesBySubject(subject))), subjects).join(``);
  const jumpLinksHtml = renderJumpLinkNav(stir.map(renderJumpLink, subjects).join(``));

  setDOMContent(resultsArea, jumpLinksHtml + html);

  /* 
          Finally get the accordions working
       */
  Array.prototype.forEach.call(resultsArea.querySelectorAll('[data-behaviour="accordion"]'), function (accordion) {
    new stir.accord(accordion, false);
  });
})(stir.node(".courselisting"));
