/* ------------------------------------------------
 * @author: Ryan Kaye
 * @version: 2
 * ------------------------------------------------ */

(function (scope) {
  if (!scope) return;

  /*
   * CONSTANTS
   */
  const applyLinks = {
    taught: "https://portal.stir.ac.uk/student/course-application/pg/application.jsp?crsCode=",
    research: "https://portal.stir.ac.uk/student/course-application/pgr/application.jsp?crsCode=",
  };

  /*
   * DOM: Main elements
   */
  const resultsArea = scope;

  /*
   * RENDERERS
   */

  /* ------------------------------------------------
   * Build html for anchor links
   * ------------------------------------------------ */
  const renderAnchors = (_subjects) => {
    if (!_subjects.length) return ``;

    return `
      <ul class="anchorlist">
          ${stir
            .map((item) => `<li><a href="#${item.split(" ").join("_")}">${item}</a></li>`, _subjects)
            .join("")}
      </ul>`;
  };

  /* ------------------------------------------------
   * Build html for all course links
   * ------------------------------------------------ */
  const renderCourses = (_data, _subjects, _applyLinks) => {
    return `${stir.map((element) => `${renderCourseList(_data, element, _applyLinks)}`, _subjects).join("")}`;
  };

  /* ------------------------------------------------
   * Build html for subject list section
   * ------------------------------------------------ */
  const renderCourseList = (_data, _subject, _applyLinks) => {
    const courses = getSubjectCourses(_data, _subject);

    if (!courses.length) return ``;

    return `
      <h2 class="u-padding-top" id="${_subject.split(" ").join("_")}">${_subject}</h2> 
      <ul>
        ${stir
          .map(
            (element) =>
              `<li>
                <a href="${_applyLinks[element.type]}${element.code}">${element.title} (${element.code})</a>
              </li>`,
            courses
          )
          .join("")}
      </ul>`;
  };

  /*
   * HELPERS
   */

  /* ------------------------------------------------
   * Returns course list that match a specific course
   * ------------------------------------------------ */
  const getSubjectCourses = (_data, _subject) => {
    return stir.filter((element) => {
      if (element.subject && element.subject.includes(_subject)) return element;
    }, _data);
  };

  /*
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * Output html content to the page
   * ------------------------------------------------ */
  const setDOMContent = stir.curry((_node, html) => {
    _node.innerHTML = html;
    return _node;
  });

  /*
   * EVENTS: INPUT (!!SIDE EFFECTS!!)
   */

  const initialSubjects = stir.t4Globals.subjects.subjects || [];
  const initialData = stir.t4Globals.applycodes || [];

  if (!initialSubjects.length || !initialData.length) return;

  /*
   * CONTROLLER / STATE
   */

  // Subjects
  const subjects = stir.clone(initialSubjects);
  const mappedSubjects = stir.map((element) => element.value, subjects).sort();

  // Courses
  const data = stir.clone(initialData);

  const results = setDOMContent(
    resultsArea,
    renderAnchors(mappedSubjects).concat(renderCourses(data, mappedSubjects, applyLinks))
  );
})(stir.node("#course-subject--listing"));
