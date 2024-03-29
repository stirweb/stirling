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
          const valueInverted = 100 - perc;
          const textPosition = perc / 2 - 2;

          const frag = stir.createDOMFragment(`<div class="barchart-value u-bg-${colour} u-absolute" style="right:${valueInverted}%"></div>
                                                <div class="barchart-text u-relative u-white u-font-bold text-md u-z-50" style="left:${textPosition}%">${value}${unit}</div>`);
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

        RENDERERS

    */

  /* renderCourseBackBtn */
  const renderCourseBackBtn = (level) => {
    const params = new URLSearchParams(document.location.search);

    if (!params.get("course")) return ``;

    const url = stir.isNumeric(params.get("course")) ? `/terminalfour/preview/1/en/${params.get("course")}` : `/courses/${level.replace("pg", "pg-taught")}/${params.get("course")}`;
    return `<a href="${url}#panel_1_3" id="backtocourseBtn" class="button u-m-0 heritage-green button--back ">Back to course</a>`;
  };

  /* renderDisclaimer    */
  const renderDisclaimer = (level, url, startDate) => {
    const params = new URLSearchParams(document.location.search);
    const date = params.get("session") ? params.get("session") : "current year";
    return `<div class="cell medium-9 bg-grey u-bleed u-p-2 ">
                <p>The module information below is for the ${date} intake and may be subject to change, including in response to student feedback and continuous innovation development. See our <a href="${url}">terms and conditions</a> for more information.</p>
            </div>
            <div class="cell medium-3 align-middle align-center u-flex">
            ${renderCourseBackBtn(level)}
            </div> `;
  };

  /* renderHeader */
  const renderHeader = ({ moduleTitle, moduleCode, locationStudyMethods, moduleLevel, moduleCredits }) => {
    return `<div class="grid-container">
                <div class="grid-x grid-padding-x u-my-2 align-middle">
                    <div class="cell large-6  c-course-title u-padding-y">
                        <h1 class="u-header-smaller ">${moduleTitle}</h1>
                    </div>
                    <div class="cell large-6">
                        <div class="u-border u-border-width-5 flex-container  u-px-3 u-py-2">
                            <div class="grid-x grid-padding-x ">
                                <div class="cell medium-6 flex-container u-gap u-p-1">
                                    <span class="u-heritage-green u-inline-block u-width-48"><t4 type="media" id="173865" formatter="inline/*"/></span>
                                    <span><strong>Module code:</strong><br>${moduleCode}</span>
                                </div>
                                <div class="cell medium-6 flex-container u-gap u-p-1">
                                    <span class="u-heritage-green u-inline-block u-width-48"><t4 type="media" id="173866" formatter="inline/*"/></span>
                                    <span><strong>SCQF level:</strong><br>${moduleLevel.replace("SCQF LEVEL ", "")}</span>
                                </div>
                                <div class="cell medium-6 flex-container u-gap u-p-1">
                                    <span class="u-heritage-green u-inline-block u-width-48"><t4 type="media" id="173867" formatter="inline/*"/></span>
                                    <span><strong>SCQF credits:</strong><br>${moduleCredits}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
  };

  /* renderContentAims */
  const renderContentAims = ({ moduleOverview, learningOutcomes, colourPack, boilerplates }) => {
    //const str = moduleOverview.replace(/¿/g, "'");
    return `<div class="cell u-p-2">
                <h2 id="contentandaims" >Content and aims</h2>
                <h3 class="header-stripped u-bg-${colourPack.first}--10 u-${colourPack.first}-line-left u-p-1  u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${moduleOverview}

                <h3 class="header-stripped u-bg-${colourPack.first}--10 u-${colourPack.first}-line-left u-p-1 u-border-width-5 u-text-regular u-mt-2">
                    Learning outcomes
                </h3>
                <p><strong>${boilerplates.outcomesIntro}</strong></p>
                <ul>${learningOutcomes.map((item) => `<li>${item}</li>`).join(``)}</ul>
            </div>`;
  };

  /* renderAwards */
  const renderAwards = ({ moduleCredits, ectsModuleCredits, professionalAccreditation, colourPack }, boilerplates, studyLevel) => {
    return `<div class="cell u-mt-2">
                <h2 id="awards">Awards</h2>
                <h3 class="header-stripped u-bg-${colourPack.third}--10 u-p-1 u-${colourPack.third}-line-left u-border-width-5 u-text-regular">Credits</h3>
                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173616" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${moduleCredits} SCQF (Scottish Credit and Qualifications Framework) credits.</p>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173615" formatter="path/*"/>" width="65" height="44" alt="EU flag" /> 
                    This equates to ${ectsModuleCredits} ECTS (The European Credit Transfer and Accumulation System) credits.</p>

                <div class="u-mb-2 u-bg-${colourPack.third}--10 flex-container align-stretch ">
                    <span class="u-bg-${colourPack.third} u-white flex-container align-middle u-width-64 u-px-1 ">
                      <t4 type="media" id="173864" formatter="inline/*"/> 
                    </span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> 
                        <a href="${studyLevel === "ug" ? boilerplates.awardsCtaUG : boilerplates.awardsCtaPG}" class="u-${colourPack.third}">Assessment and award of credit for ${studyLevel === "ug" ? `undergraduates` : `postgraduates`}</a></p>
                </div>
            </div>`;
  };

  //const renderPrerequisites = (moduleRequisites) => (!moduleRequisites ? `` : `<p>Pre-requisites: ${moduleRequisites}</p>`);

  // const renderStudyRequirements = ({ moduleRequisites }) => {
  //   return `<div class="cell u-mt-2">
  //               <h2 id="requirements" >Study requirements</h2>
  //               ${renderPrerequisites(moduleRequisites)}
  //               <p>Co-requisites: This module must be studied in conjunction with: module name (code)</p>
  //           </div>`;
  // };

  /* renderSupportingInfo */
  const renderSupportingInfo = (preparedotherinformation) => {
    return `<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3><p>${preparedotherinformation}</p>`;
  };

  /* renderStudyAbroad */
  const renderStudyAbroad = (content) => {
    return `<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>` + content;
  };

  /* renderAdditionalCosts */
  const renderAdditionalCosts = (additionalCosts) => {
    return !additionalCosts
      ? ``
      : `<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular u-mt-2">Additional costs</h3>
          <p>${additionalCosts}</p>`;
  };

  /* renderFurtherDetails */
  const renderFurtherDetails = ({ preparedotherinformation, studyAbroad, additionalCosts }, boilerplates) => {
    return !preparedotherinformation && studyAbroad !== "Yes" && !additionalCosts
      ? ``
      : `<div class="cell u-mt-2">
                <h2 id="further">Further details</h2>
                ${preparedotherinformation ? renderSupportingInfo(preparedotherinformation) : ``}
                ${studyAbroad === "Yes" ? renderStudyAbroad(boilerplates.studyAbroad) : ``}
                ${renderAdditionalCosts(additionalCosts)}
        </div>`;
  };

  /* renderDeliverablesTotal */
  const renderDeliverablesTotal = (hours, colourPack) => {
    return `<div class="u-bg-${colourPack.second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container u-mb-2">
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
            <span class="u-inline-block u-p-tiny u-px-1">${type}</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${hours}" data-max="${total}" data-unit="" data-colour="${colourPack.second}"></div>
        </div>`;
  });

  /* renderDeliveries */
  const renderDeliveries = (width, deliveries) => (!deliveries ? `` : `<div class="cell large-${width} u-mb-1">${deliveries}</div>`);

  /* renderAssessmentItem */
  const renderAssessmentItem = stir.curry((colourPack, { name, value }) => {
    return Number(value) === 0
      ? ``
      : `<div>
          <span class="u-inline-block u-p-tiny u-px-1">${name}</span>
          <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${value}" data-max="100" data-unit="%" data-colour="${colourPack.second}"></div>
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
  const renderTeachingAssessment = (deliveries, assessments, colourPack, boilerplates) => {
    const deliveriesHtml = !deliveries.length ? boilerplates.deliveriesFallback : renderDeliveries(`12`, deliveries);

    const assessmentWidth = assessments.length < 2 ? `12` : `6`;
    const renderAssessmentCurry = renderAssessment(assessmentWidth);
    const assessmentHtml = !assessments.length ? `<div class="cell">${boilerplates.assessmentFallback}</div>` : assessments.map(renderAssessmentCurry).join(``);

    return `<div class="cell">
              <h2 id="teaching" >Teaching and assessment</h2>
              ${boilerplates.teachingIntro}
              
              <h3 class="header-stripped u-bg-${colourPack.second}--10 u-p-1 u-${colourPack.second}-line-left u-border-width-5 u-text-regular u-mt-2">Engagement overview</h3>
              ${deliveriesHtml}

              <h3 class="header-stripped u-bg-${colourPack.second}--10 u-p-1 u-${colourPack.second}-line-left u-border-width-5 u-text-regular u-mt-3 ">Assessment overview</h3>
              ${assessments.length > 1 ? boilerplates.multipleAssessments : ``}
              
              <div class="grid-x grid-padding-x ">
                  ${assessmentHtml}
              </div>
              ${boilerplates.teachingTimetableInfo}
          </div>`;
  };

  const renderSectionStart = () => `<div class="grid-container"><div class="grid-x grid-padding-x">`;
  const renderSectionEnd = () => `</div></div>`;

  const renderError = () => renderSectionStart() + `<div class="cell u-padding-y"><h1>Page not found</h1></div>` + renderSectionEnd();

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

  const getStudyLevel = (level) => {
    if (!level) return "ug";
    if (level.toLowerCase().includes("p")) return "pg";
    return "ug";
  };

  const getColourPack = (level, colours) => {
    return colours.filter((item) => item.level === level).length ? colours.filter((item) => item.level === level)[0] : colours[0];
  };

  /*
      DATA PROCESSING
  */

  /*
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

    return Number(total) !== sum ? `` : deliveries.map(renderDeliverablesCurry).join(``);
    //return Number(total) !== sum ? renderDebug(total, sum, `Hours (Total Study Time)`, deliveriesTotalFiltered) : deliveries.map(renderDeliverablesCurry).join(``);
  }; */

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
    //console.log(assessments);
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
  const main = (data, colours, boilerplates) => {
    const contentArea = stir.node("#content");
    contentArea.classList.add("u-padding-bottom");

    if (data.error) return setDOMContent(contentArea, renderError());

    const studyLevel = getStudyLevel(data.moduleLevelDescription);
    const colourPack = getColourPack(studyLevel, colours);
    const data2 = { ...data, colourPack: colourPack, boilerplates: boilerplates };

    const deliveries = ""; //doDeliveries(data.deliveries, colourPack);

    const assessmentsData = data.assessments ? data.assessments : [];
    const assessments = doAssessments(assessmentsData, colourPack);

    const html = renderHeader(data2) + renderSectionStart() + renderDisclaimer(studyLevel, boilerplates.disclaimerUrl, data.deliveryPeriodStartDesc) + renderContentAims(data2) + renderTeachingAssessment(deliveries, assessments, colourPack, boilerplates) + renderAwards(data2, boilerplates, studyLevel) + renderFurtherDetails(data2, boilerplates) + renderSectionEnd();
    return setDOMContent(contentArea, html);
  };

  /*  getData from the API Endpont  */
  async function getData(fetchUrl, colours, boilerplates) {
    const response = await fetch(fetchUrl);

    // try {
    const data = await response.json();

    main(data, colours, boilerplates);
    addEventListeners();
    //} catch (error) {
    //setDOMContent(stir.node("#content"), renderError());
    //console.log(error.message);
    //}
  }

  /*
      ON LOAD
  */
  const boilerplates = stir.moduleTexts || {};

  const url = "https://www.stir.ac.uk/data/pd-api/?module=";

  const colours = [
    { level: "ug", first: "heritage-green", second: "energy-turq", third: "energy-purple" },
    { level: "pg", first: "heritage-purple", second: "heritage-purple", third: "heritage-green" },
  ];

  const params = new URLSearchParams(document.location.search);
  const fetchUrl = url + [params.get("code"), params.get("session"), params.get("semester")].join("/");

  //const fetchUrl = "sample.json"; // Testing

  getData(fetchUrl, colours, boilerplates);
})();
