/* ------------------------------------------------
 * @author Ryan Kaye
 * @version: 2
 * NO LONGER IN USE - ALL DONE IN T4 NOW
 * ------------------------------------------------ */

(function (resultsArea) {
  if (!resultsArea || !resultsArea.dataset.subject) return;

  /*
   * GLOBAL CONSTANTS
   */
  const jsonUrl =
    "https://www.stir.ac.uk/s/search.json?collection=stir-courses&sort=title&query=!padrenullquery&start_rank=1&num_ranks=300&";

  /*
   * CONTROLLER
   */

  /* ------------------------------------------------
   * Controls data flow and outputs content to page
   * ------------------------------------------------ */
  const main = (initialData) => {
    /* Helper function - is there data? */
    const gotFBData = (_d) => {
      return _d.response.resultPacket !== null && _d.response.resultPacket.results.length > 0;
    };

    if (initialData.error) {
      return setDOMContent(resultsArea, stir.getMaintenanceMsg());
    }

    if (!gotFBData(initialData)) {
      return setDOMContent(resultsArea, renderNoResults());
    }

    if (gotFBData(initialData)) {
      return setDOMContent(resultsArea, setState(initialData));
    }
  };

  /*
   * STATE
   */

  /* ------------------------------------------------
   * Ready the data in an immutable stylee
   * ------------------------------------------------ */
  const setState = (initialData) => {
    const resultsData = stir.clone(initialData.response.resultPacket.results);

    const ugData = stir.filter((element) => element.metaData.L.includes("Undergraduate"), resultsData);
    const pgData = stir.filter((element) => element.metaData.L.includes("Postgraduate"), resultsData);

    return renderResults("Undergraduate", ugData).concat(renderResults("Postgraduate", pgData));
  };

  /*
   * HELPERS
   */

  /* ------------------------------------------------
   * Form the FunnelBack search url based on params
   * ------------------------------------------------ */
  const getSearchUrl = (_jsonUrl, _facets) => {
    return _jsonUrl + stir.map(([key, val]) => `${key}=${val}`, Object.entries(_facets)).join("&");
  };

  /*
   * RENDERERS
   */

  /* ------------------------------------------------
   * Form the html for results
   * ------------------------------------------------ */
  const renderResults = (_level, _data) => {
    if (!_data.length) return ``;

    return `
        <table>
            <caption>${_level} courses</caption>
            <thead>
                <tr>
                    <th>Course</th>
                    <th style="width: 30%">Start date</th>
                </tr>
            </thead>
            <tbody>
                ${stir.map(renderItem, _data).join("")}
            </tbody>
        </table>`;
  };

  /* ------------------------------------------------
   * Form the html for individual items
   * ------------------------------------------------ */
  const renderItem = (_item) => {
    return `
        <tr>
            <td>
                <a href="${_item.displayUrl}" data-mode="${_item.metaData.M}">
                  ${_item.metaData.B ? _item.metaData.B : ""} ${_item.metaData.t}
                </a>
            </td>
            <td> 
                ${_item.metaData.sdt} 
            </td>
        </tr>`;
  };

  /* ------------------------------------------------
   * Form the html for user feedback messages
   * ------------------------------------------------ */
  const renderLoading = () => `<p>Loading courses...</p>`;
  const renderNoResults = () => `<p>No courses found</p>`;

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

  setDOMContent(resultsArea, renderLoading());

  const searchUrl = getSearchUrl(jsonUrl, { meta_S_and: resultsArea.dataset.subject });

  stir.getJSON(searchUrl, main);
})(stir.node("#course-subject-listing"));
