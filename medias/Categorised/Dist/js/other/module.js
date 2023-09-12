!function(){function l(){stir.nodes(".c-open-close").forEach(e=>{e.addEventListener("click",e=>{e=e.target.closest(".c-open-close");Array.prototype.slice.call(e.querySelectorAll(".c-open-close-icon")).forEach(e=>e.classList.toggle("hide"))})});const t=document.querySelector(".c-sticky-nav");var e=document.querySelector("#c-sticky-nav-btn");e&&e.addEventListener("click",e=>{t.classList.toggle("hide-for-small-only"),t.classList.toggle("hide-for-medium-only")});const r=new IntersectionObserver(function(e,t){e.forEach(e=>{var t,r,s,a;e.isIntersecting?(t=Number(e.target.dataset.value),r=e.target.dataset.unit,s=Number(e.target.dataset.max),a=e.target.dataset.colour||"energy-turq",s=t/s*100,a=stir.createDOMFragment(`<div class="barchart-value u-bg-${a}" style="right:${100-s}%"></div><div class="barchart-text" style="left:${s/2-2}%">${t}${r}</div>`),e.target.append(a)):e.target.innerHTML=""})},{root:null,threshold:.5});stir.nodes(".barchart").forEach(e=>{r.observe(e)});const s=new IntersectionObserver(function(e,t){e.forEach(e=>{if(e.isIntersecting){const t=e.target.innerText;stir.nodes("[data-anchornav]").forEach(e=>{e.innerText==t?e.classList.add("current"):e.classList.remove("current")})}})},{root:null,threshold:.5}),a=(stir.nodes("main h2").forEach(e=>{s.observe(e)}),stir.nodes("[data-anchornav]"));a.forEach(e=>{e.addEventListener("click",e=>{t.classList.toggle("hide-for-small-only"),t.classList.toggle("hide-for-medium-only"),setTimeout(()=>{a.forEach(e=>e.classList.remove("current")),e.target.classList.add("current")},500)})})}const d=()=>`<div class="u-white--all u-sticky-nav ">
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
                                    <a href="#"
                                        class="text-md u-font-bold u-bg-heritage-green u-p-1 u-m-0 heritage-green button--back u-border-hover-none ">Back
                                        to course</a>
                                </div>

                            </div>
                        </div>
                    </nav>
                </div>`,u=({moduletitle:e,modulecode:t,locationStudyMethods:r,modulelevel:s,modulecredits:a})=>`<div class="grid-container">
                    <div class="grid-x grid-padding-x u-my-2 align-middle">

                        <div class="cell large-6  c-course-title u-padding-y">
                            <h1 class="u-header-smaller ">${e}</h1>
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

                                            <strong>Module code:</strong><br>${t}
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
                                            <strong>Delivery mode:</strong><br>${r.filter(e=>""!==e.trim()).join("<br/>")}
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
                                            <strong>SCQF level:</strong><br>${s}
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
                                            <strong>SCQF credits:</strong><br>${a}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,c=()=>`<div class="cell bg-grey u-bleed u-p-2"><p class="u-m-0">We aim to present detailed, up-to-date module information - in fact, we're providing more 
            information than ever. However, modules and courses are constantly being enhanced to boost your learning experience, and are therefore subject 
            to change. <a href="#">See terms and conditions</a>.</p></div>`,h=({moduleOverview:e,colourPack:t,...r})=>`<div class="cell u-p-2">
                <h2 id="contentandaims">Content and aims</h2>

                <h3 class="header-stripped u-bg-${t.first}--10 u-${t.first}-line-left u-p-1  u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${e}

                <h3 class="header-stripped u-bg-${t.first}--10 u-${t.first}-line-left u-p-1 u-border-width-5 u-text-regular">
                    Learning outcomes
                </h3>

                <p><strong>After successful completion of this module, you'll be able to:</strong></p>
                
                <ul>
                    ${r["learningOutcomes "].map(e=>`<li>${e}</li>`).join("")} 
                </ul>
            </div>`,p=({modulecredits:e,ectsmodulecredits:t,professionalAccreditation:r,colourPack:s})=>{return`<div class="cell u-mt-2">
                <h2 id="awards">Awards</h2>

                <h3 class="header-stripped u-bg-${s.third}--10 u-p-1 u-${s.third}-line-left u-border-width-5 u-text-regular">Credits</h3>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173616" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${e} SCQF (Scottish Credit and Qualifications Framework) credits</p>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173615" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" /> 
                    This equates to ${t} ECTS (The European Credit Transfer and Accumulation System) credits</p>

                <div class="u-mb-2 u-bg-${s.third}--10 flex-container align-stretch ">
                    <span class="u-bg-${s.third} u-white flex-container align-middle u-width-64 u-px-1 ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="svg-icon">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z">
                            </path>
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg></span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> 
                        <a href="#" class="u-${s.third}">Assessment and award of credit for undergraduates</a></p>
                </div>

                ${e=r,t=s.third,e?`<h3 class="header-stripped u-bg-${t}--10 u-p-1 u-${t}-line-left u-border-width-5 u-text-regular">Professional accreditation</h3>
          <p>${e}</p>`:""}
            </div>`},g=({modulerequisites:e})=>{return`<div class="cell u-mt-2">
                <h2 id="requirements">Study requirements</h2>
                ${e=e,e?`<p>Pre-requisites: ${e}</p>`:""}

                <p>Co-requisites: This module must be studied in conjunction with: module name (code)</p>
            </div>`},m=e=>`<div class="cell u-mt-2">
                    <h2 id="further">Further details</h2>
                    
                    ${e.preparedotherinformation?`<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3>
            <p>${e.preparedotherinformation}</p>`:""}
                   
                    <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
                    ${"Yes"===e["studyAbroad "]?`<p>This module is available to suitably-qualified undergraduate students studying elsewhere in the
                        world who wish to join Stirling for a semester or academic year. <a href="">Learn more</a></p>`:"<p>Not available</p>"}
                    
                    <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Additional costs</h3>
                    <p>${e["additionalCosts "]}</p>
                </div>`,i=stir.curry((e,t,{label:r,hours:s,typekey:a})=>{return"total"===a?`<div class="u-bg-${e.second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container ">
                <strong class="u-flex1">Total workload</strong>
                <strong>${s} hours</strong>
            </div>`:`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${r}</span>
            <div class="barchart" data-value="${s}" data-max="${t}" data-unit="" data-colour="${e.second}"></div>
        </div>`}),s=stir.curry((e,{label:t,category:r,percent:s})=>"0"===s?"":`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${t} (${r})</span>
            <div class="barchart" data-value="${s}" data-max="100" data-unit="%" data-colour="${e.second}"></div>
        </div>`),v=(e,t,r)=>{var s,a,i=e&&t?"6":"12";return e||t?`<div class="cell u-mt-2">
              <h2 id="teaching">Teaching and assessment</h2>

              <p>Here's an overview of the learning, teaching and assessment methods, and the recommended time you
                  should dedicate to the study of this module. Most modules include a combination of activity
                  (e.g. lectures), assessments and self-study.</p>

              <div class="grid-x grid-padding-x u-my-2">
                  ${e=e,s=i,a=r,e?`<div class="cell large-${s} u-mb-1">
            <h3 class="header-stripped u-bg-${a.second}--10 u-p-1 u-${a.second}-line-left u-border-width-5 u-text-regular">Engagement overview</h3>
            ${e}
        </div>`:""}
                  ${s=t,a=i,e=r,s?`<div class="cell large-${a} u-mb-1">
            <h3 class="header-stripped u-bg-${e.second}--10 u-p-1 u-${e.second}-line-left u-border-width-5 u-text-regular">Assessment overview</h3>
            ${s}
        </div>`:""}
              </div>
              <p>Are you an incoming Stirling student? You'll typically receive timetables for module-level
                  lectures one month prior
                  - and select seminars two weeks prior - to the start of your first semester. Help with module
                  registration can be provided by Student Services. More information can be found on our Welcome
                  site</p>
        </div>`:""},f=()=>'<div class="grid-container"><div class="grid-x grid-padding-x">',b=()=>"</div></div>",w=()=>f()+'<div class="cell u-padding-y"><h1>Page not found</h1></div>'+b(),a=e=>e.category?`<div class="flex-container u-border-bottom-solid u-p-tiny"><span class="u-flex1">${e.label} (${e.category})</span><span>${e.percent}%</span></div>`:`<div class="flex-container u-border-bottom-solid u-p-tiny"><span class="u-flex1">${e.label} (hours)</span><span>${e.hours}</span></div>`,n=(e,t,r,s)=>(console.log(s),`<div class="u-border-solid u-p-1" style="color:#d51212">
              <p><strong>Error with the data</strong></p>
              <p>Reported total: ${e} ${r}<br>
              Actual sum: ${t} </p>
              ${s.map(a).join("")} 
            </div>`),y=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),x=(t,e)=>(e.filter(e=>t.includes(e.level)).length?e.filter(e=>t.includes(e.level)):e)[0],$=(e,t)=>{var r=e.filter(e=>"total"===e.typekey),r=r.length?r[0].hours:null,t=i(t,r),s=e.filter(e=>"total"!==e.typekey),r=Number(r),a=e.filter(e=>"total"!==e.typekey).map(e=>Number(e.hours)).reduce((e,t)=>e+t,0);return Number(r)!==a?n(r,a,"Hours (Total Study Time)",s):e.map(t).join("")},k=(e,t)=>{var t=s(t),r=e.map(e=>Number(e.percent)).reduce((e,t)=>e+t,0);return 100!==r?n(100,r,"(Percent)",e):e.map(t).join("")};var e=new URLSearchParams(document.location.search);!async function(e,t){var r,s,a,i,n,e=await fetch(e);try{var o=await e.json();r=o,s=t,n=stir.node("#content"),r.error?y(n,w()):(s=x(r.moduleLevelDescription,s),a={...r,colourPack:s},i=$(r.deliveries,s),r=k(r.assessments,s),i=u(a)+d()+f()+c()+h(a)+v(i,r,s)+p(a)+g(a)+m(a)+b(),y(n,i)),l()}catch(e){console.log(e.message)}}("https://www.stir.ac.uk/data/courses/akari/module/index.php?module="+[e.get("code"),e.get("session"),e.get("semester")].join("/"),[{level:"UG",first:"heritage-green",second:"energy-turq",third:"energy-purple"},{level:"PG",first:"heritage-purple",second:"heritage-purple",third:"heritage-green"}])}();