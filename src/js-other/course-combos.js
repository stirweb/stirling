/*
 * @title: Course Combinations Listing
 * @author: Ryan Kaye
 * @date: October 2021
 * @version: 1.0
 * @description: Builds listings of course apply links grouped by faculty and including combinations
 */

(function (scope) {
  if (!scope) return;

  const resultsArea = scope;
  const applyUrl = "https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=";

  /*
   * STATE HELPERS
   */

  /* ------------------------------------------------
   * Returns array of course objects (mapped from given array) with related combinations included
   * ------------------------------------------------ */
  const getCoursesCombos = stir.curry((_combos, _courses) => {
    return stir.map((course) => {
      const courseCombos = { combinations: getIndividualCourseCombos(_combos, course) };
      return { ...course, ...courseCombos };
    }, _courses);
  });

  /* ------------------------------------------------
   * Returns an array of combination course data (based on url) for a given parent course
   * ------------------------------------------------ */
  const getIndividualCourseCombos = (_combos, parentCourse) => {
    /* Fn: Helper curry: Map the combos courses.url vals to an array */
    const comboUrlFetcher = stir.map((parentCourse) => parentCourse.url);

    /* Fn: Helper curry: Match combos to parent based on url */
    const matchData = stir.filter((combo) => {
      if (comboUrlFetcher(combo.courses).includes(parentCourse.url)) return combo;
    });

    /* Fn: Fugly! Returns a new reformated and cleaned up title String with parent course prepended */
    const cleanTitle = (comboTitle, parentTitle) => {
      const title = comboTitle
        .replace(parentTitle, "")
        .replace(parentTitle + " and ", "")
        .replace(" and " + parentTitle, "");

      const titles = stir.filter((t) => t !== "", title.split(" and ")); // Convert to array and remove empties

      return (parentTitle + " and " + titles.join(" and ")).replace("and  with", "with");
    };

    /* Fn: Helper curry: Return required cleaned up combo data */
    const cleanData = stir.map((combo) => {
      return {
        prefix: combo.prefix,
        title: cleanTitle(combo.title, parentCourse.title),
        applycode: combo.codes.apply,
      };
    });

    const sortData = stir.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));

    // Run the data through the curry helper functions and return the result
    return stir.compose(sortData, cleanData, matchData)(_combos);
  };

  /*
   * RENDERERS
   */

  /* ------------------------------------------------
   * Returns the html for a faculty section
   * ------------------------------------------------ */
  const render = (data) => {
    const renderCourseItemCurry = renderCourseItem(data);

    return `
        <h2 class="u-margin-top">${data.faculty}</h2>
        ${stir.map(renderCourseItemCurry, data.courses).join("")} `;
  };

  /* ------------------------------------------------
   * Returns the html for a course + releated combos
   * ------------------------------------------------ */
  const renderCourseItem = stir.curry((data, course) => {
    return `
        <div data-behaviour=accordion>
            <h3>${course.prefix} ${course.title}</h3>
            <div>
                <ul>
                    <li>
                        <a href="${data.applyUrl}${course.applyCode.split(", ")[0]}">
                          ${course.prefix} ${course.title}
                        </a>
                    </li>
                    ${stir
                      .map(
                        (combo) =>
                          `<li>
                            <a href="${data.applyUrl}${combo.applycode}">${combo.prefix} ${combo.title}</a>
                          </li>`,
                        course.combinations
                      )
                      .join("")} 
                </ul>
              </div>
          </div>`;
  });

  /*
   * EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /* ------------------------------------------------
   * Output the html content to the page
   * ------------------------------------------------ */
  const setDOMContent = stir.curry((elem, html) => {
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
  const initialCourses = stir.t4globals.courses || [];
  const initialCombos = stir.t4globals.combos || [];

  if (!initialCourses.length || !initialCombos.length) return;

  // Helper curry functions for faculty array
  const removeDuplicates = stir.reduce(
    (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
    []
  );
  const mapFaculty = stir.map((el) => el.faculty);
  const filterEmpties = stir.filter((item) => item);

  // Form the faculty array
  const faculties = stir.compose(
    stir.sort(null),
    filterEmpties,
    removeDuplicates,
    mapFaculty,
    stir.clone
  )(initialCourses);

  // Courses data
  const courses = stir.clone(initialCourses);

  // Combos data - clean up
  const combos = stir.compose(
    stir.filter((item) => item.title),
    stir.clone
  )(initialCombos);

  // Pass in the combos data beforehand to clean things up
  const getCombosCurry = getCoursesCombos(combos);

  // Group the data by faculty; send it off to be htmlifed; Output to the page
  const results = setDOMContent(
    resultsArea,
    stir
      .map(
        (faculty) =>
          render({
            applyUrl: applyUrl,
            faculty: faculty,
            courses: getCombosCurry(stir.filter((item) => item.faculty === faculty, courses)),
          }),
        faculties
      )
      .join("")
  );

  // Finally get the accordions working
  Array.prototype.forEach.call(
    resultsArea.querySelectorAll('[data-behaviour="accordion"]'),
    function (accordion) {
      new stir.accord(accordion, false);
    }
  );
})(stir.node(".courselisting"));
