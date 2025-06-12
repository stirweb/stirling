(function (scope) {
  if (!scope) return;

  const resultsArea = scope;

  const courseTitles = {
    "UDX16-PSY": "BSc (Hons) Psychology",
    "UDX12-PSY": "BA (Hons) Psychology",
    "UDX16-NURADN": "BSc (Hons) Nursing - Adult",
    "UDX20-NURADN": "BSc Nursing - Adult",
    "UDX16-NURMHN": "BSc (Hons) Nursing - Mental Health",
    "UDX20-NURMHN": "BSc  Nursing - Mental Health",
  };

  /* RENDERERS */

  const renderJumpLinkNav = (links) => {
    return `<nav class="u-columns-2 u-bg-grey u-bleed bg-grey u-padding-y">${links}</nav>`;
  };

  const renderJumpLink = (item) => {
    return `<a href="#${renderJumpURI(item)}" class="u-block u-py-tiny">${item}</a>`;
  };

  // Helper function to get title append if it exists
  const getTitleAppend = (applyCode) => {
    const match = titleAppends.find((item) => item.applyCode === applyCode);
    return match ? ` ${match.append}` : "";
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

  const renderCourseGroup = (subject, courses) => {
    return !courses.length ? `` : `<h2 id="${renderJumpURI(subject)}" class="u-margin-top">${subject}</h2>${courses.map(renderCourse).join("")}`;
  };

  const makeLink = stir.curry((host, path, text) => (path ? `<a href="${host + path}" class="u-border-bottom-hover">${text}</a>` : text));

  const makeLinkPortalApply = makeLink("https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=");

  const singleApplyLinksList = (course) => {
    return (
      course.applyCode &&
      course.applyCode
        .split(", ")
        .map((code, index, codes) => {
          const titleAppend = getTitleAppend(code.trim());
          const baseTitle = courseTitles[code.trim()] || [course.prefix, course.title].join(" ").trim();
          const fullTitle = baseTitle + titleAppend;

          return code ? `<li>${makeLinkPortalApply(code.trim(), fullTitle)} <small>${codes.length > 1 ? " (" + code + ")" : ""}</small></li>` : `<!-- ${course.title} -->`;
        })
        .join("\n")
    );
  };

  const comboApplyLinksList = (combos) => (combos ? combos.map((combo) => `<li>${makeLinkPortalApply(combo.codes.apply, [combo.prefix, combo.title].join(" ").trim())}</li>`).join("\n") : null);

  const renderJumpURI = (text) => text.replace(/[^a-zA-Z]/g, "-").toLowerCase();

  /* HELPERS */

  const getCoursesCombos = stir.curry((_combos, _courses) =>
    stir.map((course) => {
      return { ...course, ...{ combinations: getCombosForCourse(_combos, course) } };
    }, _courses)
  );

  const courseMatchesSubject = stir.curry((_subject, _course) => _course.subject.indexOf(_subject) !== -1);

  const filterBySubject = stir.curry((_courses, _subject) => stir.filter(courseMatchesSubject(_subject), _courses));

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

  const titleAppends = stir.t4globals.titleAppends || [];

  const subjects = stir.compose(stir.sort(null), filterEmpties, removeDuplicates, flatten, extractCourseSubjects, stir.clone)(initialCourses);

  const courses = stir.filter(hasCode, initialCourses);

  const combos = stir.filter((item) => item.title, initialCombos);

  const expandCoursesWithCombos = getCoursesCombos(combos);

  const filterCoursesBySubject = filterBySubject(courses);

  const html = stir.map((subject) => renderCourseGroup(subject, expandCoursesWithCombos(filterCoursesBySubject(subject))), subjects).join(``);
  const jumpLinksHtml = renderJumpLinkNav(stir.map(renderJumpLink, subjects).join(``));

  setDOMContent(resultsArea, jumpLinksHtml + html);

  Array.prototype.forEach.call(resultsArea.querySelectorAll('[data-behaviour="accordion"]'), function (accordion) {
    new stir.accord(accordion, false);
  });
})(stir.node(".courselisting"));
