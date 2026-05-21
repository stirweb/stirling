/*
 * @description: Output Full time UG courses with January start dates as a table
 * @author: Ryan Kaye
 * @version: 2
 * @notes: This version does NOT use FunnelBack or XML - it now uses a JSON feed embedded in html
 */

(function (scope) {
  // Guard clauses to ensure the DOM element and data exist before proceeding
  if (!scope) return;

  if (!stir.feeds || !stir.feeds.data) {
    console.error("Course data feed not found");
    return;
  }

  /*
   * Render the html for each course as a table row
   * @param {Object} item - The course item to render
   * @returns {string} - The HTML string for the table row
   */
  const renderItem = stir.curry((item) => {
    const portalUrl = `https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=`;

    // if item.portalapply has multiple course codes separated by commas, we need to create a link for each one
    const courseCodes = item.portalapply ? item.portalapply.split(", ").map((code) => code.trim()) : [];
    const courseLinks = courseCodes.map((code, index) => `<a href="${portalUrl}${code}">${item.prefix.split(" / ")[index]} ${item.title}</a>`).join(", ");

    return `
               <tr>
                   <td>
                    ${item.portalapply ? courseLinks : ``}
                   </td>
                   <td>${item.janfull}</td>
               </tr>`;
  });

  /*
   *  Render the course table html
   *  @param {Array} data - The array of course items to render
   *  @returns {string} - The HTML string for the course table
   */
  const renderTable = stir.curry((data) => {
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
  });

  /*
   * On load
   * Process the data and render the table to the specified DOM element
   */

  const domElement = scope;

  // Filter out janfull objects and order by title
  const filteredData = stir.feeds.data.filter((item) => item.janfull && Object.keys(item.janfull).length > 0).sort((a, b) => a.title.localeCompare(b.title));
  const renderedData = renderTable(filteredData);

  domElement && (domElement.innerHTML = renderedData);
})(stir.node("#course-list"));
