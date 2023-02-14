/*
 * Render related course links from ajax'd in course / subject lists
 * @author: Ryan Kaye
 * @version: 2
 * @date: Oct 2021
 */

(function (scope) {
  if (!scope) return;

  /*
   * Object containing all the DOM nodes and constants the app needs
   */

  const constants = {
    /* DOM elements */
    resultsArea: scope,
    resultsWrapper: stir.node(".c-course-related__wrapper"),
    linkRef: ".c-course-related__buttons ul li",
    /* HTML embedded data */
    subjects: stir.node("[data-subjects]") ? stir.node("[data-subjects]").dataset.subjects.trim() : "",
    level: stir.node("[data-modules-course-type]")
      ? stir.node("[data-modules-course-type]").dataset.modulesCourseType.trim()
      : "",
    /* Environment variables */
    pageUrl: window.location.href.split("?")[0].split("#")[0].replace("https://www.stir.ac.uk", ""),
    dev: { dataUrl: "../data/courses-all.json" },
    preview: { dataUrl: "/terminalfour/preview/1/en/20892" },
    prod: { dataUrl: "/data/courses/all-courses/index.json" },
    "appdev-preview": { dataUrl: "/terminalfour/preview/1/en/20892" },
  };

  Object.freeze(constants);

  /*
   * Guard clause: no subject(s) so bail
   */

  if (!constants.subjects) return constants.resultsWrapper.remove();

  /*
   * STATE
   */

  /* -----------------------------------------------
   * Controls data flow from raw input to html output
   * ---------------------------------------------- */
  const main = (consts, data) => {
    // Helper Curry functions - set the context
    const sorterer = stir.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
    const filterCurry = filterCourses(consts);
    const filterer = stir.filter(filterCurry);
    const cleanerer = stir.filter((item) => item.title);
    const renderer = stir.map(renderItem);
    const setDOMResult = setDOMContent(consts.resultsArea);

    // Pass the data through the Curry functions
    const results = stir.compose(renderer, filterer, sorterer, cleanerer, stir.clone)(data.courses);

    if (!results.length) return consts.resultsWrapper.remove();

    setDOMResult(wrapResults(results));

    // Make the related courses <li />s fully clickable
    stir.each((el) => addCourseItemListener(el), stir.nodes(consts.linkRef));

    return;
  };

  /* -----------------------------------------------
   * Returns a new array containing only courses matched with subjects / level etc
   * ---------------------------------------------- */
  const filterCourses = stir.curry((conts, item) => {
    /* Helper functions */
    const matchLevel = (level) => level.trim() === getLevel(conts.level);
    const filterCurrent = (url) => url !== conts.pageUrl;

    const matches = stir.map((sub) => item.subject.includes(sub.trim()), conts.subjects.split(","));

    if (stir.any((el) => el, matches) && matchLevel(item.level) && filterCurrent(item.url)) return item;
  });

  /* -----------------------------------------------
   * Return a new level value in the required format
   * ---------------------------------------------- */
  const getLevel = (level) => level.replace("UG", "Undergraduate").replace("PG", "Postgraduate");

  /* -----------------------------------------------
   * Returns stringified html (from given array) wrapped with required <ul />
   * ---------------------------------------------- */
  const wrapResults = (results) => `<ul> ${results.join("")} </ul>`;

  /* -----------------------------------------------
   * Builds the html for the (UCAS) code value if required (only UG ATM)
   * ---------------------------------------------- */
  const renderCode = (code) => (code.trim() === "" ? `` : `<strong>UCAS Code: ${code}</strong>`);

  /* -----------------------------------------------
   * Builds html for a course item
   * ---------------------------------------------- */
  const renderItem = stir.curry((item) => {
    return `<li><a href="${item.url}">${item.prefix} ${item.title}</a>${renderCode(item.code)}</li> `;
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

  /* -----------------------------------------------
   * EVENT: Listen for and handle click events
   * ---------------------------------------------- */
  const addCourseItemListener = (el) => {
    if (el.children[0] && el.children[0].hasAttribute("href")) {
      el.onclick = () => (window.location = el.children[0].attributes.href.value);
    }
  };

  /*
   * EVENT: On Load
   */

  stir.getJSON(constants[UoS_env.name].dataUrl, (initialData) => main(constants, initialData));

  /* End */
})(stir.node("[data-course-related]"));
