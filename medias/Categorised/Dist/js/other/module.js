!function(){function o(){stir.nodes(".c-open-close").forEach(e=>{e.addEventListener("click",e=>{e=e.target.closest(".c-open-close");Array.prototype.slice.call(e.querySelectorAll(".c-open-close-icon")).forEach(e=>e.classList.toggle("hide"))})});const t=document.querySelector(".c-sticky-nav");var e=document.querySelector("#c-sticky-nav-btn");e&&e.addEventListener("click",e=>{t.classList.toggle("hide-for-small-only"),t.classList.toggle("hide-for-medium-only")});const a=new IntersectionObserver(function(e,t){e.forEach(e=>{var t,a,r,s;e.isIntersecting?(t=Number(e.target.dataset.value),a=e.target.dataset.unit,r=Number(e.target.dataset.max),s=e.target.dataset.colour||"energy-turq",r=t/r*100,s=stir.createDOMFragment(`<div class="barchart-value u-bg-${s} u-absolute" style="right:${100-r}%"></div>
                                                <div class="barchart-text u-relative u-white u-font-bold text-md u-z-50" style="left:${r/2-2}%">${t}${a}</div>`),e.target.append(s)):e.target.innerHTML=""})},{root:null,threshold:.5});stir.nodes(".barchart").forEach(e=>{a.observe(e)});const r=new IntersectionObserver(function(e,t){e.forEach(e=>{if(e.isIntersecting){const t=e.target.innerText;stir.nodes("[data-anchornav]").forEach(e=>{e.innerText==t?e.classList.add("current"):e.classList.remove("current")})}})},{root:null,threshold:.5}),s=(stir.nodes("main h2").forEach(e=>{r.observe(e)}),stir.nodes("[data-anchornav]"));s.forEach(e=>{e.addEventListener("click",e=>{t.classList.toggle("hide-for-small-only"),t.classList.toggle("hide-for-medium-only"),setTimeout(()=>{s.forEach(e=>e.classList.remove("current")),e.target.classList.add("current")},500)})})}const d=e=>{return`<div class="u-white--all u-sticky-nav ">
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
                                    ${e=e,t=new URLSearchParams(document.location.search),t.get("course")?`<a href="https://www.stir.ac.uk/courses/${e}/${t.get("course")}/#panel_1_3" id="backtocourseBtn" class="text-md u-font-bold u-bg-heritage-green u-p-1 u-m-0 heritage-green button--back u-border-hover-none ">
      Back to course</a>`:""}
                                </div>

                            </div>
                        </div>
                    </nav>
                </div>`;var t},u=({moduletitle:e,modulecode:t,locationStudyMethods:a,modulelevel:r,modulecredits:s})=>`<div class="grid-container">
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
                                            <strong>Delivery mode:</strong><br>${a.filter(e=>""!==e.trim()).join("<br/>")}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48">
                                        <t4 type="media" id="173866" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>SCQF level:</strong><br>${r}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-48">
                                        <t4 type="media" id="173867" formatter="inline/*"/> 
                                        </span>
                                        <span>
                                            <strong>SCQF credits:</strong><br>${s}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,c=()=>`<div class="cell bg-grey u-bleed u-p-2 ">
              <p class="u-m-0 text-md">We aim to present detailed, up-to-date module information - in fact, we're providing more 
              information than ever. However, modules and courses are constantly being enhanced to boost your learning experience, and are therefore subject 
              to change. <a href="#">See terms and conditions</a>.</p>
          </div>`,h=({moduleOverview:e,learningOutcomes:t,colourPack:a})=>`<div class="cell u-p-2">
                <h2 id="contentandaims" class="u-scroll-offset">Content and aims</h2>

                <h3 class="header-stripped u-bg-${a.first}--10 u-${a.first}-line-left u-p-1  u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${e}

                <h3 class="header-stripped u-bg-${a.first}--10 u-${a.first}-line-left u-p-1 u-border-width-5 u-text-regular">
                    Learning outcomes
                </h3>

                <p><strong>After successful completion of this module, you'll be able to:</strong></p>
                
                <ul>
                    ${t.map(e=>`<li>${e}</li>`).join("")} 
                </ul>
            </div>`,m=({modulecredits:e,ectsmodulecredits:t,professionalAccreditation:a,colourPack:r})=>{return`<div class="cell u-mt-2">
                <h2 id="awards" class="u-scroll-offset">Awards</h2>

                <h3 class="header-stripped u-bg-${r.third}--10 u-p-1 u-${r.third}-line-left u-border-width-5 u-text-regular">Credits</h3>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173616" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${e} SCQF (Scottish Credit and Qualifications Framework) credits</p>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173615" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" /> 
                    This equates to ${t} ECTS (The European Credit Transfer and Accumulation System) credits</p>

                <div class="u-mb-2 u-bg-${r.third}--10 flex-container align-stretch ">
                    <span class="u-bg-${r.third} u-white flex-container align-middle u-width-64 u-px-1 ">
                      <t4 type="media" id="173864" formatter="inline/*"/> 
                    </span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> 
                        <a href="#" class="u-${r.third}">Assessment and award of credit for undergraduates</a></p>
                </div>

                ${e=a,t=r.third,e?`<h3 class="header-stripped u-bg-${t}--10 u-p-1 u-${t}-line-left u-border-width-5 u-text-regular">Professional accreditation</h3><p>${e}</p>`:""}
            </div>`},g=({modulerequisites:e})=>{return`<div class="cell u-mt-2">
                <h2 id="requirements" class="u-scroll-offset">Study requirements</h2>
                ${e=e,e?`<p>Pre-requisites: ${e}</p>`:""}
                <p>Co-requisites: This module must be studied in conjunction with: module name (code)</p>
            </div>`},p=e=>`<div class="cell u-mt-2">
                <h2 id="further" class="u-scroll-offset">Further details</h2>
                ${e.preparedotherinformation?`<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3><p>${e.preparedotherinformation}</p>`:""}
                <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
                ${"Yes"===e.studyAbroad?'<p>This module is available to suitably-qualified students studying elsewhere in the world who wish to join Stirling for a semester or academic year. <a href="">Learn more</a></p>':"<p>Not available</p>"}
                <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Additional costs</h3>
                <p>${e.additionalCosts}</p>
            </div>`,r=(stir.curry((e,t,{type:a,hours:r,typekey:s})=>{return"total"===s?`<div class="u-bg-${e.second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container u-mb-2">
                <strong class="u-flex1">Total workload</strong>
                <strong>${r} hours</strong>
            </div>`:`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${a}</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${r}" data-max="${t}" data-unit="" data-colour="${e.second}"></div>
        </div>`}),stir.curry((e,{label:t,category:a,percent:r})=>"0"===r?"":`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${t} (${a})</span>
            <div class="barchart u-relative u-flex align-middle u-overflow-hidden u-bg-grey--mid" data-value="${r}" data-max="100" data-unit="%" data-colour="${e.second}"></div>
        </div>`)),s=stir.curry((e,{tab:t,tabAssessments:a})=>{e=r(e);return`<h4>${t}</h4><p>${a.map(e).join("")}</p>`}),i=stir.curry((e,t)=>t?`<div class="cell large-${e} u-mb-1">${t}</div>`:""),v=(e,t,a)=>{var r=e.length?(r="12",(e=e)?`<div class="cell large-${r} u-mb-1">${e}</div>`:""):`<p class="u-m-0">Engagement and teaching information isn't currently available, but it will be made clear to you when you make your module selections.</p>`,e=t.length<2?"12":"6",e=i(e),t=t.length?t.map(e).join(""):"Engagament information isn't currently available to be displayed for this module. You'll be able to find out more when enrolling for your modules.";return`<div class="cell u-mt-2">
              <h2 id="teaching" class="u-scroll-offset">Teaching and assessment</h2>

              <p>Here's an overview of the learning, teaching and assessment methods, and the recommended time you
                  should dedicate to the study of this module. Most modules include a combination of activity
                  (e.g. lectures), assessments and self-study.</p>
              
              <h3 class="header-stripped u-bg-${a.second}--10 u-p-1 u-${a.second}-line-left u-border-width-5 u-text-regular u-mt-2">Engagement overview</h3>
              ${r}

              <h3 class="header-stripped u-bg-${a.second}--10 u-p-1 u-${a.second}-line-left u-border-width-5 u-text-regular u-m-0 u-mt-3 u-mb-1">Assessment overview</h3>
              <div class="grid-x grid-padding-x ">
                  ${t}
              </div>

              <p>Are you an incoming Stirling student? You'll typically receive timetables for module-level
                  lectures one month prior
                  - and select seminars two weeks prior - to the start of your first semester. Help with module
                  registration can be provided by Student Services. More information can be found on our Welcome
                  site</p>
        </div>`},f=()=>'<div class="grid-container"><div class="grid-x grid-padding-x">',b=()=>"</div></div>",y=()=>f()+'<div class="cell u-padding-y"><h1>Page not found</h1></div>'+b(),w=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),x=e=>e&&e.toLowerCase().includes("p")?"pg":"ug",$=(t,e)=>(e.filter(e=>e.level===t).length?e.filter(e=>e.level===t):e)[0];const n=e=>{return{sum:e.tabAssessments.map(e=>Number(e.percent)).reduce((e,t)=>e+t,0),assessment:e}},k=(e,t)=>{const a=s(t);return e.map(n).map(e=>100!==e.sum?"":a(e.assessment))};var e=new URLSearchParams(document.location.search);!async function(e,t){var a,r,s,i,n,e=await fetch(e);try{var l=await e.json();a=l,r=t,n=stir.node("#content"),a.error?w(n,y()):(i=x(a.moduleLevelDescription),r=$(i,r),s={...a,colourPack:r},a=k(a.assessments,r),i=u(s)+d(i)+f()+c()+h(s)+v("",a,r)+m(s)+g(s)+p(s)+b(),w(n,i)),o()}catch(e){w(contentArea,y())}}("https://www.stir.ac.uk/data/courses/akari/module/index.php?module="+[e.get("code"),e.get("session"),e.get("semester")].join("/"),[{level:"ug",first:"heritage-green",second:"energy-turq",third:"energy-purple"},{level:"pg",first:"heritage-purple",second:"heritage-purple",third:"heritage-green"}])}();