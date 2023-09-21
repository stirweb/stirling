(function () {
  /*
       
    EVENT LISTENERS AND ACTIONS

  */
  function addEventListeners() {
    //const openCloseSelector = ".c-open-close";

    /*
        Generic open close component
    */
    const openCloseBtns = stir.nodes(".c-open-close");
    openCloseBtns.forEach((el) => {
      el.addEventListener("click", (event) => {
        const btn = event.target.closest(".c-open-close");
        const openCloseIcons = Array.prototype.slice.call(btn.querySelectorAll(".c-open-close-icon"));
        openCloseIcons.forEach((item) => item.classList.toggle("hide"));
      });
    });

    /*
        Sticky nav
    */
    const stickyNav = document.querySelector(".c-sticky-nav");
    const stickyNavBtn = document.querySelector("#c-sticky-nav-btn");

    stickyNavBtn &&
      stickyNavBtn.addEventListener("click", (event) => {
        stickyNav.classList.toggle("hide-for-small-only");
        stickyNav.classList.toggle("hide-for-medium-only");
      });

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

          const frag = stir.createDOMFragment(`<div class="barchart-value u-bg-${colour}" style="right:${valueInverted}%"></div><div class="barchart-text" style="left:${textPosition}%">${value}${unit}</div>`);
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

    /*
        SECTION SCROLL TRIGGER
    */
    function onIntersection2(entries, opts) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentSection = entry.target.innerText;
          const navItems = stir.nodes("[data-anchornav]");
          //console.log(currentSection);

          navItems.forEach((item) => {
            //console.log(item.innerText);
            if (item.innerText == currentSection) {
              item.classList.add("current");
            } else {
              item.classList.remove("current");
            }
          });
        }
      });
    }

    const observerSections = new IntersectionObserver(onIntersection2, {
      root: null,
      threshold: 0.5,
    });

    const sections = stir.nodes("main h2");
    sections.forEach((el) => {
      observerSections.observe(el);
    });

    /* 
      Ensure correct anchor link is highlighted
      // Prevent deeplink which will break the back to course button
    */
    const anchornavs = stir.nodes("[data-anchornav]");
    anchornavs.forEach((item) => {
      item.addEventListener("click", (event) => {
        // event.preventDefault();

        // let urlParts = event.target.href ? event.target.href.split("#") : null;
        // let nodeId = urlParts.length ? urlParts[urlParts.length - 1] : null;
        // stir.node("#" + nodeId).scrollIntoView();

        stickyNav.classList.toggle("hide-for-small-only");
        stickyNav.classList.toggle("hide-for-medium-only");

        setTimeout(() => {
          anchornavs.forEach((el) => el.classList.remove("current"));
          event.target.classList.add("current");
        }, 500);
      });
    });
  }

  /* 
  
      GET THE DATA CONTENT 
      AND POPULATE THE PAGE
  
  */
  const url = "https://www.stir.ac.uk/data/courses/akari/module/index.php?module=";

  const colours = [
    { level: "ug", first: "heritage-green", second: "energy-turq", third: "energy-purple" },
    { level: "pg", first: "heritage-purple", second: "heritage-purple", third: "heritage-green" },
  ];

  /* 

        RENDERERS

    */

  const renderCourseBackBtn = (level) => {
    let params = new URLSearchParams(document.location.search);
    return !params.get("course")
      ? ``
      : `<a href="https://www.stir.ac.uk/courses/${level}/${params.get("course")}/#panel_1_3" id="backtocourseBtn" class="text-md u-font-bold u-bg-heritage-green u-p-1 u-m-0 heritage-green button--back u-border-hover-none ">
      Back to course</a>`;
  };

  const renderStickyNav = (level) => {
    return `<div class="u-white--all u-sticky-nav ">
                    <nav class="u-relative u-bg-dark-mink" aria-label="Jump to section links">
                        <div class="grid-container u-py-1 hide-for-large">
                            <button class=" u-bg-black text-md text-left u-font-bold u-py-1 u-m-0 
                                    u-cursor-pointer u-w-full flex-container c-open-close" id="c-sticky-nav-btn">
                                <span class="u-flex1">Jump to...</span>
                                <span class="u-relative u-width-32 u-inline-block u-heritage-green c-open-close-icon"> + </span>
                                <span class="u-relative u-width-32 u-inline-block u-heritage-green hide c-open-close-icon"> -
                                </span>
                            </button>
                        </div>

                        <div
                            class="u-absolute-medium-down u-bg-dark-mink hide-for-small-only hide-for-medium-only c-sticky-nav u-w-full">
                            <div class="grid-container u-py-1 u-pt-0-medium-down">
                                <div class="flex-container flex-dir-column large-flex-dir-row u-gap-x-8 ">
                                    <a href="#contentandaims" class="text-md u-font-bold u-p-1 u-m-0 current" data-anchornav>Content
                                        and aims</a>
                                    <a href="#teaching" class="text-md u-font-bold u-p-1 u-m-0 " data-anchornav>Teaching and
                                        assessment</a>
                                    <a href="#awards" class="text-md u-font-bold u-p-1 u-m-0 " data-anchornav>Awards</a>
                                    <a href="#requirements" class="text-md u-font-bold u-p-1 u-m-0 " data-anchornav>Study
                                        requirements</a>
                                    <a href="#further" class="text-md u-font-bold u-p-1 u-m-0 u-border-hover-none "
                                        data-anchornav>Further details</a>
                                    ${renderCourseBackBtn(level)}
                                </div>

                            </div>
                        </div>
                    </nav>
                </div>`;
  };

  const renderHeader = ({ moduletitle, modulecode, locationStudyMethods, modulelevel, modulecredits }) => {
    return `<div class="grid-container">
                    <div class="grid-x grid-padding-x u-my-2 align-middle">

                        <div class="cell large-6  c-course-title u-padding-y">
                            <h1 class="u-header-smaller ">${moduletitle}</h1>
                        </div>

                        <div class="cell large-6">
                            <div class="u-border u-border-width-5 flex-container  u-px-3 u-py-2">
                                <div class="grid-x grid-padding-x ">
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                          <t4 type="media" id="173865" formatter="inline/*"/>
                                        </span>
                                        <span>

                                            <strong>Module code:</strong><br>${modulecode}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                        <t4 type="media" id="173868" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>Delivery mode:</strong><br>${locationStudyMethods.filter((item) => item.trim() !== "").join("<br/>")}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                        <t4 type="media" id="173866" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>SCQF level:</strong><br>${modulelevel}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                        <t4 type="media" id="173867" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>SCQF credits:</strong><br>${modulecredits}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
  };

  const renderDisclaimer = () => {
    return `<div class="cell bg-grey u-bleed u-p-2 "><p class="u-m-0 text-md">We aim to present detailed, up-to-date module information - in fact, we're providing more 
            information than ever. However, modules and courses are constantly being enhanced to boost your learning experience, and are therefore subject 
            to change. <a href="#">See terms and conditions</a>.</p></div>`;
  };

  const renderContentAims = ({ moduleOverview, colourPack, ...data }) => {
    return `<div class="cell u-p-2">
                <h2 id="contentandaims">Content and aims</h2>

                <h3 class="header-stripped u-bg-${colourPack.first}--10 u-${colourPack.first}-line-left u-p-1  u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${moduleOverview}

                <h3 class="header-stripped u-bg-${colourPack.first}--10 u-${colourPack.first}-line-left u-p-1 u-border-width-5 u-text-regular">
                    Learning outcomes
                </h3>

                <p><strong>After successful completion of this module, you'll be able to:</strong></p>
                
                <ul>
                    ${data["learningOutcomes "].map((item) => `<li>${item}</li>`).join("")} 
                </ul>
            </div>`;
  };

  const renderAccreditation = (professionalAccreditation, colour) => {
    return !professionalAccreditation
      ? ``
      : `<h3 class="header-stripped u-bg-${colour}--10 u-p-1 u-${colour}-line-left u-border-width-5 u-text-regular">Professional accreditation</h3>
          <p>${professionalAccreditation}</p>`;
  };

  const renderAwards = ({ modulecredits, ectsmodulecredits, professionalAccreditation, colourPack }) => {
    return `<div class="cell u-mt-2">
                <h2 id="awards">Awards</h2>

                <h3 class="header-stripped u-bg-${colourPack.third}--10 u-p-1 u-${colourPack.third}-line-left u-border-width-5 u-text-regular">Credits</h3>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173616" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${modulecredits} SCQF (Scottish Credit and Qualifications Framework) credits</p>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173615" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" /> 
                    This equates to ${ectsmodulecredits} ECTS (The European Credit Transfer and Accumulation System) credits</p>

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

  const renderPrerequisites = (modulerequisites) => (!modulerequisites ? `` : `<p>Pre-requisites: ${modulerequisites}</p>`);

  const renderStudyRequirements = ({ modulerequisites }) => {
    return `<div class="cell u-mt-2">
                <h2 id="requirements">Study requirements</h2>
                ${renderPrerequisites(modulerequisites)}

                <p>Co-requisites: This module must be studied in conjunction with: module name (code)</p>
            </div>`;
  };

  const renderStudyAbroad = () => {
    return `<p>This module is available to suitably-qualified undergraduate students studying elsewhere in the
                        world who wish to join Stirling for a semester or academic year. <a href="">Learn more</a></p>`;
  };

  const renderSupportingInfo = (preparedotherinformation) => {
    return `<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3>
            <p>${preparedotherinformation}</p>`;
  };

  const renderFurtherDetails = (data) => {
    return `<div class="cell u-mt-2">
                    <h2 id="further">Further details</h2>
                    
                    ${data.preparedotherinformation ? renderSupportingInfo(data.preparedotherinformation) : ``}
                   
                    <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
                    ${data["studyAbroad "] === "Yes" ? renderStudyAbroad() : `<p>Not available</p>`}
                    
                    <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Additional costs</h3>
                    <p>${data["additionalCosts "]}</p>
                </div>`;
  };

  const renderDeliveries = (deliveries, width, colourPack) => {
    return !deliveries
      ? ``
      : `<div class="cell large-${width} u-mb-1">
            <h3 class="header-stripped u-bg-${colourPack.second}--10 u-p-1 u-${colourPack.second}-line-left u-border-width-5 u-text-regular">Engagement overview</h3>
            ${deliveries}
        </div>`;
  };

  const renderAssessment = (assessments, width, colourPack) => {
    return !assessments
      ? ``
      : `<div class="cell large-${width} u-mb-1">
            <h3 class="header-stripped u-bg-${colourPack.second}--10 u-p-1 u-${colourPack.second}-line-left u-border-width-5 u-text-regular">Assessment overview</h3>
            ${assessments}
        </div>`;
  };

  const renderDeliverablesTotal = (hours, colourPack) => {
    return `<div class="u-bg-${colourPack.second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container ">
                <strong class="u-flex1">Total workload</strong>
                <strong>${hours} hours</strong>
            </div>`;
  };

  const renderDeliverables = stir.curry((colourPack, total, { label, hours, typekey }) => {
    return typekey === "total"
      ? renderDeliverablesTotal(hours, colourPack)
      : `
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${label}</span>
            <div class="barchart" data-value="${hours}" data-max="${total}" data-unit="" data-colour="${colourPack.second}"></div>
        </div>`;
  });

  const renderAssessments = stir.curry((colourPack, { label, category, percent }) => {
    return percent === "0"
      ? ``
      : `
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${label} (${category})</span>
            <div class="barchart" data-value="${percent}" data-max="100" data-unit="%" data-colour="${colourPack.second}"></div>
        </div>`;
  });

  const renderTeachingAssessment = (deliveries, assessments, colourPack) => {
    const width = !deliveries || !assessments ? `12` : `6`;

    return !deliveries && !assessments
      ? ``
      : `<div class="cell u-mt-2">
              <h2 id="teaching">Teaching and assessment</h2>

              <p>Here's an overview of the learning, teaching and assessment methods, and the recommended time you
                  should dedicate to the study of this module. Most modules include a combination of activity
                  (e.g. lectures), assessments and self-study.</p>

              <div class="grid-x grid-padding-x u-my-2">
                  ${renderDeliveries(deliveries, width, colourPack)}
                  ${renderAssessment(assessments, width, colourPack)}
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

  const renderDebugDataItem = (item) => {
    if (item.category) {
      return `<div class="flex-container u-border-bottom-solid u-p-tiny"><span class="u-flex1">${item.label} (${item.category})</span><span>${item.percent}%</span></div>`;
    }
    return `<div class="flex-container u-border-bottom-solid u-p-tiny"><span class="u-flex1">${item.label} (hours)</span><span>${item.hours}</span></div>`;
  };

  const renderDebug = (total, sum, unit, data) => {
    return `<div class="u-border-solid u-p-1" style="color:#d51212">
              <p><strong>Error with the data</strong></p>
              <p>Reported total: ${total} ${unit}<br>
              Actual sum: ${sum} </p>
              ${data.map(renderDebugDataItem).join(``)} 
            </div>`;
  };

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
    const deliveriesTotalFiltered = deliveries.filter((item) => item.typekey !== "total");

    const total = Number(deliveriesTotalValue);
    const sum = deliveries
      .filter((item) => item.typekey !== "total")
      .map((item) => Number(item.hours))
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    return Number(total) !== sum ? renderDebug(total, sum, `Hours (Total Study Time)`, deliveriesTotalFiltered) : deliveries.map(renderDeliverablesCurry).join(``);
  };

  // Assessments
  const doAssessments = (assessments, colourPack) => {
    // const mapped = assessments.map((item) => {
    //   return { ...item, match: item.label + item.category + item.percent };
    // });
    const renderAssessmentsCurry = renderAssessments(colourPack);

    // const filterDups = removeDuplicateObjectFromArray("match", mapped);
    const totalPercent = 100;
    const sum = assessments
      .map((item) => Number(item.percent))
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    return totalPercent !== sum ? renderDebug(totalPercent, sum, "(Percent)", assessments) : assessments.map(renderAssessmentsCurry).join(``);
  };

  // Main
  const main = (data, colours) => {
    const contentArea = stir.node("#content");

    if (data.error) return setDOMContent(contentArea, renderError());

    const studyLevel = getStudyLevel(data.moduleLevelDescription);
    const colourPack = getColourPack(studyLevel, colours);
    const data2 = { ...data, colourPack: colourPack };

    const deliveries = doDeliveries(data.deliveries, colourPack);
    const assessments = doAssessments(data.assessments, colourPack);

    const html = renderHeader(data2) + renderStickyNav(studyLevel) + renderSectionStart() + renderDisclaimer() + renderContentAims(data2) + renderTeachingAssessment(deliveries, assessments, colourPack) + renderAwards(data2) + renderStudyRequirements(data2) + renderFurtherDetails(data2) + renderSectionEnd();
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
      console.log(error.message);
    }
  }

  /*
        On Load
    */

  const params = new URLSearchParams(document.location.search);
  const fetchUrl = url + [params.get("code"), params.get("session"), params.get("semester")].join("/");

  getData(fetchUrl, colours);
})();
