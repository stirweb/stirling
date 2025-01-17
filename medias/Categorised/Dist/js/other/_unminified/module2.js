(function () {
  /*
    EVENT LISTENERS AND ACTIONS
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

        HELPERS

    */

  const upperCaseFirstWord = (s) => s[0].toUpperCase() + s.slice(1);

  /* 

        RENDERERS

    */

  /* renderCourseBackBtn */
  const renderCourseBackBtn = (level) => {
    const params = new URLSearchParams(document.location.search);
    if (!params.get("course")) return ``;

    const url = stir.isNumeric(params.get("course")) ? `/terminalfour/preview/1/en/${params.get("course")}` : `/courses/${level.replace("pg", "pg-taught")}/${params.get("course")}`;
    return `<a href="${url}#panel_1_3" id="backtocourseBtn" class="button u-m-0 heritage-green button--back ">Back to course</a>`;
  };

  /* renderDeliverablesTotal */
  const renderDeliverablesTotal = (hours, colourPack) => {
    return `<div class="u-bg-${colourPack[0].second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container u-mb-2">
                <strong class="u-flex1">Total workload</strong>
                <strong>${hours} hours</strong>
            </div>`;
  };

  /* renderDeliverables */
  const renderDeliverables = stir.curry((colourPack, total, { type, hours, typekey, label }) => {
    return typekey === "total"
      ? renderDeliverablesTotal(hours, colourPack)
      : `
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${label + `: ` + upperCaseFirstWord(type)}</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-medium-grey" data-value="${hours}" data-max="${total}" data-unit="" data-colour="${colourPack[0].second}"></div>
        </div>`;
  });

  /* renderDeliveries */
  const renderDeliveries = (width, deliveries) => (!deliveries ? `` : `<div class="cell large-${width} u-mb-1">${deliveries}</div>`);

  /* renderTeachingDeliveries */
  const renderTeachingDeliveries = (deliveries, deliveriesFallback) => {
    const deliveriesHtml = !deliveries.length ? `<div class="cell ">${deliveriesFallback}</div>` : renderDeliveries(`12`, deliveries);
    return `${deliveriesHtml}`;
  };

  /* renderAssessmentItem */
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

  /* renderAssessments */
  const renderAssessments = stir.curry((colourPack, length, item) => {
    const renderAssessmentItemCurry = renderAssessmentItem(colourPack);
    const header = length > 1 ? `<h4 class="u-mt-0">${item.tab}</h4>` : ``;

    return `${header}<p>${item.summary.map(renderAssessmentItemCurry).join(``)}</p>`;
  });

  const renderAssessment = stir.curry((width, item) => (!item ? `` : `<div class="cell large-${width} u-mb-1">${item}</div>`));

  /* renderTeachingAssessment */
  const renderTeachingAssessments = (assessments, multipleAssessments, assessmentFallback) => {
    const assessmentWidth = assessments.length < 2 ? `12` : `6`;
    const renderAssessmentCurry = renderAssessment(assessmentWidth);
    const assessmentHtml = !assessments.length ? `<div class="cell">${assessmentFallback}</div>` : assessments.map(renderAssessmentCurry).join(``);

    return `${assessments.length > 1 ? multipleAssessments : ``} ${assessmentHtml}`;
  };

  // const renderDebugDataItem = (item) => {
  //   if (item.category) {
  //     return `<div class="flex-container u-border-bottom-solid u-p-tiny"><span class="u-flex1">${item.label} (${item.category})</span><span>${item.percent}%</span></div>`;
  //   }
  //   return `<div class="flex-container u-border-bottom-solid u-p-tiny"><span class="u-flex1">${item.label} (hours)</span><span>${item.hours}</span></div>`;
  // };

  // const renderDebug = (total, sum, unit, data) => {
  //   return `<div class="u-border-solid u-p-1" style="color:#d51212">
  //             <p><strong>Error with the data</strong></p>
  //             <p>Reported total: ${total} ${unit}<br>
  //             Actual sum: ${sum} </p>
  //             ${data.map(renderDebugDataItem).join(``)}
  //           </div>`;
  // };

  /*
        INPUT / OUTPUT EVENTS (SIDE EFFECTS!!)
  */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /* 
  
      HELPERS

  */

  /*
      DATA PROCESSING
  */

  const doDeliveries = (deliveries, colourPack) => {
    const deliveriesTotalItem = deliveries.filter((item) => item.typekey === "total");
    const deliveriesTotalValue = deliveriesTotalItem.length ? deliveriesTotalItem[0].hours : null;

    const renderDeliverablesCurry = renderDeliverables(colourPack, deliveriesTotalValue);
    //const deliveriesTotalFiltered = deliveries.filter((item) => item.typekey !== "total");

    const total = Number(deliveriesTotalValue);
    const sum = deliveries
      .filter((item) => item.typekey !== "total")
      .map((item) => Number(item.hours))
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    //console.log(deliveries);
    //console.log(sum);

    return Number(total) !== sum ? `` : deliveries.map(renderDeliverablesCurry).join(``);
    //return Number(total) !== sum ? renderDebug(total, sum, `Hours (Total Study Time)`, deliveriesTotalFiltered) : deliveries.map(renderDeliverablesCurry).join(``);
  };

  const removeDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) === index);

  /* doAssessmentItem: Return a duplicate of item with aggregated values added */
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

  /* doAssessments */
  const doAssessments = (assessments, colourPack) => {
    const totalPercent = 100;
    const sums = assessments.map(doAssessmentItem).filter((item) => item.sum === totalPercent);
    //console.log(sums);
    const renderAssessmentsCurry = renderAssessments(colourPack, sums.length);

    return sums.map((item) => {
      return renderAssessmentsCurry(item);
    });
  };

  /*
      CONTROLLERS
  */

  /* Main */
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
      ON LOAD
  */

  main(JSON.parse(colours), JSON.parse(assessments), JSON.parse(deliveries), multipleAssessmentsText, assessmentsFallbackText, deliveriesFallbackText);
})();
