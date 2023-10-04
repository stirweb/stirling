!function(){function l(){const t=new IntersectionObserver(function(e,t){e.forEach(e=>{var t,r,a,i;e.isIntersecting?(t=Number(e.target.dataset.value),r=e.target.dataset.unit,a=Number(e.target.dataset.max),i=e.target.dataset.colour||"energy-turq",a=t/a*100,i=stir.createDOMFragment(`<div class="barchart-value u-bg-${i} u-absolute" style="right:${100-a}%"></div>
                                                <div class="barchart-text u-relative u-white u-font-bold text-md u-z-50" style="left:${a/2-2}%">${t}${r}</div>`),e.target.append(i)):e.target.innerHTML=""})},{root:null,threshold:.5});stir.nodes(".barchart").forEach(e=>{t.observe(e)})}const o=e=>{return`<div class="cell medium-9 bg-grey u-bleed u-p-2 ">
              <p class="u-m-0 text-md">We aim to present detailed, up-to-date module information - in fact, we're providing more 
              information than ever. However, modules and courses are constantly being enhanced to boost your learning experience, and are therefore subject 
              to change. <a href="#">See terms and conditions</a>.</p>
          </div>
          <div class="cell medium-3 align-middle align-center u-flex">
            ${e=e,t=new URLSearchParams(document.location.search),t.get("course")?`<a href="https://www.stir.ac.uk/courses/${e}/${t.get("course")}/#panel_1_3" id="backtocourseBtn" class="text-md u-font-bold u-bg-heritage-green u-p-1 u-m-0 heritage-green button--back u-border-hover-none u-white">
      Back to course</a>`:""}
          </div>
          `;var t},u=({moduleTitle:e,moduleCode:t,locationStudyMethods:r,moduleLevel:a,moduleCredits:i})=>`<div class="grid-container">
                    <div class="grid-x grid-padding-x u-my-2 align-middle">

                        <div class="cell large-6  c-course-title u-padding-y">
                            <h1 class="u-header-smaller ">${e}</h1>
                        </div>

                        <div class="cell large-6">
                            <div class="u-border u-border-width-5 flex-container  u-px-3 u-py-2">
                                <div class="grid-x grid-padding-x ">
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48">
                                          <t4 type="media" id="173865" formatter="inline/*"/>
                                        </span>
                                        <span>

                                            <strong>Module code:</strong><br>${t}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48">
                                        <t4 type="media" id="173868" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>Delivery mode:</strong><br>${r.filter(e=>""!==e.trim()).join("<br/>")}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48">
                                        <t4 type="media" id="173866" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>SCQF level:</strong><br>${a}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48">
                                        <t4 type="media" id="173867" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>SCQF credits:</strong><br>${i}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,c=({moduleOverview:e,learningOutcomes:t,colourPack:r})=>`<div class="cell u-p-2">
                <h2 id="contentandaims" >Content and aims</h2>

                <h3 class="header-stripped u-bg-${r.first}--10 u-${r.first}-line-left u-p-1  u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${e}

                <h3 class="header-stripped u-bg-${r.first}--10 u-${r.first}-line-left u-p-1 u-border-width-5 u-text-regular">
                    Learning outcomes
                </h3>

                <p><strong>After successful completion of this module, you'll be able to:</strong></p>
                
                <ul>
                    ${t.map(e=>`<li>${e}</li>`).join("")} 
                </ul>
            </div>`,g=({moduleCredits:e,ectsModuleCredits:t,professionalAccreditation:r,colourPack:a})=>{return`<div class="cell u-mt-2">
                <h2 id="awards" >Awards</h2>

                <h3 class="header-stripped u-bg-${a.third}--10 u-p-1 u-${a.third}-line-left u-border-width-5 u-text-regular">Credits</h3>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173616" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${e} SCQF (Scottish Credit and Qualifications Framework) credits</p>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173615" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" /> 
                    This equates to ${t} ECTS (The European Credit Transfer and Accumulation System) credits</p>

                <div class="u-mb-2 u-bg-${a.third}--10 flex-container align-stretch ">
                    <span class="u-bg-${a.third} u-white flex-container align-middle u-width-64 u-px-1 ">
                      <t4 type="media" id="173864" formatter="inline/*"/> 
                    </span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> 
                        <a href="#" class="u-${a.third}">Assessment and award of credit for undergraduates</a></p>
                </div>

                ${e=r,t=a.third,e?`<h3 class="header-stripped u-bg-${t}--10 u-p-1 u-${t}-line-left u-border-width-5 u-text-regular">Professional accreditation</h3><p>${e}</p>`:""}
            </div>`};const h=e=>`<div class="cell u-mt-2">
                <h2 id="further">Further details</h2>
                ${e.preparedotherinformation?`<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3><p>${e.preparedotherinformation}</p>`:""}
                <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
                ${"Yes"===e.studyAbroad?'<p>This module is available to suitably-qualified students studying elsewhere in the world who wish to join Stirling for a semester or academic year. <a href="">Learn more</a></p>':"<p>Not available</p>"}
                <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Additional costs</h3>
                <p>${e.additionalCosts}</p>
            </div>`,a=(stir.curry((e,t,{type:r,hours:a,typekey:i})=>{return"total"===i?`<div class="u-bg-${e.second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container u-mb-2">
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
        </div>`)),i=stir.curry((e,{tab:t,tabAssessments:r})=>{e=a(e);return`<h4>${t}</h4><p>${r.map(e).join("")}</p>`}),s=stir.curry((e,t)=>t?`<div class="cell large-${e} u-mb-1">${t}</div>`:""),p=(e,t,r)=>{var a=e.length?(a="12",(e=e)?`<div class="cell large-${a} u-mb-1">${e}</div>`:""):`<p class="u-m-0">Engagement and teaching information isn't currently available, but it will be made clear to you when you make your module selections.</p>`,e=t.length<2?"12":"6",e=s(e),t=t.length?t.map(e).join(""):"Assessment information isn't currently available, but it will be made clear to you when you make your module selections.";return`<div class="cell">
              <h2 id="teaching" >Teaching and assessment</h2>

              <p>Here's an overview of the learning, teaching and assessment methods, and the recommended time you
                  should dedicate to the study of this module. Most modules include a combination of activity
                  (e.g. lectures), assessments and self-study.</p>
              
              <h3 class="header-stripped u-bg-${r.second}--10 u-p-1 u-${r.second}-line-left u-border-width-5 u-text-regular u-mt-2">Engagement overview</h3>
              ${a}

              <h3 class="header-stripped u-bg-${r.second}--10 u-p-1 u-${r.second}-line-left u-border-width-5 u-text-regular u-m-0 u-mt-3 u-mb-1">Assessment overview</h3>
              <div class="grid-x grid-padding-x ">
                  ${t}
              </div>

              <p>Are you an incoming Stirling student? You'll typically receive timetables for module-level
                  lectures one month prior
                  - and select seminars two weeks prior - to the start of your first semester. Help with module
                  registration can be provided by Student Services. More information can be found on our Welcome
                  site</p>
        </div>`},m=()=>'<div class="grid-container"><div class="grid-x grid-padding-x">',v=()=>"</div></div>",b=()=>m()+'<div class="cell u-padding-y"><h1>Page not found</h1></div>'+v(),f=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),y=e=>e&&e.toLowerCase().includes("p")?"pg":"ug",w=(t,e)=>(e.filter(e=>e.level===t).length?e.filter(e=>e.level===t):e)[0];const n=e=>{return{sum:e.tabAssessments.map(e=>Number(e.percent)).reduce((e,t)=>e+t,0),assessment:e}},$=(e,t)=>{const r=i(t);return e.map(n).map(e=>100!==e.sum?"":r(e.assessment))};var e=new URLSearchParams(document.location.search);!async function(e,t){var r,a,i,s,n,e=await fetch(e);try{var d=await e.json();r=d,a=t,n=stir.node("#content"),r.error?f(n,b()):(s=y(r.moduleLevelDescription),a=w(s,a),i={...r,colourPack:a},r=$(r.assessments,a),s=u(i)+m()+o(s)+c(i)+p("",r,a)+g(i)+h(i)+v(),f(n,s)),l()}catch(e){f(contentArea,b())}}("https://www.stir.ac.uk/data/courses/akari/module/index.php?module="+[e.get("code"),e.get("session"),e.get("semester")].join("/"),[{level:"ug",first:"heritage-green",second:"energy-turq",third:"energy-purple"},{level:"pg",first:"heritage-purple",second:"heritage-purple",third:"heritage-green"}])}();