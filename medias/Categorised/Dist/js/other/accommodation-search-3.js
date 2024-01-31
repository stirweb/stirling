!function(r){if(r){const l=r;r=stir.node("#search-form");const e=stir.node("#search-price"),s=stir.node("#search-location"),o=stir.node("#search-student-type"),i=stir.node("#search-bathroom"),a=stir.node("#search-price-value"),n=stir.curry(r=>{return`<div class="cell u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
              <div class="grid-x grid-padding-x u-p-2 ">

                <div class="cell u-pt-2">
                    <p class="u-text-regular u-mb-2 "><strong><a href="">${r.name}</a></strong></p>
                  </div>

                  <div class="cell large-5 text-sm">
                    <p><strong>Price</strong></p> 
                    ${t=r.rooms,t?(e=t.map(r=>parseFloat(r.cost)).sort((r,t)=>r-t),t=stir.removeDuplicates(t.map(r=>r.room)),`<p>From £${e[0].toFixed(2)} to £${e[e.length-1].toFixed(2)}  per week</p>
          <ul >
            ${t.map(r=>`<li>${r}</li>`).join("")}
          </ul>
    `):""}
                  </div>

                  <div  class="cell large-4 text-sm">
                      <p><strong>Facilities</strong></p>
                      <p>${r.facilities}</p>
                      <p><strong>Location</strong></p> 
                      <p>${r.name}</p>
                      <p><strong>Student type</strong></p>
                      <p>${e=r.rooms,e?(e=e.map(r=>r.studType).join(",").split(","),stir.removeDuplicates(e).join("<br />")):""}</p>
                  </div>
                  
                  <div class="cell large-3 ">
                      <div style="border:1px solid #ccc;">Image</div>
                  </div>

                  <div class="cell text-sm u-pt-2">
                    ${stir.favourites.renderAddBtn}
                    
                  </div>
              </div>
            </div>`;var t,e}),c=stir.curry((t,r)=>{var e;return""!==t&&r.rooms?(e=stir.filter(r=>r.bathroom===t,r.rooms)).length?(r.rooms=e,r):{}:r}),d=stir.curry((r,t)=>""===r||!t.location||r===t.location?t:void 0),p=stir.curry((t,r)=>{var e;return""!==t&&r.rooms?(e=stir.filter(r=>r.studType.includes(t),r.rooms)).length?(r.rooms=e,r):{}:r}),u=stir.curry((t,r)=>{var e;return""!==t&&r.rooms?(e=stir.filter(r=>parseFloat(t)>parseFloat(r.cost),r.rooms)).length?(r.rooms=e,r):{}:r}),m=stir.filter(r=>{if(r.name)return r});const v=stir.curry((r,t)=>(stir.setHTML(r,t),!0)),g=(r,t)=>{var e=stir.map(n),s=stir.join(""),o=stir.map(u(r.price)),i=stir.map(p(r.studentType)),a=stir.map(c(r.bathroom)),r=stir.filter(d(r.location)),a=stir.compose(m,a,r,i,o,stir.clone)(t),r=stir.compose(s,e)(a);return v(l,`<div class="cell u-mb-3">Results based on filters - <strong>${a.length} properties</strong></div>`+r)},h=accommodationData;QueryParams.getAllArray();h.length&&(g({price:"",location:"",bathroom:"",studentType:""},h),e.value=300,s.value="",o.value="",i.value="",r&&r.addEventListener("change",r=>{var t={price:e.value,location:s.value,bathroom:i.value,studentType:o.value};v(a,t.price),g(t,h)}),l.addEventListener("click",r=>{r="BUTTON"===r.target.nodeName?r.target:r.target.closest("button");r&&r.dataset&&r.dataset.action&&console.log(r)}))}}(stir.node("#search-results"));