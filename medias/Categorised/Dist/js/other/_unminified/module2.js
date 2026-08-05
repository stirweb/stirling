(function () {
  /*
   *  EVENT LISTENERS AND ACTIONS
   */
  function addEventListeners() {
    /*  Barchart animation trigger */
    function onIntersection(entries, opts) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const value = Number(entry.target.dataset.value);
          const unit = entry.target.dataset.unit;
          const max = Number(entry.target.dataset.max);
          const colour = entry.target.dataset.colour || "energy-turq";

          const perc = (value / max) * 100;
          const percInverted = 100 - perc;
          const percInvertedFixed = percInverted > 98 ? 98 : percInverted;

          const textPositionInit = perc / 2 - 0.5;
          const textPosition = textPositionInit === 0 ? 1 : textPositionInit;

          const frag = stir.createDOMFragment(`<div>
                                                  <div class="barchart-value u-top-0 u-bottom-0 u-bg-${colour} u-absolute" style="right:${percInvertedFixed}%"></div>
                                                  <div class="barchart-text u-relative u-white u-font-bold text-md u-z-50" style="left:${Math.abs(textPosition)}%"></div>
                                              </div>`);
          entry.target.append(frag);
        } else {
          entry.target.innerHTML = ``;
        }
      });
    }

    // define observer instances
    const observerBarcharts = new IntersectionObserver(onIntersection, {
      root: null,
      threshold: 0.5,
    });

    const barcharts = stir.nodes(".barchart");

    barcharts.forEach((el) => {
      observerBarcharts.observe(el);
    });
  }

  /*
   *
   *   HELPERS
   *
   */

  const upperCaseFirstWord = (s) => s[0].toUpperCase() + s.slice(1);

  /*
   * Function: removeDuplicates
   * @description: Removes duplicate items from an array.
   * @param {Array} arr - The array from which duplicates should be removed.
   * @returns {Array} - A new array with duplicates removed.
   */
  const removeDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) === index);

  /*
   *
   * RENDERERS
   *
   */

  /*
   *  Function: renderCourseBackBtn
   *  @description: Renders a back button to the course page if the course parameter is present in the URL.
   *  @param {string} level - The level of the course (e.g., "pg", "ug").
   *  @returns {string} - HTML string for the back button or an empty string if no course parameter is present.
   */
  const renderCourseBackBtn = (level) => {
    const params = new URLSearchParams(document.location.search);
    if (!params.get("course")) return ``;

    const url = stir.isNumeric(params.get("course"))
      ? `/terminalfour/preview/1/en/${params.get("course")}`
      : `/courses/${level.replace("pg", "pg-taught")}/${params.get("course")}`;
    return `<a href="${url}#panel_1_3" id="backtocourseBtn" class="button u-m-0 heritage-green button--back ">Back to course</a>`;
  };

  /*
   * Function: renderDeliverablesTotal
   * @description: Renders the total workload for deliverables.
   * @param {number} hours - The total workload in hours.
   * @param {Array} colourPack - An array containing colour information.
   * @returns {string} - HTML string for the total workload display.
   */
  const renderDeliverablesTotal = (hours, colourPack) => {
    return `<div class="u-bg-${colourPack[0].second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container u-mb-2">
                <strong class="u-flex1">Total workload</strong>
                <strong>${hours} hours</strong>
            </div>`;
  };

  /*
   * Function: renderDeliverables
   * @description: Renders individual deliverables with a bar chart representation.
   * @param {Array} colourPack - An array containing colour information.
   * @param {number} total - The total workload in hours.
   * @param {Object} deliverable - An object containing deliverable information (type, hours, typekey, label).
   * @returns {string} - HTML string for the deliverable display.
   */
  const renderDeliverables = stir.curry((colourPack, total, { type, hours, typekey, label }) => {
    return typekey === "total"
      ? renderDeliverablesTotal(hours, colourPack)
      : `
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${label + `: ` + upperCaseFirstWord(type)}</span>
            <div class="u-flex">
              <div class="barchart u-relative u-flex u-flex1 align-middle u-overflow-hidden u-bg-medium-grey" data-value="${hours}" data-max="${total}" data-unit="" data-colour="${colourPack[0].second}"></div>
              <div class="u-pl-2 text-lg u-font-primary u-line-height-1 u-${colourPack[0].second} u-top--16 u-relative"  >${hours} hours</div>
            </div>
        </div>`;
  });

  /*
   *  Function: renderDeliveries
   *  @description: Renders the deliveries section with a specified width.
   *  @param {string} width - The width of the deliveries section (e.g., "12", "6").
   *  @param {string} deliveries - The HTML content for the deliveries.
   *  @returns {string} - HTML string for the deliveries section or an empty string if no deliveries are provided.
   */
  const renderDeliveries = (width, deliveries) => (!deliveries ? `` : `<div class="cell large-${width} u-mb-1">${deliveries}</div>`);

  /*
   * Function: renderTeachingDeliveries
   * @description: Renders the teaching deliveries section, displaying either the provided deliveries or a fallback message if no deliveries are available.
   * @param {Array} deliveries - An array of delivery items to be rendered.
   * @param {string} deliveriesFallback - A fallback message to display if no deliveries are available.
   * @returns {string} - HTML string for the teaching deliveries section.
   */
  const renderTeachingDeliveries = (deliveries, deliveriesFallback) => {
    const deliveriesHtml = !deliveries.length ? `<div class="cell ">${deliveriesFallback}</div>` : renderDeliveries(`12`, deliveries);
    return `${deliveriesHtml}`;
  };

  /*
   * Function: renderAssessmentItem
   * @description: Renders an individual assessment item with a bar chart representation.
   * @param {Array} colourPack - An array containing colour information.
   * @param {Object} assessment - An object containing assessment information (name, value).
   * @returns {string} - HTML string for the assessment item display or an empty string if the value is 0.
   */
  const renderAssessmentItem = stir.curry((colourPack, { name, value }) => {
    return Number(value) === 0
      ? ``
      : `<div >
          <span class="u-inline-block u-p-tiny u-px-1">${name}</span>
          <div class="u-flex">
            <div class="barchart u-relative u-flex u-flex1 align-middle u-overflow-hidden u-bg-light-medium-grey" data-value="${value}" data-max="100" data-unit="%" data-colour="${colourPack[0].second}"></div>
            <div class="u-pl-2 text-xlg u-font-primary u-line-height-1 u-${colourPack[0].second} u-top--16 u-relative"  >${value}%</div>
          </div>
        </div>`;
  });

  /*
   * Function: renderAssessment
   * @description: Renders an individual assessment item with a specified width.
   * @param {string} width - The width of the assessment item (e.g., "12", "6").
   * @param {string} item - The HTML content for the assessment item.
   * @returns {string} - HTML string for the assessment item or an empty string if no item is provided.
   */

  const renderAssessment = stir.curry((width, item) => (!item ? `` : `<div class="cell large-${width} u-mb-1">${item}</div>`));

  /*
   * Function: renderAssessments
   * @description: Renders the assessments section with a specified colour pack and length.
   * @param {Array} colourPack - An array containing colour information.
   * @param {number} length - The number of assessments to be rendered.
   * @param {Object} item - An object containing assessment information (tab, summary).
   * @returns {string} - HTML string for the assessments section.
   */
  const renderAssessments = stir.curry((colourPack, length, item) => {
    const renderAssessmentItemCurry = renderAssessmentItem(colourPack);
    const header = length > 1 ? `<h4 class="u-mt-0">${item.tab}</h4>` : ``;

    return `${header}<p>${item.summary.map(renderAssessmentItemCurry).join(``)}</p>`;
  });

  /*
   * Function: renderTeachingAssessment
   * @description: Renders the teaching assessments section, displaying either the provided assessments or a fallback message if no assessments are available.
   * @param {Array} assessments - An array of assessment items to be rendered.
   * @param {string} multipleAssessments - A message to display if there are multiple assessments.
   * @param {string} assessmentFallback - A fallback message to display if no assessments are available.
   * @returns {string} - HTML string for the teaching assessments section.
   */
  const renderTeachingAssessments = (assessments, multipleAssessments, assessmentFallback) => {
    const assessmentWidth = assessments.length < 2 ? `12` : `6`;
    const renderAssessmentCurry = renderAssessment(assessmentWidth);
    const assessmentHtml = !assessments.length ? `<div class="cell">${assessmentFallback}</div>` : assessments.map(renderAssessmentCurry).join(``);

    return `${assessments.length > 1 ? multipleAssessments : ``} ${assessmentHtml}`;
  };

  /*
   *
   * INPUT / OUTPUT EVENTS (SIDE EFFECTS!!)
   *
   */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /*
   *
   *  DATA PROCESSING
   *
   */

  /*
   * Function: doDeliveries
   * @description: Processes an array of delivery items, calculating the total workload and rendering the valid deliveries.
   * @param {Array} deliveries - An array of delivery items to be processed.
   * @param {Array} colourPack - An array containing colour information.
   * @returns {string} - HTML string for the rendered deliveries or an empty string if the total workload does not match the sum of individual workloads.
   */
  const doDeliveries = (deliveries, colourPack) => {
    const deliveriesTotalItem = deliveries.filter((item) => item.typekey === "total");
    const deliveriesTotalValue = deliveriesTotalItem.length ? deliveriesTotalItem[0].hours : null;

    const renderDeliverablesCurry = renderDeliverables(colourPack, deliveriesTotalValue);

    const total = Number(deliveriesTotalValue);
    const sum = deliveries
      .filter((item) => item.typekey !== "total")
      .map((item) => Number(item.hours))
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    // Only render the deliveries data if the total matches the sum of individual workloads, otherwise return an empty string.
    return Number(total) !== sum ? `` : deliveries.map(renderDeliverablesCurry).join(``);
  };

  /*
   * Function: doAssessmentItem
   * @description: Processes an individual assessment item, calculating the sum of percentages and summarizing the assessments by category.
   * @param {Object} item - An object containing assessment information (tab, tabAssessments).
   * @returns {Object} - An object containing the sum of percentages, a summary of assessments by category, and the original tab and tabAssessments.
   */
  const doAssessmentItem = (item) => {
    // Hide International by making all aggregated values 0 - Quick hack will do for now
    if (item.tab === "International") {
      return {
        sum: 0,
        summary: [],
        tab: item.tab,
        tabAssessments: item.tabAssessments,
      };
    }

    const sum = item.tabAssessments
      .map((item) => Number(item.percent))
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    const categories = removeDuplicates(item.tabAssessments.map((ass) => ass.category));

    // Summarise the assessments values
    const summary = categories.map((cat) => {
      return {
        name: cat,
        value: item.tabAssessments
          .map((ass) => {
            return ass.category === cat ? Number(ass.percent) : 0;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0),
      };
    });

    return {
      sum: sum,
      summary,
      tab: item.tab,
      tabAssessments: item.tabAssessments,
    };
  };

  /*
   * Function: doAssessments
   * @description: Processes an array of assessment items, filtering out those that do not sum to 100% and rendering the valid assessments.
   * @param {Array} assessments - An array of assessment items to be processed.
   * @param {Array} colourPack - An array containing colour information.
   * @returns {Array} - An array of rendered assessment items that sum to 100%.
   */
  const doAssessments = (assessments, colourPack) => {
    const totalPercent = 100;
    const sums = assessments.map(doAssessmentItem).filter((item) => item.sum === totalPercent);
    const renderAssessmentsCurry = renderAssessments(colourPack, sums.length);

    return sums.map((item) => {
      return renderAssessmentsCurry(item);
    });
  };

  /*
   *
   *  CONTROLLERS
   *
   */

  /*
   * Function: main
   * @description: The main function that initializes the module, processes deliveries and assessments, and sets the content of the page.
   * @param {Array} colourPack - An array containing colour information.
   * @param {Array} dataAssessments - An array of assessment items to be processed.
   * @param {Array} dataDeliveries - An array of delivery items to be processed.
   * @param {string} multipleAssessmentsText - A message to display if there are multiple assessments.
   * @param {string} assessmentsFallbackText - A fallback message to display if no assessments are available.
   * @param {string} deliveriesFallbackText - A fallback message to display if no deliveries are available.
   */
  const main = (colourPack, dataAssessments, dataDeliveries, multipleAssessmentsText, assessmentsFallbackText, deliveriesFallbackText) => {
    const contentArea = stir.node("#content");
    contentArea && contentArea.classList.add("u-padding-bottom");

    //const deliveries = doDeliveries(dataDeliveries, colourPack);
    const deliveries = "";

    setDOMContent(stir.node("#deliveries"), renderTeachingDeliveries(deliveries, deliveriesFallbackText));

    const assessmentsData = dataAssessments ? dataAssessments : [];
    const assessments = doAssessments(assessmentsData, colourPack);
    setDOMContent(stir.node("#assessments"), renderTeachingAssessments(assessments, multipleAssessmentsText, assessmentsFallbackText));

    const level = colourPack[0].level;
    setDOMContent(stir.node("#backbutton"), renderCourseBackBtn(level));

    addEventListeners();
  };

  /*
   *
   *  ON LOAD
   *
   */

  main(JSON.parse(colours), JSON.parse(assessments), JSON.parse(deliveries), multipleAssessmentsText, assessmentsFallbackText, deliveriesFallbackText);
})();
