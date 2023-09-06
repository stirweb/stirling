!function(){function n(){var e=document.querySelectorAll(".c-open-close");const t=document.querySelector(".c-sticky-nav");var r=document.querySelector("#c-sticky-nav-btn");r&&r.addEventListener("click",e=>{t.classList.toggle("hide-for-small-only"),t.classList.toggle("hide-for-medium-only")}),e.forEach(e=>{e.addEventListener("click",e=>{e.target.closest(".c-open-close").querySelectorAll(".c-open-close-icon").forEach(e=>e.classList.toggle("hide"))})});const a=new IntersectionObserver(function(e,t){e.forEach(e=>{var t,r,a,s,i;e.isIntersecting?(t=Number(e.target.dataset.value),r=e.target.dataset.unit,a=100-(s=t/Number(e.target.dataset.max)*100),s=s/2-2,(i=document.createElement("div")).classList.add("barchart-value"),i.style.right=a+"%",e.target.innerHTML=`<div class="barchart-text" style="left:${s}%">${t}${r}</div>`,e.target.appendChild(i)):e.target.innerHTML=""})},{root:null,threshold:.5}),s=new IntersectionObserver(function(e,t){e.forEach(e=>{if(e.isIntersecting){const t=e.target.innerText;document.querySelectorAll("[data-anchornav]").forEach(e=>{e.innerText==t?e.classList.add("current"):e.classList.remove("current")})}})},{root:null,threshold:.5});document.querySelectorAll("main h2").forEach(e=>{s.observe(e)}),document.querySelectorAll(".barchart").forEach(e=>{a.observe(e)})}const l=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),o=()=>`<div class="u-white--all u-sticky-nav ">
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
                </div>`,d=({moduletitle:e,modulecode:t,locationStudyMethods:r,modulelevel:a,modulecredits:s})=>`<div class="grid-container">
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
                                            <strong>Delivery mode:</strong><br>${r.join("<br/>")}
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
                                            <strong>SCQF level:</strong><br>${a}
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
                                            <strong>SCQF credits:</strong><br>${s}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,s=stir.curry((e,{label:t,hours:r,typekey:a})=>"total"===a?i(r):`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${t}</span>
            <div class="barchart" data-value="${r}" data-max="${e}" data-unit=""></div>
        </div>`),i=e=>`<div class="u-bg-energy-teal--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container ">
                <strong class="u-flex1">Total workload</strong>
                <strong>${e} hours</strong>
            </div>`,t=({label:e,category:t,percent:r})=>"0"===r?"":`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${e} (${t})</span>
            <div class="barchart" data-value="${r}" data-max="100" data-unit="%"></div>
        </div>`,u=({moduleOverview:e,...t})=>`<div class="cell u-p-2">
                <h2 id="content">Content and aims</h2>

                <h3 class="header-stripped u-bg-mint u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${e}

                <h3 class="header-stripped u-bg-mint u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">
                    Learning outcomes
                </h3>

                <p><strong>After successful completion of this module, you'll be able to:</strong></p>
                
                <ul>
                    ${t["learningOutcomes "].map(e=>`<li>${e}</li>`).join("")} 
                </ul>
            </div>`,c=({modulecredits:e,ectsmodulecredits:t,professionalAccreditation:r})=>`<div class="cell u-mt-2">
                <h2 id="awards">Awards</h2>

                <h3 class="header-stripped u-bg-heritage-purple--5 u-p-1 u-heritage-purple-line-left u-border-width-5 u-text-regular">Credits</h3>

                <p class="flex-container u-gap align-middle"><img src="scotland-flag.png" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${e} SCQF (Scottish Credit and Qualifications Framework) credits</p>

                <p class="flex-container u-gap align-middle"><img src="EU-flag.png" width="65" height="44" alt="Scotland flag" /> 
                    This equates to ${t} ECTS (The European Credit Transfer and Accumulation System) credits</p>

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
                <p>${r}</p>
            </div>`,h=({modulerequisites:e})=>{return`<div class="cell u-mt-2">
                <h2 id="requirements">Study requirements</h2>
                ${e=e,e?`<p>Pre-requisites: ${e}</p>`:""}

                <p>Co-requisites: This module must be studied in conjunction with: module name (code)</p>
            </div>`},p=e=>`<div class="cell u-mt-2">
                    <h2 id="further">Further details</h2>
                    
                    ${e.preparedotherinformation?`<h3 class="header-stripped u-bg-mint u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3>
            <p>${e.preparedotherinformation}</p>`:""}
                   
                    <h3 class="header-stripped u-bg-mint u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
                    ${"Yes"===e["studyAbroad "]?`<p>This module is available to suitably-qualified undergraduate students studying elsewhere in the
                        world who wish to join Stirling for a semester or academic year. <a href="">Learn more</a></p>`:"<p>Not available</p>"}
                    
                    <h3 class="header-stripped u-bg-mint u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Additional costs</h3>
                    <p>${e["additionalCosts "]}</p>
                </div>`,g=(e,t)=>{return e||t?`<div class="cell u-mt-2">
              <h2 id="teaching">Teaching and assessment</h2>

              <p>Here's an overview of the learning, teaching and assessment methods, and the recommended time you
                  should dedicate to the study of this module. Most modules include a combination of activity
                  (e.g. lectures), assessments and self-study.</p>

              <div class="grid-x grid-padding-x u-my-2">
                  ${e=e,e?`<div class="cell large-6">
            <h3 class="header-stripped u-bg-energy-teal--10 u-p-1 u-energy-turq-line-left u-border-width-5 u-text-regular">Engagement overview</h3>
            ${e}
        </div>`:""}
                  ${e=t,e?`<div class="cell large-6">
            <h3 class="header-stripped u-bg-energy-teal--10 u-p-1 u-energy-turq-line-left u-border-width-5 u-text-regular">Engagement overview</h3>
            ${e}
        </div>`:""}
              </div>

              <p>Are you an incoming Stirling student? You'll typically receive timetables for module-level
                  lectures one month prior
                  - and select seminars two weeks prior - to the start of your first semester. Help with module
                  registration can be provided by Student Services. More information can be found on our Welcome
                  site</p>
        </div>`:""},m=()=>`<div class="cell bg-grey u-bleed u-p-2"><p class="u-m-0">We aim to present detailed, up-to-date module information - in fact, we're providing more 
            information than ever. However, modules and courses are constantly being enhanced to boost your learning experience, and are therefore subject 
            to change. <a href="#">See terms and conditions</a>.</p></div>`,v=()=>'<div class="grid-container"><div class="grid-x grid-padding-x">',f=()=>"</div></div>",b=()=>v()+'<div class="cell u-padding-y"><h1>Page not found</h1></div>'+f(),w=e=>{var t=e.filter(e=>"total"===e.typekey),t=t.length?t[0].hours:null,r=s(t),t=Number(t),a=e.filter(e=>"total"!==e.typekey).map(e=>Number(e.hours)).reduce((e,t)=>e+t,0);return Number(t)!==a?"":e.map(r).join("")},y=e=>{e=((t,e)=>{let r={},a=[];return e.forEach(e=>{r[e[t]]||(r[e[t]]=!0,a.push(e))}),a})("match",e.map(e=>({...e,match:e.label+e.category+e.percent})));return 100!==e.map(e=>Number(e.percent)).reduce((e,t)=>e+t,0)?"":e.map(t).join("")};var e=new URLSearchParams(document.location.search);!async function(e){var t,r,a,s,e=await fetch(e);try{var i=await e.json();t=i,s=stir.node("#content"),t.error?l(s,b()):(a=w(t.deliveries),r=y(t.assessments),a=d(t)+o()+v()+m()+u(t)+g(a,r)+c(t)+h(t)+p(t)+f(),l(s,a)),n()}catch(e){}}("https://www.stir.ac.uk/data/courses/akari/module/index.php?module="+[e.get("code"),e.get("session"),e.get("semester")].join("/"))}();