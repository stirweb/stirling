!function(){if(!stir.nodes("[data-webinar]"))return;var e=stir.nodes("[data-webinarSects]");const i=stir.t4Globals.webinars||[],t=stir.t4Globals.webinarSectionData||{};var r=stir.t4Globals.webinarsdisclaimer||"",s=stir.node("[data-webinardisclaimer]");const a={safeList:["countries","series","subjects","studylevels","faculties","categories"],macros:stir.filter(e=>{if(e.tag)return e},stir.t4Globals.regionmacros)||[]},l=(Object.freeze(a),stir.curry((r,s,a)=>{var e=stir.filter(e=>r.safeList.includes(e),Object.keys(s)),e=stir.map(e=>{var t,i;return a[e]?(t=a[e].split(", "),i=n(r,s[e],e),i=stir.map(i,t),stir.any(e=>!0===e,i)):""===s[e]},e);return stir.all(e=>!0===e,e)})),n=stir.curry((e,t,i,r)=>{if(t.includes(r.trim()))return!0;if(r.trim().includes(t.trim()))return!0;if(i&&"faculties"===i&&c(t,r,"All Faculties"))return!0;if(i&&"countries"===i){if(t.includes("All nationalities"))return!0;if(t.includes("All international")&&!d(e.macros,"United Kingdom").includes(r.trim()))return!0;if(r.trim().includes("All international")&&!d(e.macros,"United Kingdom").includes(t))return!0}return!1}),c=(e,t,i)=>!!e.includes(i)||!!t.trim().includes(i),d=(e,t)=>e.filter(e=>e.tag===t).map(e=>e.data).join(", "),u=e=>{var t=(new Date).toISOString(),t=Number(t.split(".")[0].replaceAll(":","").replaceAll("-","").replaceAll("T",""));return Number(e)>t},o=stir.curry(e=>"Yes"===e.ondemand||u(e.datetime)),m=e=>`
          <div class="cell small-12 large-4 medium-6 u-my-2" >
              <div class="u-energy-line-top">
                    <h3 class="-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-1">
                    <a href="${e.link}" class="c-link" >${e.title}</a></h3>
                    ${e.countries?`<p>For students from: ${e.countries}</p>`:""}
                    <div class="text-sm">
                      <p><strong>${e.date}, ${e.time} (${e.zone})</strong></p>
                      ${e.faculties?`<p>${e.faculties}</p>`:""}
                      ${e.description}

                      ${e.ondemand?'<span class="u-bg-energy-pink u-inline-block u-white u-p-tiny text-xxsm  ">Watch on-demand</span>':""}
                      ${u(e.datetime)?'<span class="u-bg-heritage-green u-inline-block u-white u-p-tiny text-xxsm  ">Live event</span>':""}
                  </div>
                </div>
          </div> `,p=stir.curry((e,t)=>{var i,r;if(t.length||e.noItems)return`
            <div class="grid-x grid-padding-x" >
              ${i=e.head,r=e.intro,i||r?`
          <div class="cell u-mt-2">
            ${i?"<h2>"+i+"</h2>":""}
            ${r}
          </div>`:""}
              ${t.length?stir.map(m,t).join(""):'<div class="cell">'+e.noItems+"</div>"}
              ${e.divider&&"no"===e.divider?"":'<div class="cell"><hr /></div>'}
            </div>`}),v=stir.curry((e,t)=>(stir.setHTML(e,t),e)),f=(e,t,i,r)=>{var s=stir.filter(e=>e.title),e=stir.filter(l(e,r.params)),a=stir.filter(o),n=stir.sort((e,t)=>parseInt(e.datetime)>parseInt(t.datetime)?1:parseInt(t.datetime)>parseInt(e.datetime)?-1:0),t=v(t),r=p(r);return stir.compose(t,r,n,e,a,s)(i)},g=stir.node("#webinarresults");g&&(f(a,g,i,{params:{series:"",countries:"",subjects:"",studylevels:"",faculties:"",categories:""}}),stir.nodes("#webinarfilters select").forEach(e=>{e.addEventListener("change",e=>{var t=stir.node("#search-student-type").value,t={params:{series:"",countries:stir.node("#search-region").value,subjects:"",studylevels:t,faculties:"",categories:stir.node("#search-category").value}};f(a,g,i,t)})})),e.forEach(e=>{f(a,e,i,t[e.dataset.webinarsects])}),s&&e.map(e=>e.innerText).join("").trim().length<1&&v(s,r)}();