(function () {
  /*
       
    EVENT LISTENERS AND ACTIONS

  */
  function addEventListeners() {
    //const openCloseSelector = ".c-open-close";
    const openCloseBtns = document.querySelectorAll(".c-open-close");
    const stickyNav = document.querySelector(".c-sticky-nav");
    const stickyNavBtn = document.querySelector("#c-sticky-nav-btn");

    stickyNavBtn &&
      stickyNavBtn.addEventListener("click", (event) => {
        stickyNav.classList.toggle("hide-for-small-only");
        stickyNav.classList.toggle("hide-for-medium-only");
      });

    openCloseBtns.forEach((el) => {
      el.addEventListener("click", (event) => {
        const btn = event.target.closest(".c-open-close");
        const openCloseIcons = btn.querySelectorAll(".c-open-close-icon");

        openCloseIcons.forEach((item) => item.classList.toggle("hide"));
      });
    });

    // define observer instances
    const observer = new IntersectionObserver(onIntersection, {
      root: null,
      threshold: 0.5,
    });

    const observer2 = new IntersectionObserver(onIntersection2, {
      root: null,
      threshold: 0.5,
    });

    /*
        SECTION SCROLL TRIGGER
    */
    function onIntersection(entries, opts) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const value = Number(entry.target.dataset.value);
          const unit = entry.target.dataset.unit;
          const max = Number(entry.target.dataset.max);

          const perc = (value / max) * 100;

          const valueInverted = 100 - perc;
          const textPosition = perc / 2 - 2;

          const el = document.createElement("div");
          el.classList.add("barchart-value");
          el.style.right = valueInverted + "%";

          entry.target.innerHTML = `<div class="barchart-text" style="left:${textPosition}%">${value}${unit}</div>`;
          entry.target.appendChild(el);
        } else {
          entry.target.innerHTML = ``;
        }
      });
    }

    /*
        BARCHART ANIMATION TRIGGER
    */
    function onIntersection2(entries, opts) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentSection = entry.target.innerText;
          const navItems = document.querySelectorAll("[data-anchornav]");
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

    const h2s = document.querySelectorAll("main h2");
    h2s.forEach((el) => {
      observer2.observe(el);
    });

    const els = document.querySelectorAll(".barchart");
    els.forEach((el) => {
      observer.observe(el);
    });
  }

  /* 
  
  GET THE DATA CONTENT AND POPULATE THE PAGE
  
  */
  const url = "https://www.stir.ac.uk/data/courses/akari/module/index.php?module=";

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /* 

        RENDERERS

    */

  const renderStickyNav = () => {
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
                                    <a href="#content" class="text-md u-font-bold u-p-1 u-m-0 current" data-anchornav>Content
                                        and aims</a>
                                    <a href="#teaching" class="text-md u-font-bold u-p-1 u-m-0 " data-anchornav>Teaching and
                                        assessment</a>
                                    <a href="#awards" class="text-md u-font-bold u-p-1 u-m-0 " data-anchornav>Awards</a>
                                    <a href="#requirements" class="text-md u-font-bold u-p-1 u-m-0 " data-anchornav>Study
                                        requirements</a>
                                    <a href="#further" class="text-md u-font-bold u-p-1 u-m-0 u-border-hover-none "
                                        data-anchornav>Further details</a>
                                    <a href="#"
                                        class="text-md u-font-bold u-bg-heritage-green u-p-1 u-m-0 heritage-green button--back u-border-hover-none ">Back
                                        to course</a>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" id="uos-icon-share" class="svg-icon" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z">
                                                </path>
                                            </svg>
                                        </span>
                                        <span>

                                            <strong>Module code:</strong><br>${modulecode}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" id="uos-icon-share" class="svg-icon" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z">
                                                </path>
                                            </svg>
                                        </span>
                                        <span>
                                            <strong>Delivery mode:</strong><br>${locationStudyMethods.join("<br/>")}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" id="uos-icon-share" class="svg-icon" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z">
                                                </path>
                                            </svg>
                                        </span>
                                        <span>
                                            <strong>SCQF level:</strong><br>${modulelevel}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" class="svg-icon">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z">
                                                </path>
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
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

  const renderDeliverables = stir.curry((total, { label, hours, typekey }) => {
    return typekey === "total"
      ? renderDeliverablesTotal(hours)
      : `
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${label}</span>
            <div class="barchart" data-value="${hours}" data-max="${total}" data-unit=""></div>
        </div>`;
  });

  const renderDeliverablesTotal = (hours) => {
    return `<div class="u-bg-energy-teal--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container ">
                <strong class="u-flex1">Total workload</strong>
                <strong>${hours} hours</strong>
            </div>`;
  };

  const renderAssessments = ({ label, category, percent }) => {
    return percent === "0"
      ? ``
      : `
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${label} (${category})</span>
            <div class="barchart" data-value="${percent}" data-max="100" data-unit="%"></div>
        </div>`;
  };

  const renderTeachingAssessment = (deliveries, assessments) => {
    return `<div class="cell u-mt-2">
                    <h2 id="teaching">Teaching and assessment</h2>

                    <p>Here's an overview of the learning, teaching and assessment methods, and the recommended time you
                        should dedicate to the study of this module. Most modules include a combination of activity
                        (e.g. lectures), assessments and self-study.</p>

                    <div class="grid-x grid-padding-x u-my-2">
                        <div class="cell large-6">
                            <h3 class="header-stripped u-bg-energy-teal--10 u-p-1 u-energy-turq-line-left u-border-width-5 u-text-regular">Engagement overview</h3>
                            ${deliveries}
                        </div>
                        
                        <div class="cell large-6">
                            <h3 class="header-stripped u-bg-energy-teal--10 u-p-1 u-energy-turq-line-left u-border-width-5 u-text-regular">Assessment overview</h3>
                            ${assessments}
                        </div>
                    </div>

                    <p>Are you an incoming Stirling student? You'll typically receive timetables for module-level
                        lectures one month prior
                        - and select seminars two weeks prior - to the start of your first semester. Help with module
                        registration can be provided by Student Services. More information can be found on our Welcome
                        site</p>

            </div>`;
  };

  const renderContentAims = ({ moduleOverview, ...data }) => {
    return `<div class="cell u-p-2">
                <h2 id="content">Content and aims</h2>

                <h3 class="header-stripped u-bg-mint u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${moduleOverview}

                <h3 class="header-stripped u-bg-mint u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">
                    Learning outcomes
                </h3>

                <p><strong>After successful completion of this module, you'll be able to:</strong></p>
                
                <ul>
                    ${data["learningOutcomes "].map((item) => `<li>${item}</li>`).join("")} 
                </ul>
            </div>`;
  };

  const renderAwards = ({ modulecredits, ectsmodulecredits, professionalAccreditation }) => {
    return `<div class="cell u-mt-2">
                <h2 id="awards">Awards</h2>

                <h3 class="header-stripped u-bg-heritage-purple--5 u-p-1 u-heritage-purple-line-left u-border-width-5 u-text-regular">Credits</h3>

                <p class="flex-container u-gap align-middle"><img src="scotland-flag.png" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${modulecredits} SCQF (Scottish Credit and Qualifications Framework) credits</p>

                <p class="flex-container u-gap align-middle"><img src="EU-flag.png" width="65" height="44" alt="Scotland flag" /> 
                    This equates to ${ectsmodulecredits} ECTS (The European Credit Transfer and Accumulation System) credits</p>

                <div class="u-mb-2 u-bg-heritage-purple--5 flex-container align-stretch ">
                    <span class="u-bg-heritage-purple u-white flex-container align-middle u-width-64 u-px-1 ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="svg-icon">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z">
                            </path>
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg></span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> 
                        <a href="#" class="u-heritage-purple">Assessment and award of credit for undergraduates</a></p>
                </div>

                <h3 class="header-stripped u-bg-heritage-purple--5 u-p-1 u-heritage-purple-line-left u-border-width-5 u-text-regular">Professional accreditation</h3>
                <p>${professionalAccreditation}</p>
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
    return `<h3 class="header-stripped u-bg-mint u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3>
            <p>${preparedotherinformation}</p>`;
  };

  const renderFurtherDetails = (data) => {
    return `<div class="cell u-mt-2">
                    <h2 id="further">Further details</h2>
                    
                    ${data.preparedotherinformation ? renderSupportingInfo(data.preparedotherinformation) : ``}
                   
                    <h3 class="header-stripped u-bg-mint u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
                    ${data["studyAbroad "] === "Yes" ? renderStudyAbroad() : `<p>Not available</p>`}
                    
                    <h3 class="header-stripped u-bg-mint u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Additional costs</h3>
                    <p>${data["additionalCosts "]}</p>
                </div>`;
  };

  const renderIntro = () => {
    return `<div class="cell bg-grey u-bleed u-p-2"><p class="u-m-0">We aim to present detailed, up-to-date module information - in fact, we're providing more 
            information than ever. However, modules and courses are constantly being enhanced to boost your learning experience, and are therefore subject 
            to change. <a href="#">See terms and conditions</a>.</p></div>`;
  };

  const renderSectionStart = () => `<div class="grid-container"><div class="grid-x grid-padding-x">`;
  const renderSectionEnd = () => `</div></div>`;

  const renderError = () => renderSectionStart() + `<div class="cell u-padding-y"><h1>Page not found</h1></div>` + renderSectionEnd();

  /*
        Controllers
    */

  const doDeliveries = (deliveries) => {
    const deliveriesTotalItem = deliveries.filter((item) => item.typekey === "total");
    const deliveriesTotalValue = deliveriesTotalItem.length ? deliveriesTotalItem[0].hours : null;
    const renderDeliverablesCurry = renderDeliverables(deliveriesTotalValue);

    return deliveries.map(renderDeliverablesCurry).join(``);
  };

  const main = (data) => {
    const contentArea = stir.node("#content");

    if (data.error) return setDOMContent(contentArea, renderError());

    const deliveries = doDeliveries(data.deliveries);
    const assessments = data.assessments.map(renderAssessments).join(``);

    const html = renderHeader(data) + renderStickyNav() + renderSectionStart() + renderIntro() + renderContentAims(data) + renderTeachingAssessment(deliveries, assessments) + renderAwards(data) + renderStudyRequirements(data) + renderFurtherDetails(data) + renderSectionEnd();

    return setDOMContent(contentArea, html);
  };

  /*
        Init: Get the data and proceed
  */
  async function getData(fetchUrl) {
    const response = await fetch(fetchUrl);

    try {
      const data = await response.json();
      main(data);
      addEventListeners();
    } catch (error) {
      console.log(error.message);
    }
  }

  /*
        On Load
    */

  const queryparams = new URLSearchParams(document.location.search);
  const fetchUrl = url + [queryparams.get("code"), queryparams.get("session"), queryparams.get("semester")].join("/");

  console.log(fetchUrl);
  getData(fetchUrl);
})();
