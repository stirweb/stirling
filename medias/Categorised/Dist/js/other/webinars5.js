!function(){if(!stir.nodes("[data-webinar]"))return;var e=stir.nodes("[data-webinarSects]");const r=stir.t4Globals.webinars||[],t=stir.t4Globals.webinarSectionData||{};var i=stir.t4Globals.webinarsdisclaimer||"",s=stir.node("[data-webinardisclaimer]");const a={safeList:["countries","series","subjects","studylevels","faculties","categories"],macros:stir.filter(e=>{if(e.tag)return e},stir.t4Globals.regionmacros)||[]},u=(Object.freeze(a),stir.curry((i,s,a)=>{var e=stir.filter(e=>i.safeList.includes(e),Object.keys(s)),e=stir.map(e=>{var t,r;return a[e]?(t=a[e].split(", "),r=n(i,s[e],e),r=stir.map(r,t),stir.any(e=>!0===e,r)):""===s[e]},e);return stir.all(e=>!0===e,e)})),n=stir.curry((e,t,r,i)=>{if(t.includes(i.trim()))return!0;if(i.trim().includes(t.trim()))return!0;if(r&&"faculties"===r&&l(t,i,"All Faculties"))return!0;if(r&&"countries"===r){if(t.includes("All nationalities"))return!0;if(t.includes("All international")&&!c(e.macros,"United Kingdom").includes(i.trim()))return!0;if(i.trim().includes("All international")&&!c(e.macros,"United Kingdom").includes(t))return!0}return!1}),l=(e,t,r)=>!!e.includes(r)||!!t.trim().includes(r),c=(e,t)=>e.filter(e=>e.tag===t).map(e=>e.data).join(", "),o=stir.curry(e=>{var t=(new Date).toISOString(),t=Number(t.split(".")[0].replaceAll(":","").replaceAll("-","").replaceAll("T",""));return Number(e.datetime)<t}),m=stir.curry(e=>{var t=(new Date).toISOString(),t=Number(t.split(".")[0].replaceAll(":","").replaceAll("-","").replaceAll("T",""));return Number(e.datetime)>t}),p=stir.curry(e=>"Yes"===e.ondemand),d=e=>`
          <div class="cell small-12 large-4 medium-6 u-my-2" >
              <div class="u-energy-line-top">

              <div class="u-mt-1">
                ${e.ondemand&&!m(e)?'<span class="u-bg-energy-purple--10 u-px-tiny u-py-xtiny text-xxsm">Watch on-demand</span>':""}
                ${m(e)?'<span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Live event</span>':""}
            </div>

                    <h3 class="-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-1">
                    <a href="${e.link}" class="c-link" >${e.title}</a></h3>
                    
                    <p class="text-sm"><strong>${e.date}, ${e.time} 
                    ${e.timeend?"to "+e.timeend:""} (${e.zone})</strong></p>
                   
                    <div class="text-sm">
                      ${e.faculties?`<p>${e.faculties}</p>`:""}
                      ${e.description}
                    </div>
                    ${e.countries?`<p class="text-sm">For students from: ${e.countries}</p>`:""}
                </div>
          </div> `,v=stir.curry((e,t)=>{var r,i;if(console.log(e),t.length||e.noItems)return`
            <div class="grid-x grid-padding-x" >
              ${r=e.head,i=e.intro,r||i?`
          <div class="cell u-mt-2">
            ${r?"<h2>"+r+"</h2>":""}
            ${i}
          </div>`:""}
              ${t.length?stir.map(d,t).join(""):'<div class="cell">'+e.noItems+"</div>"}
              ${e.divider&&"no"===e.divider?"":'<div class="cell"><hr /></div>'}
            </div>`}),f=stir.curry((e,t)=>(stir.setHTML(e,t),e)),g=(e,t,r,i)=>{var s=stir.filter(e=>e.title),e=stir.filter(u(e,i.params)),a=stir.filter(m),n=stir.filter(o),l=stir.filter(p),c=stir.sort((e,t)=>parseInt(e.datetime)>parseInt(t.datetime)?1:parseInt(t.datetime)>parseInt(e.datetime)?-1:0),d=stir.sort((e,t)=>parseInt(e.datetime)<parseInt(t.datetime)?1:parseInt(t.datetime)<parseInt(e.datetime)?-1:0),t=f(t),i=v(i),c=stir.compose(c,e,a,s)(r),a=stir.compose(d,e,l,n,s)(r);return stir.compose(t,i)([...c,...a])},b=stir.node("#webinarresults");b&&(g(a,b,r,{params:{series:"",countries:"",subjects:"",studylevels:"",faculties:"",categories:""},divider:"no"}),stir.nodes("#webinarfilters select").forEach(e=>{e.addEventListener("change",e=>{var t=stir.node("#search-student-type").value,t={params:{series:"",countries:stir.node("#search-region").value,subjects:"",studylevels:t,faculties:"",categories:stir.node("#search-category").value}};g(a,b,r,t)})})),e.forEach(e=>{g(a,e,r,t[e.dataset.webinarsects])}),s&&e.map(e=>e.innerText).join("").trim().length<1&&f(s,i)}();