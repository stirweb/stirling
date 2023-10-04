(function () {
  /*
       
    EVENT LISTENERS AND ACTIONS

  */
  function addEventListeners() {
    /*
        BARCHART ANIMATION TRIGGER 
    */
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

  const renderCourseBackBtn = (level) => {
    let params = new URLSearchParams(document.location.search);
    return !params.get("course")
      ? ``
      : `<a href="https://www.stir.ac.uk/courses/${level}/${params.get("course")}/#panel_1_3" id="backtocourseBtn" class="text-md u-font-bold u-bg-heritage-green u-p-1 u-m-0 heritage-green button--back u-border-hover-none u-white">
      Back to course</a>`;
  };

  const renderDisclaimer = (level) => {
    return `<div class="cell medium-9 bg-grey u-bleed u-p-2 ">
              <p class="u-m-0 text-md">We aim to present detailed, up-to-date module information - in fact, we're providing more 
              information than ever. However, modules and courses are constantly being enhanced to boost your learning experience, and are therefore subject 
              to change. <a href="#">See terms and conditions</a>.</p>
          </div>
          <div class="cell medium-3 align-middle align-center u-flex">
            ${renderCourseBackBtn(level)}
          </div>
          `;
  };

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
                                        <span class="u-heritage-green u-inline-block u-width-48">
                                          <t4 type="media" id="173865" formatter="inline/*"/>
                                        </span>
                                        <span>

                                            <strong>Module code:</strong><br>${moduleCode}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48">
                                        <t4 type="media" id="173868" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>Delivery mode:</strong><br>${locationStudyMethods.filter((item) => item.trim() !== "").join("<br/>")}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48">
                                        <t4 type="media" id="173866" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>SCQF level:</strong><br>${moduleLevel}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48">
                                        <t4 type="media" id="173867" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>SCQF credits:</strong><br>${moduleCredits}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
  };

  const renderContentAims = ({ moduleOverview, learningOutcomes, colourPack }) => {
    return `<div class="cell u-p-2">
                <h2 id="contentandaims" >Content and aims</h2>

                <h3 class="header-stripped u-bg-${colourPack.first}--10 u-${colourPack.first}-line-left u-p-1  u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${moduleOverview}

                <h3 class="header-stripped u-bg-${colourPack.first}--10 u-${colourPack.first}-line-left u-p-1 u-border-width-5 u-text-regular">
                    Learning outcomes
                </h3>

                <p><strong>After successful completion of this module, you'll be able to:</strong></p>
                
                <ul>
                    ${learningOutcomes.map((item) => `<li>${item}</li>`).join("")} 
                </ul>
            </div>`;
  };

  const renderAccreditation = (professionalAccreditation, colour) => {
    return !professionalAccreditation ? `` : `<h3 class="header-stripped u-bg-${colour}--10 u-p-1 u-${colour}-line-left u-border-width-5 u-text-regular">Professional accreditation</h3><p>${professionalAccreditation}</p>`;
  };

  const renderAwards = ({ moduleCredits, ectsModuleCredits, professionalAccreditation, colourPack }) => {
    return `<div class="cell u-mt-2">
                <h2 id="awards" >Awards</h2>

                <h3 class="header-stripped u-bg-${colourPack.third}--10 u-p-1 u-${colourPack.third}-line-left u-border-width-5 u-text-regular">Credits</h3>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173616" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${moduleCredits} SCQF (Scottish Credit and Qualifications Framework) credits</p>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173615" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" /> 
                    This equates to ${ectsModuleCredits} ECTS (The European Credit Transfer and Accumulation System) credits</p>

                <div class="u-mb-2 u-bg-${colourPack.third}--10 flex-container align-stretch ">
                    <span class="u-bg-${colourPack.third} u-white flex-container align-middle u-width-64 u-px-1 ">
                      <t4 type="media" id="173864" formatter="inline/*"/> 
                    </span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> 
                        <a href="#" class="u-${colourPack.third}">Assessment and award of credit for undergraduates</a></p>
                </div>

                ${renderAccreditation(professionalAccreditation, colourPack.third)}
            </div>`;
  };

  const renderPrerequisites = (moduleRequisites) => (!moduleRequisites ? `` : `<p>Pre-requisites: ${moduleRequisites}</p>`);

  const renderStudyRequirements = ({ moduleRequisites }) => {
    return `<div class="cell u-mt-2">
                <h2 id="requirements" >Study requirements</h2>
                ${renderPrerequisites(moduleRequisites)}
                <p>Co-requisites: This module must be studied in conjunction with: module name (code)</p>
            </div>`;
  };

  const renderStudyAbroad = () => {
    return `<p>This module is available to suitably-qualified students studying elsewhere in the world who wish to join Stirling for a semester or academic year. <a href="">Learn more</a></p>`;
  };

  const renderSupportingInfo = (preparedotherinformation) => {
    return `<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3><p>${preparedotherinformation}</p>`;
  };

  const renderFurtherDetails = (data) => {
    return `<div class="cell u-mt-2">
                <h2 id="further">Further details</h2>
                ${data.preparedotherinformation ? renderSupportingInfo(data.preparedotherinformation) : ``}
                <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
                ${data.studyAbroad === "Yes" ? renderStudyAbroad() : `<p>Not available</p>`}
                <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Additional costs</h3>
                <p>${data.additionalCosts}</p>
            </div>`;
  };

  const renderDeliverablesTotal = (hours, colourPack) => {
    return `<div class="u-bg-${colourPack.second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container u-mb-2">
                <strong class="u-flex1">Total workload</strong>
                <strong>${hours} hours</strong>
            </div>`;
  };

  const renderDeliverables = stir.curry((colourPack, total, { type, hours, typekey, label }) => {
    return typekey === "total"
      ? renderDeliverablesTotal(hours, colourPack)
      : `
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${type}</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${hours}" data-max="${total}" data-unit="" data-colour="${colourPack.second}"></div>
        </div>`;
  });

  const renderDeliveries = (width, deliveries) => (!deliveries ? `` : `<div class="cell large-${width} u-mb-1">${deliveries}</div>`);

  const renderDeliveriesFallback = () => `<p class="u-m-0">Engagement and teaching information isn't currently available, but it will be made clear to you when you make your module selections.</p>`;

  const renderAssessmentItem = stir.curry((colourPack, { label, category, percent }) => {
    return percent === "0"
      ? ``
      : `
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${label} (${category})</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${percent}" data-max="100" data-unit="%" data-colour="${colourPack.second}"></div>
        </div>`;
  });

  const renderAssessments = stir.curry((colourPack, { tab, tabAssessments }) => {
    const renderAssessmentItemCurry = renderAssessmentItem(colourPack);
    return `<h4>${tab}</h4><p>${tabAssessments.map(renderAssessmentItemCurry).join(``)}</p>`;
  });

  const renderAssessment = stir.curry((width, item) => (!item ? `` : `<div class="cell large-${width} u-mb-1">${item}</div>`));

  const renderAssessmentFallback = () => `Assessment information isn't currently available, but it will be made clear to you when you make your module selections.`;

  const renderTeachingAssessment = (deliveries, assessments, colourPack) => {
    const deliveriesHtml = !deliveries.length ? renderDeliveriesFallback() : renderDeliveries(`12`, deliveries);

    const assessmentWidth = assessments.length < 2 ? `12` : `6`;
    const renderAssessmentCurry = renderAssessment(assessmentWidth);
    const assessmentHtml = !assessments.length ? renderAssessmentFallback() : assessments.map(renderAssessmentCurry).join(``);

    return `<div class="cell">
              <h2 id="teaching" >Teaching and assessment</h2>

              <p>Here's an overview of the learning, teaching and assessment methods, and the recommended time you
                  should dedicate to the study of this module. Most modules include a combination of activity
                  (e.g. lectures), assessments and self-study.</p>
              
              <h3 class="header-stripped u-bg-${colourPack.second}--10 u-p-1 u-${colourPack.second}-line-left u-border-width-5 u-text-regular u-mt-2">Engagement overview</h3>
              ${deliveriesHtml}

              <h3 class="header-stripped u-bg-${colourPack.second}--10 u-p-1 u-${colourPack.second}-line-left u-border-width-5 u-text-regular u-m-0 u-mt-3 u-mb-1">Assessment overview</h3>
              <div class="grid-x grid-padding-x ">
                  ${assessmentHtml}
              </div>

              <p>Are you an incoming Stirling student? You'll typically receive timetables for module-level
                  lectures one month prior
                  - and select seminars two weeks prior - to the start of your first semester. Help with module
                  registration can be provided by Student Services. More information can be found on our Welcome
                  site</p>
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

  // const removeDuplicateObjectFromArray = (key, array) => {
  //   let check = {};
  //   let res = [];
  //   array.forEach((element) => {
  //     if (!check[element[key]]) {
  //       check[element[key]] = true;
  //       res.push(element);
  //     }
  //   });
  //   return res;
  // };

  /*
        CONTROLLERS
  */

  // Deliveries
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
  };

  const doAssessmentItem = (item) => {
    const sum = item.tabAssessments
      .map((item) => Number(item.percent))
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    return { sum: sum, assessment: item };
  };

  // doAssessments
  const doAssessments = (assessments, colourPack) => {
    const renderAssessmentsCurry = renderAssessments(colourPack);
    // const filterDups = removeDuplicateObjectFromArray("match", mapped);
    const totalPercent = 100;
    const sums = assessments.map(doAssessmentItem);

    return sums.map((item) => {
      if (item.sum !== totalPercent) return ``;
      return renderAssessmentsCurry(item.assessment);
    });
    //return totalPercent !== sum ? renderDebug(totalPercent, sum, "(Percent)", assessments) : assessments[0].tabAssessments.map(renderAssessmentsCurry).join(``);
  };

  // Main
  const main = (data, colours) => {
    const contentArea = stir.node("#content");

    if (data.error) return setDOMContent(contentArea, renderError());

    const studyLevel = getStudyLevel(data.moduleLevelDescription);
    const colourPack = getColourPack(studyLevel, colours);
    const data2 = { ...data, colourPack: colourPack };

    const deliveries = ""; //doDeliveries(data.deliveries, colourPack);
    const assessments = doAssessments(data.assessments, colourPack);

    const html = renderHeader(data2) + renderSectionStart() + renderDisclaimer(studyLevel) + renderContentAims(data2) + renderTeachingAssessment(deliveries, assessments, colourPack) + renderAwards(data2) + renderFurtherDetails(data2) + renderSectionEnd();
    return setDOMContent(contentArea, html);
  };

  /*
        Init: Get the data and proceed
  */
  async function getData(fetchUrl, colours) {
    const response = await fetch(fetchUrl);

    try {
      const data = await response.json();
      main(data, colours);
      addEventListeners();
    } catch (error) {
      setDOMContent(contentArea, renderError());
      //console.log(error.message);
    }
  }

  /*
        On Load
    */

  const url = "https://www.stir.ac.uk/data/courses/akari/module/index.php?module=";

  const colours = [
    { level: "ug", first: "heritage-green", second: "energy-turq", third: "energy-purple" },
    { level: "pg", first: "heritage-purple", second: "heritage-purple", third: "heritage-green" },
  ];

  const params = new URLSearchParams(document.location.search);
  const fetchUrl = url + [params.get("code"), params.get("session"), params.get("semester")].join("/");

  getData(fetchUrl, colours);
})();
