!function(){function d(){const t=new IntersectionObserver(function(e,t){e.forEach(e=>{var t,a,r,s;e.isIntersecting?(t=Number(e.target.dataset.value),a=e.target.dataset.unit,r=Number(e.target.dataset.max),s=e.target.dataset.colour||"energy-turq",r=t/r*100,s=stir.createDOMFragment(`<div class="barchart-value u-bg-${s} u-absolute" style="right:${100-r}%"></div>
                                                <div class="barchart-text u-relative u-white u-font-bold text-md u-z-50" style="left:${r/2-2}%">${t}${a}</div>`),e.target.append(s)):e.target.innerHTML=""})},{root:null,threshold:.5});stir.nodes(".barchart").forEach(e=>{t.observe(e)})}const l=(e,t)=>{return`<div class="cell medium-9 bg-grey u-bleed u-p-2 ">
              ${t.disclaimer||""}
          </div>
          <div class="cell medium-3 align-middle align-center u-flex">
            ${t=e,e=new URLSearchParams(document.location.search),e.get("course")?`<a href="${stir.isNumeric(e.get("course"))?"/terminalfour/preview/1/en/"+e.get("course"):`/courses/${t}/`+e.get("course")}#panel_1_3" id="backtocourseBtn" class="button u-m-0 heritage-green button--back ">Back to course</a>`:""}
          </div>
          `},n=({moduleTitle:e,moduleCode:t,moduleLevel:a,moduleCredits:r})=>`<div class="grid-container">
                    <div class="grid-x grid-padding-x u-my-2 align-middle">
                        <div class="cell large-6  c-course-title u-padding-y">
                            <h1 class="u-header-smaller ">${e}</h1>
                        </div>
                        <div class="cell large-6">
                            <div class="u-border u-border-width-5 flex-container  u-px-3 u-py-2">
                                <div class="grid-x grid-padding-x ">
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48"><t4 type="media" id="173865" formatter="inline/*"/></span>
                                        <span><strong>Module code:</strong><br>${t}</span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48"><t4 type="media" id="173866" formatter="inline/*"/></span>
                                        <span><strong>SCQF level:</strong><br>${a}</span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48"><t4 type="media" id="173867" formatter="inline/*"/></span>
                                        <span><strong>SCQF credits:</strong><br>${r}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,u=({moduleOverview:e,learningOutcomes:t,colourPack:a,boilerplates:r})=>`<div class="cell u-p-2">
                <h2 id="contentandaims" >Content and aims</h2>
                <h3 class="header-stripped u-bg-${a.first}--10 u-${a.first}-line-left u-p-1  u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${e}

                <h3 class="header-stripped u-bg-${a.first}--10 u-${a.first}-line-left u-p-1 u-border-width-5 u-text-regular u-mt-2">
                    Learning outcomes
                </h3>
                <p><strong>${r.outcomesIntro}</strong></p>
                <ul>${t.map(e=>`<li>${e}</li>`).join("")}</ul>
            </div>`,o=({moduleCredits:e,ectsModuleCredits:t,colourPack:a},r,s)=>`<div class="cell u-mt-2">
                <h2 id="awards">Awards</h2>
                <h3 class="header-stripped u-bg-${a.third}--10 u-p-1 u-${a.third}-line-left u-border-width-5 u-text-regular">Credits</h3>
                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173616" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${e} SCQF (Scottish Credit and Qualifications Framework) credits.</p>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173615" formatter="path/*"/>" width="65" height="44" alt="EU flag" /> 
                    This equates to ${t} ECTS (The European Credit Transfer and Accumulation System) credits.</p>

                <div class="u-mb-2 u-bg-${a.third}--10 flex-container align-stretch ">
                    <span class="u-bg-${a.third} u-white flex-container align-middle u-width-64 u-px-1 ">
                      <t4 type="media" id="173864" formatter="inline/*"/> 
                    </span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> 
                        <a href="${"ug"===s?r.awardsCtaUG:r.awardsCtaPG}" class="u-${a.third}">Assessment and award of credit for ${"ug"===s?"undergraduates":"postgraduates"}</a></p>
                </div>
            </div>`,c=({preparedotherinformation:e,studyAbroad:t,additionalCosts:a},r)=>{return e||"Yes"===t||a?`<div class="cell u-mt-2">
                <h2 id="further">Further details</h2>
                ${e?`<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3><p>${e}</p>`:""}
                ${"Yes"===t?'<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>'+r.studyAbroad:""}
                ${e=a,e?`<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular u-mt-2">Additional costs</h3>
          <p>${e}</p>`:""}
        </div>`:""};stir.curry((e,t,{type:a,hours:r,typekey:s})=>{return"total"===s?`<div class="u-bg-${e.second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container u-mb-2">
                <strong class="u-flex1">Total workload</strong>
                <strong>${r} hours</strong>
            </div>`:`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${a}</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${r}" data-max="${t}" data-unit="" data-colour="${e.second}"></div>
        </div>`});const r=stir.curry((e,{name:t,value:a})=>0===Number(a)?"":`<div>
          <span class="u-inline-block u-p-tiny u-px-1">${t}</span>
          <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${a}" data-max="100" data-unit="%" data-colour="${e.second}"></div>
        </div>`),s=stir.curry((e,t,a)=>{e=r(e);return(1<t?`<h4 class="u-mt-0">${a.tab}</h4>`:"")+`<p>${a.summary.map(e).join("")}</p>`}),i=stir.curry((e,t)=>t?`<div class="cell large-${e} u-mb-1">${t}</div>`:""),g=(e,t,a,r)=>{var s=e.length?(s="12",(e=e)?`<div class="cell large-${s} u-mb-1">${e}</div>`:""):r.deliveriesFallback,e=t.length<2?"12":"6",e=i(e),e=t.length?t.map(e).join(""):`<div class="cell">${r.assessmentFallback}</div>`;return`<div class="cell">
              <h2 id="teaching" >Teaching and assessment</h2>
              ${r.teachingIntro}
              
              <h3 class="header-stripped u-bg-${a.second}--10 u-p-1 u-${a.second}-line-left u-border-width-5 u-text-regular u-mt-2">Engagement overview</h3>
              ${s}

              <h3 class="header-stripped u-bg-${a.second}--10 u-p-1 u-${a.second}-line-left u-border-width-5 u-text-regular u-mt-3 ">Assessment overview</h3>
              ${1<t.length?r.multipleAssessments:""}
              
              <div class="grid-x grid-padding-x ">
                  ${e}
              </div>
              ${r.teachingTimetableInfo}
          </div>`},m=()=>'<div class="grid-container"><div class="grid-x grid-padding-x">',p=()=>"</div></div>",h=()=>m()+'<div class="cell u-padding-y"><h1>Page not found</h1></div>'+p(),v=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),b=e=>e&&e.toLowerCase().includes("p")?"pg":"ug",f=(t,e)=>(e.filter(e=>e.level===t).length?e.filter(e=>e.level===t):e)[0],$=e=>{return"International"===e.tab?{sum:0,summary:[{name:"Coursework",value:0},{name:"Examination",value:0}],tab:e.tab,tabAssessments:e.tabAssessments}:{sum:e.tabAssessments.map(e=>Number(e.percent)).reduce((e,t)=>e+t,0),summary:[{name:"Coursework",value:e.tabAssessments.map(e=>"Coursework"===e.category?Number(e.percent):0).reduce((e,t)=>e+t,0)},{name:"Examination",value:e.tabAssessments.map(e=>"Examination"===e.category?Number(e.percent):0).reduce((e,t)=>e+t,0)}],tab:e.tab,tabAssessments:e.tabAssessments}},w=(e,t)=>{console.log(e);e=e.map($).filter(e=>100===e.sum);const a=s(t,e.length);return e.map(e=>a(e))};var e=stir.moduleTexts||{},t=new URLSearchParams(document.location.search);!async function(e,t,a){var r,s,i;e=e=await(await fetch(e)).json(),t=t,a=a,(i=stir.node("#content")).classList.add("u-padding-bottom"),e.error?v(i,h()):(r=b(e.moduleLevelDescription),t=f(r,t),s={...e,colourPack:t,boilerplates:a},e=e.assessments||[],e=w(e,t),e=n(s)+m()+l(r,a)+u(s)+g("",e,t,a)+o(s,a,r)+c(s,a)+p(),v(i,e)),d()}("https://www.stir.ac.uk/data/pd-api/?module="+[t.get("code"),t.get("session"),t.get("semester")].join("/"),[{level:"ug",first:"heritage-green",second:"energy-turq",third:"energy-purple"},{level:"pg",first:"heritage-purple",second:"heritage-purple",third:"heritage-green"}],e)}();