!function(){function d(){stir.nodes(".c-open-close").forEach(e=>{e.addEventListener("click",e=>{e=e.target.closest(".c-open-close");Array.prototype.slice.call(e.querySelectorAll(".c-open-close-icon")).forEach(e=>e.classList.toggle("hide"))})});const t=document.querySelector(".c-sticky-nav");var e=document.querySelector("#c-sticky-nav-btn");e&&e.addEventListener("click",e=>{t.classList.toggle("hide-for-small-only"),t.classList.toggle("hide-for-medium-only")});const r=new IntersectionObserver(function(e,t){e.forEach(e=>{var t,r,a,s;e.isIntersecting?(t=Number(e.target.dataset.value),r=e.target.dataset.unit,a=Number(e.target.dataset.max),s=e.target.dataset.colour||"energy-turq",a=t/a*100,s=stir.createDOMFragment(`<div class="barchart-value u-bg-${s}" style="right:${100-a}%"></div><div class="barchart-text" style="left:${a/2-2}%">${t}${r}</div>`),e.target.append(s)):e.target.innerHTML=""})},{root:null,threshold:.5});stir.nodes(".barchart").forEach(e=>{r.observe(e)});const a=new IntersectionObserver(function(e,t){e.forEach(e=>{if(e.isIntersecting){const t=e.target.innerText;stir.nodes("[data-anchornav]").forEach(e=>{e.innerText==t?e.classList.add("current"):e.classList.remove("current")})}})},{root:null,threshold:.5}),s=(stir.nodes("main h2").forEach(e=>{a.observe(e)}),stir.nodes("[data-anchornav]"));s.forEach(e=>{e.addEventListener("click",e=>{t.classList.toggle("hide-for-small-only"),t.classList.toggle("hide-for-medium-only"),setTimeout(()=>{s.forEach(e=>e.classList.remove("current")),e.target.classList.add("current")},500)})})}const u=e=>{return`<div class="u-white--all u-sticky-nav ">
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
                </div>`;var t},c=({moduletitle:e,modulecode:t,locationStudyMethods:r,modulelevel:a,modulecredits:s})=>`<div class="grid-container">
                    <div class="grid-x grid-padding-x u-my-2 align-middle">

                        <div class="cell large-6  c-course-title u-padding-y">
                            <h1 class="u-header-smaller ">${e}</h1>
                        </div>

                        <div class="cell large-6">
                            <div class="u-border u-border-width-5 flex-container  u-px-3 u-py-2">
                                <div class="grid-x grid-padding-x ">
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 24 24"><path d="M.75,0V15M7.417,0V15M9.639,0V15M11.861,0V15M15.194,0V15M16.306,0V15M19.639,0V15M20.75,0V15M4.083,0V15M5.194,0V15" transform="translate(1.25 4.5)" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5"/></svg>
                                        </span>
                                        <span>

                                            <strong>Module code:</strong><br>${t}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 24 24"><path d="M18.218,9.425a.364.364,0,0,1-.363.363H3.646a.364.364,0,0,1-.363-.363V.113A.364.364,0,0,1,3.646-.25H17.855a.364.364,0,0,1,.363.363ZM.75,12.09h20" transform="translate(1.25 6.08)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                                        </span>
                                        <span>
                                            <strong>Delivery mode:</strong><br>${r.filter(e=>""!==e.trim()).join("<br/>")}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 24 24"><path d="M1.1,11.99,9.422,3.942l4.57,4.57L21.659.845M17.756.75h3.99V4.88" transform="translate(0.579 5.573)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                                        </span>
                                        <span>
                                            <strong>SCQF level:</strong><br>${a}
                                        </span>
                                    </div>
                                    <div class="cell medium-6 flex-container u-gap u-p-1">
                                        <span class="u-heritage-green u-inline-block u-width-32">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 24 24"><path d="M6.58.52,8.452,4.314l4.187.608L9.609,7.875l.715,4.171L6.58,10.077,2.835,12.045,3.55,7.875.521,4.922l4.187-.608Zm8.889,8.547-2.574.374,1.863,1.816-.44,2.565,2.3-1.211,2.3,1.211-.44-2.565,1.863-1.816-2.574-.374L16.621,6.734Zm-5.076,7.371-2.21.321,1.6,1.56L9.4,20.52l1.977-1.04,1.977,1.04-.378-2.2,1.6-1.56-2.212-.321-.989-2Z" transform="translate(1.566 1.48)" fill="rgba(255,255,255,0)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                                        </span>
                                        <span>
                                            <strong>SCQF credits:</strong><br>${s}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,h=()=>`<div class="cell bg-grey u-bleed u-p-2 "><p class="u-m-0 text-md">We aim to present detailed, up-to-date module information - in fact, we're providing more 
            information than ever. However, modules and courses are constantly being enhanced to boost your learning experience, and are therefore subject 
            to change. <a href="#">See terms and conditions</a>.</p></div>`,p=({moduleOverview:e,colourPack:t,...r})=>`<div class="cell u-p-2">
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
            </div>`,g=({modulecredits:e,ectsmodulecredits:t,professionalAccreditation:r,colourPack:a})=>{return`<div class="cell u-mt-2">
                <h2 id="awards">Awards</h2>

                <h3 class="header-stripped u-bg-${a.third}--10 u-p-1 u-${a.third}-line-left u-border-width-5 u-text-regular">Credits</h3>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173616" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" />
                    This module is worth ${e} SCQF (Scottish Credit and Qualifications Framework) credits</p>

                <p class="flex-container u-gap align-middle"><img src="<t4 type="media" id="173615" formatter="path/*"/>" width="65" height="44" alt="Scotland flag" /> 
                    This equates to ${t} ECTS (The European Credit Transfer and Accumulation System) credits</p>

                <div class="u-mb-2 u-bg-${a.third}--10 flex-container align-stretch ">
                    <span class="u-bg-${a.third} u-white flex-container align-middle u-width-64 u-px-1 ">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 24 24"><path d="M14.667,4.5,23,12.833m0,0-8.333,8.333M23,12.833H3" transform="translate(-1 -0.833)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                    </span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> 
                        <a href="#" class="u-${a.third}">Assessment and award of credit for undergraduates</a></p>
                </div>

                ${e=r,t=a.third,e?`<h3 class="header-stripped u-bg-${t}--10 u-p-1 u-${t}-line-left u-border-width-5 u-text-regular">Professional accreditation</h3>
          <p>${e}</p>`:""}
            </div>`},m=({modulerequisites:e})=>{return`<div class="cell u-mt-2">
                <h2 id="requirements">Study requirements</h2>
                ${e=e,e?`<p>Pre-requisites: ${e}</p>`:""}

                <p>Co-requisites: This module must be studied in conjunction with: module name (code)</p>
            </div>`},v=e=>`<div class="cell u-mt-2">
                    <h2 id="further">Further details</h2>
                    
                    ${e.preparedotherinformation?`<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3>
            <p>${e.preparedotherinformation}</p>`:""}
                   
                    <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
                    ${"Yes"===e["studyAbroad "]?`<p>This module is available to suitably-qualified undergraduate students studying elsewhere in the
                        world who wish to join Stirling for a semester or academic year. <a href="">Learn more</a></p>`:"<p>Not available</p>"}
                    
                    <h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Additional costs</h3>
                    <p>${e["additionalCosts "]}</p>
                </div>`,i=stir.curry((e,t,{label:r,hours:a,typekey:s})=>{return"total"===s?`<div class="u-bg-${e.second}--10 u-p-tiny u-p-1 u-text-regular u-mt-1 flex-container ">
                <strong class="u-flex1">Total workload</strong>
                <strong>${a} hours</strong>
            </div>`:`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${r}</span>
            <div class="barchart" data-value="${a}" data-max="${t}" data-unit="" data-colour="${e.second}"></div>
        </div>`}),a=stir.curry((e,{label:t,category:r,percent:a})=>"0"===a?"":`
        <div>
            <span class="u-inline-block u-p-tiny u-px-1">${t} (${r})</span>
            <div class="barchart" data-value="${a}" data-max="100" data-unit="%" data-colour="${e.second}"></div>
        </div>`),f=(e,t,r)=>{var a,s,i=e&&t?"6":"12";return e||t?`<div class="cell u-mt-2">
              <h2 id="teaching">Teaching and assessment</h2>

              <p>Here's an overview of the learning, teaching and assessment methods, and the recommended time you
                  should dedicate to the study of this module. Most modules include a combination of activity
                  (e.g. lectures), assessments and self-study.</p>

              <div class="grid-x grid-padding-x u-my-2">
                  ${e=e,a=i,s=r,e?`<div class="cell large-${a} u-mb-1">
            <h3 class="header-stripped u-bg-${s.second}--10 u-p-1 u-${s.second}-line-left u-border-width-5 u-text-regular">Engagement overview</h3>
            ${e}
        </div>`:""}
                  ${a=t,s=i,e=r,a?`<div class="cell large-${s} u-mb-1">
            <h3 class="header-stripped u-bg-${e.second}--10 u-p-1 u-${e.second}-line-left u-border-width-5 u-text-regular">Assessment overview</h3>
            ${a}
        </div>`:""}
              </div>
              <p>Are you an incoming Stirling student? You'll typically receive timetables for module-level
                  lectures one month prior
                  - and select seminars two weeks prior - to the start of your first semester. Help with module
                  registration can be provided by Student Services. More information can be found on our Welcome
                  site</p>
        </div>`:""},w=()=>'<div class="grid-container"><div class="grid-x grid-padding-x">',b=()=>"</div></div>",x=()=>w()+'<div class="cell u-padding-y"><h1>Page not found</h1></div>'+b(),s=e=>e.category?`<div class="flex-container u-border-bottom-solid u-p-tiny"><span class="u-flex1">${e.label} (${e.category})</span><span>${e.percent}%</span></div>`:`<div class="flex-container u-border-bottom-solid u-p-tiny"><span class="u-flex1">${e.label} (hours)</span><span>${e.hours}</span></div>`,n=(e,t,r,a)=>`<div class="u-border-solid u-p-1" style="color:#d51212">
              <p><strong>Error with the data</strong></p>
              <p>Reported total: ${e} ${r}<br>
              Actual sum: ${t} </p>
              ${a.map(s).join("")} 
            </div>`,y=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),k=e=>e&&e.toLowerCase().includes("p")?"pg":"ug",$=(t,e)=>(e.filter(e=>e.level===t).length?e.filter(e=>e.level===t):e)[0],L=(e,t)=>{var r=e.filter(e=>"total"===e.typekey),r=r.length?r[0].hours:null,t=i(t,r),a=e.filter(e=>"total"!==e.typekey),r=Number(r),s=e.filter(e=>"total"!==e.typekey).map(e=>Number(e.hours)).reduce((e,t)=>e+t,0);return Number(r)!==s?n(r,s,"Hours (Total Study Time)",a):e.map(t).join("")},M=(e,t)=>{var t=a(t),r=e.map(e=>Number(e.percent)).reduce((e,t)=>e+t,0);return 100!==r?n(100,r,"(Percent)",e):e.map(t).join("")};var e=new URLSearchParams(document.location.search);!async function(e,t){var r,a,s,i,n,o,e=await fetch(e);try{var l=await e.json();r=l,a=t,o=stir.node("#content"),r.error?y(o,x()):(n=k(r.moduleLevelDescription),a=$(n,a),s={...r,colourPack:a},i=L(r.deliveries,a),r=M(r.assessments,a),n=c(s)+u(n)+w()+h()+p(s)+f(i,r,a)+g(s)+m(s)+v(s)+b(),y(o,n)),d()}catch(e){console.log(e.message)}}("https://www.stir.ac.uk/data/courses/akari/module/index.php?module="+[e.get("code"),e.get("session"),e.get("semester")].join("/"),[{level:"ug",first:"heritage-green",second:"energy-turq",third:"energy-purple"},{level:"pg",first:"heritage-purple",second:"heritage-purple",third:"heritage-green"}])}();