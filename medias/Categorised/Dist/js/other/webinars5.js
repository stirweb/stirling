!function(){if(!stir.nodes("[data-webinar]"))return;var e=stir.nodes("[data-webinarSects]");const t=stir.t4Globals.webinars||[],i=stir.t4Globals.webinarSectionData||{};var r=stir.t4Globals.webinarsdisclaimer||"",s=stir.node("[data-webinardisclaimer]");const a={safeList:["countries","series","subjects","studylevels","faculties","categories"],macros:stir.filter(e=>{if(e.tag)return e},stir.t4Globals.regionmacros)||[]},n=(Object.freeze(a),stir.curry((r,s,a)=>{var e=stir.filter(e=>r.safeList.includes(e),Object.keys(s)),e=(console.log(e),stir.map(e=>{var t,i;return a[e]?(t=a[e].split(", "),i=l(r,s[e],e),i=stir.map(i,t),stir.any(e=>!0===e,i)):""!==s[e]?(console.log("NOT defaulting "+e),!1):(console.log("Defaulting "+e),!0)},e));return stir.all(e=>!0===e,e)&&console.log(e),console.log("----"),stir.all(e=>!0===e,e)})),l=stir.curry((e,t,i,r)=>{if(t.includes(r.trim()))return!0;if(r.trim().includes(t.trim()))return!0;if(i&&"faculties"===i&&c(t,r,"All Faculties"))return!0;if(i&&"countries"===i){if(t.includes("All nationalities"))return!0;if(t.includes("All international")&&!d(e.macros,"United Kingdom").includes(r.trim()))return!0;if(r.trim().includes("All international")&&!d(e.macros,"United Kingdom").includes(t))return!0}return!1}),c=(e,t,i)=>!!e.includes(i)||!!t.trim().includes(i),d=(e,t)=>e.filter(e=>e.tag===t).map(e=>e.data).join(", "),o=e=>(console.log(e),`
          <div class="cell small-12 large-4 medium-6 u-my-2" >
              <div class="u-energy-line-top">
                    <h3 class="-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-1">
                    <a href="${e.link}" class="c-link" >${e.title}</a></h3>
                    ${e.countries?`<p>For students from: ${e.countries}</p>`:""}
                    <div class="text-sm">
                      <p><strong>${e.date}, ${e.time} (${e.zone})</strong></p>
                      ${e.faculties?`<p>${e.faculties}</p>`:""}
                      ${e.description}

                      ${e.series}
                  </div>
                </div>
          </div> `),u=stir.curry((e,t)=>{var i,r;if(t.length||e.noItems)return`
            <div class="grid-x grid-padding-x" >
              ${i=e.head,r=e.intro,i||r?`
          <div class="cell u-mt-2">
            ${i?"<h2>"+i+"</h2>":""}
            ${r}
          </div>`:""}
              ${t.length?stir.map(o,t).join(""):'<div class="cell">'+e.noItems+"</div>"}
              ${e.divider&&"no"===e.divider?"":'<div class="cell"><hr /></div>'}
            </div>`}),m=stir.curry((e,t)=>(stir.setHTML(e,t),e)),f=(e,t,i,r)=>{var s=stir.filter(e=>e.title),e=stir.filter(n(e,r.params)),a=stir.sort((e,t)=>parseInt(e.datetime)>parseInt(t.datetime)?1:parseInt(t.datetime)>parseInt(e.datetime)?-1:0),t=m(t),r=u(r);return stir.compose(t,r,a,e,s)(i)};var g=stir.node("#webinarresults");g&&f(a,g,t,{params:{series:"",countries:"England, Wales, Northern Ireland",subjects:"",studylevels:"Undergraduate",faculties:"",categories:"Student support and experience"}}),e.forEach(e=>{f(a,e,t,i[e.dataset.webinarsects])}),s&&e.map(e=>e.innerText).join("").trim().length<1&&m(s,r)}();