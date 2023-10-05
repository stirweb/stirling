!function(){function o(){const t=new IntersectionObserver(function(e,t){e.forEach(e=>{var t,r,a,i;e.isIntersecting?(t=Number(e.target.dataset.value),r=e.target.dataset.unit,a=Number(e.target.dataset.max),i=e.target.dataset.colour||"energy-turq",a=t/a*100,i=stir.createDOMFragment(`<div class="barchart-value u-bg-${i} u-absolute" style="right:${100-a}%"></div>
                                                <div class="barchart-text u-relative u-white u-font-bold text-md u-z-50" style="left:${a/2-2}%">${t}${r}</div>`),e.target.append(i)):e.target.innerHTML=""})},{root:null,threshold:.5});stir.nodes(".barchart").forEach(e=>{t.observe(e)})}const c=(e,t)=>{return`<div class="cell medium-9 bg-grey u-bleed u-p-2 ">
              ${t.disclaimer||""}
          </div>
          <div class="cell medium-3 align-middle align-center u-flex">
            ${t=e,e=new URLSearchParams(document.location.search),e.get("course")?`<a href="https://www.stir.ac.uk/courses/${t}/${e.get("course")}/#panel_1_3" id="backtocourseBtn" class="text-md u-font-bold u-bg-heritage-green u-p-1 u-m-0 heritage-green button--back u-border-hover-none u-white">
      Back to course</a>`:""}
          </div>
          `},g=({moduleTitle:e,moduleCode:t,moduleLevel:r,moduleCredits:a})=>`<div class="grid-container">
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
                                        <span><strong>SCQF level:</strong><br>${r}</span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48"><t4 type="media" id="173867" formatter="inline/*"/></span>
                                        <span><strong>SCQF credits:</strong><br>${a}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,h=({moduleOverview:e,learningOutcomes:t,colourPack:r,boilerplates:a})=>`<div class="cell u-p-2">
                <h2 id="contentandaims" >Content and aims</h2>
                <h3 class="header-stripped u-bg-${r.first}--10 u-${r.first}-line-left u-p-1  u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${e}

                <h3 class="header-stripped u-bg-${r.first}--10 u-${r.first}-line-left u-p-1 u-border-width-5 u-text-regular u-mt-2">
                    Learning outcomes
                </h3>
                <p><strong>${a.outcomesIntro}</strong></p>
                <ul>${t.map(e=>`<li>${e}</li>`).join("")}</ul>
            </div>`,p=({moduleCredits:e,ectsModuleCredits:t,colourPack:r},a)=>`<div class="cell u-mt-2">
                <h2 id="awards">Awards</h2>
                <h3 class="header-stripped u-bg-${r.third}--10 u-p-1 u-${r.third}-line-left u-border-width-5 u-text-regular">Credits</h3>
                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173616" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${e} SCQF (Scottish Credit and Qualifications Framework) credits</p>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173615" formatter="path/*"/>" width="65" height="44" alt="EU flag" /> 
                    This equates to ${t} ECTS (The European Credit Transfer and Accumulation System) credits</p>

                <div class="u-mb-2 u-bg-${r.third}--10 flex-container align-stretch ">
                    <span class="u-bg-${r.third} u-white flex-container align-middle u-width-64 u-px-1 ">
                      <t4 type="media" id="173864" formatter="inline/*"/> 
                    </span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> 
                        <a href="${a.awardsCTA}" class="u-${r.third}">Assessment and award of credit for undergraduates</a></p>
                </div>
            </div>`,m=(e,t)=>`<div class="cell u-mt-2">
                <h2 id="further">Further details</h2>
                ${e.preparedotherinformation?`<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3><p>${e.preparedotherinformation}</p>`:""}
                <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
                ${"Yes"===e.studyAbroad?t.studyAbroad:"<p>Not available</p>"}
                <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular u-mt-2">Additional costs</h3>
                <p>${e.additionalCosts}</p>
            </div>`,i=(stir.curry((e,t,{type:r,hours:a,typekey:i})=>{return"total"===i?`<div class="u-bg-${e.second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container u-mb-2">
                <strong class="u-flex1">Total workload</strong>
                <strong>${a} hours</strong>
            </div>`:`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${r}</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${a}" data-max="${t}" data-unit="" data-colour="${e.second}"></div>
        </div>`}),stir.curry((e,{label:t,category:r,percent:a})=>"0"===a?"":`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${t} (${r})</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${a}" data-max="100" data-unit="%" data-colour="${e.second}"></div>
        </div>`)),a=stir.curry((e,t,{tab:r,tabAssessments:a})=>{e=i(e);return(1<t?`<h4>${r}</h4>`:"")+`<p>${a.map(e).join("")}</p>`}),s=stir.curry((e,t)=>t?`<div class="cell large-${e} u-mb-1">${t}</div>`:""),v=(e,t,r,a)=>{var i=e.length?(i="12",(e=e)?`<div class="cell large-${i} u-mb-1">${e}</div>`:""):a.deliveriesFallback,e=t.length<2?"12":"6",e=s(e),t=t.length?t.map(e).join(""):a.assessmentFallback;return`<div class="cell">
              <h2 id="teaching" >Teaching and assessment</h2>
              ${a.teachingIntro}
              
              <h3 class="header-stripped u-bg-${r.second}--10 u-p-1 u-${r.second}-line-left u-border-width-5 u-text-regular u-mt-2">Engagement overview</h3>
              ${i}

              <h3 class="header-stripped u-bg-${r.second}--10 u-p-1 u-${r.second}-line-left u-border-width-5 u-text-regular u-m-0 u-mt-3 u-mb-1">Assessment overview</h3>
              <div class="grid-x grid-padding-x ">
                  ${t}
              </div>
              ${a.teachingTimetableInfo}
        </div>`},b=()=>'<div class="grid-container"><div class="grid-x grid-padding-x">',f=()=>"</div></div>",$=()=>b()+'<div class="cell u-padding-y"><h1>Page not found</h1></div>'+f(),w=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),x=e=>e&&e.toLowerCase().includes("p")?"pg":"ug",y=(t,e)=>(e.filter(e=>e.level===t).length?e.filter(e=>e.level===t):e)[0];const d=e=>{return{sum:e.tabAssessments.map(e=>Number(e.percent)).reduce((e,t)=>e+t,0),assessment:e}},k=(e,t)=>{e=e.map(d);const r=a(t,e.length);return e.map(e=>100!==e.sum?"":r(e.assessment))};var e=stir.moduleTexts||{},t=new URLSearchParams(document.location.search);!async function(e,t,r){var a,i,s,d,l,n,e=await fetch(e);try{var u=await e.json();a=u,i=t,s=r,(n=stir.node("#content")).classList.add("u-padding-bottom"),a.error?w(n,$()):(l=x(a.moduleLevelDescription),i=y(l,i),d={...a,colourPack:i,boilerplates:s},a=k(a.assessments,i),l=g(d)+b()+c(l,s)+h(d)+v("",a,i,s)+p(d,s)+m(d,s)+f(),w(n,l)),o()}catch(e){w(contentArea,$())}}("https://www.stir.ac.uk/data/courses/akari/module/index.php?module="+[t.get("code"),t.get("session"),t.get("semester")].join("/"),[{level:"ug",first:"heritage-green",second:"energy-turq",third:"energy-purple"},{level:"pg",first:"heritage-purple",second:"heritage-purple",third:"heritage-green"}],e)}();