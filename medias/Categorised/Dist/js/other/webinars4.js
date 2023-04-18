!function(i){if(!i)return;const n=stir.t4Globals.webinars||[],l=stir.t4Globals.webinarSectionData||{};var t=stir.t4Globals.webinarsdisclaimer||"",r=stir.node("[data-webinardisclaimer]");const d={safeList:["countries","series","subjects","studylevels","faculties"],macros:stir.filter(i=>{if(i.tag)return i},stir.t4Globals.regionmacros)||[]},c=(Object.freeze(d),stir.curry((r,e,s)=>{var i=stir.filter(i=>r.safeList.includes(i),Object.keys(e)),i=stir.map(i=>{var t;return!s[i]||(t=s[i].split(", "),i=a(r,e[i],i),i=stir.map(i,t),stir.any(i=>!0===i,i))},i);return stir.all(i=>!0===i,i)})),a=stir.curry((i,t,r,e)=>{if(t.includes(e.trim()))return!0;if(e.trim().includes(t.trim()))return!0;if(r&&"faculties"===r&&s(t,e,"All Faculties"))return!0;if(r&&"countries"===r){if(s(t,e,"All nationalities"))return!0;if(t.includes("All international")&&!o(i.macros,"United Kingdom").includes(e.trim()))return!0;if(e.trim().includes("All international")&&!o(i.macros,"United Kingdom").includes(t))return!0}return!1}),s=(i,t,r)=>!!i.includes(r)||!!t.trim().includes(r),o=(i,t)=>i.filter(i=>i.tag===t).map(i=>i.data).join(", "),u=stir.curry((i,t)=>{if(t.length||i.noItems)return`
      <div class="grid-x grid-padding-x" >
        ${p(i.head,i.intro)}
        ${t.length?stir.map(f,t).join(""):m(i.noItems)}
        ${i.divider&&"no"===i.divider?"":e()}
      </div>`}),e=()=>'<div class="cell"><hr /></div>',m=i=>'<div class="cell">'+i+"</div>",p=(i,t)=>i||t?`
        <div class="cell u-mt-2">
          ${i?"<h2>"+i+"</h2>":""}
          ${t}
        </div>`:"",f=i=>`
        <div class="cell small-12 c-promo-box large-4 medium-6 u-padding-bottom" >
          <div>
            <div class="c-promo-box__layout-container">
              <div class="c-promo-box__content">
                <div>
                  <h3 class="c-promo-box__header header-stripped"><a href="${i.link}" class="c-link" >${i.title}</a></h3>
                  ${i.countries?`<p>For students from: ${i.countries}</p>`:""}
                  <p><strong>${i.date}, ${i.time} (${i.zone})</strong></p>
                  ${i.faculties?`<p>${i.faculties}</p>`:""}
                  ${i.description}
                </div>
              </div>
            </div>
          </div>
        </div> `,v=stir.curry((i,t)=>(stir.setHTML(i,t),i));i.forEach(i=>{var t,r,e,s,a;t=d,r=i,e=n,i=l[i.dataset.webinar],s=stir.filter(i=>i.title),t=stir.filter(c(t,i.params)),a=stir.sort((i,t)=>parseInt(i.datetime)>parseInt(t.datetime)?1:parseInt(t.datetime)>parseInt(i.datetime)?-1:0),r=v(r),i=u(i),stir.compose(r,i,a,t,s)(e)}),r&&i.map(i=>i.innerText).join("").trim().length<1&&v(r,t)}(stir.nodes("[data-webinar]"));