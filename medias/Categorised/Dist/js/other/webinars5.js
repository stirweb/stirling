!function(){if(!stir.nodes("[data-webinar]"))return;var e=stir.nodes("[data-webinarSects]");const r=stir.t4Globals.webinars||[],t=stir.t4Globals.webinarSectionData||{};var i=stir.t4Globals.webinarsdisclaimer||"",s=stir.node("[data-webinardisclaimer]");const a={safeList:["countries","series","subjects","studylevels","faculties","categories"],macros:stir.filter(e=>{if(e.tag)return e},stir.t4Globals.regionmacros)||[]},n=(Object.freeze(a),stir.curry((i,s,a)=>{var e=stir.filter(e=>i.safeList.includes(e),Object.keys(s)),e=stir.map(e=>{var t,r;return a[e]?(t=a[e].split(", "),r=l(i,s[e],e),r=stir.map(r,t),stir.any(e=>!0===e,r)):""===s[e]},e);return stir.all(e=>!0===e,e)})),l=stir.curry((e,t,r,i)=>{if(t.includes(i.trim()))return!0;if(i.trim().includes(t.trim()))return!0;if(r&&"faculties"===r&&c(t,i,"All Faculties"))return!0;if(r&&"countries"===r){if(t.includes("All nationalities"))return!0;if(t.includes("All international")&&!d(e.macros,"United Kingdom").includes(i.trim()))return!0;if(i.trim().includes("All international")&&!d(e.macros,"United Kingdom").includes(t))return!0}return!1}),c=(e,t,r)=>!!e.includes(r)||!!t.trim().includes(r),d=(e,t)=>e.filter(e=>e.tag===t).map(e=>e.data).join(", "),u=e=>`
          <div class="cell small-12 large-4 medium-6 u-my-2" >
              <div class="u-energy-line-top">
                    <h3 class="-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-1">
                    <a href="${e.link}" class="c-link" >${e.title}</a></h3>
                    ${e.countries?`<p>For students from: ${e.countries}</p>`:""}
                    <div class="text-sm">
                      <p><strong>${e.date}, ${e.time} (${e.zone})</strong></p>
                      ${e.faculties?`<p>${e.faculties}</p>`:""}
                      ${e.description}

                    ${e.ondemand?'<span class="u-bg-energy-teal--darker u-inline-block u-white u-p-tiny text-xxsm  ">On demand</span>':""}

                  </div>
                </div>
          </div> `,o=stir.curry((e,t)=>{var r,i;if(t.length||e.noItems)return`
            <div class="grid-x grid-padding-x" >
              ${r=e.head,i=e.intro,r||i?`
          <div class="cell u-mt-2">
            ${r?"<h2>"+r+"</h2>":""}
            ${i}
          </div>`:""}
              ${t.length?stir.map(u,t).join(""):'<div class="cell">'+e.noItems+"</div>"}
              ${e.divider&&"no"===e.divider?"":'<div class="cell"><hr /></div>'}
            </div>`}),m=stir.curry((e,t)=>(stir.setHTML(e,t),e)),p=e=>{var t;return"Yes"===e.ondemand||(t=(new Date).toISOString(),t=Number(t.split(".")[0].replaceAll(":","").replaceAll("-","").replaceAll("T","")),Number(e.datetime)>t)},f=(e,t,r,i)=>{var r=r.filter(p),s=(console.log(r),stir.filter(e=>e.title)),e=stir.filter(n(e,i.params)),a=stir.sort((e,t)=>parseInt(e.datetime)>parseInt(t.datetime)?1:parseInt(t.datetime)>parseInt(e.datetime)?-1:0),t=m(t),i=o(i);return stir.compose(t,i,a,e,s)(r)},v=stir.node("#webinarresults");v&&(f(a,v,r,{params:{series:"",countries:"",subjects:"",studylevels:"",faculties:"",categories:""}}),stir.nodes("#webinarfilters select").forEach(e=>{e.addEventListener("change",e=>{var t=stir.node("#search-student-type").value,t={params:{series:"",countries:stir.node("#search-region").value,subjects:"",studylevels:t,faculties:"",categories:stir.node("#search-category").value}};f(a,v,r,t)})})),e.forEach(e=>{f(a,e,r,t[e.dataset.webinarsects])}),s&&e.map(e=>e.innerText).join("").trim().length<1&&m(s,i)}();