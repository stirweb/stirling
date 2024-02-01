!function(t){if(t){const l="accom",n=t;t=stir.node("#search-form");const e=stir.node("#search-price"),s=stir.node("#search-location"),i=stir.node("#search-student-type"),o=stir.node("#search-bathroom"),a=stir.node("#search-price-value"),d=stir.curry((t,r)=>{var e,s,t=t.filter(t=>Number(t.id)===Number(r.id));return`<div class="cell u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
              <div class="grid-x grid-padding-x u-p-2 ">
                <div class="cell u-pt-2">
                    <p class="u-text-regular u-mb-2 "><strong><a href="">${r.name}</a></strong></p>
                  </div>
                  <div class="cell large-5 text-sm">
                    <p><strong>Price</strong></p> 
                    ${e=r.rooms,e?(s=e.map(t=>parseFloat(t.cost)).sort((t,r)=>t-r),e=stir.removeDuplicates(e.map(t=>t.room)),`<p>From £${s[0].toFixed(2)} to £${s[s.length-1].toFixed(2)}  per week</p>
          <ul >
            ${e.map(t=>`<li>${t}</li>`).join("")}
          </ul>
    `):""}
                  </div>
                  <div class="cell large-4 text-sm">
                      <p><strong>Facilities</strong></p>
                      <p>${r.facilities}</p>
                      <p><strong>Location</strong></p> 
                      <p>${r.name}</p>
                      <p><strong>Student type</strong></p>
                      <p>${s=r.rooms,s?(s=s.map(t=>t.studType).join(",").split(","),stir.removeDuplicates(s).join("<br />")):""}</p>
                  </div>
                  <div class="cell large-3 ">
                      <div style="border:1px solid #ccc;">Image</div>
                  </div>
                  <div class="cell text-sm u-pt-2" id="favbtns${r.id}">
                    ${e=t,t=r.id,e.length?stir.favourites.renderRemoveBtn(t,e[0].date):stir.favourites.renderAddBtn(t)}
                  </div>
              </div>
            </div>`}),c=stir.curry((r,t)=>{var e;return""!==r&&t.rooms?(e=stir.filter(t=>t.bathroom===r,t.rooms)).length?(t.rooms=e,t):{}:t}),u=stir.curry((t,r)=>""===t||!r.location||t===r.location?r:void 0),p=stir.curry((r,t)=>{var e;return""!==r&&t.rooms?(e=stir.filter(t=>t.studType.includes(r),t.rooms)).length?(t.rooms=e,t):{}:t}),m=stir.curry((r,t)=>{var e;return""!==r&&t.rooms?(e=stir.filter(t=>parseFloat(r)>parseFloat(t.cost),t.rooms)).length?(t.rooms=e,t):{}:t}),v=stir.filter(t=>{if(t.name)return t});const g=stir.curry((t,r)=>(stir.setHTML(t,r),!0)),h=(t,r)=>{var e=stir.favourites.getFavsList(l),e=stir.map(d(e)),s=stir.join(""),i=stir.map(m(t.price)),o=stir.map(p(t.studentType)),a=stir.map(c(t.bathroom)),t=stir.filter(u(t.location)),a=stir.compose(v,a,t,o,i,stir.clone)(r),t=stir.compose(s,e)(a);return g(n,`<div class="cell u-mb-3">Results based on filters - <strong>${a.length} properties</strong></div>`+t)},f=accommodationData;QueryParams.getAllArray();f.length&&(h({price:"",location:"",bathroom:"",studentType:""},f),e.value=300,s.value="",i.value="",o.value="",t&&t.addEventListener("change",t=>{var r={price:e.value,location:s.value,bathroom:o.value,studentType:i.value};g(a,r.price),h(r,f)}),n.addEventListener("click",t=>{t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");t&&t.dataset&&t.dataset.action&&("addtofavs"===t.dataset.action&&stir.favourites.addToFavs(t.dataset.id,l),"removefav"===t.dataset.action)&&(console.log(t.dataset.id),stir.favourites.removeFromFavs(t.dataset.id))}))}}(stir.node("#search-results"));