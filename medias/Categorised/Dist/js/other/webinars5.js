!function(){if(!stir.nodes("[data-webinar]"))return;const i=stir.t4Globals.webinars||[],t=stir.t4Globals.webinarSectionData||{};var e=stir.t4Globals.webinarsdisclaimer||"",r=stir.node("[data-webinardisclaimer]");const a={safeList:["countries","series","subjects","studylevels","faculties","categories"],macros:stir.filter(e=>{if(e.tag)return e},stir.t4Globals.regionmacros)||[]};Object.freeze(a);const u=stir.curry((s,i,a)=>{var e=stir.filter(e=>s.safeList.includes(e),Object.keys(i)),e=stir.map(e=>{var t,r;return a[e]?(t=a[e].split(", "),r=n(s,i[e],e),r=stir.map(r,t),stir.any(e=>!0===e,r)):""===i[e]},e);return stir.all(e=>!0===e,e)}),n=stir.curry((e,t,r,s)=>{if(t.includes(s.trim()))return!0;if(s.trim().includes(t.trim()))return!0;if(r&&"faculties"===r&&l(t,s,"All Faculties"))return!0;if(r&&"countries"===r){if(l(t,s,"All nationalities"))return!0;if(s.trim().includes("All international")&&!c(e.macros,"United Kingdom").includes(t))return!0;if(e.macros.filter(e=>!!e.data.includes(t)).map(e=>e.tag).includes(s))return!0}return!1}),l=(e,t,r)=>!!e.includes(r)||!!t.trim().includes(r),c=(e,t)=>e.filter(e=>e.tag===t).map(e=>e.data).join(", "),o=stir.curry(e=>{var t=(new Date).toISOString(),t=Number(t.split(".")[0].replaceAll(":","").replaceAll("-","").replaceAll("T",""));return Number(e.datetime)<t}),m=stir.curry(e=>{var t=(new Date).toISOString(),t=Number(t.split(".")[0].replaceAll(":","").replaceAll("-","").replaceAll("T",""));return Number(e.datetime)>t}),p=stir.curry(e=>"Yes"===e.ondemand),d=e=>`
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
          </div> `,g=stir.curry((e,t)=>{var r,s;if(t.length||e.noItems)return`
            <div class="grid-x grid-padding-x" >
              ${r=e.head,s=e.intro,r||s?`
          <div class="cell u-mt-2">
            ${r?"<h2>"+r+"</h2>":""}
            ${s}
          </div>`:""}
              ${t.length?stir.map(d,t).join(""):'<div class="cell">'+e.noItems+"</div>"}
              ${e.divider&&"no"===e.divider?"":'<div class="cell"><hr /></div>'}
            </div>`}),f=stir.curry((e,t)=>(stir.setHTML(e,t),e));var s=e=>e.replaceAll("script>","").replaceAll("script%3E","").replaceAll("<","");const v=(e,t,r,s)=>{var i=stir.filter(e=>e.title),e=stir.filter(u(e,s.params)),a=stir.filter(m),n=stir.filter(o),l=stir.filter(p),c=stir.sort((e,t)=>parseInt(e.datetime)>parseInt(t.datetime)?1:parseInt(t.datetime)>parseInt(e.datetime)?-1:0),d=stir.sort((e,t)=>parseInt(e.datetime)<parseInt(t.datetime)?1:parseInt(t.datetime)<parseInt(e.datetime)?-1:0),t=f(t),s=g(s),c=stir.compose(c,e,a,i)(r),a=stir.compose(d,e,l,n,i)(r);return stir.compose(t,s)([...c,...a])},y=stir.node("#webinarresults");if(y){const b={category:QueryParams.get("category")?s(QueryParams.get("category")):"",studylevel:QueryParams.get("studylevel")?s(QueryParams.get("studylevel")):"",region:QueryParams.get("region")?s(QueryParams.get("region")):""};s={params:{series:"",countries:b.region,subjects:"",studylevels:b.studylevel,faculties:"",categories:b.category},divider:"no"};v(a,y,i,s),""===y.innerHTML&&f(y,"<p>No webinars found</p>"),stir.nodes("#webinarfilters select").forEach(e=>{e.value=b[e.name],e.addEventListener("change",e=>{var t,r=new FormData(stir.node("#webinarfilters")),s=Object.fromEntries(r.entries());for(t in s)QueryParams.set(t,s[t]);r={params:{series:"",countries:s.region,subjects:"",studylevels:s.studylevel,faculties:"",categories:s.category},divider:"no"};v(a,y,i,r),""===y.innerHTML&&f(y,"<p>No webinars found</p>")})})}s=stir.nodes("[data-webinarSects]");s.forEach(e=>{v(a,e,i,t[e.dataset.webinarsects])}),r&&s.map(e=>e.innerText).join("").trim().length<1&&f(r,e)}();