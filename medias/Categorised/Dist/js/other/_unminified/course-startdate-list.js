/*
 * Output Full time UG courses with January start dates as a table
 * JanFull: Some filtering is already done in T4 before it hits the feed eg passed dates are not included, leaving just upcoming years.
 * This means not much processing needs to be done here
 *
 * @author: Ryan Kaye
 * @date: 2026-05-21
 * @version: 3
 * @notes: This version does NOT use FunnelBack or XML - it now uses a JSON feed embedded in html
 */

(function (domElement) {
  // Guard clauses to ensure the DOM element and data exist before proceeding
  if (!domElement) return;

  if (!stir.feeds || !stir.feeds.data) return;

  /*
   * Render the html for each course as a table row
   * @param {Object} item - The course item to render
   * @returns {string} - The HTML string for the table row
   */
  const renderItem = (item) => {
    const portalUrl = `https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=`;

    // if item.portalapply has multiple course codes separated by commas, we need to create a link for each one
    const courseCodes = item.portalapply ? item.portalapply.split(", ").map((code) => code.trim()) : [];
    const courseLinks = courseCodes.map((code, index) => `<a href="${portalUrl}${code}">${item.prefix.split(" / ")[index]} ${item.title}</a>`).join(", ");

    return `<tr>
                <td>
                ${item.portalapply ? courseLinks : ``}
                </td>
                <td>${item.janfull.split(",").join(", ")}</td>
            </tr>`;
  };

  /*
   *  Render the course table html
   *  @param {Array} data - The array of course items to render
   *  @returns {string} - The HTML string for the course table
   */
  const renderTable = (data) => {
    return `
             <table>
                 <caption>Full time courses starting in January</caption>
                 <thead>
                     <tr><th>Course</th><th>Year of entry</th></tr>
                 </thead>
                 <tbody>
                     ${data.map((el) => renderItem(el)).join("")}
                 </tbody>
             </table>`;
  };

  /*
   * On load
   * 1) Process the data - filter out objects without janfull entries and order by title
   * 2) Render the data to an HTML table
   * 3) Output the rendered HTML to the DOM element
   */

  const filteredData = stir.feeds.data.filter((item) => item.janfull && Object.keys(item.janfull).length > 0).sort((a, b) => a.title.localeCompare(b.title));
  const renderedData = renderTable(filteredData);

  domElement && (domElement.innerHTML = renderedData);
})(stir.node("#course-list"));
