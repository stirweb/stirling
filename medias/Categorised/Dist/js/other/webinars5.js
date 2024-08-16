!function(){if(!stir.nodes("[data-webinar]"))return;var e=stir.nodes("[data-webinarSects]");const s=stir.t4Globals.webinars||[],t=stir.t4Globals.webinarSectionData||{};var i=stir.t4Globals.webinarsdisclaimer||"",r=stir.node("[data-webinardisclaimer]");const a={safeList:["countries","series","subjects","studylevels","faculties","categories"],macros:stir.filter(e=>{if(e.tag)return e},stir.t4Globals.regionmacros)||[]},l=(Object.freeze(a),stir.curry((i,r,a)=>{var e=stir.filter(e=>i.safeList.includes(e),Object.keys(r)),e=stir.map(e=>{var t,s;return a[e]?(t=a[e].split(", "),s=n(i,r[e],e),s=stir.map(s,t),stir.any(e=>!0===e,s)):""===r[e]},e);return stir.all(e=>!0===e,e)})),n=stir.curry((e,t,s,i)=>{if(t.includes(i.trim()))return!0;if(i.trim().includes(t.trim()))return!0;if(s&&"faculties"===s&&c(t,i,"All Faculties"))return!0;if(s&&"countries"===s){if(t.includes("All nationalities"))return!0;if(t.includes("All international")&&!d(e.macros,"United Kingdom").includes(i.trim()))return!0;if(i.trim().includes("All international")&&!d(e.macros,"United Kingdom").includes(t))return!0}return!1}),c=(e,t,s)=>!!e.includes(s)||!!t.trim().includes(s),d=(e,t)=>e.filter(e=>e.tag===t).map(e=>e.data).join(", "),u=e=>{var t=(new Date).toISOString(),t=Number(t.split(".")[0].replaceAll(":","").replaceAll("-","").replaceAll("T",""));return Number(e)>t},o=stir.curry(e=>"Yes"===e.ondemand||u(e.datetime)),m=e=>`
          <div class="cell small-12 large-4 medium-6 u-my-2" >
              <div class="u-energy-line-top">

              <div class="u-mt-1">
                ${e.ondemand&&!u(e.datetime)?'<span class="u-bg-energy-purple--10 u-px-tiny u-py-xtiny text-xxsm">Watch on-demand</span>':""}
                ${u(e.datetime)?'<span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Live event</span>':""}
            </div>

                    <h3 class="-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-1">
                    <a href="${e.link}" class="c-link" >${e.title}</a></h3>
                    
                    <p class="text-sm"><strong>${e.date}, ${e.time} (${e.zone})</strong></p>
                   
                    <div class="text-sm">
                      ${e.faculties?`<p>${e.faculties}</p>`:""}
                      ${e.description}
                    </div>
                    ${e.countries?`<p class="text-sm">For students from: ${e.countries}</p>`:""}
                </div>
          </div> `,p=stir.curry((e,t)=>{var s,i;if(console.log(e),t.length||e.noItems)return`
            <div class="grid-x grid-padding-x" >
              ${s=e.head,i=e.intro,s||i?`
          <div class="cell u-mt-2">
            ${s?"<h2>"+s+"</h2>":""}
            ${i}
          </div>`:""}
              ${t.length?stir.map(m,t).join(""):'<div class="cell">'+e.noItems+"</div>"}
              ${e.divider&&"no"===e.divider?"":'<div class="cell"><hr /></div>'}
            </div>`}),v=stir.curry((e,t)=>(stir.setHTML(e,t),e)),f=(e,t,s,i)=>{var r=stir.filter(e=>e.title),e=stir.filter(l(e,i.params)),a=stir.filter(o),n=stir.sort((e,t)=>parseInt(e.datetime)>parseInt(t.datetime)?1:parseInt(t.datetime)>parseInt(e.datetime)?-1:0),t=v(t),i=p(i);return stir.compose(t,i,n,e,a,r)(s)},g=stir.node("#webinarresults");g&&(f(a,g,s,{params:{series:"",countries:"",subjects:"",studylevels:"",faculties:"",categories:""},divider:"no"}),stir.nodes("#webinarfilters select").forEach(e=>{e.addEventListener("change",e=>{var t=stir.node("#search-student-type").value,t={params:{series:"",countries:stir.node("#search-region").value,subjects:"",studylevels:t,faculties:"",categories:stir.node("#search-category").value}};f(a,g,s,t)})})),e.forEach(e=>{f(a,e,s,t[e.dataset.webinarsects])}),r&&e.map(e=>e.innerText).join("").trim().length<1&&v(r,i)}();