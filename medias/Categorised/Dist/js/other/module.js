!function(){function c(){const t=new IntersectionObserver(function(e,t){e.forEach(e=>{var t,r,a,s;e.isIntersecting?(t=Number(e.target.dataset.value),r=e.target.dataset.unit,a=Number(e.target.dataset.max),s=e.target.dataset.colour||"energy-turq",a=t/a*100,s=stir.createDOMFragment(`<div class="barchart-value u-bg-${s} u-absolute" style="right:${100-a}%"></div>
                                                <div class="barchart-text u-relative u-white u-font-bold text-md u-z-50" style="left:${a/2-2}%">${t}${r}</div>`),e.target.append(s)):e.target.innerHTML=""})},{root:null,threshold:.5});stir.nodes(".barchart").forEach(e=>{t.observe(e)})}const g=(e,t)=>{return`<div class="cell medium-9 bg-grey u-bleed u-p-2 ">
              ${t.disclaimer||""}
          </div>
          <div class="cell medium-3 align-middle align-center u-flex">
            ${t=e,e=new URLSearchParams(document.location.search),e.get("course")?`<a href="${stir.isNumeric(e.get("course"))?"/terminalfour/preview/1/en/"+e.get("course"):`/courses/${t}/`+e.get("course")}#panel_1_3" id="backtocourseBtn" class="button u-m-0 heritage-green button--back ">Back to course</a>`:""}
          </div>
          `},p=({moduleTitle:e,moduleCode:t,moduleLevel:r,moduleCredits:a})=>`<div class="grid-container">
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
            </div>`,m=({moduleCredits:e,ectsModuleCredits:t,colourPack:r},a,s)=>`<div class="cell u-mt-2">
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
                        <a href="${"ug"===s?a.awardsCtaUG:a.awardsCtaPG}" class="u-${r.third}">Assessment and award of credit for ${"ug"===s?"undergraduates":"postgraduates"}</a></p>
                </div>
            </div>`,v=(e,t)=>{return`<div class="cell u-mt-2">
                <h2 id="further">Further details</h2>
                ${e.preparedotherinformation?`<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3><p>${e.preparedotherinformation}</p>`:""}
                ${"Yes"===e.studyAbroad?'<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>'+t.studyAbroad:""}
                ${t=e.additionalCosts,t?`
      <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular u-mt-2">Additional costs</h3>
      <p>${t}</p>`:""}
            </div>`};stir.curry((e,t,{type:r,hours:a,typekey:s})=>{return"total"===s?`<div class="u-bg-${e.second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container u-mb-2">
                <strong class="u-flex1">Total workload</strong>
                <strong>${a} hours</strong>
            </div>`:`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${r}</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${a}" data-max="${t}" data-unit="" data-colour="${e.second}"></div>
        </div>`});const s=stir.curry((e,{label:t,category:r,percent:a})=>"0"===a?"":`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${t} (${r})</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${a}" data-max="100" data-unit="%" data-colour="${e.second}"></div>
        </div>`),a=stir.curry((e,t,{tab:r,tabAssessments:a})=>{e=s(e);return(1<t?`<h4 class="u-mt-0">${r}</h4>`:"")+`<p>${a.map(e).join("")}</p>`}),i=stir.curry((e,t)=>t?`<div class="cell large-${e} u-mb-1">${t}</div>`:""),b=(e,t,r,a)=>{var s=e.length?(s="12",(e=e)?`<div class="cell large-${s} u-mb-1">${e}</div>`:""):a.deliveriesFallback,e=t.length<2?"12":"6",e=i(e),e=t.length?t.map(e).join(""):`<div class="cell">${a.assessmentFallback}</div>`;return`<div class="cell">
              <h2 id="teaching" >Teaching and assessment</h2>
              ${a.teachingIntro}
              
              <h3 class="header-stripped u-bg-${r.second}--10 u-p-1 u-${r.second}-line-left u-border-width-5 u-text-regular u-mt-2">Engagement overview</h3>
              ${s}

              <h3 class="header-stripped u-bg-${r.second}--10 u-p-1 u-${r.second}-line-left u-border-width-5 u-text-regular u-mt-3 ">Assessment overview</h3>
              ${1<t.length?a.multipleAssessments:""}
              
              <div class="grid-x grid-padding-x ">
                  ${e}
              </div>
              ${a.teachingTimetableInfo}
        </div>`},$=()=>'<div class="grid-container"><div class="grid-x grid-padding-x">',f=()=>"</div></div>",w=()=>$()+'<div class="cell u-padding-y"><h1>Page not found</h1></div>'+f(),x=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),y=e=>e&&e.toLowerCase().includes("p")?"pg":"ug",k=(t,e)=>(e.filter(e=>e.level===t).length?e.filter(e=>e.level===t):e)[0],d=e=>{return{sum:e.tabAssessments.map(e=>Number(e.percent)).reduce((e,t)=>e+t,0),assessment:e}},C=(e,t)=>{e=e.map(d);const r=a(t,e.length);return e.map(e=>100!==e.sum?"":r(e.assessment))};var e=stir.moduleTexts||{},t=new URLSearchParams(document.location.search);!async function(t,e,r){console.log(t);var a,s,i,d,l,n,u=await fetch(t);try{var o=await u.json();a=o,s=e,i=r,(n=stir.node("#content")).classList.add("u-padding-bottom"),a.error?x(n,w()):(d=y(a.moduleLevelDescription),s=k(d,s),l={...a,colourPack:s,boilerplates:i},a=a.assessments||[],a=C(a,s),a=p(l)+$()+g(d,i)+h(l)+b("",a,s,i)+m(l,i,d)+v(l,i)+f(),x(n,a)),c()}catch(e){x(stir.node("#content"),w()),console.log(e.message),console.log(t)}}("https://www.stir.ac.uk/data/courses/akari/module/index.php?module="+[t.get("code"),t.get("session"),t.get("semester")].join("/"),[{level:"ug",first:"heritage-green",second:"energy-turq",third:"energy-purple"},{level:"pg",first:"heritage-purple",second:"heritage-purple",third:"heritage-green"}],e)}();