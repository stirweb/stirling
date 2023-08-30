/*
 * @description: Output courses based on start month eg "January"
 * @author: Ryan Kaye
 * @version: 2
 * @notes: This version does NOT use FunnelBack or XML - it now uses a JSON feed embedded in html
 */

(function (scope) {
  if (!scope) return;

  /*
    DOM: Main elements 
  */
  const resultsArea = scope;

  /*
     GLOBAL CONSTANTS
   */

  const constants = {
    applyLinkUG: "https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=",
    month: resultsArea.getAttribute("data-startmonth"),
  };

  Object.freeze(constants);

  /*
   
    RENDERERS
   
   */

  /*
    Render the html for the UG Apply Link 
   */
  // const renderUGApplyLink = stir.curry((consts, item) => {
  //   // Helper function to form award text
  //   const getAward = (code) => {
  //     if (code.includes("UDX12")) return " Apply for BA (Hons)";
  //     if (code.includes("UDX16")) return " Apply for BSc (Hons)";
  //     return "Apply";
  //   };

  //   if (item.portalapply && item.portalapply !== "") {
  //     return item.portalapply
  //       .split(",")
  //       .map((element) => '<a aria-label="' + getAward(element) + " " + item.title + '" href="' + consts.applyLinkUG + element.trim() + '">' + getAward(element) + "</a>")
  //       .join(" / ");
  //   }

  //   return "";
  // });

  /*
      Return the years for this item as an html string
   */
  const getYears = (item, month) => {
    if (!item.starts) return ``;

    return stir.compose(
      stir.join(", "),
      stir.map((element) => element.split(" ")[1]),
      stir.filter((element) => element.includes(month))
    )(item.starts.split(", "));
  };

  /* 
      Render the html for each course as a table row
   */
  const renderItem = stir.curry((consts, item) => {
    //const renderApply = renderApplyLink(consts);
    return `
        <tr>
            <td>
              ${item.url ? `<a href="${item.url}">` : ``}
              ${item.prefix} ${item.title} 
              ${item.url ? `</a>` : ``}
            </td>
            <td>${getYears(item, consts.month)}</td>
        </tr>`;
  });

  /*
      Render the course table html
   */
  const renderTable = stir.curry((consts, data) => {
    const renderItemCurry = renderItem(consts);
    return `
          <table>
              <caption>Courses starting in ${consts.month}</caption>
              <thead>
                  <tr><td>Course</td><td>Year of entry</td></tr>
              </thead>
              <tbody>
                  ${data.map((el) => renderItemCurry(el)).join("")}
              </tbody>
          </table>`;
  });

  /*
      EVENTS: OUTPUT (!!SIDE EFFECTS!!)
   */

  /*
    Outputs html content to the page
   */
  const setDOMContent = stir.curry((elem, html) => {
    // !!SIDE EFFECTS!!
    elem.innerHTML = html;
    return elem;
  });

  /*
     EVENTS: INPUT (!!SIDE EFFECTS!!)
   */

  const initialData = stir.feeds.data || [];

  if (!initialData.length) return;

  // Helpers and curried functions
  const filterMonth = stir.filter((item) => item.starts && item.starts.includes(constants.month));
  //const filterNoApplyCode = stir.filter((item) => item.portalapply);
  const sortByTitle = stir.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));

  const setResult = setDOMContent(resultsArea);
  const renderTableCurry = renderTable(constants);

  // Run the data through the functions until it hits the page
  stir.compose(setResult, renderTableCurry, sortByTitle, sortByTitle, filterMonth, stir.clone)(initialData);
})(stir.node("#course-list"));
